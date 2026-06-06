"use client";

import { useState } from "react";

type Tone = "formal" | "casual" | "funny";

const TONES: { value: Tone; label: string }[] = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "funny", label: "Funny" },
];

const TONE_ACTIVE_CLASS: Record<Tone, string> = {
  formal: "bg-[#FFE600] text-black",
  casual: "bg-[#FF9900] text-black",
  funny: "bg-[#FF2A2A] text-white",
};

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
    <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-16 items-start">

      {/* ── Left: Generator form ── */}
      <form
        onSubmit={generate}
        className="bg-white border-4 border-black shadow-[12px_12px_0_#000] p-6 flex flex-col gap-5"
      >
        {/* 1. Situation */}
        <div className="flex flex-col gap-4">
          <div className="text-[11px] font-black uppercase tracking-widest">
            1. What are we bailing on?
          </div>
          <textarea
            rows={4}
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="e.g. 4PM Zoom sync about TPS reports..."
            className="w-full resize-none border-4 border-black bg-white px-4 py-4 text-base font-semibold text-black placeholder-[#969696] outline-none shadow-[6px_6px_0_#000] leading-relaxed"
          />
        </div>

        {/* 2. Tone */}
        <div className="flex flex-col gap-4">
          <div className="text-[11px] font-black uppercase tracking-widest">
            2. Tone
          </div>
          <div className="flex border-4 border-black shadow-[6px_6px_0_#000] w-full overflow-hidden">
            {TONES.map((t, i) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTone(t.value)}
                className={[
                  "flex-1 py-4 text-center font-extrabold text-base transition-colors cursor-pointer",
                  i < TONES.length - 1 ? "border-r-4 border-black" : "",
                  tone === t.value
                    ? TONE_ACTIVE_CLASS[t.value]
                    : "bg-white text-black hover:bg-[#F4F4F0]",
                ].join(" ")}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-2 w-full bg-[#FF2A2A] border-4 border-black shadow-[8px_8px_0_#000] text-white text-2xl font-black uppercase py-4 text-center transition-all active:translate-x-1 active:translate-y-1 active:shadow-[4px_4px_0_#000] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <Spinner />
              Generating…
            </span>
          ) : (
            "BAIL ME OUT"
          )}
        </button>
      </form>

      {/* ── Right: Output ── */}
      <div className="flex flex-col gap-6">

        {/* "THE ALIBI" stripe accent */}
        <div className="flex items-center gap-6">
          <div
            className="flex-1 h-2"
            style={{ background: "repeating-linear-gradient(45deg, #000, #000 10px, transparent 10px, transparent 20px)" }}
          />
          <div className="text-2xl font-black uppercase tracking-widest bg-black text-white px-4 py-2" style={{ transform: "rotate(2deg)" }}>
            THE ALIBI
          </div>
          <div
            className="flex-1 h-2"
            style={{ background: "repeating-linear-gradient(45deg, #000, #000 10px, transparent 10px, transparent 20px)" }}
          />
        </div>

        {/* Phone mockup */}
        <div className="bg-white border-[6px] border-black rounded-[40px] p-5 shadow-[16px_16px_0_#000] w-full max-w-md mx-auto flex flex-col gap-5">

          {/* Notch */}
          <div className="flex justify-center border-b-[3px] border-[#E5E5E5] pb-4">
            <div className="w-30 h-1.5 bg-black rounded-full" />
          </div>

          {/* Chat area */}
          <div className="flex flex-col gap-4 py-2 min-h-35">

            {!excuse && !error && (
              <div className="flex items-center justify-center h-25 text-sm font-bold text-[#969696] text-center">
                Your alibi will appear here
              </div>
            )}

            {error && (
              <div className="border-[3px] border-[#FF2A2A] bg-red-50 px-4 py-3 text-sm font-bold text-[#FF2A2A] rounded-lg">
                {error}
              </div>
            )}

            {excuse && !error && (
              <div className="self-end max-w-[85%]">
                <div
                  className="bg-[#33FF00] border-[3px] border-black px-4 py-4 text-base font-bold leading-relaxed"
                  style={{ borderRadius: "24px 24px 4px 24px", boxShadow: "4px 4px 0 rgba(0,0,0,0.2)" }}
                >
                  {excuse}
                </div>
                <div className="text-[11px] font-extrabold text-[#FF2A2A] mt-2 mr-3 flex items-center justify-end gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Auto-generated
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Action buttons */}
        {excuse && !error && (
          <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
            <button
              onClick={copy}
              className="bg-black text-white font-extrabold text-lg uppercase py-4 text-center rounded-xl cursor-pointer tracking-wide"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            <button
              onClick={() => generate()}
              disabled={loading}
              className="bg-white border-[3px] border-black text-black font-extrabold text-lg uppercase py-4 text-center rounded-xl shadow-[4px_4px_0_#000] cursor-pointer disabled:opacity-40 tracking-wide"
            >
              Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
