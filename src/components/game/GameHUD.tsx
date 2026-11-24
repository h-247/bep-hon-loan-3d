'use client';

import React, { useState } from 'react';
import { GameSimulationState, CustomerOrder } from '../../types/game';
import { RECIPES } from '../../game/recipes/RecipeDefinitions';

interface GameHUDProps {
  simulationState: GameSimulationState;
  onQuickChatSelect?: (message: string) => void;
  onResumeClick?: () => void;
  onRestartClick?: () => void;
  onNextLevelClick?: () => void;
  onExitClick?: () => void;
  isPaused?: boolean;
}

const QUICK_CHAT_MESSAGES = [
  'Tôi sẽ chuẩn bị nguyên liệu.',
  'Tôi sẽ nấu món ăn.',
  'Tôi sẽ rửa đĩa.',
  'Tôi cần nguyên liệu.',
  'Tôi cần đĩa sạch.',
  'Cần hỗ trợ!',
  'Món ăn sắp cháy!',
  'Đơn hàng sắp hết hạn!',
  'Mang món ăn đi!',
  'Làm tốt lắm!',
  'Xin lỗi!',
  'Cảm ơn!',
];

export const GameHUD: React.FC<GameHUDProps> = ({
  simulationState,
  onQuickChatSelect,
  onResumeClick,
  onRestartClick,
  onNextLevelClick,
  onExitClick,
  isPaused = false,
}) => {
  const [showQuickChat, setShowQuickChat] = useState(false);

  const {
    activeOrders,
    timeRemaining,
    score,
    combo,
    status,
    completedOrdersCount,
    failedOrdersCount,
    totalTips,
    highestCombo,
    floatingTexts,
    players,
  } = simulationState;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const calculateStars = () => {
    const [s1, s2, s3] = simulationState.level.starThresholds;
    if (score >= s3) return 3;
    if (score >= s2) return 2;
    if (score >= s1) return 1;
    return 0;
  };

  const stars = calculateStars();

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-2 sm:p-4 select-none">
      {/* Top Section: Active Orders Queue & Score/Timer HUD */}
      <div className="flex justify-between items-start gap-2 w-full">
        {/* Orders Queue Carousel */}
        <div className="flex gap-2 overflow-x-auto max-w-[68vw] sm:max-w-[75vw] pb-1 no-scrollbar pointer-events-auto">
          {activeOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {activeOrders.length === 0 && (
            <div className="bg-[#262626]/80 border border-[#3a3a3a] px-3 py-1.5 rounded-lg text-xs text-[#a3a3a3] backdrop-blur">
              Đang đợi đơn khách hàng...
            </div>
          )}
        </div>

        {/* Score & Timer Panel */}
        <div className="flex flex-col items-end gap-1.5 shrink-0 pointer-events-auto">
          {/* Match Timer */}
          <div className="flex items-center gap-1.5 bg-[#262626]/90 border border-[#3a3a3a] px-3 py-1.5 rounded-xl shadow-lg backdrop-blur">
            <span className="text-base sm:text-lg">⏱</span>
            <span
              className={`text-base sm:text-xl font-black tabular-nums ${
                timeRemaining <= 30 ? 'text-[#ef4444] animate-pulse' : 'text-[#ececec]'
              }`}
            >
              {timeFormatted}
            </span>
          </div>

          {/* Current Score & Combo */}
          <div className="flex items-center gap-2 bg-[#262626]/90 border border-[#3a3a3a] px-3 py-1.5 rounded-xl shadow-lg backdrop-blur">
            {combo > 1 && (
              <span className="bg-[#eab308] text-black text-xs font-black px-1.5 py-0.5 rounded-md animate-bounce">
                x{combo}
              </span>
            )}
            <div className="flex flex-col items-end leading-none">
              <span className="text-[10px] text-[#a3a3a3] font-semibold">ĐIỂM</span>
              <span className="text-base sm:text-lg font-black text-white">{score}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Score and Warning Texts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            style={{
              left: `${Math.min(90, Math.max(10, ft.x * 10))}%`,
              top: `${Math.min(80, Math.max(20, ft.y * 12))}%`,
              color: ft.color,
            }}
            className="absolute font-black text-base sm:text-xl drop-shadow-md transition-all -translate-x-1/2"
          >
            {ft.text}
          </div>
        ))}
      </div>

      {/* Quick Chat Overlay Modal */}
      {showQuickChat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-4 w-full max-w-sm shadow-2xl flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-[#3a3a3a] pb-2">
              <h3 className="text-base font-bold text-white">Tin nhắn nhanh</h3>
              <button
                onClick={() => setShowQuickChat(false)}
                className="text-[#a3a3a3] hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
              {QUICK_CHAT_MESSAGES.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onQuickChatSelect?.(msg);
                    setShowQuickChat(false);
                  }}
                  className="bg-[#303030] hover:bg-[#404040] active:scale-95 text-left text-xs p-2.5 rounded-xl border border-[#3a3a3a] text-[#ececec] font-medium transition"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pause Dialog Modal */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-2xl p-6 w-full max-w-xs shadow-2xl flex flex-col gap-4 text-center">
            <h2 className="text-xl font-black text-white">Tạm dừng</h2>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={onResumeClick}
                className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm active:scale-95 transition"
              >
                Tiếp tục
              </button>
              <button
                onClick={onRestartClick}
                className="w-full py-2.5 rounded-xl bg-[#303030] hover:bg-[#404040] text-white font-semibold text-sm active:scale-95 transition"
              >
                Chơi lại
              </button>
              <button
                onClick={onExitClick}
                className="w-full py-2.5 rounded-xl bg-[#303030] hover:bg-[#404040] text-white font-semibold text-sm active:scale-95 transition"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Completed Results Modal */}
      {status === 'completed' && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#262626] border border-[#3a3a3a] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Kết quả màn chơi</h2>

            {/* Star Rating display */}
            <div className="flex gap-2 text-3xl sm:text-4xl my-1">
              <span className={stars >= 1 ? 'text-[#eab308]' : 'text-neutral-600'}>★</span>
              <span className={stars >= 2 ? 'text-[#eab308]' : 'text-neutral-600'}>★</span>
              <span className={stars >= 3 ? 'text-[#eab308]' : 'text-neutral-600'}>★</span>
            </div>

            {/* Score summary cards */}
            <div className="grid grid-cols-2 gap-2.5 w-full text-left">
              <div className="bg-[#1a1a1a] p-3 rounded-xl border border-[#3a3a3a]">
                <div className="text-[11px] text-[#a3a3a3]">TỔNG ĐIỂM</div>
                <div className="text-xl font-black text-white">{score}</div>
              </div>
              <div className="bg-[#1a1a1a] p-3 rounded-xl border border-[#3a3a3a]">
                <div className="text-[11px] text-[#a3a3a3]">TIỀN THƯỞNG TIP</div>
                <div className="text-xl font-black text-[#22c55e]">+{totalTips}đ</div>
              </div>
              <div className="bg-[#1a1a1a] p-3 rounded-xl border border-[#3a3a3a]">
                <div className="text-[11px] text-[#a3a3a3]">ĐƠN THÀNH CÔNG</div>
                <div className="text-xl font-black text-white">{completedOrdersCount}</div>
              </div>
              <div className="bg-[#1a1a1a] p-3 rounded-xl border border-[#3a3a3a]">
                <div className="text-[11px] text-[#a3a3a3]">CHUỖI COMBO TỐI ĐA</div>
                <div className="text-xl font-black text-[#eab308]">x{highestCombo}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 w-full mt-2">
              {onNextLevelClick && stars > 0 && (
                <button
                  onClick={onNextLevelClick}
                  className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm active:scale-95 transition"
                >
                  Cấp độ tiếp theo
                </button>
              )}
              <button
                onClick={onRestartClick}
                className="w-full py-2.5 rounded-xl bg-[#303030] hover:bg-[#404040] text-white font-semibold text-sm active:scale-95 transition"
              >
                Chơi lại
              </button>
              <button
                onClick={onExitClick}
                className="w-full py-2.5 rounded-xl bg-[#303030] hover:bg-[#404040] text-white font-semibold text-sm active:scale-95 transition"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function OrderCard({ order }: { order: CustomerOrder }) {
  const recipe = RECIPES[order.recipeId];
  const timeRatio = Math.max(0, order.remainingTime / order.duration);

  let barColor = 'bg-[#22c55e]';
  if (order.urgency === 'urgent') barColor = 'bg-[#eab308]';
  if (order.urgency === 'critical') barColor = 'bg-[#ef4444] animate-pulse';

  return (
    <div className="bg-[#262626]/95 border border-[#3a3a3a] rounded-xl p-2 min-w-[130px] sm:min-w-[150px] shadow-lg flex flex-col gap-1 backdrop-blur shrink-0">
      {/* Title & Icon */}
      <div className="flex items-center gap-1.5">
        <span className="text-base sm:text-lg">{recipe?.icon || '🍽'}</span>
        <span className="text-xs font-bold text-[#ececec] truncate">{order.nameVi}</span>
      </div>

      {/* Ingredient Badges */}
      <div className="flex gap-1 flex-wrap py-0.5">
        {order.requiredIngredients.map((ing, i) => (
          <span
            key={i}
            className="text-[10px] bg-[#1a1a1a] px-1.5 py-0.5 rounded text-[#ececec] border border-[#3a3a3a]"
          >
            {ing.type}
          </span>
        ))}
      </div>

      {/* Time Remaining Bar */}
      <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden mt-0.5">
        <div
          style={{ width: `${timeRatio * 100}%` }}
          className={`h-full ${barColor} transition-all duration-300`}
        />
      </div>
    </div>
  );
}
