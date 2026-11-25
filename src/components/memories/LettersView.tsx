"use client";

import React, { useState } from "react";
import { Mail, Plus, Heart, Lock } from "lucide-react";
import { useApp } from "@/lib/store";

export function LettersView() {
  const { state, addPersonalLetter } = useApp();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [openOn, setOpenOn] = useState("");
  const [showForm, setShowForm] = useState(false);

  const giftLetters = state.giftMessages.filter((g) => g.kind === "letter_from_giver" && g.isActive);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    addPersonalLetter({
      title: title.trim(),
      body: body.trim(),
      openOn: openOn || undefined,
    });
    setTitle("");
    setBody("");
    setOpenOn("");
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">Letters</h1>
          <p className="text-sm text-[#7C6F83]">
            Surat hadiah untuk Caca dan surat hangat untuk dirimu di masa depan.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#C56F91] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Tulis Surat Masa Depan
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="rounded-3xl bg-white border border-[#EEDCE5] p-5 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul surat..."
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={openOn}
              onChange={(e) => setOpenOn(e.target.value)}
              aria-label="Tanggal buka surat (opsional)"
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
            />
          </div>
          <textarea
            rows={4}
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tulis pesan untuk Caca di masa depan..."
            className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] p-3 text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs text-[#7C6F83] px-3 py-1"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#C56F91] text-white px-5 py-1.5 text-xs font-semibold cursor-pointer"
            >
              Simpan Surat
            </button>
          </div>
        </form>
      )}

      {/* Letters from Giver */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#C56F91] flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5" /> Surat dari Pembuat Hadiah
        </h2>
        {giftLetters.map((letter) => (
          <article
            key={letter.id}
            className="rounded-3xl bg-gradient-to-br from-white to-[#FBE8EF]/45 border border-[#F4C8D9] p-6 sm:p-8 shadow-xs space-y-3"
          >
            <h3 className="font-serif text-2xl font-semibold text-[#514657]">{letter.title}</h3>
            <p className="text-sm text-[#514657] whitespace-pre-line leading-relaxed">
              {letter.body}
            </p>
          </article>
        ))}
      </section>

      {/* Letters to Future Self */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C6F83] flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" /> Surat untuk Diri di Masa Depan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.personalLetters.map((pl) => {
            const isLocked = pl.openOn ? new Date(pl.openOn) > new Date() : false;
            return (
              <article
                key={pl.id}
                className="rounded-3xl bg-white border border-[#DCD4F4] p-5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-xl font-semibold text-[#514657]">{pl.title}</h3>
                  {isLocked && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F0EDFB] px-2.5 py-0.5 text-[10px] font-semibold text-[#514657]">
                      <Lock className="w-3 h-3" /> Buka {pl.openOn}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#7C6F83] leading-relaxed whitespace-pre-line">
                  {isLocked
                    ? "Kapsul waktu ini masih tertutup hingga tanggal yang kamu pilih."
                    : pl.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
