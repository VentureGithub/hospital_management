import { BsCardHeading } from "react-icons/bs";

const Heading = ({ headingText }) => {
  
  const isSalaryDeduction = headingText === "Salary Deduction";
  const colorClass = isSalaryDeduction ? "text-red-500" : "text-sky-500";

  return (
    <div className="flex justify-start items-center mb-4">
      {/* <img src="/header.png" className="text-blue-500 h-[30px] w-[30px] mr-3" /> */}
      <div className={`font-semibold ${colorClass} text-sm md:text-lg`}>
        {headingText}
      </div>
    </div>
  );
};

export default Heading;
