"use client";

import { useState, useRef, useEffect } from "react";
import { type ThreatLevel, THREAT_LEVELS } from "@/data/threatLevels";
import { EXCUSE_FLAVORS } from "@/data/excuseFlavors";
import { RANDOM_SITUATIONS } from "@/data/randomSituations";


export default function ExcuseForm() {
  const [situation, setSituation] = useState("");
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>("moderate");
  const [excuseFlavor, setExcuseFlavor] = useState(EXCUSE_FLAVORS[0].label);
  const [flavorOpen, setFlavorOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [excuse, setExcuse] = useState("");
  const [submittedSituation, setSubmittedSituation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFlavorOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

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
        body: JSON.stringify({
          situation: situation.trim(),
          threatLevel,
          excuseFlavor,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      const data = await res.json();
      setExcuse(data.excuse);
      setSubmittedSituation(situation.trim());
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
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

  function sendSms() {
    window.open("sms:?&body=" + encodeURIComponent(excuse));
  }

  function randomize() {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    setSituation(pick(RANDOM_SITUATIONS));
    setThreatLevel(pick(THREAT_LEVELS).value);
    setExcuseFlavor(pick(EXCUSE_FLAVORS).label);
  }

  const canSubmit = situation.trim().length > 0 && !loading;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-20 items-start">

      {/* ── Left: Generator form ── */}
      <form
        onSubmit={generate}
        className="bg-white border-4 border-black shadow-[12px_12px_0_#000] p-6 flex flex-col gap-5"
      >
        {/* 1. Situation */}
        <div className="flex flex-col gap-4">
          <div className="text-sm font-black uppercase tracking-widest">
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

        {/* 2. Threat Level */}
        <div className="flex flex-col gap-4">
          <div className="text-sm font-black uppercase tracking-widest">
            2. Threat Level
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 border-4 border-black shadow-[6px_6px_0_#000] w-full bg-black gap-[3px] overflow-hidden">
            {THREAT_LEVELS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setThreatLevel(t.value)}
                className={`py-4 text-center font-extrabold text-sm sm:text-base transition-colors cursor-pointer ${threatLevel === t.value ? t.activeClass : "bg-white text-black hover:bg-[#F4F4F0]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Excuse Flavor */}
        <div className="flex flex-col gap-4">
          <div className="text-sm font-black uppercase tracking-widest">
            3. Excuse Flavor
          </div>
          <div ref={dropdownRef} className="relative border-4 border-black shadow-[6px_6px_0_#000] bg-white">
            <button
              type="button"
              onClick={() => setFlavorOpen((o) => !o)}
              className="w-full flex items-center justify-between px-5 py-5 font-extrabold text-lg cursor-pointer bg-white text-left"
            >
              <span>{excuseFlavor}</span>
              <svg
                width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="4" strokeLinecap="square"
                className={`transition-transform ${flavorOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {flavorOpen && (
              <div className="absolute -left-1 -right-1 top-full border-4 border-t-0 border-black bg-white z-10 shadow-[6px_6px_0_#000] max-h-56 overflow-y-auto">
                {EXCUSE_FLAVORS.map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => { setExcuseFlavor(f.label); setFlavorOpen(false); }}
                    className={[
                      "w-full text-left px-5 py-4 font-extrabold text-base cursor-pointer border-b-2 border-[#E5E5E5] last:border-b-0",
                      f.label === excuseFlavor ? "bg-[#FFE600]" : "bg-white hover:bg-[#F4F4F0]",
                    ].join(" ")}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit + Dice — sticky on mobile */}
        <div className="sticky bottom-0 -mx-6 px-6 pb-6 pt-3 bg-white sm:static sm:mx-0 sm:px-0 sm:pb-0 sm:pt-0 sm:bg-transparent mt-2 border-t-4 border-black sm:border-t-0 flex gap-3">
          <button
            type="button"
            onClick={randomize}
            title="Randomize everything"
            className="shrink-0 w-16 bg-[#FFE600] border-4 border-black shadow-[6px_6px_0_#000] flex items-center justify-center transition-all active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_#000]"
          >
            <DiceIcon />
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex-1 bg-[#FF2A2A] border-4 border-black shadow-[8px_8px_0_#000] text-white text-[28px] font-black uppercase py-4 text-center transition-all active:translate-x-1 active:translate-y-1 active:shadow-[4px_4px_0_#000] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
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
        </div>
      </form>

      {/* ── Right: Output — hidden on mobile until generated ── */}
      <div ref={resultRef} className={`flex flex-col gap-6 ${!excuse && !error ? "hidden lg:flex" : "flex"}`}>

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
        <div className="bg-white border-[6px] border-black rounded-[40px] p-5 shadow-[16px_16px_0_#000] w-full max-w-105 mx-auto flex flex-col gap-5">

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
              <>
                {/* Received message */}
                <div className="self-start max-w-[80%]">
                  <div
                    className="bg-[#E5E5E5] border-[3px] border-black px-4 py-4 text-base font-semibold leading-snug"
                    style={{ borderRadius: "24px 24px 24px 4px" }}
                  >
                    {submittedSituation}
                  </div>
                </div>

                {/* Generated excuse */}
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
              </>
            )}

          </div>
        </div>

        {/* Action buttons */}
        {excuse && !error && (
          <div className="flex flex-col gap-3 max-w-105 mx-auto w-full">
            <button
              onClick={copy}
              className="bg-black text-white font-extrabold text-lg uppercase py-4 text-center rounded-xl cursor-pointer tracking-wide"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            <button
              onClick={sendSms}
              className="bg-white border-[3px] border-black text-black font-extrabold text-lg uppercase py-4 text-center rounded-xl shadow-[4px_4px_0_#000] cursor-pointer tracking-wide"
            >
              Send Directly (SMS)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DiceIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <circle cx="8"  cy="8"  r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8"  r="1.2" fill="currentColor" stroke="none" />
      <circle cx="8"  cy="16" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
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
