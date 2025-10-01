const Sidebar_Master=()=>{
    return(
      <div className=" w-[240px] ">
        <div className="h-[120px] w-[240px] flex justify-center items-center "><img className="h-[100px] w-[210px]" src="/arogya7.png" /></div>
        <div className="h-[609px] w-[240px] flex justify-center ">
          <div className="h-[530px] w-[215px] ">
          <ul>
            <li><div className="hover:bg-gray-100 hover:text-black rounded-lg h-[55px] w-[210px] flex justify-center items-center font-bold text-neutral-700 "><div className="h-[45px] w-[200px] flex justify-start items-center"><div className="h-[35px] w-[35px] flex justify-center items-center"></div><div className=""><a href="departmentMaster">Department</a></div></div></div></li>
            <li><div className="hover:bg-gray-100 hover:text-black rounded-lg h-[55px] w-[210px] flex justify-center items-center font-bold text-neutral-700 "><div className="h-[45px] w-[200px] flex justify-start items-center"><div className="h-[35px] w-[35px] flex justify-center items-center"></div><div className=""><a href="doctorMaster">Doctor</a></div></div></div></li>
          </ul>
          </div>
        </div>
      </div>
    )
  }

  export default Sidebar_Master;