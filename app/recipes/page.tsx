'use client';

import React from 'react';
import Link from 'next/link';
import { RECIPES } from '@/src/game/recipes/RecipeDefinitions';

export default function RecipesPage() {
  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 sm:p-6 text-[#ececec]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-3 mb-4">
        <Link
          href="/"
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#262626] border border-[#3a3a3a] hover:bg-[#303030] text-[#ececec]"
        >
          ← Về trang chủ
        </Link>
        <h1 className="text-lg font-black text-white">Sổ tay công thức</h1>
        <div className="w-16" />
      </div>

      {/* Recipes List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.values(RECIPES).map((recipe) => (
          <div
            key={recipe.id}
            className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 flex flex-col gap-2.5 shadow"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl">{recipe.icon}</span>
              <div>
                <h3 className="text-sm font-black text-white">{recipe.nameVi}</h3>
                <span className="text-[10px] text-[#22c55e] font-semibold">
                  +{recipe.baseScore} điểm • {recipe.prepTimeSeconds}s sơ chế
                </span>
              </div>
            </div>

            <p className="text-xs text-[#a3a3a3]">{recipe.descriptionVi}</p>

            {/* Ingredients Needed */}
            <div className="border-t border-[#3a3a3a] pt-2 flex flex-col gap-1">
              <span className="text-[11px] font-bold text-[#ececec]">Nguyên liệu cần:</span>
              <div className="flex flex-wrap gap-1.5">
                {recipe.requirements.map((req, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#3a3a3a] text-[#ececec]"
                  >
                    {req.quantity ? `${req.quantity}x ` : ''}
                    {req.type} ({req.state === 'chopped' ? 'thái nhỏ' : req.state === 'cooked' ? 'nấu chín' : 'sống'})
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
