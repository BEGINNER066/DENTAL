"use client";

import React, { useState } from "react";
import {
  Home,
  BookOpen,
  FileText,
  CheckSquare,
  Calendar,
  Users,
  Stethoscope,
  BrainCircuit,
  RotateCcw,
  Music,
  BookHeart,
  Smile,
  CloudMoon,
  Gamepad2,
  Images,
  Mail,
  ListChecks,
  Gift,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Sparkles,
} from "lucide-react";
import { AreaTheme, NavSection } from "@/types/app";
import { SwanLogo, ToothMascot, CozyMoonMascot } from "./BrandAssets";
import { useApp } from "@/lib/store";

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  area: AreaTheme;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Dashboard", icon: Home, area: "home" },

  // Study World
  { id: "study-library", label: "Study Library", icon: BookOpen, area: "study" },
  { id: "notes", label: "Notes", icon: FileText, area: "study" },
  { id: "tasks", label: "Task Manager", icon: CheckSquare, area: "study" },
  { id: "calendar", label: "Academic Calendar", icon: Calendar, area: "study" },
  { id: "fgd", label: "FGD Workspace", icon: Users, area: "study" },
  { id: "skill-lab", label: "Skill Lab Tracker", icon: Stethoscope, area: "study" },
  { id: "quiz", label: "Quiz & Flashcards", icon: BrainCircuit, area: "study" },
  { id: "revision", label: "Revision Center", icon: RotateCcw, area: "study" },

  // Me Time World
  { id: "music", label: "Music Room", icon: Music, area: "metime" },
  { id: "diary", label: "My Diary", icon: BookHeart, area: "metime" },
  { id: "mood", label: "Mood Corner", icon: Smile, area: "metime" },
  { id: "cozy", label: "Cozy Room", icon: CloudMoon, area: "metime" },
  { id: "games", label: "Little Games", icon: Gamepad2, area: "metime" },

  // Little Memories
  { id: "memories", label: "Memory Gallery", icon: Images, area: "memories" },
  { id: "letters", label: "Letters", icon: Mail, area: "memories" },
  { id: "bucket-list", label: "Bucket List", icon: ListChecks, area: "memories" },
  { id: "surprise-box", label: "Surprise Box", icon: Gift, area: "memories" },

  // My Space
  { id: "settings", label: "Profile & Settings", icon: Settings, area: "myspace" },
];

interface AppShellProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  children: React.ReactNode;
}

