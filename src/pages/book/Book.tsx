/* eslint-disable @typescript-eslint/no-explicit-any */
import BookFilter from "./components/filter/Filter";
import Navbar from "./components/navbar/Navbar";
import { IoIosArrowForward } from "react-icons/io";
import { FiPlus, FiMinus } from "react-icons/fi";
import TransactionsGroup from "./components/transactionsGroup/TransactionsGroup";
import { useEffect, useState } from "react";
import instance from "../../instance";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ConfirmDelete from "../../components/ConfirmDelete";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/Store";
import { cashbooksAction } from "../../store/slices/cashbooksSlice";
import { Pencil, Trash2 } from "lucide-react";
import DialogDemo from "../../components/DialogDemo";
import { getCashbookById } from "../../store/slices/singleCashbookSlice";
import PageNotFound from "../../components/PageNotFound";
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
  groupedEntries?: GroupedEntries[] ;
  id: string;
  name: string;
  netBalance: number;
  totalEntries: number;
  totalIn: number;
  totalOut: number;
}

const Book = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentCashbook, status } = useSelector((state: any) => state.singleCashbook);
  // const [bookData, setBookData] = useState<BookEntries | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [open, setOpen] = useState(false)
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const { id } = useParams();
  const navigate = useNavigate()
  console.log(id);
  useEffect(() => {
    if (id) {
      dispatch(getCashbookById(id));
    }
    }, [id,dispatch]);
    // if (status === "loading") {
    //   return <Loader/>;
    // }
    if (status === "failed") {
      return <PageNotFound/>;
    }
  const handleNavigate = (entrytype:string)=> {
    console.log(entrytype);
    if(entrytype == "in"){
      navigate(`add-cash-entry?type=in`)
    }
    else{
      navigate(`add-cash-entry?type=out`)
    }
  }
  const handleDeleteEntry = () => {
    console.log(id);
    instance
      .delete(`/api/Cashbook/${id}?deleteRelated=true`)
      .then((response) => {
        console.log(response.data);
        toast.success("Successfully deleted");
        setIsDropdownOpen(false);
        setIsModalOpen(false);
        dispatch(cashbooksAction())
        navigate("/",{replace:true})
      })
      .catch((error) => {
        console.log(error);
        toast.error("Operation failed");
      });
  };
  const handleUpdate = ()=>{
    setIsUpdate(true);
    setOpen(true)
  }
  return (
    <main className="mb-24">
      <Toaster position="top-center"/>
      <ConfirmDelete
        isOpen={isModalOpen}
        handleOpen={() => setIsModalOpen(false)}
        handleDelete={handleDeleteEntry}
      />
      <DialogDemo open={open} onOpenChange={setOpen} isUpdate={isUpdate} book_name={currentCashbook?currentCashbook.name:""} id={id||""}/>
      <Navbar setIsDropdownOpen={setIsDropdownOpen} book_name={currentCashbook?currentCashbook.name:""}/>
      <BookFilter />
      <section className=" bg-gray-100 shadow-xs m-3 rounded-lg">
        <div className=" flex justify-between p-3 border-b border-gray-200">
          <p className="font-bold text-gray-800">Net Balance</p>
          <p className="font-bold text-gray-800">{currentCashbook?.netBalance}</p>
        </div>
        <div className="p-3 border-b border-gray-200 text-sm">
          <p className="flex justify-between text-gray-800">
            <span className="font-[500]">Total In</span>
            <span className="text-success font-[500] text-green-700">{currentCashbook?.totalIn}</span>
          </p>
          <p className="flex justify-between text-gray-800">
            <span className="font-[500]">Total Out</span>
            <span className="text-danger font-[500] text-red-700">{currentCashbook?.totalOut}</span>
          </p>
        </div>
        <button className="w-full p-3 flex items-center justify-center text-sm gap-2.5">
          <p className="font-normal uppercase text-yellow-400">View reports</p>
          <IoIosArrowForward className="text-sm text-yellow-400"/>
        </button>
      </section>
      <div className="flex justify-between items-center m-3">
        <span className="w-[30%] h-px bg-gray-300"></span>
        <span className="text-xs font-bold text-gray-800">Showing {currentCashbook?.totalEntries} entries</span>
        <span className="w-[30%] h-px bg-gray-300"></span>
      </div>
      <TransactionsGroup entries={currentCashbook?.groupedEntries ?? []}/>
      <footer className="flex justify-center items-center p-4 fixed bottom-0 bg-white w-full gap-3.5">
        <button className=" bg-green-700 gap-1.5 py-2.5 min-w-[40%] flex justify-center items-center rounded-md  text-sm font-medium mb-4" onClick={()=>handleNavigate("in")}>
          <FiPlus className="text-white"/>
          <span className="text-white">CASH IN</span>
        </button>
        <button className=" bg-red-700 gap-1.5 py-2.5 min-w-[40%] flex justify-center items-center rounded-md text-sm font-medium mb-4" onClick={()=>handleNavigate("out")}>
          <FiMinus className="text-white"/>
          <span className="text-white">CASH OUT</span>
        </button>
      </footer>
      {
        isDropdownOpen?
        <div className="w-screen bg-black/60 h-screen fixed top-0" onClick={()=>{setIsDropdownOpen(false)}}>
          <div className="bg-gray-100 fixed w-full bottom-0 flex flex-col gap-2 p-2 rounded-t-xl">
            <button className="flex items-center gap-4 p-4" onClick={handleUpdate}>
              <Pencil className="text-gray-700 w-5"/>
              <p className="text-gray-700 text-sm">Edit Cashbook Name</p>
            </button>
            <button className="flex items-center gap-4 p-4" onClick={()=>setIsModalOpen(true)}>
              <Trash2 className="text-red-800 w-5"/>
              <p className="text-gray-700 text-sm">Delete Cashbook</p>
            </button>
          </div>
        </div>
        :
        <></>
      }
    </main>
  );
};

export default Book;
