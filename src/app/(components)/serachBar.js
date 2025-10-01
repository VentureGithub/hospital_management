const Searchbar = () => {
  return (
    <div className="h-[15%] w-full  flex justify-end">
      <div className="h-full w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl flex space-x-4 items-center px-4  justify-end">
        <div className="h-[90%] w-[90%] flex items-center font-medium justify-end">

          <form className="max-w-md mx-auto  w-[100%]">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
              <input type="search" id="default-search" className="block h-[40px]  w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." required />
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Searchbar;