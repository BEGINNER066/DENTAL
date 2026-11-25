"use client";

import React, { useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";

const SYMBOLS = ["🦢", "🦷", "🌷", "🪻", "🫧", "✨"];

interface Card {
  id: number;
  symbol: string;
  matched: boolean;
}

function createShuffledDeck(): Card[] {
  const pairs = [...SYMBOLS, ...SYMBOLS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((symbol, id) => ({ id, symbol, matched: false }));
}

export function LittleGamesView() {
  const [cards, setCards] = useState<Card[]>(createShuffledDeck);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const handleFlip = (id: number) => {
    if (flippedIds.length >= 2) return;
    if (flippedIds.includes(id)) return;
    const target = cards.find((c) => c.id === id);
    if (!target || target.matched) return;

    const nextFlipped = [...flippedIds, id];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = nextFlipped;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);

      if (first && second && first.symbol === second.symbol) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
            )
          );
          setFlippedIds([]);
        }, 350);
      } else {
        setTimeout(() => {
          setFlippedIds([]);
        }, 700);
      }
    }
  };

  const resetGame = () => {
    setCards(createShuffledDeck());
    setFlippedIds([]);
    setMoves(0);
  };

  const allMatched = cards.every((c) => c.matched);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#514657]">Little Games</h1>
          <p className="text-sm text-[#7C6F83]">
            Permainan mencocokkan kartu ringan untuk jeda tanpa timer dan tanpa tekanan.
          </p>
        </div>
        <button
          type="button"
          onClick={resetGame}
          className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#DCD4F4] px-4 py-2 text-xs font-semibold text-[#514657] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Acak Ulang
        </button>
      </div>

      {allMatched && (
        <div className="rounded-3xl bg-[#E4F1EA] border border-[#3E6B56]/25 p-5 flex items-center gap-3 text-sm font-medium text-[#3E6B56]">
          <Sparkles className="w-5 h-5 shrink-0" />
          <span>
            Yeay! Semua pasangan ketemu dalam {moves} langkah santai. Semoga pikiranmu terasa lebih
            segar!
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {cards.map((card) => {
          const isOpen = card.matched || flippedIds.includes(card.id);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleFlip(card.id)}
              className={`h-24 rounded-3xl border-2 text-3xl flex items-center justify-center transition cursor-pointer ${
                card.matched
                  ? "bg-[#E4F1EA]/70 border-[#3E6B56]/30"
                  : isOpen
                  ? "bg-white border-[#C56F91]"
                  : "bg-gradient-to-br from-[#FBE8EF] to-[#F0EDFB] border-[#DCD4F4] hover:border-[#C56F91]"
              }`}
            >
              {isOpen ? card.symbol : "✦"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
