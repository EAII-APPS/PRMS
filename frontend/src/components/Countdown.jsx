import React, { useState, useEffect } from 'react';

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

  const timerComponents = [];
  const isWarning = timeLeft.days !== undefined && timeLeft.days < 2;

  Object.keys(timeLeft).forEach(interval => {
    timerComponents.push(
      <div key={interval}>
        <div className={`time-box ${isWarning ? 'bggggg' : ''}`}>
          <div className="time">{timeLeft[interval]}</div>
        </div>
        <div className="time-box1">
          <div className="label">{interval}</div>
        </div>
      </div>
    );
  });

  return (
    <div className="countdown">
      {timerComponents.length ? timerComponents : <span></span>}
    </div>
  );
};

export default Countdown;
