"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { INITIAL_APP_STATE } from "./seedData";
import {
  AppState,
  BucketListItem,
  CalendarEvent,
  Chapter,
  DiaryEntry,
  FgdSession,
  GiftMessage,
  Material,
  MemoryItem,
  MoodEntry,
  NoteItem,
  PersonalLetter,
  PlaylistItem,
  QuizAttempt,
  QuizItem,
  SkillLabItem,
  Subject,
  TaskItem,
  UserProfile,
} from "@/types/app";

const STORAGE_KEY = "little_dental_world_state_v1";

interface AppContextValue {
  state: AppState;
  hydrated: boolean;
  updateProfile: (patch: Partial<UserProfile>) => void;
  enterFromWelcome: () => void;
  loginAsOwner: (email?: string) => void;
  loginAsGiftAdmin: () => void;
  logout: () => void;
  resetDemoData: () => void;
  clearAllData: () => void;
  exportAllData: () => string;

  // Study Library
  addSubject: (subject: Omit<Subject, "id">) => void;
  addChapter: (chapter: Omit<Chapter, "id">) => void;
  toggleChapterStudied: (chapterId: string) => void;
  toggleChapterReview: (chapterId: string) => void;
  updateChapterConfidence: (chapterId: string, level: number) => void;
  addMaterial: (material: Omit<Material, "id" | "createdAt">) => void;
  toggleBookmark: (materialId: string) => void;
  logStudySession: (minutes: number) => void;

