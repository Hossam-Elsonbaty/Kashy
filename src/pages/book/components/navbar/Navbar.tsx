import './_navbar.scss'
import { FaRegFilePdf } from "react-icons/fa6";
import { MdPersonAddAlt } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

const BookNavbar = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const book_name = searchParams.get("name");
  const navigate = useNavigate();
  return (
    <nav className='book-navbar'>
      <div className='left flex gap-3 items-center'>
          <button onClick={()=>navigate(-1)}>
            <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
          </button>
          <div className="flex flex-col">
            <p>{book_name}</p>
            <p>Add Member, Book Activity</p>
          </div>
      </div>
      <div className='right'>
        <button className='btn'><MdPersonAddAlt className='icon'/></button>
        <button className='btn'><FaRegFilePdf className='icon'/></button>
        <button className='btn'><BsThreeDotsVertical className='icon'/></button>
      </div>
    </nav>
  )
}

export default BookNavbar