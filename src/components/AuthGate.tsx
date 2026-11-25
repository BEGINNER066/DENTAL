"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, Sparkles, Gift, ArrowLeft } from "lucide-react";
import { SwanLogo } from "./BrandAssets";
import { useApp } from "@/lib/store";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function AuthGate() {
  const { loginAsOwner, loginAsGiftAdmin } = useApp();
  const [email, setEmail] = useState("caca@littledental.world");
  const [password, setPassword] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const supabaseEnabled = isSupabaseConfigured();

  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (supabaseEnabled) {
      setLoading(true);
      try {
        const supabase = createClient();
        if (!supabase) throw new Error("Koneksi Supabase belum tersedia.");
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setErrorMsg(error.message);
          return;
        }
        loginAsOwner(email);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Gagal masuk.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email.trim()) {
      setErrorMsg("Masukkan email atau nama akunmu terlebih dahulu.");
      return;
    }
    loginAsOwner(email.trim());
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (adminPasscode.trim().length < 4) {
      setErrorMsg("Masukkan passcode minimal 4 karakter (demo default: caca-gift).");
      return;
    }
    loginAsGiftAdmin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-b from-[#FFFAF4] via-[#FBE8EF]/45 to-[#F0EDFB]">
      <div className="w-full max-w-md rounded-3xl bg-white border border-[#EEDCE5] shadow-lg p-7 sm:p-9">
        <div className="flex flex-col items-center text-center mb-6">
          <SwanLogo size={64} className="mb-3" />
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">
            {adminMode ? "Area Admin Hadiah" : "Masuk ke Ruang Pribadi"}
          </h1>
          <p className="text-sm text-[#7C6F83] mt-1">
            {adminMode
              ? "Khusus mengelola pesan kejutan & surat hadiah tanpa akses ke diary atau mood Caca."
              : "Diary, foto kenangan, mood, dan materi belajarmu terlindungi dari pengunjung luar."}
          </p>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mb-4 rounded-2xl bg-[#FBE8EF] border border-[#C56F91]/40 px-4 py-3 text-xs font-medium text-[#A95476]"
          >
            {errorMsg}
          </div>
        )}

        {!adminMode ? (
          <form onSubmit={handleOwnerLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-[#514657] mb-1.5">
                Email Akun Caca
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#EEDCE5] bg-[#FFFAF4] px-4 py-2.5 text-sm text-[#514657] focus:border-[#C56F91] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="login-pass" className="block text-xs font-semibold text-[#514657] mb-1.5">
                Kata Sandi {supabaseEnabled ? "" : "(Opsional pada Mode Demo Lokal)"}
              </label>
              <input
                id="login-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required={supabaseEnabled}
                className="w-full rounded-2xl border border-[#EEDCE5] bg-[#FFFAF4] px-4 py-2.5 text-sm text-[#514657] focus:border-[#C56F91] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#C56F91] hover:bg-[#A95476] text-white font-semibold py-3 text-sm transition cursor-pointer disabled:opacity-60"
            >
              <Lock className="w-4 h-4" />
              {loading
                ? "Memverifikasi..."
                : supabaseEnabled
                ? "Masuk dengan Akun Privat"
                : "Masuk sebagai Caca (Mode Demo Lokal)"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-code" className="block text-xs font-semibold text-[#514657] mb-1.5">
                Passcode Pembuat Hadiah
              </label>
              <input
                id="admin-code"
                type="password"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                placeholder="Contoh demo: caca-gift"
                required
                className="w-full rounded-2xl border border-[#EEDCE5] bg-[#FFFAF4] px-4 py-2.5 text-sm text-[#514657] focus:border-[#C56F91] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#514657] hover:bg-[#3d3442] text-white font-semibold py-3 text-sm transition cursor-pointer"
            >
              <Gift className="w-4 h-4" />
              Masuk ke Pengelola Hadiah
            </button>
          </form>
        )}

        {/* Privacy transparency box per Section 8 */}
        <div className="mt-6 rounded-2xl bg-[#F0EDFB]/70 border border-[#DCD4F4] p-4 space-y-2 text-xs text-[#514657]">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#C56F91] shrink-0" />
            <span>Transparansi Privasi & Penyimpanan</span>
          </div>
          <p className="text-[#7C6F83] leading-relaxed">
            {supabaseEnabled
              ? "Tersambung ke Supabase dengan Row Level Security (RLS). Diary, mood, dan file pribadimu hanya dapat diakses oleh akunmu."
              : "Saat ini berjalan dalam Mode Demo Lokal (data tersimpan di browser Anda untuk pratinjau). Jangan gunakan perangkat umum untuk data sensitif hingga Supabase aktif."}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-[#7C6F83]">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C56F91]" />
            <span>Little Dental World</span>
          </span>

          <button
            type="button"
            onClick={() => {
              setErrorMsg("");
              setAdminMode(!adminMode);
            }}
            className="inline-flex items-center gap-1 font-medium text-[#C56F91] hover:underline cursor-pointer"
          >
            {adminMode ? (
              <>
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Login Caca
              </>
            ) : (
              "Login Pembuat Hadiah"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
