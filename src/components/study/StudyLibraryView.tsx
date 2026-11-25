"use client";

import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  Bookmark,
  Plus,
  CheckCircle2,
  Circle,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Presentation,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Discipline, FileType, UnderstandingStatus } from "@/types/app";
import { ToothMascot } from "../BrandAssets";

const DISCIPLINES: Discipline[] = [
  "Ilmu Kedokteran Dasar",
  "Ilmu Kedokteran Gigi Dasar",
  "Ilmu Klinik",
  "Ilmu Pendukung",
];

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB

export function StudyLibraryView() {
  const {
    state,
    addSubject,
    addChapter,
    toggleChapterStudied,
    toggleChapterReview,
    addMaterial,
    toggleBookmark,
    logStudySession,
  } = useApp();

  const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    state.subjects[0]?.id ?? ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [onlyUnstudied, setOnlyUnstudied] = useState(false);

  // Forms
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjName, setNewSubjName] = useState("");
  const [newSubjSem, setNewSubjSem] = useState(3);
  const [newSubjDisc, setNewSubjDisc] = useState<Discipline>("Ilmu Kedokteran Gigi Dasar");

  const [newChapTitle, setNewChapTitle] = useState("");
  const [newSubchapParent, setNewSubchapParent] = useState<string>("");

  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [matChapterId, setMatChapterId] = useState("");
  const [matTitle, setMatTitle] = useState("");
  const [matDesc, setMatDesc] = useState("");
  const [matType, setMatType] = useState<FileType>("pdf");
  const [matUrl, setMatUrl] = useState("");
  const [matTags, setMatTags] = useState("");
  const [matFileName, setMatFileName] = useState("");
  const [matFileDataUrl, setMatFileDataUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [sessionToast, setSessionToast] = useState(false);

  const filteredSubjects = useMemo(() => {
    return state.subjects.filter((s) => {
      if (selectedSemester !== "all" && s.semester !== selectedSemester) return false;
      if (selectedDiscipline !== "all" && s.discipline !== selectedDiscipline) return false;
      return true;
    });
  }, [state.subjects, selectedSemester, selectedDiscipline]);

  const activeSubject =
    filteredSubjects.find((s) => s.id === selectedSubjectId) ?? filteredSubjects[0] ?? null;

  const subjectChapters = useMemo(() => {
    if (!activeSubject) return [];
    return state.chapters
      .filter((c) => c.subjectId === activeSubject.id)
      .sort((a, b) => a.orderNo - b.orderNo);
  }, [state.chapters, activeSubject]);

  const parentBabs = subjectChapters.filter((c) => c.parentId === null);

  const matchingMaterials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return state.materials.filter((m) => {
      const chap = state.chapters.find((c) => c.id === m.chapterId);
      const subj = chap ? state.subjects.find((s) => s.id === chap.subjectId) : undefined;
      if (onlyBookmarked && !state.bookmarkedMaterialIds.includes(m.id)) return false;
      if (onlyUnstudied && chap?.isStudied) return false;
      if (!q) return chap?.subjectId === activeSubject?.id;
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)) ||
        (subj?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [
    state.materials,
    state.chapters,
    state.subjects,
    state.bookmarkedMaterialIds,
    searchQuery,
    onlyBookmarked,
    onlyUnstudied,
    activeSubject,
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|png|jpe?g|webp|pptx?|docx?)$/i)) {
      setUploadError("Format file tidak didukung. Gunakan PDF, gambar, PPT/PPTX, atau DOC/DOCX.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError("Ukuran file melebihi batas 5 MB.");
      return;
    }
    setMatFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setMatFileDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjName.trim()) return;
    addSubject({
      name: newSubjName.trim(),
      semester: newSubjSem,
      discipline: newSubjDisc,
    });
    setNewSubjName("");
    setShowAddSubject(false);
  };

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubject || !newChapTitle.trim()) return;
    addChapter({
      subjectId: activeSubject.id,
      parentId: newSubchapParent || null,
      title: newChapTitle.trim(),
      orderNo: subjectChapters.length + 1,
      isStudied: false,
      needsReview: false,
      confidenceLevel: 3,
    });
    setNewChapTitle("");
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const targetChapId = matChapterId || subjectChapters[0]?.id;
    if (!targetChapId || !matTitle.trim()) return;
    addMaterial({
      chapterId: targetChapId,
      title: matTitle.trim(),
      description: matDesc.trim(),
      fileType: matType,
      fileName: matFileName || undefined,
      fileDataUrl: matFileDataUrl || undefined,
      sourceUrl: matUrl.trim() || undefined,
      tags: matTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      understandingStatus: "not_started" as UnderstandingStatus,
    });
    setMatTitle("");
    setMatDesc("");
    setMatUrl("");
    setMatTags("");
    setMatFileName("");
    setMatFileDataUrl("");
    setShowAddMaterial(false);
  };

  const fileIcon = (ft: FileType) => {
    if (ft === "image") return <ImageIcon className="w-4 h-4 text-[#C56F91]" />;
    if (ft === "presentation") return <Presentation className="w-4 h-4 text-[#C56F91]" />;
    if (ft === "link") return <LinkIcon className="w-4 h-4 text-[#C56F91]" />;
    return <FileText className="w-4 h-4 text-[#C56F91]" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ToothMascot size={44} />
          <div>
            <h1 className="font-serif text-3xl font-semibold text-[#514657]">Study Library</h1>
            <p className="text-sm text-[#7C6F83]">
              Semester → Rumpun Ilmu → Mata Kuliah → Bab → Subbab → Materi
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              logStudySession(25);
              setSessionToast(true);
              setTimeout(() => setSessionToast(false), 3000);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F1EA] px-4 py-2 text-xs font-semibold text-[#3E6B56] hover:opacity-90 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            Catat Sesi Belajar (+25m)
          </button>
          <button
            type="button"
            onClick={() => setShowAddSubject(!showAddSubject)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#C56F91] px-4 py-2 text-xs font-semibold text-white hover:bg-[#A95476] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Mata Kuliah
          </button>
        </div>
      </div>

      {sessionToast && (
        <div className="rounded-2xl bg-[#E4F1EA] border border-[#3E6B56]/25 px-4 py-2.5 text-xs font-semibold text-[#3E6B56]">
          25 menit sesi belajar ditambahkan ke target mingguanmu!
        </div>
      )}

      {/* Add Subject Form */}
      {showAddSubject && (
        <form
          onSubmit={handleAddSubject}
          className="rounded-3xl bg-white border border-[#EEDCE5] p-5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
        >
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#514657] mb-1">Nama Mata Kuliah</label>
            <input
              type="text"
              required
              value={newSubjName}
              onChange={(e) => setNewSubjName(e.target.value)}
              placeholder="Contoh: Periodonsia Dasar"
              className="w-full rounded-xl border border-[#EEDCE5] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#514657] mb-1">Semester</label>
            <select
              value={newSubjSem}
              onChange={(e) => setNewSubjSem(Number(e.target.value))}
              className="w-full rounded-xl border border-[#EEDCE5] px-3 py-2 text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#514657] mb-1">Rumpun Ilmu</label>
            <select
              value={newSubjDisc}
              onChange={(e) => setNewSubjDisc(e.target.value as Discipline)}
              className="w-full rounded-xl border border-[#EEDCE5] px-3 py-2 text-sm"
            >
              {DISCIPLINES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddSubject(false)}
              className="rounded-full px-4 py-1.5 text-xs text-[#7C6F83]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#C56F91] text-white px-5 py-1.5 text-xs font-semibold"
            >
              Simpan Mata Kuliah
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter Bar */}
      <div className="rounded-3xl bg-white border border-[#EEDCE5] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7C6F83] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul materi, mata kuliah, tag, atau kata kunci..."
            className="w-full rounded-full bg-[#FFFAF4] border border-[#EEDCE5] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#C56F91]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Filter semester"
            value={selectedSemester}
            onChange={(e) =>
              setSelectedSemester(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="rounded-full border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-1.5 text-xs font-medium"
          >
            <option value="all">Semua Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter rumpun ilmu"
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="rounded-full border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-1.5 text-xs font-medium"
          >
            <option value="all">Semua Rumpun</option>
            {DISCIPLINES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium border cursor-pointer ${
              onlyBookmarked
                ? "bg-[#FBE8EF] border-[#C56F91] text-[#A95476]"
                : "bg-white border-[#EEDCE5] text-[#7C6F83]"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Bookmark
          </button>

          <button
            type="button"
            onClick={() => setOnlyUnstudied(!onlyUnstudied)}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium border cursor-pointer ${
              onlyUnstudied
                ? "bg-[#F0EDFB] border-[#C56F91] text-[#514657]"
                : "bg-white border-[#EEDCE5] text-[#7C6F83]"
            }`}
          >
            Belum Dipelajari
          </button>
        </div>
      </div>

      {/* Main 2-column Hierarchy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Subject List */}
        <div className="lg:col-span-4 space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C6F83] px-1">
            Daftar Mata Kuliah ({filteredSubjects.length})
          </h2>
          {filteredSubjects.length === 0 ? (
            <div className="rounded-2xl bg-white border border-[#EEDCE5] p-5 text-xs text-[#7C6F83]">
              Tidak ada mata kuliah pada filter ini.
            </div>
          ) : (
            filteredSubjects.map((subj) => {
              const subs = state.chapters.filter((c) => c.subjectId === subj.id && c.parentId !== null);
              const done = subs.filter((c) => c.isStudied).length;
              const isSelected = activeSubject?.id === subj.id;
              return (
                <button
                  key={subj.id}
                  type="button"
                  onClick={() => setSelectedSubjectId(subj.id)}
                  className={`w-full text-left rounded-2xl border p-4 transition cursor-pointer ${
                    isSelected
                      ? "bg-[#FBE8EF]/75 border-[#C56F91] shadow-xs"
                      : "bg-white border-[#EEDCE5] hover:bg-[#FBE8EF]/30"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#C56F91] mb-1">
                    <span>Semester {subj.semester}</span>
                    <span>
                      {done}/{subs.length} subbab
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-[#514657]">{subj.name}</p>
                  <p className="text-[11px] text-[#7C6F83] mt-0.5">{subj.discipline}</p>
                </button>
              );
            })
          )}
        </div>

        {/* Right: Chapters, Subchapters & Materials */}
        <div className="lg:col-span-8 space-y-5">
          {activeSubject && (
            <div className="rounded-3xl bg-white border border-[#EEDCE5] p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EEDCE5]">
                <div>
                  <span className="text-[11px] font-semibold text-[#C56F91]">
                    Semester {activeSubject.semester} · {activeSubject.discipline}
                  </span>
                  <h2 className="font-serif text-2xl font-semibold text-[#514657]">
                    {activeSubject.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddMaterial(!showAddMaterial)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FBE8EF] text-[#A95476] px-4 py-2 text-xs font-semibold hover:bg-[#F4C8D9] transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Materi / File
                </button>
              </div>

              {/* Add Chapter / Subchapter */}
              <form onSubmit={handleAddChapter} className="flex flex-col sm:flex-row gap-2">
                <select
                  aria-label="Induk bab"
                  value={newSubchapParent}
                  onChange={(e) => setNewSubchapParent(e.target.value)}
                  className="rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
                >
                  <option value="">+ Buat Bab Baru</option>
                  {parentBabs.map((b) => (
                    <option key={b.id} value={b.id}>
                      Subbab di: {b.title}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newChapTitle}
                  onChange={(e) => setNewChapTitle(e.target.value)}
                  placeholder="Judul bab atau subbab baru..."
                  className="flex-1 rounded-xl border border-[#EEDCE5] px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#514657] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  Tambah
                </button>
              </form>

              {/* Add Material Form */}
              {showAddMaterial && (
                <form
                  onSubmit={handleAddMaterial}
                  className="rounded-2xl bg-[#FFFAF4] border border-[#EEDCE5] p-4 space-y-3"
                >
                  <p className="text-xs font-bold text-[#514657]">Unggah / Tambah Materi Baru</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={matChapterId}
                      onChange={(e) => setMatChapterId(e.target.value)}
                      className="rounded-xl border border-[#EEDCE5] bg-white px-3 py-2 text-xs"
                    >
                      <option value="">Pilih Bab / Subbab</option>
                      {subjectChapters.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.parentId ? "↳ " : ""}
                          {c.title}
                        </option>
                      ))}
                    </select>
                    <select
                      value={matType}
                      onChange={(e) => setMatType(e.target.value as FileType)}
                      className="rounded-xl border border-[#EEDCE5] bg-white px-3 py-2 text-xs"
                    >
                      <option value="pdf">PDF</option>
                      <option value="presentation">Slide Presentasi</option>
                      <option value="image">Gambar / Atlas</option>
                      <option value="document">Dokumen</option>
                      <option value="link">Tautan Referensi</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    required
                    value={matTitle}
                    onChange={(e) => setMatTitle(e.target.value)}
                    placeholder="Judul materi"
                    className="w-full rounded-xl border border-[#EEDCE5] bg-white px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    value={matDesc}
                    onChange={(e) => setMatDesc(e.target.value)}
                    placeholder="Deskripsi singkat..."
                    className="w-full rounded-xl border border-[#EEDCE5] bg-white px-3 py-2 text-xs"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="url"
                      value={matUrl}
                      onChange={(e) => setMatUrl(e.target.value)}
                      placeholder="Tautan URL (opsional)"
                      className="rounded-xl border border-[#EEDCE5] bg-white px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      value={matTags}
                      onChange={(e) => setMatTags(e.target.value)}
                      placeholder="Tag (pisahkan koma: anatomi, ujian)"
                      className="rounded-xl border border-[#EEDCE5] bg-white px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#7C6F83] mb-1">
                      Lampiran File (PDF, PNG/JPG, PPTX, DOCX · Maks 5 MB)
                    </label>
                    <input type="file" onChange={handleFileUpload} className="text-xs" />
                    {uploadError && <p className="text-xs text-[#A95476] mt-1">{uploadError}</p>}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMaterial(false)}
                      className="text-xs text-[#7C6F83] px-3 py-1"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-[#C56F91] text-white text-xs font-semibold px-4 py-1.5"
                    >
                      Simpan Materi
                    </button>
                  </div>
                </form>
              )}

              {/* Bab & Subbab Tree */}
              <div className="space-y-4">
                {parentBabs.map((bab) => {
                  const subbabs = subjectChapters.filter((c) => c.parentId === bab.id);
                  return (
                    <div key={bab.id} className="rounded-2xl bg-[#FFFAF4] border border-[#EEDCE5] p-4">
                      <p className="font-semibold text-sm text-[#514657] mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#C56F91]" />
                        {bab.title}
                      </p>
                      <div className="space-y-2 pl-2 sm:pl-4">
                        {subbabs.length === 0 ? (
                          <p className="text-xs text-[#7C6F83]">Belum ada subbab di bab ini.</p>
                        ) : (
                          subbabs.map((sub) => (
                            <div
                              key={sub.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white border border-[#EEDCE5] px-3 py-2"
                            >
                              <button
                                type="button"
                                onClick={() => toggleChapterStudied(sub.id)}
                                className="flex items-center gap-2 text-left text-xs font-medium text-[#514657] cursor-pointer"
                              >
                                {sub.isStudied ? (
                                  <CheckCircle2 className="w-4 h-4 text-[#3E6B56] shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-[#C56F91] shrink-0" />
                                )}
                                <span className={sub.isStudied ? "line-through text-[#7C6F83]" : ""}>
                                  {sub.title}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleChapterReview(sub.id)}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium cursor-pointer ${
                                  sub.needsReview
                                    ? "bg-[#FBE8EF] text-[#A95476]"
                                    : "bg-[#F0EDFB] text-[#7C6F83]"
                                }`}
                              >
                                <AlertCircle className="w-3 h-3" />
                                {sub.needsReview ? "Perlu Review" : "Tandai Review"}
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Matching Materials List */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7C6F83] mb-3">
                  Materi & Lampiran ({matchingMaterials.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchingMaterials.map((mat) => {
                    const isBookmarked = state.bookmarkedMaterialIds.includes(mat.id);
                    return (
                      <div
                        key={mat.id}
                        className="rounded-2xl bg-white border border-[#EEDCE5] p-4 flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {fileIcon(mat.fileType)}
                              <span className="text-[11px] uppercase font-semibold text-[#7C6F83]">
                                {mat.fileType}
                              </span>
                            </div>
                            <button
                              type="button"
                              aria-label="Bookmark materi"
                              onClick={() => toggleBookmark(mat.id)}
                              className="cursor-pointer"
                            >
                              <Bookmark
                                className={`w-4 h-4 ${
                                  isBookmarked ? "fill-[#C56F91] text-[#C56F91]" : "text-[#7C6F83]"
                                }`}
                              />
                            </button>
                          </div>
                          <p className="font-semibold text-sm text-[#514657] mt-2">{mat.title}</p>
                          {mat.description && (
                            <p className="text-xs text-[#7C6F83] mt-1">{mat.description}</p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EEDCE5]">
                          <div className="flex flex-wrap gap-1">
                            {mat.tags.map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-[#F0EDFB] px-2 py-0.5 text-[10px] font-medium text-[#514657]"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                          {mat.sourceUrl && (
                            <a
                              href={mat.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-[#C56F91] hover:underline"
                            >
                              Buka Tautan
                            </a>
                          )}
                          {mat.fileDataUrl && (
                            <a
                              href={mat.fileDataUrl}
                              download={mat.fileName || "materi"}
                              className="text-xs font-semibold text-[#C56F91] hover:underline"
                            >
                              Unduh {mat.fileName}
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
