import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  BookOpen,
  Brain,
  Check,
  X,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { Improvement, ImprovementStatus, ImprovementType } from "../data/sleep-report";

interface ImprovementCardProps {
  improvement: Improvement;
  status: ImprovementStatus;
  onApprove: (id: string) => void;
  onDismiss: (id: string) => void;
  index: number;
}

const typeConfig: Record<
  ImprovementType,
  {
    icon: React.FC<{ className?: string }>;
    label: string;
    glowColor: string;
    borderColor: string;
    bgColor: string;
    textColor: string;
    gradientFrom: string;
    overlayGradient: string;
  }
> = {
  skill: {
    icon: Zap,
    label: "New Skill",
    glowColor: "rgba(6, 182, 212, 0.4)",
    borderColor: "border-cyan-400/30",
    bgColor: "bg-cyan-500/10",
    textColor: "text-cyan-400",
    gradientFrom: "bg-gradient-to-br from-cyan-500/20 to-transparent",
    overlayGradient: "bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent",
  },
  rule: {
    icon: BookOpen,
    label: "New Rule",
    glowColor: "rgba(245, 158, 11, 0.4)",
    borderColor: "border-amber-400/30",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
    gradientFrom: "bg-gradient-to-br from-amber-500/20 to-transparent",
    overlayGradient: "bg-gradient-to-br from-amber-500/10 via-transparent to-transparent",
  },
  memory: {
    icon: Brain,
    label: "New Memory",
    glowColor: "rgba(139, 92, 246, 0.4)",
    borderColor: "border-violet-400/30",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-400",
    gradientFrom: "bg-gradient-to-br from-violet-500/20 to-transparent",
    overlayGradient: "bg-gradient-to-br from-violet-500/10 via-transparent to-transparent",
  },
};

const ImprovementCard: React.FC<ImprovementCardProps> = ({
  improvement,
  status,
  onApprove,
  onDismiss,
  index,
}) => {
  if (status === "hidden") return null;

  const config = typeConfig[improvement.type];
  const TypeIcon = config.icon;
  const isApproved = status === "approved";
  const isDismissed = status === "dismissed";
  const isResolved = isApproved || isDismissed;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
        animate={{
          opacity: isDismissed ? 0.4 : 1,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 100,
          delay: index * 0.15,
        }}
        className={`relative group ${isDismissed ? "pointer-events-none" : ""}`}
      >
        {/* Outer glow */}
        <div
          className={`absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm ${
            isApproved
              ? "bg-gradient-to-br from-emerald-500/20 to-emerald-500/5"
              : config.gradientFrom
          }`}
          style={
            isApproved
              ? { boxShadow: "0 0 40px -10px rgba(16, 185, 129, 0.4)" }
              : { boxShadow: `0 0 40px -10px ${config.glowColor}` }
          }
        />

        <div
          className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
            isApproved
              ? "border-emerald-500/30 bg-emerald-950/20"
              : isDismissed
              ? "border-slate-700/20 bg-slate-950/30"
              : `${config.borderColor} bg-[#0a0f0f]/80`
          }`}
          style={
            isApproved
              ? { boxShadow: "0 0 30px -10px rgba(16, 185, 129, 0.3)" }
              : !isDismissed
              ? { boxShadow: `0 0 30px -10px ${config.glowColor}` }
              : {}
          }
        >
          {/* Background gradient overlay */}
          <div
            className={`absolute inset-0 opacity-30 ${
              isApproved
                ? "bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent"
                : config.overlayGradient
            }`}
          />

          {/* Content */}
          <div className="relative z-10 p-6">
            {/* Top Row: Type badge + Sleep Stage + Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Type Badge */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bgColor} ${config.borderColor} border`}
                >
                  <TypeIcon className={`w-3.5 h-3.5 ${config.textColor}`} />
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${config.textColor}`}
                  >
                    {config.label}
                  </span>
                </div>

                {/* Sleep Stage */}
                <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                    {improvement.sleepStage}
                  </span>
                </div>
              </div>

              {/* Status indicator */}
              {isApproved && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400">
                    Approved
                  </span>
                </motion.div>
              )}
              {isDismissed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-500/10 border border-slate-500/20"
                >
                  <X className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-500">
                    Dismissed
                  </span>
                </motion.div>
              )}
            </div>

            {/* Title */}
            <h3
              className={`text-xl font-bold mb-3 ${
                isDismissed ? "line-through text-slate-600" : "text-white"
              }`}
            >
              {improvement.title}
            </h3>

            {/* Confidence Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                  Confidence
                </span>
                <span
                  className={`text-sm font-bold ${
                    isDismissed ? "text-slate-600" : config.textColor
                  }`}
                >
                  {Math.round(improvement.confidence * 100)}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${improvement.confidence * 100}%`,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: index * 0.15 + 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`h-full rounded-full ${
                    isApproved
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                      : isDismissed
                      ? "bg-slate-700"
                      : improvement.type === "skill"
                      ? "bg-gradient-to-r from-cyan-600 to-cyan-400"
                      : improvement.type === "rule"
                      ? "bg-gradient-to-r from-amber-600 to-amber-400"
                      : "bg-gradient-to-r from-violet-600 to-violet-400"
                  }`}
                />
              </div>
            </div>

            {/* Story */}
            <p
              className={`text-sm leading-relaxed mb-4 ${
                isDismissed ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {improvement.story}
            </p>

            {/* Impact */}
            <div
              className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg ${
                isDismissed
                  ? "bg-slate-900/30 border border-slate-800/20"
                  : "bg-emerald-500/5 border border-emerald-500/10"
              }`}
            >
              <TrendingUp
                className={`w-4 h-4 ${
                  isDismissed ? "text-slate-700" : "text-emerald-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isDismissed ? "text-slate-700" : "text-emerald-300"
                }`}
              >
                {improvement.impact}
              </span>
            </div>

            {/* Pattern Sources */}
            <div className="flex flex-wrap gap-2 mb-5">
              {improvement.patternSources.map((source, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-mono px-2 py-1 rounded-md ${
                    isDismissed
                      ? "bg-slate-900/30 text-slate-700 border border-slate-800/20"
                      : "bg-slate-800/50 text-slate-500 border border-slate-700/30"
                  }`}
                >
                  {source}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            {!isResolved && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 + 0.5 }}
                className="flex items-center gap-3"
              >
                <button
                  onClick={() => onApprove(improvement.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all duration-300 text-sm font-semibold"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => onDismiss(improvement.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300 transition-all duration-300 text-sm font-medium"
                >
                  <X className="w-4 h-4" />
                  Dismiss
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImprovementCard;
