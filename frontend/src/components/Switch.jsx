import React, { useState } from "react";

function Switch({ isToggled, onToggle }) {
  
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isToggled}
        onChange={onToggle}
        // defaultChecked={true}
        className="sr-only peer"
      />
      <div
        className="relative w-11 h-6
          rounded-full peer 
         peer-checked:after:translate-x-full  after:absolute after:top-[1px] 
         after:start-[1px] after:bg-red-900  
         after:border after:rounded-full after:h-5 after:w-5 after:transition-all
         bg-white  border border-gray-200  peer-checked:after:bg-blue-900"
      ></div>
    </label>
  );
}
export default Switch;
