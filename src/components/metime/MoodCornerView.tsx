"use client";

import React, { useState } from "react";
import { Lock, Trash2, Download } from "lucide-react";
import { useApp } from "@/lib/store";

const MOOD_OPTIONS = [
  { emoji: "🌷", label: "Tenang" },
  { emoji: "✨", label: "Bersemangat" },
  { emoji: "🌸", label: "Bersyukur" },
  { emoji: "🫧", label: "Lelah" },
  { emoji: "🌧️", label: "Sendu" },
  { emoji: "🤍", label: "Butuh Pelukan" },
];

export function MoodCornerView() {
  const { state, addMoodEntry, deleteMoodEntry } = useApp();
  const [selected, setSelected] = useState(MOOD_OPTIONS[0]);
  const [note, setNote] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    addMoodEntry({
      emoji: selected.emoji,
      mood: selected.label,
      note: note.trim() || undefined,
    });
    setNote("");
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state.moodEntries, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `caca-mood-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F0EDFB] px-3 py-1 text-[11px] font-semibold text-[#514657] mb-2">
            <Lock className="w-3 h-3 text-[#C56F91]" />
            <span>Check-in Privat</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">Mood Corner</h1>
          <p className="text-sm text-[#7C6F83]">
            Catat suasana hatimu dengan cepat tanpa perlu menjelaskan panjang lebar.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#DCD4F4] bg-white px-4 py-2 text-xs font-semibold text-[#514657] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Ekspor Mood
        </button>
      </div>

      {/* Check-in Box */}
      <form
        onSubmit={handleCheckIn}
        className="rounded-3xl bg-white/95 border border-[#DCD4F4] p-6 space-y-4"
      >
        <p className="text-sm font-semibold text-[#514657]">Bagaimana perasaanmu saat ini?</p>
        <div className="flex flex-wrap gap-2.5">
          {MOOD_OPTIONS.map((m) => {
            const active = selected.label === m.label;
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => setSelected(m)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  active
                    ? "bg-[#FBE8EF] border-[#C56F91] text-[#A95476]"
                    : "bg-[#FFFAF4] border-[#EEDCE5] text-[#514657]"
                }`}
              >
                <span className="text-base">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Catatan singkat jika ingin (opsional)..."
            className="flex-1 rounded-full border border-[#EEDCE5] bg-[#FFFAF4] px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-[#C56F91] text-white px-6 py-2 text-xs font-semibold hover:bg-[#A95476] cursor-pointer"
          >
            Simpan Mood
          </button>
        </div>
      </form>

      {/* History Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C6F83]">
          Riwayat Mood ({state.moodEntries.length})
        </h2>
        <div className="inline-flex rounded-full bg-white border border-[#DCD4F4] p-1">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer ${
              viewMode === "list" ? "bg-[#F0EDFB] text-[#514657]" : "text-[#7C6F83]"
            }`}
          >
            Daftar
          </button>
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer ${
              viewMode === "calendar" ? "bg-[#F0EDFB] text-[#514657]" : "text-[#7C6F83]"
            }`}
          >
            Kartu Ringkas
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="space-y-2.5">
          {state.moodEntries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl bg-white border border-[#DCD4F4] p-4 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{entry.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-[#514657]">{entry.mood}</p>
                  {entry.note && <p className="text-xs text-[#7C6F83]">{entry.note}</p>}
                  <p className="text-[11px] text-[#7C6F83] mt-0.5">
                    {new Date(entry.createdAt).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Hapus riwayat mood"
                onClick={() => deleteMoodEntry(entry.id)}
                className="p-1.5 rounded-full text-[#7C6F83] hover:bg-[#FBE8EF] cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {state.moodEntries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl bg-white border border-[#DCD4F4] p-4 text-center space-y-1"
            >
              <p className="text-3xl">{entry.emoji}</p>
              <p className="text-xs font-semibold text-[#514657]">{entry.mood}</p>
              <p className="text-[10px] text-[#7C6F83]">
                {new Date(entry.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
