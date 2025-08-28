import React, { useEffect, useRef, useState } from 'react';

interface GestureControllerProps {
  onGesture: (gesture: 'swipeLeft' | 'swipeRight' | 'swipeUp' | 'swipeDown' | 'pinch' | 'tap') => void;
  isEnabled: boolean;
}

export const GestureController: React.FC<GestureControllerProps> = ({ onGesture, isEnabled }) => {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [isGestureActive, setIsGestureActive] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };
        setIsGestureActive(true);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || e.changedTouches.length !== 1) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      
      const minSwipeDistance = 50;
      const maxSwipeTime = 500;

      if (deltaTime < maxSwipeTime) {
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
          // 水平滑动
          onGesture(deltaX > 0 ? 'swipeRight' : 'swipeLeft');
        } else if (Math.abs(deltaY) > minSwipeDistance) {
          // 垂直滑动
          onGesture(deltaY > 0 ? 'swipeDown' : 'swipeUp');
        } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
          // 点击
          onGesture('tap');
        }
      }

      touchStartRef.current = null;
      setIsGestureActive(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      // 防止页面滚动
      if (isGestureActive) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isEnabled, onGesture, isGestureActive]);

  return null;
};