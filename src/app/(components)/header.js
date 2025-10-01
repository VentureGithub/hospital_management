


'use client';
import { useEffect, useState } from 'react';
import { IoIosLogOut } from "react-icons/io";
import { MdHome } from "react-icons/md";
import apiClient from "@/app/config";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";

const Header = () => {
  const [loginInfo, setLoginInfo] = useState({ username: '', loginTime: '' });
  // Removed countdown timer per requirement
  const router = useRouter();

  useEffect(() => {
    // Fetch login info
    const fetchLoginInfo = async () => {
      try {
        const response = await apiClient.get('user/loggedInUserInfo');
        if (response.status === 200) {
          const data = response.data;
          setLoginInfo({
            username: data.username || '',
            loginTime: data.loginTime || ''
          });

          // Check if this is a new login (reset timer)
          const isLoggedIn = localStorage.getItem('isLoggedIn');
          if (!isLoggedIn) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('elapsedTime', '0'); // Reset elapsed time
            setElapsedTime(0);
          } else {
            // If already logged in, load saved time
            const savedTime = localStorage.getItem('elapsedTime');
            setElapsedTime(Number(savedTime) || 0);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchLoginInfo();

    // Removed timer logic and cleanup
    return () => {};
  }, []);

  const handleHome = () => {
    const role = localStorage.getItem('role');
    if (role === 'SUPERADMIN' || role === 'ADMIN') {
      router.push('/dash');
    } else if (role === 'RECEPTION') {
      router.push('/receptiondashboard');
    }
  };

  // const handleLogOut = () => {
  //   localStorage.removeItem('role');
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('elapsedTime'); // Clear saved timer
  //   localStorage.removeItem('isLoggedIn'); // Clear login state
  //   router.push('/');
  // };

  const handleLogOut = async () => {
    try {
      await apiClient.get('user/logout');
    } catch (error) {
      console.error('Error during logout API call:', error);
      // alert('Logout failed. Please try again.');
    }

    localStorage.removeItem('role');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('elapsedTime');
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  // Removed formatTime utility

  return (
    <div className="h-[48px] w-full flex justify-between p-2 bg-gray-50 shadow-sm sticky top-0">
      <div
        className="h-[90%] w-[12%] flex items-center justify-between font-medium sm:text-sm cursor-pointer"
        onClick={handleHome}
      >
        <MdHome className="text-blue-700 font-semibold" size={24} />
        <IoIosArrowForward className="text-gray-700" size={18} />
        <p className="text-md text-gray-700 font-normal">Home</p>
     
        {/* <p className="text-md text-blue-700 font-normal">Reception</p> */}
      </div>
      {/* Removed countdown display */}
      <div
        className="h-[90%] w-[20%] flex items-center justify-end font-medium sm:text-sm cursor-pointer"
        onClick={handleLogOut}
      >
        <IoIosLogOut className="text-red-700" size={18} />
        <p className="text-md text-red-700">Logout</p>
      </div>
    </div>
  );
};

export default Header;




// 'use client';
// import { useEffect, useState } from 'react';
// import { IoIosLogOut } from "react-icons/io";
// import { MdHome } from "react-icons/md";
// import apiClient from "@/app/config";
// import { useRouter } from "next/navigation";
// import { IoIosArrowForward } from "react-icons/io";

// const Header = () => {
//   const [loginInfo, setLoginInfo] = useState({ username: '', loginTime: '' });
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchLoginInfo = async () => {
//       try {
//         const response = await apiClient.get('user/loggedInUserInfo');
//         if (response.status === 200) {
//           const data = response.data;
//           setLoginInfo({
//             username: data.username || '',
//             loginTime: data.loginTime || ''
//           });

//           const isLoggedIn = localStorage.getItem('isLoggedIn');
//           if (!isLoggedIn) {
//             localStorage.setItem('isLoggedIn', 'true');
//             localStorage.setItem('elapsedTime', '0');
//             setElapsedTime(0);
//           } else {
//             const savedTime = localStorage.getItem('elapsedTime');
//             setElapsedTime(Number(savedTime) || 0);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching login info:', error);
//       }
//     };

//     fetchLoginInfo();

//     const timerId = setInterval(() => {
//       setElapsedTime((prevTime) => {
//         if (prevTime >= 28800) { // 8 hours
//           clearInterval(timerId);
//           handleLogOut();
//           return prevTime;
//         }
//         const updatedTime = prevTime + 1;
//         localStorage.setItem('elapsedTime', updatedTime.toString());
//         return updatedTime;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, []);

//   const handleHome = () => {
//     const role = localStorage.getItem('role');
//     if (role === 'SUPERADMIN' || role === 'ADMIN') {
//       router.push('/dash');
//     } else if (role === 'RECEPTION') {
//       router.push('/receptiondashboard');
//     }
//   };

//   const handleLogOut = async () => {
//     try {
//       await apiClient.get('user/logout');
//       localStorage.removeItem('role');
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('elapsedTime');
//       localStorage.removeItem('isLoggedIn');
//       router.push('/');
//     } catch (error) {
//       console.error('Error during logout:', error);
//       router.push('/');
//     }
//   };

//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full bg-gray-50 shadow-sm">
//       <div className="max-w-[2520px] mx-auto">
//         <div className="flex items-center justify-between px-4 py-2">
//           {/* Left Section - Navigation */}
//           <div className="flex items-center space-x-2 md:space-x-4">
//             <button 
//               onClick={handleHome}
//               className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
//               aria-label="Go to home"
//             >
//               <MdHome className="text-blue-700 h-5 w-5 md:h-6 md:w-6" />
//               <span className="hidden sm:inline text-gray-700 text-sm font-medium">
//                 Home
//               </span>
//             </button>

//           </div>

//           {/* Center Section - Timer */}
//           <div className="hidden sm:block flex-1 max-w-[300px] mx-4">
//             <div className="bg-white rounded-full px-4 py-1.5 shadow-sm border text-center">
//               <p className="text-sm md:text-base text-blue-700 font-medium whitespace-nowrap">
//                 {`Time: ${formatTime(elapsedTime)}`}
//               </p>
//             </div>
//           </div>

//           {/* Mobile Timer */}
//           <div className="sm:hidden text-xs text-blue-700 font-medium">
//             {formatTime(elapsedTime)}
//           </div>

//           {/* Right Section - Logout */}
//           <button
//             onClick={handleLogOut}
//             className="flex items-center space-x-1 hover:bg-red-50 rounded-lg p-2 transition-colors"
//             aria-label="Logout"
//           >
//             <IoIosLogOut className="text-red-600 h-5 w-5" />
//             <span className="hidden sm:inline text-red-600 text-sm font-medium">
//               Logout
//             </span>
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
