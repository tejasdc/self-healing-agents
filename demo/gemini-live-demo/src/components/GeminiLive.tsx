import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Square, Settings, Sparkles, Terminal, Activity } from "lucide-react";
import { LiveClient } from "../services/live-client";
import { floatTo16Bit, arrayBufferToBase64, base64ToUint8Array } from "../utils/audio";

const SYSTEM_INSTRUCTION = `
You are a project management agent. You have just completed several projects and are here to provide a status report to the user.
Be concise but professional. You can have a back-and-forth about the project updates.

Here is the latest project status report from February 21, 2026:

# Project Status Report - February 21, 2026

## Project: Velma-2 STT Optimization
- Status: Completed
- Goal: Improve transcription speed for batch English audio.
- Outcome: The new \`velma-2-stt-batch-english-vfast\` endpoint is now live, achieving 30% faster processing than the standard batch API.
- Next Steps: Monitor latency and error rates for high-scale users.

## Project: Multimodal Live Integration
- Status: In Progress
- Goal: Integrate Gemini 2.0 Flash with voice-first applications.
- Current Phase: Prototyping WebSocket communication and audio stream handling.
- Key Challenge: Synchronizing audio input and output for a "interruptible" conversation.

## Project: Speaker Diarization Enhancement
- Status: Research Phase
- Goal: Better separation of multiple speakers in noisy environments.
- Findings: Initial tests with Velma-2 show high accuracy even in 4-person conversations.
- Plan: Roll out updated diarization features in March.

## Project: Emotion Detection API
- Status: Beta Testing
- Goal: Real-time sentiment and emotional state tracking from voice audio.
- Feedback: Early users report positive results for customer support use cases.
- Release: Target release in late Q1.

When you start, briefly greet the user and summarize the highlights of this report. Wait for the user's questions.
`;

