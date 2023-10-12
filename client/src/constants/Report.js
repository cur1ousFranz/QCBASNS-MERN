export const REPORT = {
  NoRecord: "NoRecord",
  Present: "Present",
  Absent: "Absent",
  Late: "Late",
  Cutting: "Cutting",
  Halfday: "Halfday",
  Monthly: "Monthly",
  Weekly: "Weekly",
};

export const Present = () => {
  return <div className="w-fit mt-1 p-1.5 h-fit border border-gray-400"></div>;
};

export const Absent = () => {
  return <div className="w-fit border mt-1 p-1.5 h-fit bg-black"></div>;
};

export const Cutting = () => {
  return <div className="px-1 text-xs font-bold mt-0.5">X</div>;
};

export const Late = () => {
  return <div className="w-fit border mt-1 p-1.5 h-fit bg-red-500"></div>;
};

export const Halfday = () => {
  return (
    <div className="relative border border-black w-full h-fit mt-1 p-1.5">
      <div className="absolute left-0 top-0 w-full h-1/2 bg-black"></div>
      <div className="absolute left-0 bottom-0 w-full h-1/2 bg-white"></div>
    </div>
  );
};
