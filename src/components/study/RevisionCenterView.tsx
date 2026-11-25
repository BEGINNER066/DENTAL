"use client";

import React from "react";
import { RotateCcw, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/store";

export function RevisionCenterView() {
  const { state, updateChapterConfidence, toggleChapterReview, toggleChapterStudied } = useApp();

  const reviewChapters = state.chapters.filter((c) => c.needsReview);
  const exams = state.calendarEvents
    .filter((e) => e.type === "ujian" && new Date(e.startsAt).getTime() >= Date.now())
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  const daysUntil = (iso: string) => {
    const diff = new Date(iso).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-[#514657]">
          Revision Center & Exam Countdown
        </h1>
        <p className="text-sm text-[#7C6F83]">
          Pengingat lembut untuk mengulang materi yang masih perlu diperkuat—bukan sumber kecemasan.
        </p>
      </div>

      {/* Gentle Exam Countdown */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#EEDCE5] p-5 text-sm text-[#7C6F83]">
            Belum ada jadwal ujian mendatang di Academic Calendar.
          </div>
        ) : (
          exams.map((ex) => {
            const days = daysUntil(ex.startsAt);
            return (
              <div
                key={ex.id}
                className="rounded-3xl bg-gradient-to-br from-[#FBE8EF]/70 to-[#F0EDFB] border border-[#EEDCE5] p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C56F91]">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(ex.startsAt).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                  <h2 className="font-semibold text-base text-[#514657] mt-1">{ex.title}</h2>
                  <p className="text-xs text-[#7C6F83] mt-1">
                    {ex.notes || "Cicil pelan-pelan satu subbab setiap sesi ya."}
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-center shrink-0 border border-[#EEDCE5]">
                  <p className="font-serif text-2xl font-bold text-[#C56F91]">{days}</p>
                  <p className="text-[10px] font-semibold text-[#7C6F83]">Hari lagi</p>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Recommended Gentle Review Plan */}
      <section className="rounded-3xl bg-[#E4F1EA]/55 border border-[#3E6B56]/20 p-5 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#3E6B56] shrink-0 mt-0.5" />
        <div className="text-xs text-[#514657] space-y-1">
          <p className="font-bold text-[#3E6B56]">Saran Sesi Review Hari Ini</p>
          <p>
            {reviewChapters.length > 0
              ? `Mulai dari "${reviewChapters[0].title}" selama 20–25 menit dengan teknik active recall, lalu beri diri sendiri jeda minum teh atau mendengarkan musik.`
              : "Semua subbab sudah terlihat mantap! Kamu bisa tetap santai atau mencoba 1 kuis ringan."}
          </p>
        </div>
      </section>

      {/* Subchapters Needing Review */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C6F83]">
          Daftar Materi untuk Diulang ({reviewChapters.length})
        </h2>

        {reviewChapters.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#EEDCE5] p-8 text-center text-sm text-[#7C6F83]">
            <RotateCcw className="w-7 h-7 text-[#F4C8D9] mx-auto mb-2" />
            Belum ada materi yang ditandai perlu diulang.
          </div>
        ) : (
          reviewChapters.map((chap) => {
            const subj = state.subjects.find((s) => s.id === chap.subjectId);
            return (
              <div
                key={chap.id}
                className="rounded-3xl bg-white border border-[#EEDCE5] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[11px] font-semibold text-[#C56F91]">
                    {subj?.name || "Mata Kuliah"}
                  </span>
                  <p className="font-semibold text-sm text-[#514657]">{chap.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-[#7C6F83]">Tingkat keyakinan:</span>
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => updateChapterConfidence(chap.id, lvl)}
                        className={`w-6 h-6 rounded-full text-[11px] font-bold cursor-pointer ${
                          chap.confidenceLevel >= lvl
                            ? "bg-[#C56F91] text-white"
                            : "bg-[#FBE8EF] text-[#7C6F83]"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!chap.isStudied) toggleChapterStudied(chap.id);
                      toggleChapterReview(chap.id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F1EA] text-[#3E6B56] px-4 py-2 text-xs font-semibold cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sudah Paham
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
