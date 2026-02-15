"use client";

import { useState } from "react";
import type { Activity } from "@/types";
import {
  Play,
  BookOpen,
  FileText,
  MessageSquare,
  HelpCircle,
  ClipboardList,
  Video,
  CheckCircle2,
  ThumbsUp,
  AlertCircle,
  Info,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const baseClasses =
    "rounded-xl border border-slate-200 bg-white p-5 shadow-sm";

  switch (activity.type) {
    case "video_player":
      return (
        <div className={baseClasses}>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Video className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900">{activity.title}</h3>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-lg transition-transform hover:scale-110"
              >
                <Play className="ml-1 h-8 w-8" fill="currentColor" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-sm text-white/90">
                {activity.description || "Click play to watch"}
              </p>
            </div>
          </div>
        </div>
      );

    case "explanatory_text":
      return (
        <div className={baseClasses}>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900">{activity.title}</h3>
          </div>
          <div
            className="prose prose-slate max-w-none text-slate-700 prose-p:my-2 prose-ul:my-2 prose-li:my-0"
            dangerouslySetInnerHTML={{
              __html: activity.content || "",
            }}
          />
        </div>
      );

    case "reading":
      return (
        <div className={baseClasses}>
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-slate-900">{activity.title}</h3>
          </div>
          {activity.config &&
            typeof activity.config === "object" &&
            "estimatedTime" in activity.config && (
              <p className="mb-3 text-sm text-slate-500">
                Estimated reading time:{" "}
                {(activity.config as { estimatedTime?: number }).estimatedTime}{" "}
                min
              </p>
            )}
          <div
            className="prose prose-slate max-w-none text-slate-700 prose-p:my-2 prose-ul:my-2 prose-li:my-0"
            dangerouslySetInnerHTML={{
              __html: activity.content || "",
            }}
          />
        </div>
      );

    case "poll":
      return (
        <PollActivity activity={activity} baseClasses={baseClasses} />
      );

    case "question":
      return (
        <QuestionActivity activity={activity} baseClasses={baseClasses} />
      );

    case "formative_quiz":
      return (
        <FormativeQuizActivity activity={activity} baseClasses={baseClasses} />
      );

    case "whiteboard":
      return (
        <WhiteboardActivity activity={activity} baseClasses={baseClasses} />
      );

    case "information_box":
      return (
        <InformationBoxActivity activity={activity} baseClasses={baseClasses} />
      );

    case "live_class":
      return (
        <LiveClassActivity activity={activity} baseClasses={baseClasses} />
      );

    case "learning_outcomes":
      return (
        <LearningOutcomesActivity
          activity={activity}
          baseClasses={baseClasses}
        />
      );

    default:
      return (
        <div className={baseClasses}>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900">{activity.title}</h3>
          </div>
          <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">
            Activity type: {activity.type.replace(/_/g, " ")}
          </p>
          {activity.description && (
            <p className="mt-2 text-sm text-slate-600">{activity.description}</p>
          )}
        </div>
      );
  }
}

