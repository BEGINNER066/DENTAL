"use client";

import React, { useEffect, useRef, useState } from "react";
import { CloudRain, Waves, Wind, Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { CozyMoonMascot } from "../BrandAssets";

const RELAX_PROMPTS = [
  "Tarik napas perlahan, lepaskan ketegangan di bahu dan rahangmu.",
  "Kamu tidak harus menyelesaikan semuanya malam ini. Istirahat juga bentuk produktivitas.",
  "Minum segelas air putih hangat dan pejamkan mata sejenak selama 1 menit.",
];

export function CozyRoomView() {
  const { logStudySession } = useApp();
  const [mode, setMode] = useState<"focus" | "rest">("rest");
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [running, setRunning] = useState(false);

  // Ambient sound synthesizer via Web Audio API (no external dependencies)
  const [activeSound, setActiveSound] = useState<"none" | "rain" | "ocean" | "breeze">("none");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Breathing exercise
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Tarik napas" | "Tahan" | "Hembuskan">("Tarik napas");
  const [promptIdx, setPromptIdx] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          if (mode === "focus") logStudySession(25);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, mode, logStudySession]);

  useEffect(() => {
    if (!breathingActive) return;
    let step = 0;
    const cycle = setInterval(() => {
      step = (step + 1) % 3;
      setBreathPhase(step === 0 ? "Tarik napas" : step === 1 ? "Tahan" : "Hembuskan");
    }, 4000);
    return () => clearInterval(cycle);
  }, [breathingActive]);

  const stopAudio = () => {
    try {
      sourceNodeRef.current?.stop();
    } catch {
      // Ignore if already stopped
    }
    sourceNodeRef.current = null;
    setActiveSound("none");
  };

  const toggleSound = (kind: "rain" | "ocean" | "breeze") => {
    if (activeSound === kind) {
      stopAudio();
      return;
    }
    stopAudio();
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current ?? new AudioCtx();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown/pinkish gentle filter
        data[i] = (lastOut + 0.03 * white) / 1.03;
        lastOut = data[i];
        data[i] *= kind === "ocean" ? 2.2 : kind === "rain" ? 1.5 : 1.0;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = kind === "rain" ? 950 : kind === "ocean" ? 420 : 650;

      const gain = ctx.createGain();
      gain.gain.value = 0.25;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();

      sourceNodeRef.current = source;
      gainNodeRef.current = gain;
      setActiveSound(kind);
    } catch {
      setActiveSound("none");
    }
  };

  useEffect(() => {
    return () => {
      try {
        sourceNodeRef.current?.stop();
      } catch {
        // Ignore cleanup errors
      }
    };
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CozyMoonMascot size={46} />
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">Cozy Room</h1>
          <p className="text-sm text-[#7C6F83]">
            Timer fokus/istirahat lembut, suara hujan & laut, dan latihan napas sederhana.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Focus / Rest Timer */}
        <section className="rounded-3xl bg-white/95 border border-[#DCD4F4] p-6 text-center space-y-5">
          <div className="inline-flex rounded-full bg-[#F0EDFB] p-1">
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setMode("rest");
                setSecondsLeft(15 * 60);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer ${
                mode === "rest" ? "bg-white text-[#514657] shadow-xs" : "text-[#7C6F83]"
              }`}
            >
              Timer Istirahat (15m)
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setMode("focus");
                setSecondsLeft(25 * 60);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer ${
                mode === "focus" ? "bg-white text-[#514657] shadow-xs" : "text-[#7C6F83]"
              }`}
            >
              Fokus Lembut (25m)
            </button>
          </div>

          <div className="py-4">
            <p className="font-serif text-6xl font-semibold text-[#514657] tabular-nums">
              {mm}:{ss}
            </p>
            <p className="text-xs text-[#7C6F83] mt-2">
              {mode === "rest"
                ? "Tidak ada penalti jika sesi istirahatmu berlangsung lebih lama."
                : "Belajar pelan-pelan, satu bagian kecil dulu."}
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setRunning(!running)}
              className="inline-flex items-center gap-2 rounded-full bg-[#C56F91] text-white px-6 py-2.5 text-xs font-semibold hover:bg-[#A95476] cursor-pointer"
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {running ? "Jeda" : "Mulai"}
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setSecondsLeft(mode === "rest" ? 15 * 60 : 25 * 60);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#EEDCE5] bg-white px-4 py-2.5 text-xs font-semibold text-[#514657] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </section>

        {/* Ambient Sounds & Breathing */}
        <div className="space-y-6">
          <section className="rounded-3xl bg-white/95 border border-[#DCD4F4] p-6 space-y-4">
            <h2 className="font-semibold text-base text-[#514657]">Suara Ambient Menenangkan</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "rain" as const, label: "Hujan Halus", icon: CloudRain },
                { id: "ocean" as const, label: "Ombak Laut", icon: Waves },
                { id: "breeze" as const, label: "Angin Malam", icon: Wind },
              ].map((s) => {
                const Icon = s.icon;
                const active = activeSound === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSound(s.id)}
                    className={`rounded-2xl border p-4 flex flex-col items-center gap-2 text-xs font-semibold transition cursor-pointer ${
                      active
                        ? "bg-[#DCD4F4] border-[#C56F91] text-[#514657]"
                        : "bg-[#FFFAF4] border-[#EEDCE5] text-[#7C6F83] hover:bg-[#F0EDFB]"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#C56F91]" />
                    <span>{s.label}</span>
                    <span className="text-[10px]">{active ? "Diputar" : "Putar"}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl bg-gradient-to-br from-[#F0EDFB] to-[#FBE8EF]/70 border border-[#DCD4F4] p-6 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <h2 className="font-semibold text-base text-[#514657]">Latihan Napas 4-4-4</h2>
              <p className="text-xs text-[#7C6F83]">
                {breathingActive
                  ? `Ikuti irama: ${breathPhase}...`
                  : "Klik mulai untuk menenangkan detak jantung sejenak."}
              </p>
              <button
                type="button"
                onClick={() => setBreathingActive(!breathingActive)}
                className="rounded-full bg-white border border-[#EEDCE5] px-4 py-1.5 text-xs font-semibold text-[#514657] cursor-pointer"
              >
                {breathingActive ? "Hentikan" : "Mulai Napas"}
              </button>
            </div>
            <div
              className={`w-20 h-20 rounded-full bg-[#DCD4F4] border-2 border-[#C56F91] flex items-center justify-center text-[11px] font-bold text-[#514657] text-center p-2 shrink-0 ${
                breathingActive ? "animate-soft-pulse" : ""
              }`}
            >
              {breathingActive ? breathPhase : "Tenang"}
            </div>
          </section>
        </div>
      </div>

      {/* Gentle Relaxation Prompt */}
      <div className="rounded-3xl bg-white border border-[#DCD4F4] p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#C56F91] shrink-0" />
          <p className="font-serif italic text-base text-[#514657]">
            &ldquo;{RELAX_PROMPTS[promptIdx]}&rdquo;
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPromptIdx((prev) => (prev + 1) % RELAX_PROMPTS.length)}
          className="rounded-full bg-[#F0EDFB] px-3.5 py-1.5 text-xs font-semibold text-[#514657] shrink-0 cursor-pointer"
        >
          Pesan Lain
        </button>
      </div>
    </div>
  );
}
