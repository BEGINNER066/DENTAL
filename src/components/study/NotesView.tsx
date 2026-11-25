"use client";

import React, { useMemo, useState } from "react";
import { FileText, Pin, Archive, Trash2, Plus, Search, Printer, Edit3 } from "lucide-react";
import { useApp } from "@/lib/store";
import { NoteItem } from "@/types/app";

export function NotesView() {
  const { state, addNote, updateNote, deleteNote } = useApp();
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subjectId, setSubjectId] = useState(state.subjects[0]?.id ?? "");
  const [chapterId, setChapterId] = useState("");
  const [tags, setTags] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return state.notes
      .filter((n) => n.isArchived === showArchived)
      .filter(
        (n) =>
          !q ||
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      )
      .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
  }, [state.notes, showArchived, search]);

  const subjectChapters = state.chapters.filter((c) => c.subjectId === subjectId);

  const startNew = () => {
    setEditingNote(null);
    setTitle("");
    setBody("");
    setTags("");
    setAttachmentName("");
    setShowForm(true);
  };

  const startEdit = (note: NoteItem) => {
    setEditingNote(note);
    setTitle(note.title);
    setBody(note.body);
    setSubjectId(note.subjectId ?? "");
    setChapterId(note.chapterId ?? "");
    setTags(note.tags.join(", "));
    setAttachmentName(note.attachmentName ?? "");
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const tagArr = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingNote) {
      updateNote(editingNote.id, {
        title: title.trim(),
        body,
        subjectId: subjectId || undefined,
        chapterId: chapterId || undefined,
        tags: tagArr,
        attachmentName: attachmentName.trim() || undefined,
      });
    } else {
      addNote({
        title: title.trim(),
        body,
        subjectId: subjectId || undefined,
        chapterId: chapterId || undefined,
        tags: tagArr,
        attachmentName: attachmentName.trim() || undefined,
        isPinned: false,
        isArchived: false,
      });
    }
    setShowForm(false);
    setEditingNote(null);
  };

  const insertChecklistLine = () => {
    setBody((prev) => (prev ? `${prev}\n[ ] Poin baru` : "[ ] Poin baru"));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">Notes</h1>
          <p className="text-sm text-[#7C6F83]">
            Catatan belajar yang dapat ditautkan ke subbab di Study Library.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#EEDCE5] bg-white px-4 py-2 text-xs font-semibold text-[#514657] hover:bg-[#FBE8EF]/40 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak / PDF
          </button>
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#C56F91] px-4 py-2 text-xs font-semibold text-white hover:bg-[#A95476] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Buat Catatan
          </button>
        </div>
      </div>

      {/* Search & Archive toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7C6F83] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari catatan berdasarkan judul, isi, atau tag..."
            className="w-full rounded-full bg-white border border-[#EEDCE5] pl-10 pr-4 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowArchived(!showArchived)}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold border cursor-pointer ${
            showArchived
              ? "bg-[#F0EDFB] border-[#C56F91] text-[#514657]"
              : "bg-white border-[#EEDCE5] text-[#7C6F83]"
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          {showArchived ? "Lihat Catatan Aktif" : "Lihat Arsip"}
        </button>
      </div>

      {/* Editor Modal / Inline Card */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="rounded-3xl bg-white border border-[#EEDCE5] p-5 sm:p-6 space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-base text-[#514657]">
              {editingNote ? "Edit Catatan" : "Catatan Baru"}
            </h2>
            <button
              type="button"
              onClick={insertChecklistLine}
              className="text-xs font-semibold text-[#C56F91] hover:underline cursor-pointer"
            >
              + Sisipkan Checklist
            </button>
          </div>

          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul catatan..."
            className="w-full rounded-2xl border border-[#EEDCE5] bg-[#FFFAF4] px-4 py-2.5 text-sm font-medium"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                setChapterId("");
              }}
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
            >
              <option value="">Tautkan ke Mata Kuliah (opsional)</option>
              {state.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
            >
              <option value="">Tautkan ke Bab / Subbab (opsional)</option>
              {subjectChapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <textarea
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tulis rangkuman, poin penting, atau checklist belajar..."
            className="w-full rounded-2xl border border-[#EEDCE5] bg-[#FFFAF4] p-4 text-sm leading-relaxed"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tag (pisahkan koma: anatomi, ujian)"
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
            />
            <input
              type="text"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
              placeholder="Nama lampiran/referensi (opsional)"
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full px-4 py-2 text-xs text-[#7C6F83]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#C56F91] text-white px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Simpan Catatan
            </button>
          </div>
        </form>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#EEDCE5] p-10 text-center text-sm text-[#7C6F83]">
          <FileText className="w-8 h-8 text-[#F4C8D9] mx-auto mb-2" />
          Belum ada catatan pada tampilan ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => {
            const subj = state.subjects.find((s) => s.id === note.subjectId);
            const chap = state.chapters.find((c) => c.id === note.chapterId);
            return (
              <article
                key={note.id}
                className="rounded-3xl bg-white border border-[#EEDCE5] p-5 shadow-xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {subj && (
                        <span className="inline-block rounded-full bg-[#FBE8EF] px-2.5 py-0.5 text-[11px] font-semibold text-[#A95476] mb-1.5">
                          {subj.name}
                          {chap ? ` · ${chap.title}` : ""}
                        </span>
                      )}
                      <h3 className="font-semibold text-base text-[#514657]">{note.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        aria-label="Pin catatan"
                        onClick={() => updateNote(note.id, { isPinned: !note.isPinned })}
                        className="p-1.5 rounded-full hover:bg-[#FBE8EF] cursor-pointer"
                      >
                        <Pin
                          className={`w-3.5 h-3.5 ${
                            note.isPinned ? "text-[#C56F91] fill-[#C56F91]" : "text-[#7C6F83]"
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        aria-label="Edit catatan"
                        onClick={() => startEdit(note)}
                        className="p-1.5 rounded-full hover:bg-[#FBE8EF] cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#7C6F83]" />
                      </button>
                      <button
                        type="button"
                        aria-label="Arsipkan catatan"
                        onClick={() => updateNote(note.id, { isArchived: !note.isArchived })}
                        className="p-1.5 rounded-full hover:bg-[#F0EDFB] cursor-pointer"
                      >
                        <Archive className="w-3.5 h-3.5 text-[#7C6F83]" />
                      </button>
                      <button
                        type="button"
                        aria-label="Hapus catatan"
                        onClick={() => deleteNote(note.id)}
                        className="p-1.5 rounded-full hover:bg-[#FBE8EF] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-[#7C6F83]" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-[#514657] whitespace-pre-line leading-relaxed">
                    {note.body}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#EEDCE5] text-[11px] text-[#7C6F83]">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-[#F0EDFB] px-2 py-0.5 text-[10px] font-medium text-[#514657]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span>
                    Diperbarui{" "}
                    {new Date(note.updatedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
