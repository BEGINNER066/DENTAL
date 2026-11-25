"use client";

import React, { useState } from "react";
import { Plus, Trash2, LayoutGrid, List, CheckCircle2, Calendar } from "lucide-react";
import { useApp } from "@/lib/store";
import { TaskPriority, TaskStatus } from "@/types/app";

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
  deferred: "Deferred",
};

const PRIORITY_BADGE: Record<TaskPriority, string> = {
  low: "bg-[#E4F1EA] text-[#3E6B56]",
  medium: "bg-[#F0EDFB] text-[#514657]",
  high: "bg-[#FBE8EF] text-[#A95476]",
};

export function TasksView() {
  const { state, addTask, updateTask, deleteTask } = useApp();
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState(state.subjects[0]?.id ?? "");
  const [dueAt, setDueAt] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [showForm, setShowForm] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      description: description.trim(),
      subjectId: subjectId || undefined,
      dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
      priority,
      status: "todo",
    });
    setTitle("");
    setDescription("");
    setDueAt("");
    setShowForm(false);
  };

  const visibleTasks = state.tasks.filter(
    (t) => filterStatus === "all" || t.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">Task Manager</h1>
          <p className="text-sm text-[#7C6F83]">
            Tugas dengan tenggat waktu otomatis tampil di Home & Academic Calendar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full bg-white border border-[#EEDCE5] p-1">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold cursor-pointer ${
                viewMode === "list" ? "bg-[#FBE8EF] text-[#A95476]" : "text-[#7C6F83]"
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              type="button"
              onClick={() => setViewMode("board")}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold cursor-pointer ${
                viewMode === "board" ? "bg-[#FBE8EF] text-[#A95476]" : "text-[#7C6F83]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Board
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#C56F91] text-white px-4 py-2 text-xs font-semibold hover:bg-[#A95476] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tugas Baru
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-3xl bg-white border border-[#EEDCE5] p-5 space-y-3 shadow-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul tugas..."
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3.5 py-2 text-sm"
            />
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3.5 py-2 text-sm"
            >
              <option value="">Umum / Tanpa Mata Kuliah</option>
              {state.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detail atau langkah pengerjaan..."
            className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3.5 py-2 text-sm"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div>
              <label className="block text-[11px] font-semibold text-[#7C6F83] mb-1">Deadline</label>
              <input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#7C6F83] mb-1">Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-1.5 text-xs"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-1.5 text-xs text-[#7C6F83]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#C56F91] text-white px-5 py-1.5 text-xs font-semibold cursor-pointer"
              >
                Simpan Tugas
              </button>
            </div>
          </div>
        </form>
      )}

      {viewMode === "list" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["all", "todo", "in_progress", "done", "deferred"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold border cursor-pointer ${
                  filterStatus === st
                    ? "bg-[#FBE8EF] border-[#C56F91] text-[#A95476]"
                    : "bg-white border-[#EEDCE5] text-[#7C6F83]"
                }`}
              >
                {st === "all" ? "Semua" : STATUS_LABELS[st]}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {visibleTasks.map((task) => {
              const subj = state.subjects.find((s) => s.id === task.subjectId);
              return (
                <div
                  key={task.id}
                  className="rounded-2xl bg-white border border-[#EEDCE5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      aria-label="Selesaikan tugas"
                      onClick={() =>
                        updateTask(task.id, {
                          status: task.status === "done" ? "todo" : "done",
                        })
                      }
                      className="mt-0.5 cursor-pointer"
                    >
                      <CheckCircle2
                        className={`w-5 h-5 ${
                          task.status === "done" ? "text-[#3E6B56]" : "text-[#C56F91]"
                        }`}
                      />
                    </button>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={`text-sm font-semibold ${
                            task.status === "done"
                              ? "line-through text-[#7C6F83]"
                              : "text-[#514657]"
                          }`}
                        >
                          {task.title}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            PRIORITY_BADGE[task.priority]
                          }`}
                        >
                          {task.priority}
                        </span>
                        {subj && (
                          <span className="rounded-full bg-[#FFFAF4] border border-[#EEDCE5] px-2 py-0.5 text-[10px] text-[#7C6F83]">
                            {subj.name}
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-xs text-[#7C6F83] mt-1">{task.description}</p>
                      )}
                      {task.dueAt && (
                        <p className="text-[11px] text-[#C56F91] mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueAt).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <select
                      aria-label={`Status tugas ${task.title}`}
                      value={task.status}
                      onChange={(e) =>
                        updateTask(task.id, { status: e.target.value as TaskStatus })
                      }
                      className="rounded-full border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-1 text-xs font-medium"
                    >
                      {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((st) => (
                        <option key={st} value={st}>
                          {STATUS_LABELS[st]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      aria-label="Hapus tugas"
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-full text-[#7C6F83] hover:bg-[#FBE8EF] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((status) => {
            const colTasks = state.tasks.filter((t) => t.status === status);
            return (
              <div
                key={status}
                className="rounded-3xl bg-white border border-[#EEDCE5] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#514657]">
                    {STATUS_LABELS[status]}
                  </h2>
                  <span className="rounded-full bg-[#FBE8EF] px-2 py-0.5 text-[11px] font-bold text-[#A95476]">
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-2xl bg-[#FFFAF4] border border-[#EEDCE5] p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-[#514657]">{t.title}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                            PRIORITY_BADGE[t.priority]
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>
                      <select
                        value={t.status}
                        onChange={(e) =>
                          updateTask(t.id, { status: e.target.value as TaskStatus })
                        }
                        className="w-full rounded-lg border border-[#EEDCE5] bg-white px-2 py-1 text-[11px]"
                      >
                        {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((st) => (
                          <option key={st} value={st}>
                            {STATUS_LABELS[st]}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
