"use client";

import React, { useState } from "react";
import { BookHeart, Lock, Download, Trash2, Plus, Search } from "lucide-react";
import { useApp } from "@/lib/store";

export function DiaryView() {
  const { state, addDiaryEntry, deleteDiaryEntry } = useApp();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState("");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    addDiaryEntry({
      title: title.trim() || undefined,
      body: body.trim(),
      mood: mood.trim() || undefined,
      entryDate,
    });
    setTitle("");
    setBody("");
    setMood("");
  };

  const handleExportDiary = () => {
    const blob = new Blob([JSON.stringify(state.diaryEntries, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `caca-diary-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const visibleEntries = state.diaryEntries.filter(
    (d) =>
      !search.trim() ||
      (d.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
      d.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F0EDFB] px-3 py-1 text-[11px] font-semibold text-[#514657] mb-2">
            <Lock className="w-3 h-3 text-[#C56F91]" />
            <span>Privat · Hanya dapat dibaca akun Caca</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">My Diary</h1>
          <p className="text-sm text-[#7C6F83]">
            Ruang jujur untuk bercerita tentang hari ini tanpa takut dinilai.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportDiary}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#DCD4F4] bg-white px-4 py-2 text-xs font-semibold text-[#514657] hover:bg-[#F0EDFB] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Ekspor Diary (JSON)
        </button>
      </div>

      {/* Write Entry */}
      <form
        onSubmit={handleSave}
        className="rounded-3xl bg-white/95 border border-[#DCD4F4] p-5 sm:p-6 space-y-4 shadow-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul entri (opsional)"
            className="sm:col-span-2 rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3.5 py-2 text-sm"
          />
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3.5 py-2 text-sm"
          />
        </div>

        <textarea
          rows={5}
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Apa yang sedang kamu rasakan atau syukuri hari ini, Caca?"
          className="w-full rounded-2xl border border-[#EEDCE5] bg-[#FFFAF4] p-4 text-sm leading-relaxed"
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Suasana hati (opsional, mis. Lega)"
            className="sm:w-64 rounded-full border border-[#EEDCE5] bg-[#FFFAF4] px-4 py-2 text-xs"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C56F91] text-white px-6 py-2.5 text-xs font-semibold hover:bg-[#A95476] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Simpan Entri Privat
          </button>
        </div>
      </form>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#7C6F83] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari catatan diary..."
          className="w-full rounded-full bg-white border border-[#DCD4F4] pl-10 pr-4 py-2 text-sm"
        />
      </div>

      {/* Diary List */}
      <div className="space-y-4">
        {visibleEntries.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#DCD4F4] p-8 text-center text-sm text-[#7C6F83]">
            <BookHeart className="w-8 h-8 text-[#DCD4F4] mx-auto mb-2" />
            Belum ada entri diary.
          </div>
        ) : (
          visibleEntries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-3xl bg-white/95 border border-[#DCD4F4] p-5 sm:p-6 space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#7C6F83]">
                    <span>
                      {new Date(entry.entryDate).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    {entry.mood && (
                      <span className="rounded-full bg-[#FBE8EF] px-2.5 py-0.5 text-[11px] font-medium text-[#A95476]">
                        {entry.mood}
                      </span>
                    )}
                  </div>
                  {entry.title && (
                    <h2 className="font-serif text-xl font-semibold text-[#514657] mt-1">
                      {entry.title}
                    </h2>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Hapus entri diary"
                  onClick={() => deleteDiaryEntry(entry.id)}
                  className="p-1.5 rounded-full text-[#7C6F83] hover:bg-[#FBE8EF] cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-[#514657] whitespace-pre-line leading-relaxed pt-1">
                {entry.body}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