function PollActivity({
  activity,
  baseClasses,
}: {
  activity: Activity;
  baseClasses: string;
}) {
  const config = activity.config as {
    question?: string;
    options?: string[];
    results?: number[];
  };
  const options = config?.options ?? [];
  const results = config?.results ?? options.map(() => 0);
  const [voted, setVoted] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const maxVotes = Math.max(...results, 1);

  return (
    <div className={baseClasses}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
          <MessageSquare className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-slate-900">{activity.title}</h3>
      </div>
      <p className="mb-4 text-slate-600">
        {config?.question || activity.description}
      </p>

      {!voted ? (
        <>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <label
                key={i}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  selected === i
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name={`poll-${activity.id}`}
                  checked={selected === i}
                  onChange={() => setSelected(i)}
                  className="h-4 w-4 text-[var(--color-primary)]"
                />
                <span className="text-slate-800">{opt}</span>
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => selected !== null && setVoted(true)}
            disabled={selected === null}
            className="mt-4 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
          >
            Vote
          </button>
        </>
      ) : (
        <div className="space-y-3">
          {options.map((opt, i) => (
            <div key={i}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-700">{opt}</span>
                <span className="font-medium text-slate-900">
                  {results[i] ?? 0} votes
                </span>
              </div>
              <div className="h-6 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  className="h-full rounded-full bg-[var(--color-primary)]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((results[i] ?? 0) / maxVotes) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionActivity({
  activity,
  baseClasses,
}: {
  activity: Activity;
  baseClasses: string;
}) {
  const config = activity.config as { questions?: string[] };
  const questions = config?.questions ?? [
    activity.description || "Share your thoughts...",
  ];

  return (
    <div className={baseClasses}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
          <HelpCircle className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-slate-900">{activity.title}</h3>
      </div>
      {activity.content && (
        <div
          className="mb-4 text-slate-600"
          dangerouslySetInnerHTML={{ __html: activity.content }}
        />
      )}
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i}>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {q}
            </label>
            <textarea
              rows={4}
              placeholder="Type your response..."
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function FormativeQuizActivity({
  activity,
  baseClasses,
}: {
  activity: Activity;
  baseClasses: string;
}) {
  const config = activity.config as {
    questions?: Array<{
      question: string;
      options: string[];
      correctIndex: number;
      feedback: string;
    }>;
  };
  const questions = config?.questions ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (questions.length === 0) {
    return (
      <div className={baseClasses}>
        <h3 className="font-semibold text-slate-900">{activity.title}</h3>
        <p className="mt-2 text-slate-500">No questions configured.</p>
      </div>
    );
  }

  const q = questions[currentIndex];
  const isCorrect = selected === q.correctIndex;

  return (
    <div className={baseClasses}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
          <ClipboardList className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-slate-900">{activity.title}</h3>
      </div>
      <p className="mb-4 text-sm text-slate-500">
        Question {currentIndex + 1} of {questions.length}
      </p>
      <p className="mb-4 font-medium text-slate-800">{q.question}</p>

      {!showFeedback ? (
        <>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSelected(i);
                  setShowFeedback(true);
                }}
                className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-sm">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-slate-800">{opt}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div
              className={`flex items-start gap-3 rounded-lg p-4 ${
                isCorrect ? "bg-green-50" : "bg-red-50"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600" />
              ) : (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-200 text-red-700">
                  ✕
                </span>
              )}
              <div>
                <p
                  className={`font-medium ${
                    isCorrect ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isCorrect ? "Correct!" : "Not quite."}
                </p>
                <p
                  className={`mt-1 text-sm ${
                    isCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {q.feedback}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setShowFeedback(false);
                setCurrentIndex((i) =>
                  i < questions.length - 1 ? i + 1 : i
                );
              }}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]"
            >
              {currentIndex < questions.length - 1 ? "Next question" : "Finish"}
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function WhiteboardActivity({
  activity,
  baseClasses,
}: {
  activity: Activity;
  baseClasses: string;
}) {
  const config = activity.config as {
    prompt?: string;
    submissions?: Array<{ id: string; author: string; text: string; votes: number }>;
  };
  const prompt = config?.prompt ?? activity.description;
  const submissions = (config?.submissions ?? []).sort(
    (a, b) => (b.votes ?? 0) - (a.votes ?? 0)
  );
  const [newSubmission, setNewSubmission] = useState("");

  return (
    <div className={baseClasses}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
          <MessageSquare className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-slate-900">{activity.title}</h3>
      </div>
      <p className="mb-4 text-slate-600">{prompt}</p>

      <div className="mb-4 space-y-3">
        {submissions.map((s) => (
          <div
            key={s.id}
            className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3"
          >
            <p className="flex-1 text-sm text-slate-800">{s.text}</p>
            <div className="flex shrink-0 items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-600">
                {s.votes}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newSubmission}
          onChange={(e) => setNewSubmission(e.target.value)}
          placeholder="Add your idea..."
          className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:outline-none"
        />
        <button
          type="button"
          className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function InformationBoxActivity({
  activity,
  baseClasses,
}: {
  activity: Activity;
  baseClasses: string;
}) {
  const config = activity.config as { color?: "yellow" | "blue" | "green" };
  const color = config?.color ?? "yellow";
  const colorMap = {
    yellow: "bg-amber-50 border-amber-200 text-amber-900",
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    green: "bg-green-50 border-green-200 text-green-900",
  };
  const iconMap = {
    yellow: <AlertCircle className="h-5 w-5 text-amber-600" />,
    blue: <Info className="h-5 w-5 text-blue-600" />,
    green: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  };

  return (
    <div
      className={`${baseClasses} border-2 ${colorMap[color]}`}
    >
      <div className="flex items-start gap-3">
        {iconMap[color]}
        <div>
          <h3 className="font-semibold">{activity.title}</h3>
          <div
            className="mt-1 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: activity.content || "" }}
          />
        </div>
      </div>
    </div>
  );
}

function LiveClassActivity({
  activity,
  baseClasses,
}: {
  activity: Activity;
  baseClasses: string;
}) {
  const config = activity.config as {
    date?: string;
    time?: string;
    duration?: number;
    platform?: string;
    link?: string;
    instructor?: string;
  };

  return (
    <div className={baseClasses}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
          <Video className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-slate-900">{activity.title}</h3>
      </div>
      <div className="space-y-2 text-sm text-slate-600">
        <p>
          <strong>Date:</strong> {config?.date ?? "TBD"}
        </p>
        <p>
          <strong>Time:</strong> {config?.time ?? "TBD"}
        </p>
        <p>
          <strong>Platform:</strong> {config?.platform ?? "TBD"}
        </p>
        {config?.instructor && (
          <p>
            <strong>Instructor:</strong> {config.instructor}
          </p>
        )}
      </div>
      {config?.link && (
        <a
          href={config.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          <Video className="h-4 w-4" />
          Join session
        </a>
      )}
    </div>
  );
}

function LearningOutcomesActivity({
  activity,
  baseClasses,
}: {
  activity: Activity;
  baseClasses: string;
}) {
  const config = activity.config as { outcomes?: string[] };
  const outcomes = config?.outcomes ?? [];

  return (
    <div className={baseClasses}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
          <Lightbulb className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-slate-900">{activity.title}</h3>
      </div>
      <ul className="space-y-2">
        {outcomes.map((outcome, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-slate-700"
          >
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 text-xs">
              {i + 1}
            </span>
            <span>{outcome}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
