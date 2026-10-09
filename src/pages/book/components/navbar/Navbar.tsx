import { FaRegFilePdf } from "react-icons/fa6";
// import { MdPersonAddAlt } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import {  useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

const BookNavbar = ({setIsDropdownOpen,book_name,cashbookId}:{setIsDropdownOpen: (open: boolean) => void;book_name:string;cashbookId:string}) => {
  const navigate = useNavigate();
  return (
    <nav className='book-navbar sticky top-0 flex items-center justify-between p-3 bg-white border-b border-gray-200'>
      <div className='left flex gap-3 items-center '>
        <button onClick={()=>navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
        </button>
        <div className="flex flex-col">
          <p className='font-bold text-gray-700'>{book_name}</p>
          {/* <p>Add Member, Book Activity</p> */}
        </div>
      </div>
      <div className='right flex gap-5 items-center '>
        {/* <button className='btn'><MdPersonAddAlt className='icon'/></button> */}
        <button
          className='btn'
          type="button"
          aria-label="Export cashbook report as PDF"
          title="Export PDF report"
          onClick={() => navigate(`/book/${cashbookId}/report`)}
        >
          <FaRegFilePdf className='icon'/>
        </button>
        <button className='btn' onClick={()=>setIsDropdownOpen(true)}><BsThreeDotsVertical className='icon'/></button>
      </div>
    </nav>
  )
}

export default BookNavbar