const GeminiLive: React.FC = () => {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || "");
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Standby");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  
  const clientRef = useRef<LiveClient | null>(null);
  const recordingContextRef = useRef<AudioContext | null>(null);
  const playbackContextRef = useRef<AudioContext | null>(null);
  const microphoneRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const connectingRef = useRef(false);
  const nextStartTimeRef = useRef(0);
  const activeSourcesRef = useRef(0);
  const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-50));
  };

  const getPlaybackContext = () => {
    if (!playbackContextRef.current) {
      playbackContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (playbackContextRef.current.state === "suspended") {
      playbackContextRef.current.resume();
    }
    return playbackContextRef.current;
  };

  const clearPlayback = () => {
    for (const src of scheduledSourcesRef.current) {
      try { src.stop(); } catch (_) { /* already stopped */ }
    }
    scheduledSourcesRef.current = [];
    activeSourcesRef.current = 0;
    nextStartTimeRef.current = 0;
    setIsAgentSpeaking(false);
  };

  const testAudio = () => {
    try {
      const ctx = getPlaybackContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      addLog("Test audio (beep) triggered.");
    } catch (e) {
      addLog("Test audio failed: " + e);
    }
  };

  // Global click to resume audio
  useEffect(() => {
    const handleInteraction = () => {
      if (playbackContextRef.current?.state === "suspended") {
        playbackContextRef.current.resume();
        addLog("Playback AudioContext resumed.");
      }
      if (recordingContextRef.current?.state === "suspended") {
        recordingContextRef.current.resume();
        addLog("Recording AudioContext resumed.");
      }
    };
    window.addEventListener("click", handleInteraction);
    return () => window.removeEventListener("click", handleInteraction);
  }, []);

  // Auto-connect if API key is present
  useEffect(() => {
    if (apiKey && !isConnected && !connectingRef.current) {
      connectingRef.current = true;
      connect();
    }
  }, []);

  useEffect(() => {
    return () => {
      stopRecording();
      clientRef.current?.disconnect();
    };
  }, []);

  const connect = async () => {
    if (!apiKey) {
      setStatus("No API Key");
      connectingRef.current = false;
      return;
    }

    try {
      setErrorDetails(null);
      setStatus("Connecting...");
      addLog("Opening WebSocket to v1beta BidiGenerateContent...");
      
      const client = new LiveClient({
        url: "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent",
        apiKey,
        model: "gemini-2.5-flash-native-audio-latest", 
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      client.onLog = (msg) => addLog(msg);
      client.onSetupComplete = () => {
        setTimeout(() => wakeAgent(), 500);
      };
      client.onAudioData = (base64) => {
        const audioData = base64ToUint8Array(base64);
        scheduleAudioChunk(audioData);
      };
      client.onInterrupted = () => {
        clearPlayback();
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
      setErrorDetails(e.message || "Unknown Connection Error");
      addLog(`FATAL: ${e.message}`);
      connectingRef.current = false;
    }
  };

  const startRecording = async () => {
    try {
      addLog("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneRef.current = stream;

      // Recording context at 16kHz for Gemini input
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      recordingContextRef.current = audioContext;

      // Ensure playback context is ready too
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
  };

  const stopRecording = () => {
    processorRef.current?.disconnect();
    microphoneRef.current?.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
    addLog("Microphone muted.");
  };

  const disconnect = () => {
    clearPlayback();
    stopRecording();
    clientRef.current?.disconnect();
    clientRef.current = null;
    setIsConnected(false);
    connectingRef.current = false;
    setStatus("Standby");
    addLog("Disconnected.");
  };

  const scheduleAudioChunk = (rawData: Uint8Array) => {
    const ctx = playbackContextRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    const int16 = new Int16Array(rawData.buffer, rawData.byteOffset, rawData.byteLength / 2);
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

    // Schedule seamlessly on the timeline - no gaps
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
      scheduledSourcesRef.current = scheduledSourcesRef.current.filter(s => s !== source);
      activeSourcesRef.current--;
      if (activeSourcesRef.current <= 0) {
        activeSourcesRef.current = 0;
        setIsAgentSpeaking(false);
      }
    };
  };

  const wakeAgent = () => {
    addLog("Sending wake signal...");
    const silence = new Int16Array(1600).buffer;
    clientRef.current?.sendAudio(arrayBufferToBase64(silence));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_50%)] opacity-30 pointer-events-none" />
      
      <main className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">Gemini Live</h1>
              <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Project Update Agent</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800/50">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-600 animate-pulse'}`} />
              <span className="text-xs font-mono font-medium text-slate-400">{status}</span>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col items-center justify-center py-12">
                <AnimatePresence mode="wait">
                  {!isConnected ? (
                    <motion.div 
                      key="setup"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-xs font-mono uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <Terminal className="w-3 h-3" /> Access Credentials
                        </label>
                        <input 
                          type="password"
                          placeholder="Paste Gemini API Key..."
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="w-full bg-black/40 border border-slate-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-4">
                        <button 
                          onClick={connect}
                          className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)]"
                        >
                          {status === "Connecting..." ? "Connecting..." : "Initialize Agent"}
                        </button>
                        {errorDetails && (
                          <div className="space-y-3">
                            <p className="text-rose-400 text-xs text-center font-medium bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">{errorDetails}</p>
                            <button 
                              onClick={() => window.location.reload()}
                              className="w-full text-xs text-slate-500 hover:text-white transition-colors underline underline-offset-4"
                            >
                              Force Refresh Page
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="active"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative">
                        <motion.div 
                          animate={{ 
                            scale: isRecording || isAgentSpeaking ? [1, 1.2, 1] : 1,
                            opacity: isRecording || isAgentSpeaking ? [0.2, 0.4, 0.2] : 0.2
                          }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          className={`absolute -inset-8 rounded-full blur-3xl ${isAgentSpeaking ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        />
                        <button 
                          onClick={() => isRecording ? stopRecording() : startRecording()}
                          className={`relative z-20 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-indigo-600 text-white shadow-[0_0_50px_rgba(99,102,241,0.4)]' : 'bg-slate-800 text-slate-400 hover:text-white'} ${isAgentSpeaking ? 'border-4 border-emerald-500/50 scale-110' : ''}`}
                        >
                          {isRecording ? <Mic className="w-10 h-10" /> : <MicOff className="w-10 h-10" />}
                        </button>
                      </div>
                      <p className="mt-8 text-slate-400 font-medium tracking-wide">
                        {isAgentSpeaking ? "Agent is Speaking..." : isRecording ? "Listening to you..." : "Microphone Muted"}
                      </p>
                      {!isRecording && (
                        <button 
                          onClick={startRecording}
                          className="mt-4 text-xs bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
                        >
                          Enable Microphone
                        </button>
                      )}
                      <div className="flex items-center gap-4 mt-6">
                        <button
                          onClick={disconnect}
                          className="flex items-center gap-2 bg-rose-500/10 text-rose-400 px-5 py-2.5 rounded-full border border-rose-500/20 hover:bg-rose-500/20 transition-all text-sm font-medium"
                        >
                          <Square className="w-4 h-4" /> Stop Session
                        </button>
                        <button
                          onClick={wakeAgent}
                          className="text-[10px] text-slate-500 hover:text-white uppercase tracking-widest font-mono"
                        >
                          Wake Agent
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500">System Logs</h3>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto font-mono text-[10px] text-slate-500 scrollbar-hide">
                {logs.map((log, i) => (
                  <p key={i} className={log.includes('FATAL') ? 'text-rose-400' : log.includes('active') ? 'text-emerald-400' : ''}>
                    {log}
                  </p>
                ))}
                {logs.length === 0 && <p className="italic">Waiting for activity...</p>}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" /> Model Context
              </h3>
              <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                <p>Agent is grounded with the Project Status Report (Feb 21, 2026).</p>
                <div className="bg-black/30 rounded-lg p-3 text-xs border border-white/5">
                  <p className="text-indigo-300 mb-1 italic">Knowledge Base:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Velma-2 STT Opt.</li>
                    <li>Multimodal Live API</li>
                    <li>Speaker Diarization</li>
                    <li>Emotion Detection</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="p-1 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10">
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6">
                <h4 className="text-white text-sm font-medium mb-2 italic">Audio Check</h4>
                <button 
                  onClick={testAudio}
                  className="w-full text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 py-2 rounded-lg border border-white/10 transition-all uppercase tracking-widest font-mono"
                >
                  Test Speakers (Beep)
                </button>
              </div>
            </div>
            
            <div className="p-1 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10">
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6">
                <h4 className="text-white text-sm font-medium mb-2 italic">Pro-tip</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Try asking: "What's the update on the STT optimization?" or "When will emotion detection be released?"
                </p>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default GeminiLive;
