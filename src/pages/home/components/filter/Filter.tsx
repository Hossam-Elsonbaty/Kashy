import { FiFilter } from "react-icons/fi";
import { IoSearchSharp } from "react-icons/io5";
import './_filter.scss'
const Filter = () => {
  return (
    <section className="filter-home bg-white">
      <p>Your Books</p>
      <div className="btns">
        <button className="btn"><FiFilter /></button>
        <button className="btn"><IoSearchSharp /></button>
      </div>
    </section>
  )
}

export default Filter