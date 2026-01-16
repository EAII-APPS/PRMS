import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendarAlt, faFlag, faCheck } from "@fortawesome/free-solid-svg-icons";

const ReminderCard = ({ onSave, onClose, user }) => {
  const [title, setTitle] = useState('');
  const [sectorDate, setSectorDate] = useState(null);
  const [divisionDate, setDivisionDate] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();

    if (sectorDate && sectorDate < now) {
      setError('The sector submission date cannot be in the past.');
    } else if (divisionDate && divisionDate < now) {
      setError('The division submission date cannot be in the past.');
    } else {
      setError('');
      const sectorDateToSave = sectorDate ? sectorDate.toISOString() : null;
      const divisionDateToSave = divisionDate ? divisionDate.toISOString() : null;
      onSave(title, sectorDateToSave, divisionDateToSave);
    }
  };

  return (
    <Card className="w-full shadow-none bg-transparent">
      <CardBody className="p-6">
        <Typography variant="h5" color="blue-gray" className="mb-6 font-bold flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm">
            <FontAwesomeIcon icon={faClock} />
          </div>
          Create New Reminder
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Typography variant="small" color="blue-gray" className="font-bold px-1 opacity-70">
              Reminder Title
            </Typography>
            <Input
              size="lg"
              placeholder="Enter reminder title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="!border-t-blue-gray-200 focus:!border-t-blue-500"
              labelProps={{ className: "hidden" }}
              icon={<FontAwesomeIcon icon={faFlag} className="text-gray-400" />}
            />
          </div>

          {user && user.monitoring_id && (
            <div className="space-y-2">
              <Typography variant="small" color="blue-gray" className="font-bold px-1 opacity-70">
                Submission Date of Sector
              </Typography>
              <div className="relative group">
                <DatePicker
                  selected={sectorDate}
                  onChange={(date) => setSectorDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  required
                  customInput={
                    <div className="w-full flex items-center justify-between p-3 border border-blue-gray-200 rounded-lg bg-white group-focus-within:border-blue-500 transition-colors cursor-pointer">
                      <span className={sectorDate ? "text-blue-gray-900 font-medium" : "text-gray-400"}>
                        {sectorDate ? sectorDate.toLocaleString() : "Select date and time..."}
                      </span>
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                    </div>
                  }
                  wrapperClassName="w-full"
                  popperClassName="shadow-2xl !z-[2000]"
                />
              </div>
              {error && <Typography variant="small" color="red" className="px-1 italic font-medium">{error}</Typography>}
            </div>
          )}

          {user && user.sector_id && (
            <div className="space-y-2">
              <Typography variant="small" color="blue-gray" className="font-bold px-1 opacity-70">
                Submission Date of Division
              </Typography>
              <div className="relative group">
                <DatePicker
                  selected={divisionDate}
                  onChange={(date) => setDivisionDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  required
                  customInput={
                    <div className="w-full flex items-center justify-between p-3 border border-blue-gray-200 rounded-lg bg-white group-focus-within:border-blue-500 transition-colors cursor-pointer">
                      <span className={divisionDate ? "text-blue-gray-900 font-medium" : "text-gray-400"}>
                        {divisionDate ? divisionDate.toLocaleString() : "Select date and time..."}
                      </span>
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                    </div>
                  }
                  wrapperClassName="w-full"
                  popperClassName="shadow-2xl !z-[2000]"
                />
              </div>
              {error && <Typography variant="small" color="red" className="px-1 italic font-medium">{error}</Typography>}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="gradient"
              color="blue"
              className="flex-1 py-3 group flex items-center justify-center gap-2 normal-case text-sm"
            >
              Save Reminder
              <FontAwesomeIcon icon={faCheck} className="hidden group-hover:block animate-in zoom-in" />
            </Button>
            <Button
              type="button"
              variant="text"
              color="blue-gray"
              onClick={onClose}
              className="normal-case font-bold"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default ReminderCard;