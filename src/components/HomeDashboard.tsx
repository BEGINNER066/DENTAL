"use client";

import React, { useState } from "react";
import {
  BookOpen,
  CheckSquare,
  Music,
  BookHeart,
  Calendar,
  Sparkles,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { NavSection } from "@/types/app";
import { useApp } from "@/lib/store";
import { ACHIEVEMENT_CATALOG, DAILY_MESSAGES } from "@/lib/seedData";
import { SwanLogo, ToothMascot } from "./BrandAssets";

const QUICK_MOODS = [
  { emoji: "🌷", label: "Tenang" },
  { emoji: "✨", label: "Semangat" },
  { emoji: "🫧", label: "Lelah" },
  { emoji: "🤍", label: "Butuh Jeda" },
  { emoji: "🌸", label: "Bersyukur" },
];

export function HomeDashboard({ onNavigate }: { onNavigate: (s: NavSection) => void }) {
  const { state, addMoodEntry, updateTask } = useApp();
  const [moodNote, setMoodNote] = useState("");
  const [moodSavedToast, setMoodSavedToast] = useState(false);

  const now = new Date();
  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const dayIndex = now.getDate() % DAILY_MESSAGES.length;
  const dailyMessage = DAILY_MESSAGES[dayIndex];

  const pendingTasks = state.tasks.filter((t) => t.status !== "done");
  const doneTasks = state.tasks.filter((t) => t.status === "done");

  const upcomingEvents = [...state.calendarEvents]
    .filter((ev) => new Date(ev.startsAt).getTime() >= now.getTime() - 3600 * 1000 * 6)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, 3);

  const subchapters = state.chapters.filter((c) => c.parentId !== null);
  const studiedCount = subchapters.filter((c) => c.isStudied).length;
  const studyPercent =
    subchapters.length > 0 ? Math.round((studiedCount / subchapters.length) * 100) : 0;

  const weeklyGoalPercent = Math.min(
    100,
    Math.round(
      (state.profile.studyMinutesThisWeek / Math.max(1, state.profile.weeklyStudyGoalMins)) * 100
    )
  );

  const handleQuickMood = (emoji: string, mood: string) => {
    addMoodEntry({ emoji, mood, note: moodNote.trim() || undefined });
    setMoodNote("");
    setMoodSavedToast(true);
    setTimeout(() => setMoodSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <section className="rounded-3xl bg-gradient-to-r from-[#FBE8EF] via-white to-[#F0EDFB] border border-[#EEDCE5] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C56F91]">
              {dateLabel}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#514657]">
              Hello, {state.profile.displayName}!
            </h1>
            <p className="text-sm text-[#7C6F83] max-w-xl leading-relaxed">{dailyMessage}</p>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <SwanLogo size={64} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: "study-library" as NavSection, label: "Study Library", icon: BookOpen, bg: "bg-white hover:bg-[#FBE8EF]/60" },
            { id: "tasks" as NavSection, label: "Task Manager", icon: CheckSquare, bg: "bg-white hover:bg-[#FBE8EF]/60" },
            { id: "music" as NavSection, label: "Music Room", icon: Music, bg: "bg-[#F0EDFB]/80 hover:bg-[#DCD4F4]/70" },
            { id: "diary" as NavSection, label: "My Diary", icon: BookHeart, bg: "bg-[#F0EDFB]/80 hover:bg-[#DCD4F4]/70" },
          ].map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => onNavigate(act.id)}
                className={`flex items-center justify-between rounded-2xl border border-[#EEDCE5] px-4 py-3 text-sm font-semibold text-[#514657] transition cursor-pointer ${act.bg}`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#C56F91]" />
                  {act.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7C6F83]" />
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Summary */}
        <section className="rounded-3xl bg-white border border-[#EEDCE5] p-5 sm:p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base text-[#514657] flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#C56F91]" />
              Ringkasan Tugas
            </h2>
            <button
              type="button"
              onClick={() => onNavigate("tasks")}
              className="text-xs font-semibold text-[#C56F91] hover:underline cursor-pointer"
            >
              Lihat semua
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-2xl bg-[#FBE8EF]/70 p-3.5">
              <p className="text-2xl font-bold text-[#A95476]">{pendingTasks.length}</p>
              <p className="text-xs text-[#7C6F83]">Belum selesai</p>
            </div>
            <div className="rounded-2xl bg-[#E4F1EA] p-3.5">
              <p className="text-2xl font-bold text-[#3E6B56]">{doneTasks.length}</p>
              <p className="text-xs text-[#3E6B56]">Sudah selesai</p>
            </div>
          </div>

          <div className="space-y-2.5 flex-1">
            {pendingTasks.length === 0 ? (
              <p className="text-xs text-[#7C6F83] py-4 text-center">
                Semua tugas sedang beres. Ambil jeda sejenak yuk!
              </p>
            ) : (
              pendingTasks.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="flex items-start gap-2.5 rounded-2xl bg-[#FFFAF4] border border-[#EEDCE5] p-3"
                >
                  <button
                    type="button"
                    aria-label={`Tandai ${t.title} selesai`}
                    onClick={() => updateTask(t.id, { status: "done" })}
                    className="mt-0.5 text-[#C56F91] hover:text-[#3E6B56] cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#514657] truncate">{t.title}</p>
                    {t.dueAt && (
                      <p className="text-[11px] text-[#7C6F83] mt-0.5">
                        Tenggat:{" "}
                        {new Date(t.dueAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Nearest Calendar Agenda */}
        <section className="rounded-3xl bg-white border border-[#EEDCE5] p-5 sm:p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base text-[#514657] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C56F91]" />
              Agenda Terdekat
            </h2>
            <button
              type="button"
              onClick={() => onNavigate("calendar")}
              className="text-xs font-semibold text-[#C56F91] hover:underline cursor-pointer"
            >
              Kalender
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-[#7C6F83] py-6 text-center">
                Belum ada agenda terdekat tercatat.
              </p>
            ) : (
              upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-2xl bg-[#F0EDFB]/65 border border-[#DCD4F4] p-3.5"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="inline-block rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#514657]">
                      {ev.type.replace("_", " ")}
                    </span>
                    <span className="text-[11px] text-[#7C6F83] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ev.startsAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#514657]">{ev.title}</p>
                  {ev.location && <p className="text-xs text-[#7C6F83] mt-0.5">{ev.location}</p>}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Weekly Study Progress & Gentle Mood Check-in */}
        <section className="space-y-6">
          <div className="rounded-3xl bg-white border border-[#EEDCE5] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-base text-[#514657] flex items-center gap-2">
                <ToothMascot size={24} />
                Progress Belajar
              </h2>
              <span className="text-xs font-semibold text-[#3E6B56] bg-[#E4F1EA] px-2.5 py-0.5 rounded-full">
                {studyPercent}% subbab
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-[#7C6F83] mb-1">
                  <span>Target mingguan pilihanmu</span>
                  <span>
                    {state.profile.studyMinutesThisWeek} / {state.profile.weeklyStudyGoalMins} mnt
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-[#FBE8EF] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#C56F91] transition-all"
                    style={{ width: `${weeklyGoalPercent}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#7C6F83]">
                Progress ini hanya sebagai cermin kemajuanmu—hari istirahat tidak pernah mengurangi skor.
              </p>
            </div>
          </div>

          {/* Optional Quick Mood Check-in (Privacy-first: stores privately, does not display history here) */}
          <div className="rounded-3xl bg-gradient-to-br from-[#F0EDFB] to-[#FBE8EF]/65 border border-[#DCD4F4] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-sm text-[#514657] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C56F91]" />
                Mood Check-in (Opsional & Privat)
              </h2>
              <button
                type="button"
                onClick={() => onNavigate("mood")}
                className="text-[11px] font-semibold text-[#C56F91] hover:underline cursor-pointer"
              >
                Mood Corner
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK_MOODS.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => handleQuickMood(m.emoji, m.label)}
                  className="inline-flex items-center gap-1 rounded-full bg-white/90 hover:bg-white border border-[#EEDCE5] px-3 py-1.5 text-xs font-medium text-[#514657] transition cursor-pointer"
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            <input
              type="text"
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="Catatan singkat (opsional)..."
              className="mt-3 w-full rounded-xl bg-white/85 border border-[#EEDCE5] px-3 py-1.5 text-xs text-[#514657] placeholder:text-[#7C6F83] focus:outline-none focus:border-[#C56F91]"
            />

            {moodSavedToast && (
              <p className="mt-2 text-[11px] font-medium text-[#3E6B56]">
                Tersimpan secara privat di Mood Corner. Terima kasih sudah menyapa dirimu hari ini!
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Healthy Gamification Strip (Toggleable in Settings) */}
      {state.profile.gamificationEnabled && (
        <section className="rounded-3xl bg-white border border-[#EEDCE5] p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C56F91]" />
              <h2 className="font-semibold text-base text-[#514657]">
                Apresiasi Langkah Kecil
              </h2>
            </div>
            <span className="text-xs font-medium text-[#7C6F83]">
              {state.xp} Poin Apresiasi · Dapat dimatikan kapan saja di Settings
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {ACHIEVEMENT_CATALOG.map((badge) => {
              const earned = Boolean(state.earnedBadges[badge.key]);
              return (
                <div
                  key={badge.key}
                  className={`rounded-2xl border p-3.5 transition ${
                    earned
                      ? "bg-[#E4F1EA]/65 border-[#3E6B56]/25"
                      : "bg-[#FFFAF4] border-[#EEDCE5] opacity-75"
                  }`}
                >
                  <p className="text-xs font-bold text-[#514657] flex items-center justify-between">
                    <span>{badge.title}</span>
                    {earned && <span className="text-[#3E6B56]">✓</span>}
                  </p>
                  <p className="text-[11px] text-[#7C6F83] mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
