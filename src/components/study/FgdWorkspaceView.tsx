"use client";

import React, { useState } from "react";
import { Users, Plus, ArrowRightCircle, CheckCircle2, BookOpen } from "lucide-react";
import { useApp } from "@/lib/store";

export function FgdWorkspaceView() {
  const { state, addFgdSession, convertFgdActionToTask } = useApp();
  const [showForm, setShowForm] = useState(false);

  const [topic, setTopic] = useState("");
  const [meetingAt, setMeetingAt] = useState("");
  const [goal, setGoal] = useState("");
  const [members, setMembers] = useState("Caca, Nadia, Raka");
  const [questions, setQuestions] = useState("");
  const [points, setPoints] = useState("");
  const [references, setReferences] = useState("");
  const [summary, setSummary] = useState("");
  const [actionDesc, setActionDesc] = useState("");
  const [actionOwner, setActionOwner] = useState("Caca");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !meetingAt) return;
    addFgdSession({
      topic: topic.trim(),
      meetingAt: new Date(meetingAt).toISOString(),
      goal: goal.trim(),
      members: members
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      triggerQuestions: questions
        .split("\n")
        .map((q) => q.trim())
        .filter(Boolean),
      discussionPoints: points
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean),
      referencesList: references
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      summary: summary.trim(),
      prepStatus: "preparing",
      actions: actionDesc.trim()
        ? [
            {
              id: `act-${Date.now()}`,
              description: actionDesc.trim(),
              assignee: actionOwner.trim() || "Caca",
            },
          ]
        : [],
    });
    setTopic("");
    setGoal("");
    setQuestions("");
    setPoints("");
    setReferences("");
    setSummary("");
    setActionDesc("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">FGD Workspace</h1>
          <p className="text-sm text-[#7C6F83]">
            Agenda diskusi kelompok, pertanyaan pemantik, kesimpulan, dan action item ke Task Manager.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#C56F91] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Sesi FGD Baru
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-3xl bg-white border border-[#EEDCE5] p-5 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topik diskusi FGD..."
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
            />
            <input
              type="datetime-local"
              required
              value={meetingAt}
              onChange={(e) => setMeetingAt(e.target.value)}
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
            />
          </div>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Tujuan pembelajaran FGD..."
            className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            placeholder="Anggota (pisahkan koma)"
            className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <textarea
              rows={3}
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="Pertanyaan pemantik (satu per baris)"
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] p-3 text-xs"
            />
            <textarea
              rows={3}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Poin diskusi (satu per baris)"
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] p-3 text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              placeholder="Referensi (pisahkan koma)"
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
            />
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Ringkasan hasil sementara"
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={actionDesc}
              onChange={(e) => setActionDesc(e.target.value)}
              placeholder="Action item pertama (opsional)"
              className="sm:col-span-2 rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
            />
            <input
              type="text"
              value={actionOwner}
              onChange={(e) => setActionOwner(e.target.value)}
              placeholder="Penanggung jawab"
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
            />
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
              Simpan Sesi FGD
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {state.fgdSessions.map((fgd) => (
          <article
            key={fgd.id}
            className="rounded-3xl bg-white border border-[#EEDCE5] p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-[#EEDCE5]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full bg-[#F0EDFB] px-2.5 py-0.5 text-[11px] font-semibold text-[#514657]">
                    {fgd.prepStatus}
                  </span>
                  <span className="text-xs text-[#7C6F83]">
                    {new Date(fgd.meetingAt).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#514657]">{fgd.topic}</h2>
                {fgd.goal && <p className="text-xs text-[#7C6F83] mt-1">{fgd.goal}</p>}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#7C6F83] bg-[#FFFAF4] border border-[#EEDCE5] rounded-full px-3 py-1">
                <Users className="w-3.5 h-3.5 text-[#C56F91]" />
                {fgd.members.join(", ")}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl bg-[#FFFAF4] border border-[#EEDCE5] p-4 space-y-2">
                <p className="font-bold text-[#514657]">Pertanyaan Pemantik</p>
                <ul className="list-disc pl-4 space-y-1 text-[#7C6F83]">
                  {fgd.triggerQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-[#FFFAF4] border border-[#EEDCE5] p-4 space-y-2">
                <p className="font-bold text-[#514657]">Poin Diskusi & Kesimpulan</p>
                <ul className="list-disc pl-4 space-y-1 text-[#7C6F83]">
                  {fgd.discussionPoints.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
                {fgd.summary && (
                  <p className="pt-2 border-t border-[#EEDCE5] font-medium text-[#514657]">
                    Kesimpulan: {fgd.summary}
                  </p>
                )}
              </div>
            </div>

            {fgd.referencesList.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#7C6F83]">
                <BookOpen className="w-3.5 h-3.5 text-[#C56F91]" />
                <span>Referensi:</span>
                {fgd.referencesList.map((r, i) => (
                  <span key={i} className="rounded-full bg-[#F0EDFB] px-2.5 py-0.5 text-[11px] text-[#514657]">
                    {r}
                  </span>
                ))}
              </div>
            )}

            {/* Action Items -> 1-click convert to Task */}
            <div className="rounded-2xl bg-[#FBE8EF]/45 border border-[#F4C8D9] p-4 space-y-2">
              <p className="text-xs font-bold text-[#514657]">Pembagian Tugas / Action Items</p>
              {fgd.actions.length === 0 ? (
                <p className="text-xs text-[#7C6F83]">Belum ada action item.</p>
              ) : (
                fgd.actions.map((act) => (
                  <div
                    key={act.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white border border-[#EEDCE5] px-3 py-2 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#514657]">{act.description}</span>
                      <span className="text-[#7C6F83]"> · PJ: {act.assignee}</span>
                    </div>
                    {act.taskId ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3E6B56]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Sudah di Task Manager
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => convertFgdActionToTask(fgd.id, act.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#C56F91] text-white px-3 py-1 text-[11px] font-semibold hover:bg-[#A95476] cursor-pointer"
                      >
                        <ArrowRightCircle className="w-3.5 h-3.5" />
                        Jadikan Tugas
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
