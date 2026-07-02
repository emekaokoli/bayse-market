import { useState } from "react";

export default function YesNoToggle() {
  const [selected, setSelected] = useState(true);

  const pillBase =
    "w-[50px] h-[27px] rounded-[3px] flex items-center justify-center text-[8px] font-bold transition-colors";

  return (
    <div className="flex items-center justify-center py-5">
      <div className="inline-flex items-center gap-2.5 w-[72px] h-[31px] p-[6px] rounded-[5px] bg-gray-100">
        <button
          onClick={() => setSelected(true)}
          className={`${pillBase} ${selected ? "bg-white text-blue-600 shadow-sm" : "bg-transparent text-gray-500"
            }`}
        >
          Yes
        </button>
        <button
          onClick={() => setSelected(false)}
          className={`${pillBase} ${!selected ? "bg-white text-blue-600 shadow-sm" : "bg-transparent text-gray-500"
            }`}
        >
          No
        </button>
      </div>
    </div>
  );
}