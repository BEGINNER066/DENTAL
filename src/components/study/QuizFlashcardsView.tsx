"use client";

import React, { useState } from "react";
import { BrainCircuit, RotateCw, CheckCircle2, XCircle, Plus, AlertTriangle } from "lucide-react";
import { useApp } from "@/lib/store";

export function QuizFlashcardsView() {
  const { state, addQuiz, recordQuizAttempt } = useApp();
  const [selectedQuizId, setSelectedQuizId] = useState(state.quizzes[0]?.id ?? "");
  const [tab, setTab] = useState<"quiz" | "flashcards" | "create">("quiz");

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Create simple question
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [qPrompt, setQPrompt] = useState("");
  const [qType, setQType] = useState<"mcq" | "true_false" | "flashcard">("mcq");
  const [qOptions, setQOptions] = useState("Pilihan A, Pilihan B, Pilihan C, Pilihan D");
  const [qAnswer, setQAnswer] = useState("Pilihan A");
  const [qExplanation, setQExplanation] = useState("");

  const activeQuiz = state.quizzes.find((q) => q.id === selectedQuizId) ?? state.quizzes[0];
  const quizQuestions = activeQuiz?.questions.filter((q) => q.questionType !== "flashcard") ?? [];
  const flashcards = activeQuiz?.questions ?? [];

  const handleSubmitQuiz = () => {
    if (!activeQuiz || quizQuestions.length === 0) return;
    let score = 0;
    const weakTopics: string[] = [];
    quizQuestions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        score += 1;
      } else {
        weakTopics.push(q.prompt.slice(0, 50));
      }
    });
    setSubmitted(true);
    recordQuizAttempt({
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      score,
      totalQuestions: quizQuestions.length,
      weakTopics,
    });
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle.trim() || !qPrompt.trim() || !qAnswer.trim()) return;
    const options =
      qType === "true_false"
        ? ["Benar", "Salah"]
        : qType === "mcq"
        ? qOptions
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean)
        : [];
    addQuiz({
      title: newQuizTitle.trim(),
      questions: [
        {
          id: `q-${Date.now()}`,
          questionType: qType,
          prompt: qPrompt.trim(),
          options,
          answer: qAnswer.trim(),
          explanation: qExplanation.trim(),
        },
      ],
    });
    setNewQuizTitle("");
    setQPrompt("");
    setQExplanation("");
    setTab("quiz");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">Quiz & Flashcards</h1>
          <p className="text-sm text-[#7C6F83]">
            Latihan recall konsep, anatomi, material, dan prosedur dari materimu sendiri.
          </p>
        </div>

        <div className="inline-flex rounded-full bg-white border border-[#EEDCE5] p-1">
          {[
            { id: "quiz", label: "Kuis" },
            { id: "flashcards", label: "Flashcards" },
            { id: "create", label: "+ Buat" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as typeof tab)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer ${
                tab === t.id ? "bg-[#FBE8EF] text-[#A95476]" : "text-[#7C6F83]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Academic Disclaimer per Section 5.9 */}
      <div className="rounded-2xl bg-[#F0EDFB]/70 border border-[#DCD4F4] px-4 py-3 flex items-start gap-2.5 text-xs text-[#514657]">
        <AlertTriangle className="w-4 h-4 text-[#C56F91] shrink-0 mt-0.5" />
        <p>
          Konten akademik pada kuis dan flashcard perlu selalu ditinjau terhadap buku teks & sumber
          terpercaya. Aplikasi ini bukan sumber diagnosis atau pedoman klinis.
        </p>
      </div>

      {tab !== "create" && state.quizzes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {state.quizzes.map((qz) => (
            <button
              key={qz.id}
              type="button"
              onClick={() => {
                setSelectedQuizId(qz.id);
                setAnswers({});
                setSubmitted(false);
                setCardIndex(0);
                setFlipped(false);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold border cursor-pointer ${
                activeQuiz?.id === qz.id
                  ? "bg-[#FBE8EF] border-[#C56F91] text-[#A95476]"
                  : "bg-white border-[#EEDCE5] text-[#7C6F83]"
              }`}
            >
              {qz.title}
            </button>
          ))}
        </div>
      )}

      {tab === "quiz" && activeQuiz && (
        <div className="space-y-4">
          {quizQuestions.length === 0 ? (
            <p className="text-sm text-[#7C6F83]">Belum ada soal pilihan ganda/benar-salah di set ini.</p>
          ) : (
            quizQuestions.map((q, idx) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.answer;
              const linkedMat = state.materials.find((m) => m.id === q.materialId);
              return (
                <div
                  key={q.id}
                  className="rounded-3xl bg-white border border-[#EEDCE5] p-5 space-y-3"
                >
                  <p className="text-sm font-semibold text-[#514657]">
                    {idx + 1}. {q.prompt}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        disabled={submitted}
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                        className={`text-left rounded-2xl border px-4 py-2.5 text-xs font-medium transition cursor-pointer ${
                          userAns === opt
                            ? "border-[#C56F91] bg-[#FBE8EF]/70 text-[#514657]"
                            : "border-[#EEDCE5] bg-[#FFFAF4] text-[#514657] hover:bg-[#FBE8EF]/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {submitted && (
                    <div
                      className={`rounded-2xl p-3.5 text-xs space-y-1 ${
                        isCorrect
                          ? "bg-[#E4F1EA] text-[#3E6B56]"
                          : "bg-[#FBE8EF] text-[#A95476]"
                      }`}
                    >
                      <p className="font-bold flex items-center gap-1.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Jawaban benar: {q.answer}
                      </p>
                      {q.explanation && <p>{q.explanation}</p>}
                      {linkedMat && (
                        <p className="opacity-85">Materi terkait: {linkedMat.title}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {quizQuestions.length > 0 && (
            <div className="flex items-center justify-between">
              {!submitted ? (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="rounded-full bg-[#C56F91] text-white px-6 py-2.5 text-xs font-semibold cursor-pointer"
                >
                  Periksa Jawaban
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAnswers({});
                    setSubmitted(false);
                  }}
                  className="rounded-full bg-[#514657] text-white px-6 py-2.5 text-xs font-semibold cursor-pointer"
                >
                  Ulangi Latihan
                </button>
              )}
            </div>
          )}

          {/* Score History */}
          <div className="rounded-3xl bg-white border border-[#EEDCE5] p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C6F83] mb-3">
              Riwayat Skor
            </h2>
            <div className="space-y-2">
              {state.quizAttempts.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between text-xs rounded-xl bg-[#FFFAF4] border border-[#EEDCE5] px-3.5 py-2"
                >
                  <span className="font-medium text-[#514657]">{att.quizTitle}</span>
                  <span className="font-bold text-[#C56F91]">
                    {att.score} / {att.totalQuestions}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "flashcards" && activeQuiz && flashcards.length > 0 && (
        <div className="max-w-xl mx-auto space-y-4 text-center">
          <p className="text-xs text-[#7C6F83]">
            Kartu {cardIndex + 1} dari {flashcards.length} · Klik kartu untuk membalik
          </p>
          <button
            type="button"
            onClick={() => setFlipped(!flipped)}
            className="w-full min-h-56 rounded-3xl bg-white border-2 border-[#DCD4F4] shadow-sm p-8 flex flex-col items-center justify-center gap-3 transition hover:border-[#C56F91] cursor-pointer"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C56F91]">
              {flipped ? "Jawaban & Penjelasan" : "Pertanyaan / Konsep"}
            </span>
            <p className="font-serif text-2xl text-[#514657]">
              {flipped ? flashcards[cardIndex].answer : flashcards[cardIndex].prompt}
            </p>
            {flipped && flashcards[cardIndex].explanation && (
              <p className="text-xs text-[#7C6F83] max-w-md">{flashcards[cardIndex].explanation}</p>
            )}
            <span className="inline-flex items-center gap-1 text-xs text-[#7C6F83] mt-2">
              <RotateCw className="w-3.5 h-3.5" /> Balik Kartu
            </span>
          </button>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setFlipped(false);
                setCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
              }}
              className="rounded-full border border-[#EEDCE5] bg-white px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={() => {
                setFlipped(false);
                setCardIndex((prev) => (prev + 1) % flashcards.length);
              }}
              className="rounded-full bg-[#C56F91] text-white px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}

      {tab === "create" && (
        <form
          onSubmit={handleCreateQuiz}
          className="rounded-3xl bg-white border border-[#EEDCE5] p-6 space-y-4 max-w-2xl"
        >
          <h2 className="font-semibold text-base text-[#514657] flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-[#C56F91]" />
            Buat Kuis atau Flashcard Baru
          </h2>
          <input
            type="text"
            required
            value={newQuizTitle}
            onChange={(e) => setNewQuizTitle(e.target.value)}
            placeholder="Judul set kuis (contoh: Material Komposit)"
            className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          />
          <select
            value={qType}
            onChange={(e) => setQType(e.target.value as typeof qType)}
            className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          >
            <option value="mcq">Pilihan Ganda</option>
            <option value="true_false">Benar / Salah</option>
            <option value="flashcard">Flashcard</option>
          </select>
          <textarea
            rows={2}
            required
            value={qPrompt}
            onChange={(e) => setQPrompt(e.target.value)}
            placeholder="Pertanyaan atau istilah..."
            className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] p-3 text-sm"
          />
          {qType === "mcq" && (
            <input
              type="text"
              value={qOptions}
              onChange={(e) => setQOptions(e.target.value)}
              placeholder="Opsi jawaban (pisahkan koma)"
              className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
            />
          )}
          <input
            type="text"
            required
            value={qAnswer}
            onChange={(e) => setQAnswer(e.target.value)}
            placeholder="Jawaban benar..."
            className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={qExplanation}
            onChange={(e) => setQExplanation(e.target.value)}
            placeholder="Penjelasan singkat (opsional)"
            className="w-full rounded-xl border border-[#EEDCE5] bg-[#FFFAF4] px-3 py-2 text-xs"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#C56F91] text-white px-5 py-2 text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Simpan Kuis
          </button>
        </form>
      )}
    </div>
  );
}
