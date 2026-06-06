"use client";

import { useState } from "react";

type Tone = "formal" | "casual" | "funny";

const TONES: { value: Tone; label: string; description: string }[] = [
  { value: "formal", label: "Formal", description: "Professional & polished" },
  { value: "casual", label: "Casual", description: "Relaxed & natural" },
  { value: "funny", label: "Funny", description: "Light-hearted & humorous" },
];

export default function ExcuseForm() {
  const [situation, setSituation] = useState("");
  const [tone, setTone] = useState<Tone>("casual");
  const [excuse, setExcuse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!situation.trim()) return;

    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const res = await fetch("/api/excuse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: situation.trim(), tone }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      const data = await res.json();
      setExcuse(data.excuse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!excuse) return;
    await navigator.clipboard.writeText(excuse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const canSubmit = situation.trim().length > 0 && !loading;

  return (
    <div className="flex flex-col gap-6">
      {/* Input card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <form onSubmit={generate} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="situation"
              className="text-sm font-medium text-zinc-300"
            >
              What&apos;s your situation?
            </label>
            <textarea
              id="situation"
              rows={4}
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g. I can't make it to work today, I missed my friend's birthday dinner…"
              className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Tone selector */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-300">Tone</span>
            <div className="grid grid-cols-3 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTone(t.value)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition ${
                    tone === t.value
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                      : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs opacity-70">{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <Spinner />
                Generating…
              </>
            ) : (
              "Generate Excuse"
            )}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Result card */}
      {excuse && !error && (
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Your Excuse
            </span>
            <span className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs capitalize text-zinc-400">
              {tone}
            </span>
          </div>

          <p className="text-base leading-relaxed text-zinc-100">{excuse}</p>

          <div className="mt-5 flex gap-3">
            <button
              onClick={copy}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-4 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
            >
              {copied ? (
                <>
                  <CheckIcon />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardIcon />
                  Copy
                </>
              )}
            </button>

            <button
              onClick={() => generate()}
              disabled={loading}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-4 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100 disabled:opacity-40"
            >
              <RefreshIcon />
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-green-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  );
}
