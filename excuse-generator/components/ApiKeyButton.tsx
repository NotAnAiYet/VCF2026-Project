"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export const USER_MODE = process.env.NEXT_PUBLIC_USER_MODE === "true";
export const LS_KEY = "groq_api_key";

const KEY_CHANGE_EVENT = "groq-key-changed";

export function dispatchKeyChange() {
  window.dispatchEvent(new Event(KEY_CHANGE_EVENT));
}

export function useGroqApiKey() {
  const [userApiKey, setUserApiKey] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setUserApiKey(localStorage.getItem(LS_KEY) ?? "");
    sync();
    window.addEventListener(KEY_CHANGE_EVENT, sync);
    return () => window.removeEventListener(KEY_CHANGE_EVENT, sync);
  }, []);

  return userApiKey;
}

export default function ApiKeyButton() {
  const [mounted, setMounted] = useState(false);
  const [userApiKey, setUserApiKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [keyPanelOpen, setKeyPanelOpen] = useState(false);
  const keyPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) ?? "";
    setUserApiKey(saved);
    setKeyInput(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (keyPanelRef.current && !keyPanelRef.current.contains(e.target as Node)) {
        setKeyPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const saveKey = useCallback(() => {
    const trimmed = keyInput.trim();
    localStorage.setItem(LS_KEY, trimmed);
    setUserApiKey(trimmed);
    setKeyPanelOpen(false);
    dispatchKeyChange();
  }, [keyInput]);

  const clearKey = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setUserApiKey("");
    setKeyInput("");
    setKeyPanelOpen(false);
    dispatchKeyChange();
  }, []);

  if (!mounted) return null;

  return (
    <div ref={keyPanelRef} className="relative">
      <button
        type="button"
        onClick={() => { setKeyInput(userApiKey); setKeyPanelOpen((o) => !o); }}
        title={USER_MODE ? "Your Groq API key (required)" : "Override Groq API key (optional)"}
        className={`flex items-center gap-2 px-3 py-2 border-4 border-black font-extrabold text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-[4px_4px_0_#000] ${userApiKey ? "bg-[#33FF00] text-black" : "bg-[#FFE600] text-black"}`}
      >
        <KeyIcon />
        {userApiKey ? "Key saved" : USER_MODE ? "Add API key" : "Override API key"}
      </button>

      {keyPanelOpen && (
        <div className="absolute right-0 top-full mt-2 z-20 bg-white border-4 border-black shadow-[8px_8px_0_#000] p-4 flex flex-col gap-3 w-80">
          <div className="text-xs font-black uppercase tracking-widest">
            {USER_MODE ? "Your Groq API key" : "Override Groq API key"}
          </div>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveKey()}
            placeholder="gsk_..."
            className="border-4 border-black px-3 py-2 font-mono text-sm outline-none w-full shadow-[4px_4px_0_#000]"
            autoFocus
          />
          <p className="text-[11px] font-semibold text-[#666]">
            {USER_MODE
              ? "Required. Stored locally in your browser. Never sent anywhere except Groq."
              : "Optional. Overrides the server key. Stored locally in your browser."}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveKey}
              className="flex-1 bg-black text-white font-extrabold text-sm uppercase py-2 border-4 border-black shadow-[4px_4px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
            >
              Save
            </button>
            {userApiKey && (
              <button
                type="button"
                onClick={clearKey}
                className="flex-1 bg-[#FF2A2A] text-white font-extrabold text-sm uppercase py-2 border-4 border-black shadow-[4px_4px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function KeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2l-9.6 9.6" />
      <path d="M15.5 7.5l3 3" />
    </svg>
  );
}
