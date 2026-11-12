import React, { useEffect } from 'react';

export const Timer = ({ timeLeft, setTimeLeft, onTimeout, active }) => {
  useEffect(() => {
    if (!active) return;

    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, active, onTimeout, setTimeLeft]);

  const isLow = timeLeft <= 5;

  return (
    <div style={{ fontSize: '18px', fontWeight: 'bold', color: isLow ? '#f44336' : '#333' }}>
      Còn {timeLeft} giây
    </div>
  );
};