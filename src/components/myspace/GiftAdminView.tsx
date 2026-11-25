"use client";

import React, { useState } from "react";
import { Gift, Plus, Trash2, Shield } from "lucide-react";
import { useApp } from "@/lib/store";

export function GiftAdminView() {
  const { state, addGiftMessage, deleteGiftMessage } = useApp();
  const [kind, setKind] = useState<"surprise" | "letter_from_giver">("surprise");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [unlockAt, setUnlockAt] = useState("");
  const [unlockCondition, setUnlockCondition] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    addGiftMessage({
      kind,
      title: title.trim(),
      body: body.trim(),
      unlockAt: unlockAt || undefined,
      unlockCondition: unlockCondition.trim() || undefined,
      isActive: true,
    });
    setTitle("");
    setBody("");
    setUnlockAt("");
    setUnlockCondition("");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F0EDFB] px-3 py-1 text-[11px] font-semibold text-[#514657] mb-2">
          <Shield className="w-3.5 h-3.5 text-[#C56F91]" />
          <span>Area Admin Terbatas · Terisolasi dari Diary & Mood Caca</span>
        </div>
        <h1 className="font-serif text-3xl font-semibold text-[#514657]">
          Pengelola Konten Hadiah
        </h1>
        <p className="text-sm text-[#7C6F83]">
          Siapkan surat pembuka atau pesan Surprise Box tanpa mengakses data pribadi Caca.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="rounded-3xl bg-white border border-[#EEDCE5] p-6 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as typeof kind)}
            className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          >
            <option value="surprise">Pesan Surprise Box</option>
            <option value="letter_from_giver">Surat dari Pembuat Hadiah</option>
          </select>
          <input
            type="date"
            value={unlockAt}
            onChange={(e) => setUnlockAt(e.target.value)}
            aria-label="Tanggal buka (opsional)"
            className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          />
        </div>

        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul hadiah atau surat..."
          className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
        />

        <input
          type="text"
          value={unlockCondition}
          onChange={(e) => setUnlockCondition(e.target.value)}
          placeholder="Keterangan momen buka (opsional, mis. Saat butuh istirahat)"
          className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
        />

        <textarea
          rows={4}
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Isi pesan hangat untuk Caca..."
          className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] p-3 text-sm"
        />

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#C56F91] text-white px-5 py-2 text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Simpan Konten Hadiah
        </button>
      </form>

      <div className="space-y-3">
        {state.giftMessages.map((g) => (
          <div
            key={g.id}
            className="rounded-2xl bg-white border border-[#EEDCE5] p-4 flex items-start justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#C56F91]" />
                <span className="text-[11px] font-bold uppercase text-[#C56F91]">{g.kind}</span>
              </div>
              <p className="font-semibold text-sm text-[#514657]">{g.title}</p>
              <p className="text-xs text-[#7C6F83] whitespace-pre-line">{g.body}</p>
            </div>
            <button
              type="button"
              aria-label="Hapus pesan hadiah"
              onClick={() => deleteGiftMessage(g.id)}
              className="p-1.5 rounded-full text-[#7C6F83] hover:bg-[#FBE8EF] cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
