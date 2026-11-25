"use client";

import React, { useState } from "react";
import { Images, Plus, Trash2, Calendar } from "lucide-react";
import { useApp } from "@/lib/store";

const MAX_IMG_BYTES = 4 * 1024 * 1024;

export function MemoryGalleryView() {
  const { state, addMemory, deleteMemory } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [memoryDate, setMemoryDate] = useState(new Date().toISOString().split("T")[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("File harus berupa gambar (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > MAX_IMG_BYTES) {
      setErrorMsg("Ukuran gambar maksimal 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) {
      setErrorMsg("Pilih foto dan isi judul kenangan.");
      return;
    }
    addMemory({
      title: title.trim(),
      caption: caption.trim(),
      imageUrl,
      memoryDate,
    });
    setTitle("");
    setCaption("");
    setImageUrl("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">Memory Gallery</h1>
          <p className="text-sm text-[#7C6F83]">
            Scrapbook digital untuk menyimpan foto-foto dan momen berharga Caca.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#C56F91] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Kenangan
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-3xl bg-white border border-[#F4C8D9] p-5 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul momen..."
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={memoryDate}
              onChange={(e) => setMemoryDate(e.target.value)}
              className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
            />
          </div>
          <textarea
            rows={2}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Cerita singkat di balik foto ini..."
            className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] p-3 text-sm"
          />
          <div>
            <label className="block text-xs font-semibold text-[#514657] mb-1">
              Unggah Foto (PNG/JPG/WEBP · Maks 4 MB)
            </label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs" />
            {errorMsg && <p className="text-xs text-[#A95476] mt-1">{errorMsg}</p>}
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
              Simpan Kenangan
            </button>
          </div>
        </form>
      )}

      {state.memories.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#EEDCE5] p-10 text-center text-sm text-[#7C6F83]">
          <Images className="w-8 h-8 text-[#F4C8D9] mx-auto mb-2" />
          Belum ada foto di galeri.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.memories.map((mem) => (
            <figure
              key={mem.id}
              className="rounded-3xl bg-white border border-[#F4C8D9]/80 p-3.5 pb-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="overflow-hidden rounded-2xl bg-[#FBE8EF]/40 aspect-[4/3] mb-3">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="px-1 space-y-1">
                  <h2 className="font-serif text-xl font-semibold text-[#514657]">{mem.title}</h2>
                  <p className="text-xs text-[#7C6F83] leading-relaxed">{mem.caption}</p>
                </figcaption>
              </div>
              <div className="flex items-center justify-between px-1 pt-3 mt-3 border-t border-[#EEDCE5] text-[11px] text-[#7C6F83]">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C56F91]" />
                  {new Date(mem.memoryDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  type="button"
                  aria-label={`Hapus ${mem.title}`}
                  onClick={() => deleteMemory(mem.id)}
                  className="p-1 rounded-full hover:bg-[#FBE8EF] cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
