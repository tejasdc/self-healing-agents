import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Moon,
  Wifi,
  WifiOff,
  ChevronRight,
  Scissors,
  Wrench,
  ArrowDownRight,
  Sparkles,
  Activity,
} from "lucide-react";
import { LiveClient } from "../services/live-client";
import {
  floatTo16Bit,
  arrayBufferToBase64,
  base64ToUint8Array,
} from "../utils/audio";
import {
  SLEEP_REPORT,
  SLEEP_REPORT_SYSTEM_INSTRUCTION,
  DASHBOARD_TOOLS,
} from "../data/sleep-report";
import type { ImprovementStatus } from "../data/sleep-report";
import ImprovementCard from "./ImprovementCard";

/* -------------------------------------------------------------------------- */
/*  Animated counter component                                                 */
/* -------------------------------------------------------------------------- */

const AnimatedNumber: React.FC<{
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}> = ({ value, duration = 1.5, suffix = "", prefix = "", className = "" }) => {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/*  Main Dashboard                                                             */
/* -------------------------------------------------------------------------- */

const SleepDashboard: React.FC = () => {
  // ── Connection & Voice State ────────────────────────────────────────────────
  const [apiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || "");
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [status, setStatus] = useState("Standby");
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // ── Dashboard State ─────────────────────────────────────────────────────────
  const [cardStatuses, setCardStatuses] = useState<
    Record<string, ImprovementStatus>
  >({
    "imp-1": "hidden",
    "imp-2": "hidden",
    "imp-3": "hidden",
  });
  const [revealedCount, setRevealedCount] = useState(0);
  const [showMaintenance, setShowMaintenance] = useState(false);

  // ── Refs ────────────────────────────────────────────────────────────────────
  const clientRef = useRef<LiveClient | null>(null);
  const recordingContextRef = useRef<AudioContext | null>(null);
  const playbackContextRef = useRef<AudioContext | null>(null);
  const microphoneRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const connectingRef = useRef(false);
  const nextStartTimeRef = useRef(0);
  const activeSourcesRef = useRef(0);
  const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // ── Logging ─────────────────────────────────────────────────────────────────
  const addLog = useCallback((msg: string) => {
    console.log(msg);
    setLogs((prev) =>
      [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-80)
    );
  }, []);

  // ── Audio helpers ───────────────────────────────────────────────────────────
  const getPlaybackContext = useCallback(() => {
    if (!playbackContextRef.current) {
      playbackContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    if (playbackContextRef.current.state === "suspended") {
      playbackContextRef.current.resume();
    }
    return playbackContextRef.current;
  }, []);

  const clearPlayback = useCallback(() => {
    for (const src of scheduledSourcesRef.current) {
      try {
        src.stop();
      } catch (_) {
        /* already stopped */
      }
    }
    scheduledSourcesRef.current = [];
    activeSourcesRef.current = 0;
    nextStartTimeRef.current = 0;
    setIsAgentSpeaking(false);
  }, []);

  const scheduleAudioChunk = useCallback(
    (rawData: Uint8Array) => {
      const ctx = playbackContextRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();

      const int16 = new Int16Array(
        rawData.buffer,
        rawData.byteOffset,
        rawData.byteLength / 2
      );
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
      }

      const sampleRate = 24000;
      const buffer = ctx.createBuffer(1, float32.length, sampleRate);
      buffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const now = ctx.currentTime;
      if (nextStartTimeRef.current <= now) {
        nextStartTimeRef.current = now;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += buffer.duration;

      scheduledSourcesRef.current.push(source);
      activeSourcesRef.current++;
      setIsAgentSpeaking(true);

      source.onended = () => {
        scheduledSourcesRef.current = scheduledSourcesRef.current.filter(
          (s) => s !== source
        );
        activeSourcesRef.current--;
        if (activeSourcesRef.current <= 0) {
          activeSourcesRef.current = 0;
          setIsAgentSpeaking(false);
        }
      };
    },
    []
  );

  // ── Recording ───────────────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    try {
      addLog("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneRef.current = stream;

      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)({ sampleRate: 16000 });
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      recordingContextRef.current = audioContext;
      getPlaybackContext();
      addLog("Microphone active. AudioContext " + audioContext.state);

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(512, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const client = clientRef.current;
        if (client && client.isReady()) {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm = floatTo16Bit(inputData);
          const base64 = arrayBufferToBase64(pcm);
          client.sendAudio(base64);
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      setIsRecording(true);
      setStatus("Listening");
    } catch (e) {
      console.error("Microphone access denied:", e);
      setStatus("Mic Access Denied");
      addLog("ERROR: Microphone access denied.");
    }
  }, [addLog, getPlaybackContext]);

  const stopRecording = useCallback(() => {
    processorRef.current?.disconnect();
    microphoneRef.current?.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
    addLog("Microphone muted.");
  }, [addLog]);

  // ── Tool call handling ──────────────────────────────────────────────────────
  const handleToolCall = useCallback(
    (toolCall: { id: string; name: string; args: Record<string, any> }) => {
      addLog(`Handling tool: ${toolCall.name}(${JSON.stringify(toolCall.args)})`);

      switch (toolCall.name) {
        case "show_next_finding": {
          setRevealedCount((prev) => {
            const next = prev + 1;
            const improvementId = `imp-${next}`;
            if (next <= SLEEP_REPORT.improvements.length) {
              setCardStatuses((cs) => ({
                ...cs,
                [improvementId]: "revealed",
              }));
              addLog(`Revealed improvement: ${improvementId}`);
            }
            // Show maintenance after all cards
            if (next >= SLEEP_REPORT.improvements.length) {
              setTimeout(() => setShowMaintenance(true), 1000);
            }
            return next;
          });
          break;
        }
        case "approve_improvement": {
          const id = toolCall.args.id;
          if (id) {
            setCardStatuses((cs) => ({
              ...cs,
              [id]: "approved",
            }));
            addLog(`Approved: ${id}`);
          }
          break;
        }
        case "dismiss_improvement": {
          const id = toolCall.args.id;
          if (id) {
            setCardStatuses((cs) => ({
              ...cs,
              [id]: "dismissed",
            }));
            addLog(`Dismissed: ${id}`);
          }
          break;
        }
        default:
          addLog(`Unknown tool: ${toolCall.name}`);
      }

      // Send response back to Gemini
      clientRef.current?.sendToolResponse(toolCall.id, { success: true });
    },
    [addLog]
  );

  // ── Connection ──────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    if (!apiKey) {
      setStatus("No API Key");
      connectingRef.current = false;
      return;
    }

    try {
      setStatus("Connecting...");
      addLog("Opening WebSocket to Gemini Live API...");

      const client = new LiveClient({
        url: "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent",
        apiKey,
        model: "gemini-2.5-flash-native-audio-latest",
        systemInstruction: SLEEP_REPORT_SYSTEM_INSTRUCTION,
        tools: DASHBOARD_TOOLS,
      });

      client.onLog = (msg) => addLog(msg);

      client.onSetupComplete = () => {
        addLog("Setup complete. Waking agent...");
        setTimeout(() => {
          const silence = new Int16Array(1600).buffer;
          client.sendAudio(arrayBufferToBase64(silence));
        }, 500);
      };

      client.onAudioData = (base64) => {
        const audioData = base64ToUint8Array(base64);
        scheduleAudioChunk(audioData);
      };

      client.onInterrupted = () => {
        clearPlayback();
      };

      client.onToolCall = (tc) => {
        handleToolCall(tc);
      };

      await client.connect();
      clientRef.current = client;
      setIsConnected(true);
      setStatus("Connected");
      addLog("Socket opened. Setup message sent.");
      startRecording();
    } catch (e: any) {
      console.error("Connection failed:", e);
      setStatus("Connection Failed");
      addLog(`FATAL: ${e.message}`);
      connectingRef.current = false;
    }
  }, [apiKey, addLog, scheduleAudioChunk, clearPlayback, handleToolCall, startRecording]);

  const disconnect = useCallback(() => {
    clearPlayback();
    stopRecording();
    clientRef.current?.disconnect();
    clientRef.current = null;
    setIsConnected(false);
    connectingRef.current = false;
    setStatus("Standby");
    addLog("Disconnected.");
  }, [clearPlayback, stopRecording, addLog]);

  // ── Manual controls (fallback for voice) ────────────────────────────────────
  const manualNextFinding = useCallback(() => {
    handleToolCall({ id: "manual", name: "show_next_finding", args: {} });
  }, [handleToolCall]);

  const manualApprove = useCallback(
    (id: string) => {
      handleToolCall({
        id: "manual",
        name: "approve_improvement",
        args: { id },
      });
    },
    [handleToolCall]
  );

  const manualDismiss = useCallback(
    (id: string) => {
      handleToolCall({
        id: "manual",
        name: "dismiss_improvement",
        args: { id },
      });
    },
    [handleToolCall]
  );

  // ── Auto-connect on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (apiKey && !isConnected && !connectingRef.current) {
      connectingRef.current = true;
      connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resume audio on any click
  useEffect(() => {
    const handleInteraction = () => {
      if (playbackContextRef.current?.state === "suspended") {
        playbackContextRef.current.resume();
      }
      if (recordingContextRef.current?.state === "suspended") {
        recordingContextRef.current.resume();
      }
    };
    window.addEventListener("click", handleInteraction);
    return () => window.removeEventListener("click", handleInteraction);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      clientRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived state ──────────────────────────────────────────────────────────
  const allRevealed = revealedCount >= SLEEP_REPORT.improvements.length;
  const summary = SLEEP_REPORT.summary;

  return (
    <div className="min-h-screen bg-[#030808] text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden">
      {/* ── Animated background ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Radial gradient pulse */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.06) 0%, transparent 60%)",
            animation: "pulse-glow 8s ease-in-out infinite",
          }}
        />
        {/* Secondary ambient glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.04) 0%, transparent 60%)",
            animation: "pulse-glow 12s ease-in-out infinite reverse",
          }}
        />
        {/* Subtle moving mesh */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(6,182,212,0.8) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(139,92,246,0.8) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(16,185,129,0.6) 0%, transparent 50%)
            `,
            animation: "float 20s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── Voice Bar (top) ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-cyan-500/10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left: Connection status + Mic */}
          <div className="flex items-center gap-4">
            {/* Connection dot */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  isConnected
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                    : "bg-slate-600"
                }`}
              />
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                {status}
              </span>
            </div>

            {/* Mic button */}
            {isConnected && (
              <button
                onClick={() =>
                  isRecording ? stopRecording() : startRecording()
                }
                className={`relative p-2 rounded-full transition-all duration-300 ${
                  isRecording
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "bg-slate-800/50 text-slate-500 border border-slate-700/30 hover:text-slate-300"
                }`}
              >
                {/* Mic pulsing glow when recording */}
                {isRecording && (
                  <motion.div
                    animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-cyan-500/30"
                  />
                )}
                {isRecording ? (
                  <Mic className="w-4 h-4 relative z-10" />
                ) : (
                  <MicOff className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Center: Speaking indicator */}
          <div className="flex items-center gap-3">
            {isAgentSpeaking && (
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 rounded-full border border-cyan-400/40"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeOut",
                      delay: 0.3,
                    }}
                    className="absolute inset-0 rounded-full border border-cyan-400/30"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.3], opacity: [0.2, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeOut",
                      delay: 0.6,
                    }}
                    className="absolute inset-0 rounded-full border border-cyan-400/20"
                  />
                  <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
                </div>
                <span className="text-xs text-cyan-400 font-medium">
                  Agent speaking...
                </span>
              </div>
            )}
            {!isAgentSpeaking && isRecording && (
              <span className="text-xs text-slate-500 font-medium">
                Listening...
              </span>
            )}
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-3">
            {/* Next Finding button */}
            {isConnected && !allRevealed && (
              <button
                onClick={manualNextFinding}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5" />
                Next Finding
              </button>
            )}

            {/* Log toggle */}
            <button
              onClick={() => setShowLogs(!showLogs)}
              className={`p-2 rounded-full transition-all ${
                showLogs
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "bg-slate-800/50 text-slate-600 border border-slate-700/30 hover:text-slate-400"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
            </button>

            {/* Connect / Disconnect */}
            {isConnected ? (
              <button
                onClick={disconnect}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
              >
                <WifiOff className="w-3.5 h-3.5" />
                Disconnect
              </button>
            ) : (
              <button
                onClick={connect}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
              >
                <Wifi className="w-3.5 h-3.5" />
                Connect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── System Logs (collapsible) ──────────────────────────────────── */}
      <AnimatePresence>
        {showLogs && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="sticky top-[57px] z-40 bg-black/60 backdrop-blur-md border-b border-cyan-500/5 overflow-hidden"
          >
            <div className="max-w-5xl mx-auto px-6 py-3">
              <div className="space-y-0.5 max-h-32 overflow-y-auto font-mono text-[10px] text-slate-600 scrollbar-hide">
                {logs.map((log, i) => (
                  <p
                    key={i}
                    className={
                      log.includes("FATAL")
                        ? "text-rose-400"
                        : log.includes("TOOL CALL")
                        ? "text-cyan-400"
                        : log.includes("Approved")
                        ? "text-emerald-400"
                        : log.includes("Dismissed")
                        ? "text-amber-400"
                        : ""
                    }
                  >
                    {log}
                  </p>
                ))}
                {logs.length === 0 && (
                  <p className="italic">Waiting for activity...</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]">
              <Moon className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Sleep Cycle Complete
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Your agent healed overnight. Here's what it found.
              </p>
            </div>
          </div>

          {/* Summary stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-[#0a0f0f]/80 border border-cyan-500/10 rounded-xl p-4 shadow-[0_0_20px_-10px_rgba(6,182,212,0.15)]">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-1">
                Sessions Scanned
              </p>
              <p className="text-2xl font-bold text-white">
                <AnimatedNumber value={summary.sessionsScanned} />
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                over {summary.daysSpan} days
              </p>
            </div>
            <div className="bg-[#0a0f0f]/80 border border-cyan-500/10 rounded-xl p-4 shadow-[0_0_20px_-10px_rgba(6,182,212,0.15)]">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-1">
                Artifacts Evaluated
              </p>
              <p className="text-2xl font-bold text-white">
                <AnimatedNumber value={summary.artifactsEvaluated} />
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                skills, rules, memories
              </p>
            </div>
            <div className="bg-[#0a0f0f]/80 border border-cyan-500/10 rounded-xl p-4 shadow-[0_0_20px_-10px_rgba(6,182,212,0.15)]">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-1">
                Improvements Found
              </p>
              <p className="text-2xl font-bold text-cyan-400">
                <AnimatedNumber value={summary.improvementsFound} />
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                ready for review
              </p>
            </div>
            <div className="bg-[#0a0f0f]/80 border border-emerald-500/10 rounded-xl p-4 shadow-[0_0_20px_-10px_rgba(16,185,129,0.15)]">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-1">
                Token Reduction
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                <AnimatedNumber
                  value={summary.tokenReductionPercent}
                  suffix="%"
                />
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                projected savings
              </p>
            </div>
          </div>
        </motion.header>

        {/* ── Improvement Cards ─────────────────────────────────────────── */}
        <section className="space-y-6 mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-mono uppercase tracking-widest text-slate-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500/50" />
              Discovered Improvements
            </h2>
            {!allRevealed && (
              <span className="text-[10px] font-mono text-slate-700">
                {revealedCount} / {SLEEP_REPORT.improvements.length} revealed
              </span>
            )}
          </div>

          <div className="space-y-5">
            {SLEEP_REPORT.improvements.map((improvement, i) => (
              <ImprovementCard
                key={improvement.id}
                improvement={improvement}
                status={cardStatuses[improvement.id]}
                onApprove={manualApprove}
                onDismiss={manualDismiss}
                index={i}
              />
            ))}
          </div>

          {/* Placeholder for unrevealed cards */}
          {!allRevealed && (
            <div className="space-y-4">
              {Array.from({
                length: SLEEP_REPORT.improvements.length - revealedCount,
              }).map((_, i) => (
                <motion.div
                  key={`placeholder-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-16 rounded-2xl border border-dashed border-slate-800/40 bg-slate-900/10 flex items-center justify-center"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-800">
                    Pending analysis...
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* ── Maintenance / Footer ──────────────────────────────────────── */}
        <AnimatePresence>
          {showMaintenance && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12"
            >
              <h2 className="text-sm font-mono uppercase tracking-widest text-slate-600 flex items-center gap-2 mb-4">
                <Wrench className="w-4 h-4 text-slate-600" />
                Overnight Maintenance
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SLEEP_REPORT.maintenance.map((action) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 25, stiffness: 120 }}
                    className="bg-[#0a0f0f]/60 border border-slate-800/30 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {action.kind === "pruned" ? (
                        <Scissors className="w-3.5 h-3.5 text-amber-500/60" />
                      ) : (
                        <Wrench className="w-3.5 h-3.5 text-cyan-500/60" />
                      )}
                      <span
                        className={`text-[10px] font-mono uppercase tracking-widest ${
                          action.kind === "pruned"
                            ? "text-amber-500/60"
                            : "text-cyan-500/60"
                        }`}
                      >
                        {action.kind}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-300 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {action.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Token Reduction Footer ────────────────────────────────────── */}
        <AnimatePresence>
          {showMaintenance && (
            <motion.footer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="border-t border-cyan-500/10 pt-8 pb-16"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-3 mb-2">
                  <ArrowDownRight className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                    Projected Token Usage
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-3xl font-bold text-slate-500 line-through">
                    <AnimatedNumber
                      value={245}
                      suffix="k"
                      duration={2}
                    />
                  </span>
                  <svg
                    className="w-6 h-6 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <span className="text-4xl font-bold text-emerald-400">
                    <AnimatedNumber
                      value={98}
                      suffix="k"
                      duration={2}
                    />
                  </span>
                  <span className="text-lg font-bold text-emerald-400/60 ml-1">
                    tokens
                  </span>
                </div>
                <p className="text-sm text-emerald-400/80 mt-2 font-medium">
                  60% reduction in context window usage
                </p>
              </div>
            </motion.footer>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SleepDashboard;
