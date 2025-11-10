// ProgressBar.jsx
import confetti from 'canvas-confetti'; // optional; remove both this line and the confetti block below if you don't want it
import { useEffect, useRef } from 'react';
import './ProgressBar.css';

export default function ProgressBar({ value = 0, height = 18 }) {
  const fillRef = useRef(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;

    // Trigger animation on next frame for smooth transition
    requestAnimationFrame(() => {
      el.style.width = `${Math.min(100, value)}%`;
    });

    // optional confetti for 100% completion
    if (value >= 100) {
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // confetti lib might not be installed — ignore if missing
      }
    }
  }, [value]);

  return (
    <div className="progress-wrapper" aria-hidden="false" style={{ padding: 8 }}>
      <div className="progress-track" style={{ height }}>
        <div
          ref={fillRef}
          className="progress-fill"
          style={{ width: '0%', height: '100%' }}
          aria-valuenow={value}
        />
      </div>
    </div>
  );
}