export function AppShell({ activeSection, onNavigate, children }: AppShellProps) {
  const { state, logout, openGiftMessage } = useApp();
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [dismissedSurpriseBanner, setDismissedSurpriseBanner] = useState(false);

  const isGiftAdmin = state.profile.role === "gift_admin";
  const currentItem = NAV_ITEMS.find((i) => i.id === activeSection);
  const activeArea: AreaTheme = currentItem?.area ?? "home";

  // Unopened active surprise box message
  const unopenedSurprise = !isGiftAdmin
    ? state.giftMessages.find((g) => g.isActive && !g.isOpened && g.kind === "surprise")
    : undefined;

  // Area background nuance (Section 3: Study World clean/structured, Me Time softer/dreamy, Little Memories warm)
  const areaCanvasClass =
    activeArea === "metime"
      ? "bg-gradient-to-b from-[#F0EDFB]/65 via-[#FFFAF4] to-[#FBE8EF]/35"
      : activeArea === "memories"
      ? "bg-gradient-to-b from-[#FBE8EF]/55 via-[#FFFAF4] to-[#F0EDFB]/40"
      : "bg-[#FFFAF4]";

  const renderNavGroup = (title: string, area: AreaTheme, badge?: React.ReactNode) => {
    const items = NAV_ITEMS.filter((i) => i.area === area);
    return (
      <div className="mb-5">
        <div className="flex items-center justify-between px-3 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C6F83]">
            {title}
          </span>
          {badge}
        </div>
        <div className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMoreOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 rounded-2xl px-3 py-2 text-sm font-medium transition cursor-pointer ${
                  active
                    ? "bg-[#FBE8EF] text-[#A95476] font-semibold shadow-xs"
                    : "text-[#514657] hover:bg-[#FBE8EF]/50"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#C56F91]" : "text-[#7C6F83]"}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex ${areaCanvasClass}`}>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:flex lg:w-68 lg:flex-col lg:fixed lg:inset-y-0 bg-white/90 backdrop-blur border-r border-[#EEDCE5] px-3 py-5 overflow-y-auto">
        <div className="flex items-center gap-3 px-2 mb-6">
          <SwanLogo size={42} />
          <div className="min-w-0">
            <p className="font-serif text-lg font-semibold text-[#514657] leading-tight truncate">
              Little Dental World
            </p>
            <p className="text-[11px] text-[#7C6F83] truncate">
              {isGiftAdmin ? "Mode Admin Hadiah" : `Ruang belajar ${state.profile.displayName}`}
            </p>
          </div>
        </div>

        {isGiftAdmin ? (
          <div className="flex-1 space-y-2">
            <div className="rounded-2xl bg-[#F0EDFB] p-3 text-xs text-[#514657] mb-4">
              <div className="flex items-center gap-1.5 font-semibold mb-1">
                <Shield className="w-3.5 h-3.5 text-[#C56F91]" />
                <span>Akses Terbatas</span>
              </div>
              <p className="text-[#7C6F83]">
                Anda hanya dapat mengelola konten kejutan & surat hadiah. Diary & mood Caca terkunci privat.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("gift-admin")}
              className="w-full flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold bg-[#FBE8EF] text-[#A95476]"
            >
              <Gift className="w-4 h-4 text-[#C56F91]" />
              Kelola Gift & Surprise Box
            </button>
          </div>
        ) : (
          <nav className="flex-1" aria-label="Navigasi Utama">
            {renderNavGroup("Home", "home")}
            {renderNavGroup("Study World", "study", <ToothMascot size={22} />)}
            {renderNavGroup("Me Time World", "metime", <CozyMoonMascot size={22} />)}
            {renderNavGroup("Little Memories", "memories")}
            {renderNavGroup("My Space", "myspace")}
          </nav>
        )}

        <div className="pt-4 border-t border-[#EEDCE5] mt-2">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2.5 rounded-2xl px-3 py-2 text-sm font-medium text-[#7C6F83] hover:bg-[#FBE8EF]/60 hover:text-[#A95476] transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Kunci / Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-68 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white/90 backdrop-blur border-b border-[#EEDCE5] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <SwanLogo size={34} />
            <div>
              <p className="font-serif text-base font-semibold text-[#514657] leading-none">
                Little Dental World
              </p>
              <p className="text-[11px] text-[#7C6F83] mt-0.5">
                {isGiftAdmin ? "Admin Hadiah" : currentItem?.label || "Home"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMoreOpen(true)}
            aria-label="Buka semua menu"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FBE8EF] px-3 py-1.5 text-xs font-semibold text-[#A95476]"
          >
            <Menu className="w-4 h-4" />
            Menu
          </button>
        </header>

        {/* Non-intrusive dismissible surprise notification */}
        {unopenedSurprise && !dismissedSurpriseBanner && activeSection !== "surprise-box" && (
          <div className="mx-4 sm:mx-8 mt-4 rounded-2xl bg-gradient-to-r from-[#FBE8EF] to-[#F0EDFB] border border-[#F4C8D9] px-4 py-3 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#C56F91]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#514657] truncate">
                  Ada kejutan kecil menunggumu: {unopenedSurprise.title}
                </p>
                <p className="text-[11px] text-[#7C6F83]">
                  Buka kapan saja kamu siap—atau tutup pengingat ini.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  openGiftMessage(unopenedSurprise.id);
                  onNavigate("surprise-box");
                }}
                className="rounded-full bg-[#C56F91] text-white text-xs font-semibold px-3.5 py-1.5 hover:bg-[#A95476] transition cursor-pointer"
              >
                Buka
              </button>
              <button
                type="button"
                aria-label="Tutup notifikasi kejutan"
                onClick={() => setDismissedSurpriseBanner(true)}
                className="p-1 rounded-full text-[#7C6F83] hover:bg-white/70 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 px-4 sm:px-8 py-6 pb-24 lg:pb-10 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (4 key items + More) */}
      {!isGiftAdmin && (
        <nav
          aria-label="Navigasi Ponsel"
          className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-[#EEDCE5] px-2 py-1.5 flex items-center justify-around"
        >
          {[
            { id: "home" as NavSection, label: "Home", icon: Home },
            { id: "study-library" as NavSection, label: "Library", icon: BookOpen },
            { id: "tasks" as NavSection, label: "Tasks", icon: CheckSquare },
            { id: "music" as NavSection, label: "Me Time", icon: Music },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-medium ${
                  active ? "text-[#C56F91] bg-[#FBE8EF]/70 font-semibold" : "text-[#7C6F83]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setMobileMoreOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-medium text-[#7C6F83]"
          >
            <Menu className="w-4 h-4" />
            <span>Explore</span>
          </button>
        </nav>
      )}

      {/* Mobile Explore / More Drawer */}
      {mobileMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#514657]/35 backdrop-blur-xs flex justify-end">
          <div className="w-80 max-w-[85vw] bg-white h-full overflow-y-auto p-5 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <SwanLogo size={32} />
                <span className="font-serif text-lg font-semibold text-[#514657]">Explore</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMoreOpen(false)}
                aria-label="Tutup menu"
                className="p-1.5 rounded-full bg-[#FBE8EF] text-[#514657]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isGiftAdmin ? (
              <button
                type="button"
                onClick={() => {
                  onNavigate("gift-admin");
                  setMobileMoreOpen(false);
                }}
                className="w-full flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold bg-[#FBE8EF] text-[#A95476]"
              >
                <Gift className="w-4 h-4" />
                Kelola Hadiah
              </button>
            ) : (
              <>
                {renderNavGroup("Home", "home")}
                {renderNavGroup("Study World", "study")}
                {renderNavGroup("Me Time World", "metime")}
                {renderNavGroup("Little Memories", "memories")}
                {renderNavGroup("My Space", "myspace")}
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setMobileMoreOpen(false);
                logout();
              }}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-full border border-[#EEDCE5] py-2.5 text-sm font-medium text-[#7C6F83]"
            >
              <LogOut className="w-4 h-4" />
              Kunci / Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
