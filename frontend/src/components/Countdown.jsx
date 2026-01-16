import React, { useState, useEffect } from 'react';
import { Typography } from "@material-tailwind/react";

const Countdown = ({ sectorDate, divisionDate }) => {
  const [targetDate, setTargetDate] = useState(null);

  useEffect(() => {
    if (divisionDate) {
      setTargetDate(divisionDate);
    } else if (sectorDate) {
      setTargetDate(sectorDate);
    }
  }, [sectorDate, divisionDate]);

  const calculateTimeLeft = () => {
    if (!targetDate) return {};
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const isWarning = timeLeft.days !== undefined && timeLeft.days < 2;

  const labels = {
    days: 'Days',
    hours: 'Hrs',
    minutes: 'Min',
    seconds: 'Sec'
  };

  return (
    <div className="flex items-center gap-3 py-2">
      {Object.keys(timeLeft).length > 0 ? (
        Object.entries(timeLeft).map(([key, value]) => (
          <div key={key} className="flex flex-col items-center gap-1 min-w-[64px]">
            <div
              className={`w-full aspect-square flex items-center justify-center rounded-2xl border transition-all duration-300 ${isWarning
                  ? 'bg-red-50 border-red-100 text-red-600 shadow-sm shadow-red-100'
                  : 'bg-blue-50/50 border-blue-100 text-blue-600 shadow-sm shadow-blue-50'
                }`}
            >
              <Typography variant="h4" className="font-bold leading-none tracking-tighter">
                {String(value).padStart(2, '0')}
              </Typography>
            </div>
            <Typography
              variant="small"
              className={`font-bold uppercase tracking-widest text-[9px] ${isWarning ? 'text-red-400' : 'text-blue-gray-300'
                }`}
            >
              {labels[key]}
            </Typography>
          </div>
        ))
      ) : (
        <div className="p-4 bg-red-50 rounded-xl border border-red-100 w-full text-center">
          <Typography variant="small" color="red" className="font-bold uppercase tracking-widest">
            Time Expired
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Countdown;