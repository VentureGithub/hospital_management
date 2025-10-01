// import { BsCardHeading } from "react-icons/bs";

// const Heading = ({headingText}) => {
//     return (
//         <div className="flex justify-start items-center p-4 ">
//         <BsCardHeading className="text-blue-500 text-2xl md:text-3xl mr-3" />
//         <div className="font-semibold text-gray-800 text-xl md:text-2xl ">
//             {headingText}
//         </div>
//     </div>
//     )
//   };
//   export default Heading;



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