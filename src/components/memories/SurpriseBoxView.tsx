"use client";

import React from "react";
import { Gift, Sparkles, LockOpen } from "lucide-react";
import { useApp } from "@/lib/store";

export function SurpriseBoxView() {
  const { state, openGiftMessage } = useApp();
  const surprises = state.giftMessages.filter((g) => g.kind === "surprise" && g.isActive);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-[#514657]">Surprise Box</h1>
        <p className="text-sm text-[#7C6F83]">
          Kotak kejutan kecil yang dapat kamu buka kapan pun kamu siap atau di tanggal spesial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {surprises.map((box) => {
          const isDateLocked = box.unlockAt ? new Date(box.unlockAt) > new Date() : false;
          return (
            <div
              key={box.id}
              className={`rounded-3xl border p-6 space-y-4 transition ${
                box.isOpened
                  ? "bg-white border-[#F4C8D9]"
                  : "bg-gradient-to-br from-[#FBE8EF] to-[#F0EDFB] border-[#DCD4F4]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center border border-[#EEDCE5]">
                    {box.isOpened ? (
                      <LockOpen className="w-5 h-5 text-[#C56F91]" />
                    ) : (
                      <Gift className="w-5 h-5 text-[#C56F91]" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#514657]">{box.title}</h2>
                    {box.unlockCondition && (
                      <p className="text-[11px] text-[#7C6F83]">{box.unlockCondition}</p>
                    )}
                  </div>
                </div>
              </div>

              {box.isOpened ? (
                <div className="rounded-2xl bg-[#FFFAF4] border border-[#EEDCE5] p-4 text-sm text-[#514657] leading-relaxed">
                  {box.body}
                </div>
              ) : isDateLocked ? (
                <p className="text-xs text-[#7C6F83]">
                  Kejutan ini akan terbuka pada {box.unlockAt}.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => openGiftMessage(box.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#C56F91] text-white px-5 py-2 text-xs font-semibold hover:bg-[#A95476] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Buka Kejutan Ini
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
