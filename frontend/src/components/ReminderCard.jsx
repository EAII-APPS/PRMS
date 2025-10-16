import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

/*   const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();

    if (sectorDate){
      if(sectorDate < now) {
        setError('The dates cannot be in the past.');
      }
      else{
        setError('');
        const divisionDateToSave = null;
        onSave(title, sectorDate, divisionDateToSave);
      }
    } 
    else{
      if (divisionDate < now){
        setError('The dates cannot be in the past.');}
      else{
        setError('');
        const sectorDateToSave = null;
        onSave(title, sectorDate, sectorDateToSave);      }
    }
  }; */

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {user && user.monitoring_id && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Submission Date of Sector:</label>
          <DatePicker
            selected={sectorDate}
            onChange={(date) => setSectorDate(date)}
            showTimeSelect
            dateFormat="Pp"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            wrapperClassName="w-full"
            popperClassName="shadow-lg"
          />
          {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
        </div>
      )}
      {user && user.sector_id && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Submission Date of Division:</label>
          <DatePicker
            selected={divisionDate}
            onChange={(date) => setDivisionDate(date)}
            showTimeSelect
            dateFormat="Pp"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            wrapperClassName="w-full"
            popperClassName="shadow-lg"
          />
          {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
        </div>
      )}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReminderCard;
