"use client";

import React, { useState } from "react";
import { Stethoscope, Plus, CheckSquare, Square, Info } from "lucide-react";
import { useApp } from "@/lib/store";
import { SkillStatus } from "@/types/app";

const STATUS_BADGE: Record<SkillStatus, { label: string; cls: string }> = {
  not_started: { label: "Not started", cls: "bg-[#FFFAF4] text-[#7C6F83] border-[#EEDCE5]" },
  practicing: { label: "Practicing", cls: "bg-[#F0EDFB] text-[#514657] border-[#DCD4F4]" },
  needs_review: { label: "Needs review", cls: "bg-[#FBE8EF] text-[#A95476] border-[#F4C8D9]" },
  confident: { label: "Confident", cls: "bg-[#E4F1EA] text-[#3E6B56] border-[#3E6B56]/30" },
};

export function SkillLabView() {
  const { state, addSkillLab, updateSkillLab } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Konservasi Gigi");
  const [scheduledAt, setScheduledAt] = useState("");
  const [checklistText, setChecklistText] = useState("Siapkan alat\nBaca panduan preklinik");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addSkillLab({
      title: title.trim(),
      category: category.trim(),
      status: "not_started",
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      prepChecklist: checklistText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((label, idx) => ({ id: `chk-${Date.now()}-${idx}`, label, done: false })),
      reflection: "",
    });
    setTitle("");
    setScheduledAt("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">Skill Lab Tracker</h1>
          <p className="text-sm text-[#7C6F83]">
            Daftar keterampilan praktik, checklist persiapan, tanggal latihan, dan refleksi diri.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#C56F91] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Skill Lab
        </button>
      </div>

      <div className="rounded-2xl bg-[#F0EDFB]/70 border border-[#DCD4F4] px-4 py-3 flex items-start gap-2.5 text-xs text-[#514657]">
        <Info className="w-4 h-4 text-[#C56F91] shrink-0 mt-0.5" />
        <p>
          Catatan refleksi membantu mengingat bagian yang perlu dilatih lagi; aplikasi ini hanya
          pendamping belajar dan tidak menggantikan penilaian dosen atau instruktur.
        </p>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-3xl bg-white border border-[#EEDCE5] p-5 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nama keterampilan / skill lab..."
              className="sm:col-span-2 rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Departemen / Kategori"
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#7C6F83] mb-1">
                Jadwal Skill Lab (otomatis masuk kalender)
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C6F83] mb-1">
                Checklist Persiapan (satu per baris)
              </label>
              <textarea
                rows={2}
                value={checklistText}
                onChange={(e) => setChecklistText(e.target.value)}
                className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] p-2 text-xs"
              />
            </div>
          </div>
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
              Simpan Skill
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {state.skillLabs.map((skill) => {
          const meta = STATUS_BADGE[skill.status];
          return (
            <div
              key={skill.id}
              className="rounded-3xl bg-white border border-[#EEDCE5] p-5 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-[#C56F91]">{skill.category}</span>
                  <h2 className="font-semibold text-base text-[#514657] flex items-center gap-2 mt-0.5">
                    <Stethoscope className="w-4 h-4 text-[#C56F91]" />
                    {skill.title}
                  </h2>
                </div>
                <select
                  aria-label={`Status ${skill.title}`}
                  value={skill.status}
                  onChange={(e) =>
                    updateSkillLab(skill.id, { status: e.target.value as SkillStatus })
                  }
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${meta.cls}`}
                >
                  {(Object.keys(STATUS_BADGE) as SkillStatus[]).map((st) => (
                    <option key={st} value={st}>
                      {STATUS_BADGE[st].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checklist */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-[#7C6F83]">Checklist Persiapan</p>
                {skill.prepChecklist.map((chk) => (
                  <button
                    key={chk.id}
                    type="button"
                    onClick={() => {
                      const updated = skill.prepChecklist.map((c) =>
                        c.id === chk.id ? { ...c, done: !c.done } : c
                      );
                      updateSkillLab(skill.id, { prepChecklist: updated });
                    }}
                    className="w-full flex items-center gap-2 text-left text-xs text-[#514657] py-1 cursor-pointer"
                  >
                    {chk.done ? (
                      <CheckSquare className="w-4 h-4 text-[#3E6B56] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-[#C56F91] shrink-0" />
                    )}
                    <span className={chk.done ? "line-through text-[#7C6F83]" : ""}>
                      {chk.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Reflection */}
              <div>
                <label className="block text-xs font-bold text-[#7C6F83] mb-1">
                  Catatan Refleksi Latihan
                </label>
                <textarea
                  rows={2}
                  value={skill.reflection}
                  onChange={(e) => updateSkillLab(skill.id, { reflection: e.target.value })}
                  placeholder="Bagian mana yang sudah lancar atau perlu diulang?"
                  className="w-full rounded-2xl border border-[#EEDCE5] bg-[#FFFAF4] p-3 text-xs text-[#514657]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
