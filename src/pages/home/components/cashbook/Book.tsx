import { MdBook } from "react-icons/md";
import { TbDotsVertical } from "react-icons/tb";
import "./_book.scss";
import { useNavigate } from "react-router-dom";
import ConfirmDelete from "../../../../components/ConfirmDelete";
import instance from "../../../../instance";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

interface Item {
  balance: number;
  createdAt: string;
  description: string;
  iconUrl: null;
  id: string;
  isDeleted: boolean;
  name: string;
  updatedAt: string;
  userId: string;
}
export interface CashBook {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items?: Item[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
const Book = ({ item }: { item: Item }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const handleDeleteEntry = () => {
    console.log(item.id);
    instance
      .delete(`/api/Cashbook?cashbookId=${item.id}&deleteRelated=true`)
      .then((response) => {
        console.log(response.data);
        toast.success("Successfully deleted");
        setIsDropdownOpen(false);
        setIsModalOpen(false);
        window.location.reload()
        setTimeout(() => {
          navigate(-1);
        }, 600);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Operation failed");
      });
  };
  const navigate = useNavigate();
  return (
    <>
      <Toaster position="top-center"/>
      <ConfirmDelete
        isOpen={isModalOpen}
        handleOpen={() => setIsModalOpen(false)}
        handleDelete={handleDeleteEntry}
      />
      <section
        className="book-cell mt-2"
        key={item.id}
      >
        <div className="i-holder flex-center">
          <MdBook />
        </div>
        <div className="book-info"
        onClick={() => navigate(`/book/${item.id}?name=${item.name}`)}
        >
          <p>{item.name}</p>
          <p>{item.updatedAt}</p>
        </div>
        <div className="book-price relative">
          {/* Options dropdown*/}
          <div
            id="dropdownDots"
            className={`${
              isDropdownOpen ? "block" : "hidden"
            } z-10 absolute right-6 top-0  bg-gray-200 divide-y p-2 divide-gray-100 rounded-lg custom-shadow w-24`}
          >
            <ul
              className="text-sm flex flex-col gap-2"
              aria-labelledby="dropdownMenuIconButton"
            >
              <li className="">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="block hover:bg-red-800 text-white  bg-red-700 p-1 med-rounded text-center w-full"
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
          <p>{item.balance}</p>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <TbDotsVertical className="w-5 h-5 text-gray-800" />
          </button>
        </div>
      </section>
    </>
  );
};

export default Book;
