// import Header from "../(components)/header";
// import Searchbar from "../(components)/serachBar";
// import Sidebar from "../(components)/sidebar"


// const LayoutForm = ({ children }) => {
//     return (
//         <div className="h-full w-full flex">
//             <Sidebar />
//             <div className={`w-full flex-1 flex flex-col`}>
//                 <Header />
//                 <div className="h-[calc(100%-64px)] px-9 py-4 ">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default LayoutForm;

import { Toaster } from 'sonner';  // Import the Toaster component from Sonner
import Header from "../(components)/header";
import Searchbar from "../(components)/serachBar";
import Sidebar from "../(components)/sidebar";

const LayoutForm = ({ children }) => {
    return (
        <>
        <div className="h-full w-full flex">
            <Sidebar />
            <div className={`w-full flex-1 flex flex-col lg:ml-72`}>
                <Header />
                <div className="h-[calc(100%-64px)] px-9 py-4">
                    {children}
                </div>
            </div>
            <Toaster  position="top-right"/> 
        </div>
        </>
    );
}

export default LayoutForm;