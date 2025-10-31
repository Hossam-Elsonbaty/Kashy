import './_filter.scss';
import { MdOutlineDateRange } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
const BookFilter = () => {
  return (
    <div className='filter-swiper'>
      <div className='cell'>
        <MdOutlineDateRange/>
        <p>Select date</p>
        <IoMdArrowDropdown/>
      </div>
      <div className='cell'>
        <MdOutlineDateRange/>
        <p>Select date</p>
        <IoMdArrowDropdown/>
      </div>
      <div className='cell'>
        <MdOutlineDateRange/>
        <p>Select date</p>
        <IoMdArrowDropdown/>
      </div>
    </div>
  )
}

export default BookFilter