  // Notes
  addNote: (note: Omit<NoteItem, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, patch: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;

  // Tasks & Calendar
  addTask: (task: Omit<TaskItem, "id" | "createdAt">) => TaskItem;
  updateTask: (id: string, patch: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;
  addCalendarEvent: (ev: Omit<CalendarEvent, "id">) => void;
  deleteCalendarEvent: (id: string) => void;

  // FGD & Skill Lab
  addFgdSession: (fgd: Omit<FgdSession, "id">) => void;
  convertFgdActionToTask: (sessionId: string, actionId: string) => void;
  addSkillLab: (skill: Omit<SkillLabItem, "id">) => void;
  updateSkillLab: (id: string, patch: Partial<SkillLabItem>) => void;

  // Quiz
  addQuiz: (quiz: Omit<QuizItem, "id">) => void;
  recordQuizAttempt: (attempt: Omit<QuizAttempt, "id" | "completedAt">) => void;

  // Me Time
  addPlaylist: (pl: Omit<PlaylistItem, "id">) => void;
  deletePlaylist: (id: string) => void;
  addDiaryEntry: (entry: Omit<DiaryEntry, "id" | "createdAt">) => void;
  deleteDiaryEntry: (id: string) => void;
  addMoodEntry: (mood: Omit<MoodEntry, "id" | "createdAt">) => void;
  deleteMoodEntry: (id: string) => void;

  // Memories & Gift
  addMemory: (mem: Omit<MemoryItem, "id">) => void;
  deleteMemory: (id: string) => void;
  addPersonalLetter: (letter: Omit<PersonalLetter, "id" | "createdAt">) => void;
  addBucketItem: (item: Omit<BucketListItem, "id">) => void;
  toggleBucketItem: (id: string) => void;
  deleteBucketItem: (id: string) => void;
  openGiftMessage: (id: string) => void;
  addGiftMessage: (msg: Omit<GiftMessage, "id" | "isOpened">) => void;
  deleteGiftMessage: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL_APP_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppState>;
        setState((prev) => ({
          ...prev,
          ...parsed,
          profile: { ...prev.profile, ...(parsed.profile ?? {}) },
        }));
      }
    } catch {
      // Fallback to initial seed
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage quota safeguard
    }
  }, [state, hydrated]);

  const awardBadge = (
    prev: AppState,
    badgeKey: string,
    xpDelta = 10
  ): Pick<AppState, "earnedBadges" | "xp"> => {
    const nextBadges = { ...prev.earnedBadges };
    if (!nextBadges[badgeKey]) {
      nextBadges[badgeKey] = new Date().toISOString();
    }
    return {
      earnedBadges: nextBadges,
      xp: prev.xp + xpDelta,
    };
  };

  const updateProfile = (patch: Partial<UserProfile>) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  };

  const enterFromWelcome = () => {
    setState((prev) => ({ ...prev, welcomeSeen: true }));
  };

  const loginAsOwner = (email?: string) => {
    setState((prev) => ({
      ...prev,
      welcomeSeen: true,
      isAuthenticated: true,
      profile: {
        ...prev.profile,
        role: "owner",
        email: email || prev.profile.email,
      },
    }));
  };

  const loginAsGiftAdmin = () => {
    setState((prev) => ({
      ...prev,
      welcomeSeen: true,
      isAuthenticated: true,
      profile: {
        ...prev.profile,
        role: "gift_admin",
      },
    }));
  };

  const logout = () => {
    setState((prev) => ({ ...prev, isAuthenticated: false }));
  };

  const resetDemoData = () => {
    setState({ ...INITIAL_APP_STATE, welcomeSeen: true, isAuthenticated: true });
  };

  const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      ...INITIAL_APP_STATE,
      subjects: [],
      chapters: [],
      materials: [],
      bookmarkedMaterialIds: [],
      notes: [],
      tasks: [],
      calendarEvents: [],
      fgdSessions: [],
      skillLabs: [],
      quizzes: [],
      quizAttempts: [],
      playlists: [],
      diaryEntries: [],
      moodEntries: [],
      memories: [],
      personalLetters: [],
      bucketList: [],
      earnedBadges: {},
      xp: 0,
      welcomeSeen: true,
      isAuthenticated: true,
    });
  };

  const exportAllData = () => JSON.stringify(state, null, 2);

  const addSubject = (subject: Omit<Subject, "id">) => {
    setState((prev) => {
      const next = {
        ...prev,
        subjects: [...prev.subjects, { ...subject, id: uid("subj") }],
      };
      return { ...next, ...awardBadge(next, "first_little_step", 15) };
    });
  };

  const addChapter = (chapter: Omit<Chapter, "id">) => {
    setState((prev) => ({
      ...prev,
      chapters: [...prev.chapters, { ...chapter, id: uid("chap") }],
    }));
  };

  const toggleChapterStudied = (chapterId: string) => {
    setState((prev) => {
      const target = prev.chapters.find((c) => c.id === chapterId);
      const nextStudied = target ? !target.isStudied : true;
      const chapters = prev.chapters.map((c) =>
        c.id === chapterId ? { ...c, isStudied: nextStudied } : c
      );
      const next = { ...prev, chapters };
      return nextStudied ? { ...next, ...awardBadge(next, "steady_learner", 15) } : next;
    });
  };

  const toggleChapterReview = (chapterId: string) => {
    setState((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapterId ? { ...c, needsReview: !c.needsReview } : c
      ),
    }));
  };

  const updateChapterConfidence = (chapterId: string, level: number) => {
    setState((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === chapterId ? { ...c, confidenceLevel: level } : c
      ),
    }));
  };

  const addMaterial = (material: Omit<Material, "id" | "createdAt">) => {
    setState((prev) => ({
      ...prev,
      materials: [
        { ...material, id: uid("mat"), createdAt: new Date().toISOString() },
        ...prev.materials,
      ],
    }));
  };

  const toggleBookmark = (materialId: string) => {
    setState((prev) => {
      const exists = prev.bookmarkedMaterialIds.includes(materialId);
      return {
        ...prev,
        bookmarkedMaterialIds: exists
          ? prev.bookmarkedMaterialIds.filter((id) => id !== materialId)
          : [...prev.bookmarkedMaterialIds, materialId],
      };
    });
  };

  const logStudySession = (minutes: number) => {
    setState((prev) => {
      const next = {
        ...prev,
        profile: {
          ...prev.profile,
          studyMinutesThisWeek: prev.profile.studyMinutesThisWeek + minutes,
        },
      };
      return { ...next, ...awardBadge(next, "steady_learner", 10) };
    });
  };

  const addNote = (note: Omit<NoteItem, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    setState((prev) => {
      const notes = [{ ...note, id: uid("note"), createdAt: now, updatedAt: now }, ...prev.notes];
      const next = { ...prev, notes };
      if (notes.length >= 5) {
        return { ...next, ...awardBadge(next, "note_collector", 15) };
      }
      return { ...next, xp: prev.xp + 5 };
    });
  };

  const updateNote = (id: string, patch: Partial<NoteItem>) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n
      ),
    }));
  };

  const deleteNote = (id: string) => {
    setState((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== id) }));
  };

  const addTask = (task: Omit<TaskItem, "id" | "createdAt">): TaskItem => {
    const created: TaskItem = {
      ...task,
      id: uid("task"),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => {
      const calendarEvents = [...prev.calendarEvents];
      if (created.dueAt) {
        calendarEvents.push({
          id: uid("cal"),
          type: "deadline",
          title: `Deadline: ${created.title}`,
          startsAt: created.dueAt,
          notes: created.description,
          linkedTaskId: created.id,
        });
      }
      return {
        ...prev,
        tasks: [created, ...prev.tasks],
        calendarEvents,
      };
    });
    return created;
  };

  const updateTask = (id: string, patch: Partial<TaskItem>) => {
    setState((prev) => {
      const tasks = prev.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
      const updated = tasks.find((t) => t.id === id);
      let calendarEvents = prev.calendarEvents;
      if (updated) {
        const hasCal = calendarEvents.some((e) => e.linkedTaskId === id);
        if (updated.dueAt && hasCal) {
          calendarEvents = calendarEvents.map((e) =>
            e.linkedTaskId === id
              ? { ...e, title: `Deadline: ${updated.title}`, startsAt: updated.dueAt! }
              : e
          );
        } else if (updated.dueAt && !hasCal) {
          calendarEvents = [
            ...calendarEvents,
            {
              id: uid("cal"),
              type: "deadline",
              title: `Deadline: ${updated.title}`,
              startsAt: updated.dueAt,
              linkedTaskId: updated.id,
            },
          ];
        }
      }
      return {
        ...prev,
        tasks,
        calendarEvents,
        xp: patch.status === "done" ? prev.xp + 10 : prev.xp,
      };
    });
  };

  const deleteTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
      calendarEvents: prev.calendarEvents.filter((e) => e.linkedTaskId !== id),
    }));
  };

  const addCalendarEvent = (ev: Omit<CalendarEvent, "id">) => {
    setState((prev) => ({
      ...prev,
      calendarEvents: [...prev.calendarEvents, { ...ev, id: uid("cal") }],
    }));
  };

  const deleteCalendarEvent = (id: string) => {
    setState((prev) => ({
      ...prev,
      calendarEvents: prev.calendarEvents.filter((e) => e.id !== id),
    }));
  };

  const addFgdSession = (fgd: Omit<FgdSession, "id">) => {
    setState((prev) => ({
      ...prev,
      fgdSessions: [{ ...fgd, id: uid("fgd") }, ...prev.fgdSessions],
      calendarEvents: [
        ...prev.calendarEvents,
        {
          id: uid("cal"),
          type: "fgd",
          title: `FGD: ${fgd.topic}`,
          startsAt: fgd.meetingAt,
          notes: fgd.goal,
        },
      ],
    }));
  };

  const convertFgdActionToTask = (sessionId: string, actionId: string) => {
    setState((prev) => {
      const session = prev.fgdSessions.find((s) => s.id === sessionId);
      const action = session?.actions.find((a) => a.id === actionId);
      if (!session || !action || action.taskId) return prev;

      const newTask: TaskItem = {
        id: uid("task"),
        title: `[FGD] ${action.description}`,
        description: `Dari sesi FGD: ${session.topic} (PJ: ${action.assignee})`,
        dueAt: session.meetingAt,
        priority: "medium",
        status: "todo",
        createdAt: new Date().toISOString(),
      };

      return {
        ...prev,
        tasks: [newTask, ...prev.tasks],
        fgdSessions: prev.fgdSessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                actions: s.actions.map((a) =>
                  a.id === actionId ? { ...a, taskId: newTask.id } : a
                ),
              }
            : s
        ),
      };
    });
  };

  const addSkillLab = (skill: Omit<SkillLabItem, "id">) => {
    setState((prev) => {
      const calendarEvents = [...prev.calendarEvents];
      if (skill.scheduledAt) {
        calendarEvents.push({
          id: uid("cal"),
          type: "skill_lab",
          title: `Skill Lab: ${skill.title}`,
          startsAt: skill.scheduledAt,
          notes: skill.category,
        });
      }
      return {
        ...prev,
        skillLabs: [{ ...skill, id: uid("skill") }, ...prev.skillLabs],
        calendarEvents,
      };
    });
  };

  const updateSkillLab = (id: string, patch: Partial<SkillLabItem>) => {
    setState((prev) => {
      const next = {
        ...prev,
        skillLabs: prev.skillLabs.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      };
      if (patch.reflection && patch.reflection.trim().length > 0) {
        return { ...next, ...awardBadge(next, "skill_in_progress", 10) };
      }
      return next;
    });
  };

  const addQuiz = (quiz: Omit<QuizItem, "id">) => {
    setState((prev) => ({
      ...prev,
      quizzes: [{ ...quiz, id: uid("quiz") }, ...prev.quizzes],
    }));
  };

  const recordQuizAttempt = (attempt: Omit<QuizAttempt, "id" | "completedAt">) => {
    setState((prev) => ({
      ...prev,
      quizAttempts: [
        { ...attempt, id: uid("att"), completedAt: new Date().toISOString() },
        ...prev.quizAttempts,
      ],
      xp: prev.xp + 10,
    }));
  };

  const addPlaylist = (pl: Omit<PlaylistItem, "id">) => {
    setState((prev) => ({
      ...prev,
      playlists: [{ ...pl, id: uid("pl") }, ...prev.playlists],
    }));
  };

  const deletePlaylist = (id: string) => {
    setState((prev) => ({
      ...prev,
      playlists: prev.playlists.filter((p) => p.id !== id),
    }));
  };

  const addDiaryEntry = (entry: Omit<DiaryEntry, "id" | "createdAt">) => {
    setState((prev) => ({
      ...prev,
      diaryEntries: [
        { ...entry, id: uid("diary"), createdAt: new Date().toISOString() },
        ...prev.diaryEntries,
      ],
    }));
  };

  const deleteDiaryEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      diaryEntries: prev.diaryEntries.filter((d) => d.id !== id),
    }));
  };

  const addMoodEntry = (mood: Omit<MoodEntry, "id" | "createdAt">) => {
    setState((prev) => {
      const next = {
        ...prev,
        moodEntries: [
          { ...mood, id: uid("mood"), createdAt: new Date().toISOString() },
          ...prev.moodEntries,
        ],
      };
      return { ...next, ...awardBadge(next, "kind_to_myself", 10) };
    });
  };

  const deleteMoodEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      moodEntries: prev.moodEntries.filter((m) => m.id !== id),
    }));
  };

  const addMemory = (mem: Omit<MemoryItem, "id">) => {
    setState((prev) => ({
      ...prev,
      memories: [{ ...mem, id: uid("mem") }, ...prev.memories],
    }));
  };

  const deleteMemory = (id: string) => {
    setState((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
    }));
  };

  const addPersonalLetter = (letter: Omit<PersonalLetter, "id" | "createdAt">) => {
    setState((prev) => ({
      ...prev,
      personalLetters: [
        { ...letter, id: uid("plet"), createdAt: new Date().toISOString() },
        ...prev.personalLetters,
      ],
    }));
  };

  const addBucketItem = (item: Omit<BucketListItem, "id">) => {
    setState((prev) => ({
      ...prev,
      bucketList: [{ ...item, id: uid("buck") }, ...prev.bucketList],
    }));
  };

  const toggleBucketItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      bucketList: prev.bucketList.map((b) =>
        b.id === id ? { ...b, isCompleted: !b.isCompleted } : b
      ),
    }));
  };

  const deleteBucketItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      bucketList: prev.bucketList.filter((b) => b.id !== id),
    }));
  };

  const openGiftMessage = (id: string) => {
    setState((prev) => ({
      ...prev,
      giftMessages: prev.giftMessages.map((g) =>
        g.id === id ? { ...g, isOpened: true } : g
      ),
    }));
  };

  const addGiftMessage = (msg: Omit<GiftMessage, "id" | "isOpened">) => {
    setState((prev) => ({
      ...prev,
      giftMessages: [
        { ...msg, id: uid("gift"), isOpened: false },
        ...prev.giftMessages,
      ],
    }));
  };

  const deleteGiftMessage = (id: string) => {
    setState((prev) => ({
      ...prev,
      giftMessages: prev.giftMessages.filter((g) => g.id !== id),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        hydrated,
        updateProfile,
        enterFromWelcome,
        loginAsOwner,
        loginAsGiftAdmin,
        logout,
        resetDemoData,
        clearAllData,
        exportAllData,
        addSubject,
        addChapter,
        toggleChapterStudied,
        toggleChapterReview,
        updateChapterConfidence,
        addMaterial,
        toggleBookmark,
        logStudySession,
        addNote,
        updateNote,
        deleteNote,
        addTask,
        updateTask,
        deleteTask,
        addCalendarEvent,
        deleteCalendarEvent,
        addFgdSession,
        convertFgdActionToTask,
        addSkillLab,
        updateSkillLab,
        addQuiz,
        recordQuizAttempt,
        addPlaylist,
        deletePlaylist,
        addDiaryEntry,
        deleteDiaryEntry,
        addMoodEntry,
        deleteMoodEntry,
        addMemory,
        deleteMemory,
        addPersonalLetter,
        addBucketItem,
        toggleBucketItem,
        deleteBucketItem,
        openGiftMessage,
        addGiftMessage,
        deleteGiftMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
