const Sidebar = () => {
    return (
      <div className=" w-[240px] ">
        <div className="h-[120px] w-[240px] flex justify-center items-center "><img className="h-[100px] w-[210px]" src="/arogya7.png" /></div>
        <div className="h-[609px] w-[240px] flex justify-center ">
          <div className="h-[530px] w-[215px] ">
            <ul>
              {/* <li><div class="relative group">
         <a class="text-md active:font-bold hover:bg-gray-100 hover:text-black rounded-lg h-[55px] flex justify-center items-center font-bold text-neutral-700
  text-center w-full no-underline sm:w-auto sm:pr-4 sm:py-1" >
      Dropdown
      </a>
  
       <div class="absolute z-10 hidden bg-grey-200 group-hover:block">
         <div class="w-full bg-white shadow-lg">
              <div class="dropdown-menu">
              
                <ul>
                <li><a href="/first" class=" dropdown-item">First </a></li>
                <li><a href="/second" class=" dropdown-item">Second </a></li>
                <li><a href="/third" class=" dropdown-item">Third </a></li>
                <li><a href="/fourth" class=" dropdown-item">Fourth </a></li>
                </ul>
              </div>
            </div>
        </div>
      </div></li> */}
              <ul class="relative">
                <li class="dropdown">
                  <div class="hover:bg-gray-100 hover:text-black rounded-lg h-[55px] w-[210px] flex justify-center items-center font-bold text-neutral-700 cursor-pointer">
                    <div class="h-[45px] w-[200px] flex justify-start items-center">
                      <div class="h-[35px] w-[35px] flex justify-center items-center"></div>
                      <div class="">Master</div>
                    </div>
                  </div>
                  <ul class="dropdown-menu absolute hidden bg-white z-10 shadow-lg mt-1 scroll-my-px rounded-lg py-2 border-solid border-2 border-stone-200 ml-28">
                    <li><a href="#" class="block  w-[210px] px-4 py-2 hover:bg-gray-100">Search Patient</a></li>
                    <li><a href="#" class="block w-[210px] px-4 py-2 hover:bg-gray-100">Search Doctor</a></li>
                  </ul>
                </li>
              </ul>
  
              <li><div className="hover:bg-gray-100 hover:text-black rounded-lg h-[55px] w-[210px] flex justify-center items-center font-bold text-neutral-700 "><div className="h-[45px] w-[200px] flex justify-start items-center"><div className="h-[35px] w-[35px] flex justify-center items-center"></div><div className="">Reception</div></div></div></li>
              <li><div className="hover:bg-gray-100 hover:text-black rounded-lg h-[55px] w-[210px] flex justify-center items-center font-bold text-neutral-700 "><div className="h-[45px] w-[200px] flex justify-start items-center"><div className="h-[35px] w-[35px] flex justify-center items-center"></div><div className="">Billing</div></div></div></li>
              <li><div className="hover:bg-gray-100 hover:text-black rounded-lg h-[55px] w-[210px] flex justify-center items-center font-bold text-neutral-700 "><div className="h-[45px] w-[200px] flex justify-start items-center"><div className="h-[35px] w-[35px] flex justify-center items-center"></div><div className="">Diagnostic</div></div></div></li>
              <li><div className="hover:bg-gray-100 hover:text-black rounded-lg h-[55px] w-[210px] flex justify-center items-center font-bold text-neutral-700 "><div className="h-[45px] w-[200px] flex justify-start items-center"><div className="h-[35px] w-[35px] flex justify-center items-center"></div><div className="">Pharmacy</div></div></div></li>
              <li><div className="hover:bg-gray-100 hover:text-black rounded-lg h-[55px] w-[210px] flex justify-center items-center font-bold text-neutral-700 "><div className="h-[45px] w-[200px] flex justify-start items-center"><div className="h-[35px] w-[35px] flex justify-center items-center"></div><div className="">HR Management</div></div></div></li>
              <li><div className="hover:bg-gray-100 hover:text-black rounded-lg h-[55px] w-[210px] flex justify-center items-center font-bold text-neutral-700 "><div className="h-[45px] w-[200px] flex justify-start items-center"><div className="h-[35px] w-[35px] flex justify-center items-center"></div><div className="">Store Management</div></div></div></li>
              <li><div className="hover:bg-gray-100 hover:text-black rounded-lg h-[55px] w-[210px] flex justify-center items-center font-bold text-neutral-700 "><div className="h-[45px] w-[200px] flex justify-start items-center"><div className="h-[35px] w-[35px] flex justify-center items-center"></div><div className="">Account Management</div></div></div></li>
              <li><div className="hover:bg-gray-100 hover:text-black rounded-lg h-[55px] w-[210px] flex justify-center items-center font-bold text-neutral-700 "><div className="h-[45px] w-[200px] flex justify-start items-center"><div className="h-[35px] w-[35px] flex justify-center items-center"></div><div className="">Report</div></div></div></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
  
  export default Sidebar;