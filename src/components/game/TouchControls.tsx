'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PlayerInput } from '../../game/simulation/PlayerSystem';

interface TouchControlsProps {
  onInputChange: (input: Partial<PlayerInput>) => void;
  onQuickChatClick?: () => void;
  onPingClick?: () => void;
  onSwitchChefClick?: () => void;
  onPauseClick?: () => void;
  isLeftHanded?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onInputChange,
  onQuickChatClick,
  onPingClick,
  onSwitchChefClick,
  onPauseClick,
  isLeftHanded = false,
}) => {
  const [joystickActive, setJoystickActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const activeTouchId = useRef<number | null>(null);

  const currentInput = useRef<PlayerInput>({
    moveX: 0,
    moveY: 0,
    isDashing: false,
    actionPickDrop: false,
    actionInteract: false,
    actionThrow: false,
  });

  const handleJoystickPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (activeTouchId.current !== null) return;
    activeTouchId.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setJoystickActive(true);
    updateJoystickPos(e.clientX, e.clientY);
  };

  const handleJoystickPointerMove = (e: React.PointerEvent) => {
    if (activeTouchId.current !== e.pointerId) return;
    updateJoystickPos(e.clientX, e.clientY);
  };

  const handleJoystickPointerUp = (e: React.PointerEvent) => {
    if (activeTouchId.current !== e.pointerId) return;
    activeTouchId.current = null;
    setJoystickActive(false);
    setKnobPos({ x: 0, y: 0 });
    currentInput.current.moveX = 0;
    currentInput.current.moveY = 0;
    onInputChange({ moveX: 0, moveY: 0 });
  };

  const updateJoystickPos = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxRadius = rect.width / 2 - 10;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let normX = 0;
    let normY = 0;

    if (distance > 0) {
      normX = dx / distance;
      normY = dy / distance;
    }

    const clampedDist = Math.min(distance, maxRadius);
    const kx = normX * clampedDist;
    const ky = normY * clampedDist;

    setKnobPos({ x: kx, y: ky });

    const moveX = clampedDist > 8 ? normX : 0;
    const moveY = clampedDist > 8 ? normY : 0;

    currentInput.current.moveX = moveX;
    currentInput.current.moveY = moveY;
    onInputChange({ moveX, moveY });
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none touch-none z-20 flex flex-col justify-between p-3">
      {/* Top Bar for Secondary buttons */}
      <div className="flex justify-between items-center w-full pointer-events-auto">
        <div className="flex gap-2">
          {onSwitchChefClick && (
            <button
              onClick={onSwitchChefClick}
              className="px-3 py-1.5 rounded-lg bg-[#303030]/90 active:bg-[#404040] border border-[#3a3a3a] text-white text-xs font-semibold shadow backdrop-blur"
            >
              Đổi đầu bếp
            </button>
          )}
          {onQuickChatClick && (
            <button
              onClick={onQuickChatClick}
              className="px-3 py-1.5 rounded-lg bg-[#303030]/90 active:bg-[#404040] border border-[#3a3a3a] text-white text-xs font-semibold shadow backdrop-blur flex items-center gap-1"
            >
              💬 Giao tiếp
            </button>
          )}
          {onPingClick && (
            <button
              onClick={onPingClick}
              className="px-3 py-1.5 rounded-lg bg-[#303030]/90 active:bg-[#404040] border border-[#3a3a3a] text-white text-xs font-semibold shadow backdrop-blur flex items-center gap-1"
            >
              📍 Đánh dấu
            </button>
          )}
        </div>

        {onPauseClick && (
          <button
            onClick={onPauseClick}
            className="w-9 h-9 rounded-lg bg-[#303030]/90 active:bg-[#404040] border border-[#3a3a3a] text-white flex items-center justify-center font-bold text-sm shadow backdrop-blur"
          >
            ⏸
          </button>
        )}
      </div>

      {/* Bottom Controls Area */}
      <div
        className={`flex justify-between items-end w-full pb-2 ${
          isLeftHanded ? 'flex-row-reverse' : ''
        }`}
      >
        {/* Virtual Joystick */}
        <div
          ref={joystickBaseRef}
          onPointerDown={handleJoystickPointerDown}
          onPointerMove={handleJoystickPointerMove}
          onPointerUp={handleJoystickPointerUp}
          onPointerCancel={handleJoystickPointerUp}
          className="pointer-events-auto w-32 h-32 rounded-full bg-white/10 border-2 border-white/20 backdrop-blur-sm flex items-center justify-center relative touch-none shadow-lg active:border-white/40"
        >
          {/* Thumb Knob */}
          <div
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
              transition: joystickActive ? 'none' : 'transform 0.15s ease-out',
            }}
            className="w-14 h-14 rounded-full bg-white/70 border-2 border-white shadow-md"
          />
        </div>

        {/* Action Buttons Cluster */}
        <div className="pointer-events-auto flex flex-col items-end gap-2.5">
          {/* Throw button */}
          <button
            onPointerDown={() => onInputChange({ actionThrow: true })}
            onPointerUp={() => onInputChange({ actionThrow: false })}
            className="w-13 h-13 rounded-full bg-[#303030]/80 active:scale-95 border border-[#3a3a3a] text-white text-xs font-bold shadow-md flex items-center justify-center touch-none select-none backdrop-blur"
          >
            Ném
          </button>

          <div className="flex gap-2.5 items-end">
            {/* Dash Button */}
            <button
              onPointerDown={() => onInputChange({ isDashing: true })}
              onPointerUp={() => onInputChange({ isDashing: false })}
              className="w-14 h-14 rounded-full bg-[#f59e0b]/85 active:scale-95 border-2 border-[#fef08a] text-black text-xs font-black shadow-lg flex items-center justify-center touch-none select-none backdrop-blur"
            >
              Tăng tốc
            </button>

            {/* Pick / Drop Button */}
            <button
              onPointerDown={() => onInputChange({ actionPickDrop: true })}
              onPointerUp={() => onInputChange({ actionPickDrop: false })}
              className="w-16 h-16 rounded-full bg-white/90 active:scale-95 border-2 border-white text-black text-sm font-black shadow-xl flex items-center justify-center touch-none select-none"
            >
              Nhặt/Đặt
            </button>

            {/* Interact Button */}
            <button
              onPointerDown={() => onInputChange({ actionInteract: true })}
              onPointerUp={() => onInputChange({ actionInteract: false })}
              className="w-18 h-18 rounded-full bg-[#22c55e]/90 active:scale-95 border-2 border-[#86efac] text-white text-sm font-black shadow-xl flex items-center justify-center touch-none select-none"
            >
              Tương tác
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
