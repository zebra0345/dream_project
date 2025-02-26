import React from "react";

export default function DataLabel({ label }) {
  return (
    <div className="px-4 py-2 rounded-md bg-yellow-100 hover:bg-my-yellow transition duration-300 ease-in select-none  text-hmy-blue-1 text-center font-bold">
      {label}
    </div>
  );
}