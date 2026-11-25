"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { NavSection } from "@/types/app";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { AuthGate } from "@/components/AuthGate";
import { AppShell } from "@/components/AppShell";
import { HomeDashboard } from "@/components/HomeDashboard";
import { StudyLibraryView } from "@/components/study/StudyLibraryView";
import { NotesView } from "@/components/study/NotesView";
import { TasksView } from "@/components/study/TasksView";
import { CalendarView } from "@/components/study/CalendarView";
import { FgdWorkspaceView } from "@/components/study/FgdWorkspaceView";
import { SkillLabView } from "@/components/study/SkillLabView";
import { QuizFlashcardsView } from "@/components/study/QuizFlashcardsView";
import { RevisionCenterView } from "@/components/study/RevisionCenterView";
import { MusicRoomView } from "@/components/metime/MusicRoomView";
import { DiaryView } from "@/components/metime/DiaryView";
import { MoodCornerView } from "@/components/metime/MoodCornerView";
import { CozyRoomView } from "@/components/metime/CozyRoomView";
import { LittleGamesView } from "@/components/metime/LittleGamesView";
import { MemoryGalleryView } from "@/components/memories/MemoryGalleryView";
import { LettersView } from "@/components/memories/LettersView";
import { BucketListView } from "@/components/memories/BucketListView";
import { SurpriseBoxView } from "@/components/memories/SurpriseBoxView";
import { SettingsView } from "@/components/myspace/SettingsView";
import { GiftAdminView } from "@/components/myspace/GiftAdminView";

export default function Page() {
  const { state, hydrated } = useApp();
  const [activeSection, setActiveSection] = useState<NavSection>("home");

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFAF4]">
        <p className="font-serif text-xl text-[#C56F91]">Menyiapkan Little Dental World...</p>
      </div>
    );
  }

  // 1. Welcome / Surprise Screen
  if (!state.welcomeSeen) {
    return <WelcomeScreen />;
  }

  // 2. Private Authentication Gate (Section 8: visitors cannot view dashboard/diary/files)
  if (!state.isAuthenticated) {
    return <AuthGate />;
  }

  // 3. Role-based isolation for Gift Admin
  if (state.profile.role === "gift_admin") {
    return (
      <AppShell activeSection="gift-admin" onNavigate={() => setActiveSection("gift-admin")}>
        <GiftAdminView />
      </AppShell>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HomeDashboard onNavigate={setActiveSection} />;
      case "study-library":
        return <StudyLibraryView />;
      case "notes":
        return <NotesView />;
      case "tasks":
        return <TasksView />;
      case "calendar":
        return <CalendarView />;
      case "fgd":
        return <FgdWorkspaceView />;
      case "skill-lab":
        return <SkillLabView />;
      case "quiz":
        return <QuizFlashcardsView />;
      case "revision":
        return <RevisionCenterView />;
      case "music":
        return <MusicRoomView />;
      case "diary":
        return <DiaryView />;
      case "mood":
        return <MoodCornerView />;
      case "cozy":
        return <CozyRoomView />;
      case "games":
        return <LittleGamesView />;
      case "memories":
        return <MemoryGalleryView />;
      case "letters":
        return <LettersView />;
      case "bucket-list":
        return <BucketListView />;
      case "surprise-box":
        return <SurpriseBoxView />;
      case "settings":
        return <SettingsView />;
      default:
        return <HomeDashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <AppShell activeSection={activeSection} onNavigate={setActiveSection}>
      {renderSection()}
    </AppShell>
  );
}
