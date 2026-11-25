"use client";

import React, { useState } from "react";
import { Music, Plus, Trash2, Info } from "lucide-react";
import { useApp } from "@/lib/store";
import { PlaylistCategory } from "@/types/app";
import { CozyMoonMascot } from "../BrandAssets";

const CATEGORIES: PlaylistCategory[] = ["Focus", "Calm", "Happy", "Late Night Study"];

export function parseSpotifyEmbedUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (!url.hostname.includes("spotify.com")) return null;
    const match = url.pathname.match(/\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
    if (!match) return null;
    const [, kind, id] = match;
    return `https://open.spotify.com/embed/${kind}/${id}?utm_source=generator&theme=0`;
  } catch {
    return null;
  }
}

export function MusicRoomView() {
  const { state, addPlaylist, deletePlaylist } = useApp();
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [title, setTitle] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [category, setCategory] = useState<PlaylistCategory>("Focus");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const embed = parseSpotifyEmbedUrl(spotifyUrl);
    if (!embed) {
      setErrorMsg(
        "Tautan Spotify tidak valid. Gunakan link playlist, album, atau lagu dari open.spotify.com."
      );
      return;
    }
    addPlaylist({
      title: title.trim() || "Playlist Favorit Caca",
      spotifyUrl: spotifyUrl.trim(),
      category,
    });
    setTitle("");
    setSpotifyUrl("");
  };

  const visiblePlaylists = state.playlists.filter(
    (p) => selectedCat === "all" || p.category === selectedCat
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CozyMoonMascot size={46} />
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">Music Room</h1>
          <p className="text-sm text-[#7C6F83]">
            Tempelkan tautan playlist, album, atau lagu Spotify untuk menemani belajar atau santai.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#F0EDFB]/80 border border-[#DCD4F4] px-4 py-3 flex items-start gap-2.5 text-xs text-[#514657]">
        <Info className="w-4 h-4 text-[#C56F91] shrink-0 mt-0.5" />
        <p>
          Pemutaran penuh dan background playback mengikuti aturan Spotify, ketersediaan konten,
          browser, dan status akun Spotify yang kamu gunakan.
        </p>
      </div>

      {/* Add Spotify Link Form */}
      <form
        onSubmit={handleAdd}
        className="rounded-3xl bg-white/90 border border-[#DCD4F4] p-5 space-y-3"
      >
        <p className="text-xs font-bold text-[#514657] flex items-center gap-1.5">
          <Music className="w-4 h-4 text-[#C56F91]" />
          Tambah Playlist / Lagu Spotify
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nama playlist (mis. Acoustic Study)"
            className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          />
          <input
            type="url"
            required
            value={spotifyUrl}
            onChange={(e) => setSpotifyUrl(e.target.value)}
            placeholder="https://open.spotify.com/playlist/..."
            className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PlaylistCategory)}
            className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {errorMsg && (
          <p role="alert" className="text-xs font-medium text-[#A95476]">
            {errorMsg}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#C56F91] text-white px-5 py-2 text-xs font-semibold hover:bg-[#A95476] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Embed
          </button>
        </div>
      </form>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCat("all")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border cursor-pointer ${
            selectedCat === "all"
              ? "bg-[#DCD4F4] border-[#C56F91] text-[#514657]"
              : "bg-white border-[#EEDCE5] text-[#7C6F83]"
          }`}
        >
          Semua
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border cursor-pointer ${
              selectedCat === cat
                ? "bg-[#DCD4F4] border-[#C56F91] text-[#514657]"
                : "bg-white border-[#EEDCE5] text-[#7C6F83]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Playlist Embeds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visiblePlaylists.map((pl) => {
          const embedSrc = parseSpotifyEmbedUrl(pl.spotifyUrl);
          return (
            <div
              key={pl.id}
              className="rounded-3xl bg-white/90 border border-[#DCD4F4] p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="inline-block rounded-full bg-[#F0EDFB] px-2.5 py-0.5 text-[10px] font-semibold text-[#514657]">
                    {pl.category}
                  </span>
                  <h2 className="font-semibold text-sm text-[#514657] mt-1">{pl.title}</h2>
                </div>
                <button
                  type="button"
                  aria-label={`Hapus ${pl.title}`}
                  onClick={() => deletePlaylist(pl.id)}
                  className="p-1.5 rounded-full text-[#7C6F83] hover:bg-[#FBE8EF] cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {embedSrc ? (
                <iframe
                  title={pl.title}
                  src={embedSrc}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-2xl border-0"
                />
              ) : (
                <p className="text-xs text-[#A95476]">Tautan Spotify tidak valid.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
