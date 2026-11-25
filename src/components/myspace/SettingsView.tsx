"use client";

import React, { useState } from "react";
import { Download, RotateCcw, Trash2, ShieldCheck, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function SettingsView() {
  const {
    state,
    updateProfile,
    exportAllData,
    resetDemoData,
    clearAllData,
  } = useApp();

  const [displayName, setDisplayName] = useState(state.profile.displayName);
  const [goalMins, setGoalMins] = useState(state.profile.weeklyStudyGoalMins);
  const [savedMsg, setSavedMsg] = useState(false);

  const supabaseEnabled = isSupabaseConfigured();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim() || "Caca",
      weeklyStudyGoalMins: Math.max(30, Number(goalMins) || 300),
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleExportAll = () => {
    const json = exportAllData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `little-dental-world-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-[#514657]">Profile & Settings</h1>
        <p className="text-sm text-[#7C6F83]">
          Atur preferensi pengalaman, target belajar mingguan, privasi, dan cadangan datamu.
        </p>
      </div>

      {/* Profile Preferences */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-3xl bg-white border border-[#EEDCE5] p-6 space-y-4"
      >
        <h2 className="font-semibold text-base text-[#514657]">Profil & Kenyamanan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#514657] mb-1">Nama Panggilan</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#514657] mb-1">
              Target Belajar Mingguan (menit)
            </label>
            <input
              type="number"
              min={30}
              step={15}
              value={goalMins}
              onChange={(e) => setGoalMins(Number(e.target.value))}
              className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <label className="flex items-center justify-between rounded-2xl bg-[#FFFAF4] border border-[#EEDCE5] p-3.5 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-[#514657]">Animasi Lembut</p>
              <p className="text-xs text-[#7C6F83]">
                Kelopak bunga & animasi ringan pada layar sambutan.
              </p>
            </div>
            <input
              type="checkbox"
              checked={state.profile.animationsEnabled}
              onChange={(e) => updateProfile({ animationsEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#C56F91]"
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl bg-[#FFFAF4] border border-[#EEDCE5] p-3.5 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-[#514657]">Gamifikasi Apresiasi</p>
              <p className="text-xs text-[#7C6F83]">
                Tampilkan badge & poin apresiasi (hari istirahat tidak pernah merusak skor).
              </p>
            </div>
            <input
              type="checkbox"
              checked={state.profile.gamificationEnabled}
              onChange={(e) => updateProfile({ gamificationEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#C56F91]"
            />
          </label>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedMsg ? (
            <span className="text-xs font-semibold text-[#3E6B56]">Pengaturan tersimpan!</span>
          ) : (
            <span />
          )}
          <button
            type="submit"
            className="rounded-full bg-[#C56F91] text-white px-5 py-2 text-xs font-semibold cursor-pointer"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>

      {/* Privacy & Security Transparency (Section 8) */}
      <section className="rounded-3xl bg-[#F0EDFB]/65 border border-[#DCD4F4] p-6 space-y-2.5">
        <div className="flex items-center gap-2 font-semibold text-base text-[#514657]">
          <ShieldCheck className="w-5 h-5 text-[#C56F91]" />
          <span>Keamanan & Kepemilikan Data</span>
        </div>
        <p className="text-xs text-[#514657] leading-relaxed">
          Status koneksi:{" "}
          <strong>
            {supabaseEnabled
              ? "Tersambung ke Supabase (Postgres + RLS + Private Storage)"
              : "Mode Demo Lokal (tersimpan di localStorage browser perangkat ini)"}
          </strong>
          . Diary dan catatan mood tidak pernah dikirim ke analitik pihak ketiga dan terpisah dari
          area pembuat hadiah.
        </p>
      </section>

      {/* Export & Data Management */}
      <section className="rounded-3xl bg-white border border-[#EEDCE5] p-6 space-y-4">
        <h2 className="font-semibold text-base text-[#514657]">Ekspor & Pengelolaan Data</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportAll}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F1EA] text-[#3E6B56] px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Ekspor Semua Data (JSON)
          </button>
          <button
            type="button"
            onClick={resetDemoData}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#EEDCE5] bg-[#FFFAF4] text-[#514657] px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Muat Ulang Data Contoh
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Hapus seluruh data lokal dari aplikasi ini?")) {
                clearAllData();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FBE8EF] text-[#A95476] px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Hapus Semua Data
          </button>
        </div>
      </section>

      <div className="text-center text-xs text-[#7C6F83] pt-2 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#C56F91]" />
        <span>Little Dental World · A little universe made just for Caca</span>
      </div>
    </div>
  );
}
