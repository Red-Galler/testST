import { FaBell, FaSearch, FaTimes } from "react-icons/fa";


function SearchBox() {
    return (
        <div className="flex justify-center w-full">
            <input
                type="text"
                placeholder="Document zoeken"
                className="w-full sm:w-11/12 lg:w-6/12 px-4 py-3 rounded-md rounded-r-none border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:outline-none transition duration-150 ease-in-out"
            />
            <button className='bg-primary text-white p-4'>
                <FaSearch className='' />
            </button>
        </div>)
}



export default SearchBox;