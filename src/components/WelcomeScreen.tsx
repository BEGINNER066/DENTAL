"use client";

import React from "react";
import { Sparkles, Pause, Play, Gift } from "lucide-react";
import { SwanLogo } from "./BrandAssets";
import { useApp } from "@/lib/store";

const PETALS = [
  { left: "8%", delay: "0s", duration: "11s", size: 14, color: "#F4C8D9" },
  { left: "22%", delay: "2s", duration: "13s", size: 10, color: "#DCD4F4" },
  { left: "38%", delay: "1s", duration: "10s", size: 12, color: "#F4C8D9" },
  { left: "56%", delay: "3.5s", duration: "12s", size: 15, color: "#DCD4F4" },
  { left: "74%", delay: "0.8s", duration: "11.5s", size: 11, color: "#F4C8D9" },
  { left: "89%", delay: "2.4s", duration: "13.5s", size: 13, color: "#DCD4F4" },
];

export function WelcomeScreen() {
  const { state, enterFromWelcome, updateProfile } = useApp();
  const animOn = state.profile.animationsEnabled;

  return (
    <div
      className={`relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#FBE8EF] via-[#FFFAF4] to-[#F0EDFB] ${
        animOn ? "" : "animations-paused"
      }`}
    >
      {/* Floating light petals */}
      {animOn && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          {PETALS.map((p, idx) => (
            <span
              key={idx}
              className="animate-petal absolute -top-8 rounded-full opacity-70"
              style={
                {
                  left: p.left,
                  width: p.size,
                  height: p.size * 1.3,
                  backgroundColor: p.color,
                  borderRadius: "60% 40% 60% 40%",
                  animationDelay: p.delay,
                  "--petal-duration": p.duration,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Animation toggle button */}
      <button
        type="button"
        onClick={() => updateProfile({ animationsEnabled: !animOn })}
        className="fixed top-5 right-5 z-20 inline-flex items-center gap-2 rounded-full bg-white/85 backdrop-blur px-3.5 py-2 text-xs font-medium text-[#514657] border border-[#EEDCE5] shadow-sm hover:bg-[#FBE8EF] transition"
      >
        {animOn ? <Pause className="w-3.5 h-3.5 text-[#C56F91]" /> : <Play className="w-3.5 h-3.5 text-[#C56F91]" />}
        {animOn ? "Hentikan animasi" : "Putar animasi"}
      </button>

      {/* Main Welcome Gift Card */}
      <main className="relative z-10 w-full max-w-lg rounded-3xl bg-white/90 backdrop-blur-md border border-[#EEDCE5] shadow-[0_20px_50px_-15px_rgba(197,111,145,0.22)] p-8 sm:p-11 text-center">
        <div className="mx-auto mb-6 inline-flex items-center justify-center animate-gentle-bob">
          <SwanLogo size={88} />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F0EDFB] px-3.5 py-1 text-xs font-medium text-[#514657] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#C56F91]" />
          <span>A little universe made just for Caca</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#514657] mb-3">
          Little Dental World
        </h1>

        <p className="text-sm sm:text-base text-[#7C6F83] leading-relaxed mb-7">
          Hadiah kecil untuk menemani perjalanan belajar kedokteran gigimu—tempat di mana
          materi kuliah tersusun rapi, dan hatimu selalu punya ruang lembut untuk beristirahat.
        </p>

        <div className="rounded-2xl bg-[#FFFAF4] border border-[#F4C8D9]/70 p-4 mb-8 text-left">
          <p className="font-serif italic text-base sm:text-lg text-[#514657] leading-relaxed">
            &ldquo;Perjalanan menjadi dokter gigi dibangun dari banyak langkah kecil.
            Selamat datang di ruang kecilmu, Caca.&rdquo;
          </p>
        </div>

        <button
          type="button"
          onClick={enterFromWelcome}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#C56F91] hover:bg-[#A95476] text-white font-semibold px-8 py-3.5 text-base shadow-[0_10px_25px_-8px_rgba(197,111,145,0.6)] transition cursor-pointer"
        >
          <Gift className="w-5 h-5" />
          Open Your Gift
        </button>
      </main>
    </div>
  );
}
