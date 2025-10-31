import "./_book.scss";
import BookFilter from "./components/filter/Filter";
import Navbar from "./components/navbar/Navbar";
import { IoIosArrowForward } from "react-icons/io";
import { FiPlus, FiMinus } from "react-icons/fi";
import TransactionsGroup from "./components/transactionsGroup/TransactionsGroup";
import { useEffect, useState } from "react";
import instance from "../../instance";
import { useNavigate, useParams } from "react-router-dom";

interface Entries {
  amount: number;
  balanceAfter: number;
  categoryName: null;
  createdAtDate: string;
  createdAtTime: string;
  createdBy: string;
  entryType: number;
  id: string;
  name: string;
  paymentMethodName: null;
}
export interface GroupedEntries {
  entries?: Entries[];
  groupDate: string;
}
export interface BookEntries {
  groupedEntries?: GroupedEntries[];
  id: string;
  name: string;
  netBalance: number;
  totalEntries: number;
  totalIn: number;
  totalOut: number;
}

const Book = () => {
  const [bookData, setBookData] = useState<BookEntries | null>(null);
  const { id } = useParams();
  const navigate = useNavigate()
  console.log(id);
  useEffect(() => {
    instance.get(`/api/cashbook/${id}`).then((response) => {
      console.log(response);
      setBookData(response.data);
    });
  }, [id]);
  const handleNavigate = (entrytype:string)=> {
    console.log(entrytype);
    if(entrytype == "in"){
      navigate(`add-cash-entry?type=in`)
    }
    else{
      navigate(`add-cash-entry?type=out`)
    }
  }
  return (
    <main className="book-main">
      <Navbar />
      <BookFilter />
      <section className="net-balance">
        <div className="net">
          <p>Net Balance</p>
          <p>{bookData?.netBalance}</p>
        </div>
        <div className="in-out">
          <p>
            <span>Total In</span>
            <span className="text-success">{bookData?.totalIn}</span>
          </p>
          <p>
            <span>Total Out</span>
            <span className="text-danger">{bookData?.totalOut}</span>
          </p>
        </div>
        <button className="btn view-reports">
          <p>View reports</p>
          <IoIosArrowForward />
        </button>
      </section>
      <div className="entries-line">
        <span></span>
        <span>Showing {bookData?.totalEntries} entries</span>
        <span></span>
      </div>
      <TransactionsGroup entries={bookData?.groupedEntries} />
      <footer>
        <button className="btn" onClick={()=>handleNavigate("in")}>
          <FiPlus />
          <span>CASH IN</span>
        </button>
        <button className="btn" onClick={()=>handleNavigate("out")}>
          <FiMinus />
          <span>CASH OUT</span>
        </button>
      </footer>
    </main>
  );
};

export default Book;
