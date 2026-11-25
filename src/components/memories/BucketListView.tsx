"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { useApp } from "@/lib/store";

export function BucketListView() {
  const { state, addBucketItem, toggleBucketItem, deleteBucketItem } = useApp();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Akademik");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addBucketItem({
      title: title.trim(),
      category,
      isCompleted: false,
    });
    setTitle("");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-[#514657]">Bucket List</h1>
        <p className="text-sm text-[#7C6F83]">
          Daftar impian kecil, self-reward, dan pengalaman yang ingin kamu coba.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="rounded-3xl bg-white border border-[#EEDCE5] p-4 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tulis impian atau pengalaman baru..."
          className="flex-1 rounded-full border border-[#EEDCE5] bg-[#FFFAF4] px-4 py-2 text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-full border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs font-medium"
        >
          <option value="Akademik">Akademik</option>
          <option value="Self-Reward">Self-Reward</option>
          <option value="Me Time">Me Time</option>
          <option value="Personal">Personal</option>
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1 rounded-full bg-[#C56F91] text-white px-5 py-2 text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah
        </button>
      </form>

      <div className="space-y-2.5">
        {state.bucketList.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white border border-[#EEDCE5] p-4 flex items-center justify-between gap-3"
          >
            <button
              type="button"
              onClick={() => toggleBucketItem(item.id)}
              className="flex items-center gap-3 text-left cursor-pointer"
            >
              {item.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-[#3E6B56] shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-[#C56F91] shrink-0" />
              )}
              <div>
                <p
                  className={`text-sm font-medium ${
                    item.isCompleted ? "line-through text-[#7C6F83]" : "text-[#514657]"
                  }`}
                >
                  {item.title}
                </p>
                <span className="text-[11px] text-[#C56F91]">{item.category}</span>
              </div>
            </button>
            <button
              type="button"
              aria-label="Hapus item"
              onClick={() => deleteBucketItem(item.id)}
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
