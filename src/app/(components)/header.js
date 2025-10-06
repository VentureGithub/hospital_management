

'use client';
import { useEffect, useState } from 'react';
import { IoIosLogOut } from "react-icons/io";
import { MdHome, MdLocalHospital } from "react-icons/md";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";

const Header = () => {
  const [userName, setUserName] = useState('Guest');
  const [role, setRole] = useState('');
  const [loginTime, setLoginTime] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem('name') || localStorage.getItem('userName') || 'Guest';
    const storedRole = localStorage.getItem('role') || '';
    const storedLogin = localStorage.getItem('loginTime');
    setUserName(storedName);
    setRole(storedRole);
    setLoginTime(storedLogin ? new Date(storedLogin).toLocaleString() : '');
  }, []);

  const handleHome = () => {
    const userRole = localStorage.getItem('role');
    if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
      router.push('/dash');
    } else if (userRole === 'RECEPTION') {
      router.push('/receptiondashboard');
    }
  };

  const handleLogOut = async () => {
    try {
      // Best-effort logout - API optional; clear client state regardless
      localStorage.removeItem('role');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('elapsedTime');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('name');
      localStorage.removeItem('userName');
      localStorage.removeItem('loginTime');
    } finally {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full lg:w-[calc(100%-2rem)] lg:ml-8 shadow-sm transition-all">
      {/* Gradient bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-[2520px] mx-auto px-4">
          <div className="h-[56px] flex items-center justify-between text-white">
            {/* Brand + Home */}
            <div className="flex items-center gap-3">
              {/* <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <MdLocalHospital className="w-5 h-5" />
              </div> */}
              <button
                onClick={handleHome}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Go to home"
              >
                <MdHome className="w-5 h-5" />
                <IoIosArrowForward className="w-4 h-4 text-blue-100" />
                <span className="text-sm font-medium">Home</span>
              </button>
            </div>

            {/* User chip */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-semibold">{userName?.charAt(0)?.toUpperCase() || 'G'}</span>
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{userName}</p>
                  {role ? (
                    <p className="text-[11px] text-blue-100 uppercase">{role}</p>
                  ) : null}
                </div>
                {loginTime ? (
                  <span className="hidden md:inline text-[11px] text-blue-100">Login: {loginTime}</span>
                ) : null}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogOut}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-1.5 transition-colors"
                aria-label="Logout"
              >
                <IoIosLogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
