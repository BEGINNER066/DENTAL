"use client";

import React, { useMemo, useState } from "react";
import { Calendar as CalendarIcon, Plus, Trash2, MapPin, Clock } from "lucide-react";
import { useApp } from "@/lib/store";
import { CalendarEventType } from "@/types/app";

const TYPE_META: Record<CalendarEventType, { label: string; color: string }> = {
  kuliah: { label: "Kuliah", color: "bg-[#F0EDFB] text-[#514657]" },
  praktikum: { label: "Praktikum", color: "bg-[#E4F1EA] text-[#3E6B56]" },
  skill_lab: { label: "Skill Lab", color: "bg-[#FBE8EF] text-[#A95476]" },
  fgd: { label: "FGD", color: "bg-[#DCD4F4] text-[#514657]" },
  ujian: { label: "Ujian", color: "bg-[#F4C8D9] text-[#514657]" },
  deadline: { label: "Deadline Tugas", color: "bg-[#FBE8EF] text-[#C56F91]" },
};

export function CalendarView() {
  const { state, addCalendarEvent, deleteCalendarEvent } = useApp();
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month");
  const [filterType, setFilterType] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<CalendarEventType>("kuliah");
  const [startsAt, setStartsAt] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const filteredEvents = useMemo(() => {
    return [...state.calendarEvents]
      .filter((e) => filterType === "all" || e.type === filterType)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [state.calendarEvents, filterType]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOffset = new Date(year, month, 1).getDay();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startsAt) return;
    addCalendarEvent({
      title: title.trim(),
      type,
      startsAt: new Date(startsAt).toISOString(),
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setTitle("");
    setStartsAt("");
    setLocation("");
    setNotes("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">Academic Calendar</h1>
          <p className="text-sm text-[#7C6F83]">
            Kuliah, praktikum, skill lab, FGD, ujian, dan deadline tugas terpusat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full bg-white border border-[#EEDCE5] p-1">
            {(["month", "week", "list"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setViewMode(m)}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize cursor-pointer ${
                  viewMode === m ? "bg-[#FBE8EF] text-[#A95476]" : "text-[#7C6F83]"
                }`}
              >
                {m === "month" ? "Bulan" : m === "week" ? "Minggu" : "Daftar"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#C56F91] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Agenda Baru
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`rounded-full px-3 py-1 text-xs font-semibold border cursor-pointer ${
            filterType === "all"
              ? "bg-[#FBE8EF] border-[#C56F91] text-[#A95476]"
              : "bg-white border-[#EEDCE5] text-[#7C6F83]"
          }`}
        >
          Semua
        </button>
        {(Object.keys(TYPE_META) as CalendarEventType[]).map((tp) => (
          <button
            key={tp}
            type="button"
            onClick={() => setFilterType(tp)}
            className={`rounded-full px-3 py-1 text-xs font-semibold border cursor-pointer ${
              filterType === tp
                ? "bg-[#FBE8EF] border-[#C56F91] text-[#A95476]"
                : "bg-white border-[#EEDCE5] text-[#7C6F83]"
            }`}
          >
            {TYPE_META[tp].label}
          </button>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-3xl bg-white border border-[#EEDCE5] p-5 grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul agenda..."
            className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CalendarEventType)}
            className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          >
            {(Object.keys(TYPE_META) as CalendarEventType[]).map((tp) => (
              <option key={tp} value={tp}>
                {TYPE_META[tp].label}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            required
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Lokasi / Ruang (opsional)"
            className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan singkat (opsional)"
            className="sm:col-span-2 rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          />
          <div className="sm:col-span-2 flex justify-end gap-2">
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
              Simpan Agenda
            </button>
          </div>
        </form>
      )}

      {viewMode === "month" && (
        <div className="rounded-3xl bg-white border border-[#EEDCE5] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold text-[#514657] flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#C56F91]" />
              {now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
            </h2>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-[#7C6F83] mb-2">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-20 rounded-xl bg-[#FFFAF4]/50" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dayEvents = filteredEvents.filter((ev) => {
                const d = new Date(ev.startsAt);
                return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
              });
              const isToday = day === now.getDate();
              return (
                <div
                  key={day}
                  className={`min-h-20 sm:min-h-24 rounded-xl border p-1.5 text-left ${
                    isToday ? "border-[#C56F91] bg-[#FBE8EF]/40" : "border-[#EEDCE5] bg-[#FFFAF4]"
                  }`}
                >
                  <span
                    className={`inline-block text-[11px] font-bold px-1.5 rounded-full ${
                      isToday ? "bg-[#C56F91] text-white" : "text-[#514657]"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium truncate ${
                          TYPE_META[ev.type].color
                        }`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-[10px] text-[#7C6F83]">+{dayEvents.length - 2} lagi</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "week" && (
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-2.5">
          {Array.from({ length: 7 }).map((_, offset) => {
            const d = new Date(now);
            d.setDate(now.getDate() + offset);
            const dayEvents = filteredEvents.filter((ev) => {
              const ed = new Date(ev.startsAt);
              return (
                ed.getFullYear() === d.getFullYear() &&
                ed.getMonth() === d.getMonth() &&
                ed.getDate() === d.getDate()
              );
            });
            return (
              <div
                key={offset}
                className="rounded-2xl bg-white border border-[#EEDCE5] p-3 space-y-2 min-h-36"
              >
                <p className="text-xs font-bold text-[#514657]">
                  {d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" })}
                </p>
                {dayEvents.length === 0 ? (
                  <p className="text-[11px] text-[#7C6F83]">Kosong</p>
                ) : (
                  dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`rounded-xl p-2 text-[11px] font-medium ${TYPE_META[ev.type].color}`}
                    >
                      <p className="font-semibold">{ev.title}</p>
                      <p className="text-[10px] opacity-80">
                        {new Date(ev.startsAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "list" && (
        <div className="space-y-2.5">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="rounded-2xl bg-white border border-[#EEDCE5] p-4 flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    TYPE_META[ev.type].color
                  }`}
                >
                  {TYPE_META[ev.type].label}
                </span>
                <p className="font-semibold text-sm text-[#514657]">{ev.title}</p>
                <div className="flex flex-wrap gap-3 text-xs text-[#7C6F83]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(ev.startsAt).toLocaleString("id-ID", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {ev.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {ev.location}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                aria-label="Hapus agenda"
                onClick={() => deleteCalendarEvent(ev.id)}
                className="p-2 rounded-full text-[#7C6F83] hover:bg-[#FBE8EF] cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
