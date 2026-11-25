export type AreaTheme = "home" | "study" | "metime" | "memories" | "myspace";

export type NavSection =
  | "home"
  | "study-library"
  | "notes"
  | "tasks"
  | "calendar"
  | "fgd"
  | "skill-lab"
  | "quiz"
  | "revision"
  | "music"
  | "diary"
  | "mood"
  | "cozy"
  | "games"
  | "memories"
  | "letters"
  | "bucket-list"
  | "surprise-box"
  | "settings"
  | "gift-admin";

export type Discipline =
  | "Ilmu Kedokteran Dasar"
  | "Ilmu Kedokteran Gigi Dasar"
  | "Ilmu Klinik"
  | "Ilmu Pendukung";

export type UnderstandingStatus =
  | "not_started"
  | "studying"
  | "needs_review"
  | "understood";

export type FileType = "pdf" | "image" | "document" | "presentation" | "link";

export interface Subject {
  id: string;
  semester: number;
  discipline: Discipline;
  name: string;
  code?: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  parentId: string | null; // null = Bab, non-null = Subbab
  title: string;
  orderNo: number;
  isStudied: boolean;
  needsReview: boolean;
  confidenceLevel: number; // 1-5
}

export interface Material {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  fileType: FileType;
  fileName?: string;
  fileDataUrl?: string; // local preview/download or signed URL
  sourceUrl?: string;
  tags: string[];
  understandingStatus: UnderstandingStatus;
  createdAt: string;
}

export interface NoteItem {
  id: string;
  subjectId?: string;
  chapterId?: string;
  title: string;
  body: string;
  tags: string[];
  attachmentName?: string;
  isPinned: boolean;
  isArchived: boolean;
  updatedAt: string;
  createdAt: string;
}

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done" | "deferred";

export interface TaskItem {
  id: string;
  subjectId?: string;
  title: string;
  description: string;
  dueAt?: string; // ISO date or datetime string
  priority: TaskPriority;
  status: TaskStatus;
  reminderAt?: string;
  createdAt: string;
}

export type CalendarEventType =
  | "kuliah"
  | "praktikum"
  | "skill_lab"
  | "fgd"
  | "ujian"
  | "deadline";

export interface CalendarEvent {
  id: string;
  type: CalendarEventType;
  title: string;
  startsAt: string;
  endsAt?: string;
  location?: string;
  notes?: string;
  reminderMinutes?: number;
  linkedTaskId?: string;
}

export interface FgdActionItem {
  id: string;
  description: string;
  assignee: string;
  taskId?: string;
}

export interface FgdSession {
  id: string;
  topic: string;
  meetingAt: string;
  goal: string;
  members: string[];
  triggerQuestions: string[];
  discussionPoints: string[];
  referencesList: string[];
  summary: string;
  prepStatus: "preparing" | "ready" | "completed";
  actions: FgdActionItem[];
}

export type SkillStatus = "not_started" | "practicing" | "needs_review" | "confident";

export interface SkillPrepCheck {
  id: string;
  label: string;
  done: boolean;
}

export interface SkillLabItem {
  id: string;
  title: string;
  category: string;
  status: SkillStatus;
  prepChecklist: SkillPrepCheck[];
  practicedAt?: string;
  scheduledAt?: string;
  reflection: string;
}

export interface QuizQuestion {
  id: string;
  questionType: "mcq" | "true_false" | "flashcard";
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  materialId?: string;
}

export interface QuizItem {
  id: string;
  subjectId?: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  weakTopics: string[];
  completedAt: string;
}

export type PlaylistCategory = "Focus" | "Calm" | "Happy" | "Late Night Study";

export interface PlaylistItem {
  id: string;
  title: string;
  spotifyUrl: string;
  category: PlaylistCategory;
}

export interface DiaryEntry {
  id: string;
  title?: string;
  body: string;
  mood?: string;
  entryDate: string;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  note?: string;
  createdAt: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  memoryDate: string;
}

export interface GiftMessage {
  id: string;
  kind: "surprise" | "letter_from_giver" | "daily_note";
  title: string;
  body: string;
  unlockAt?: string;
  unlockCondition?: string;
  isActive: boolean;
  isOpened: boolean;
}

export interface PersonalLetter {
  id: string;
  title: string;
  body: string;
  openOn?: string;
  createdAt: string;
}

export interface BucketListItem {
  id: string;
  title: string;
  category: string;
  isCompleted: boolean;
  targetDate?: string;
}

export interface UserProfile {
  displayName: string;
  email: string;
  role: "owner" | "gift_admin";
  weeklyStudyGoalMins: number;
  studyMinutesThisWeek: number;
  animationsEnabled: boolean;
  gamificationEnabled: boolean;
}

export interface AchievementBadge {
  key: string;
  title: string;
  description: string;
  earnedAt?: string;
}

export interface AppState {
  profile: UserProfile;
  welcomeSeen: boolean;
  isAuthenticated: boolean;
  authMode: "local" | "supabase";
  subjects: Subject[];
  chapters: Chapter[];
  materials: Material[];
  bookmarkedMaterialIds: string[];
  notes: NoteItem[];
  tasks: TaskItem[];
  calendarEvents: CalendarEvent[];
  fgdSessions: FgdSession[];
  skillLabs: SkillLabItem[];
  quizzes: QuizItem[];
  quizAttempts: QuizAttempt[];
  playlists: PlaylistItem[];
  diaryEntries: DiaryEntry[];
  moodEntries: MoodEntry[];
  memories: MemoryItem[];
  giftMessages: GiftMessage[];
  personalLetters: PersonalLetter[];
  bucketList: BucketListItem[];
  earnedBadges: Record<string, string>; // badge_key -> ISO timestamp
  xp: number;
}
