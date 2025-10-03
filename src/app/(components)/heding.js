
import { BsCardHeading } from "react-icons/bs";

const Heading = ({headingText}) => {
    return (
        <div className="flex justify-start items-center mb-4 ">
        {/* <img src="/header.png" className="text-blue-500 h-[30px] w-[30px] mr-3" /> */}
        <div className="font-semibold text-sky-500 text-sm md:text-lg ">
            {headingText}
        </div>
    </div>
    )
  };
  export default Heading;