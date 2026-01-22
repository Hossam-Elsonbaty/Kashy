import { useNavigate } from "react-router-dom";
import { IoMdWallet } from "react-icons/io";
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
  const navigate = useNavigate();
  return (
    <>
      <section
        className="mt-2 flex cursor-pointer items-center gap-[10px] px-4 py-2"
        key={item.id}
        onClick={() => navigate(`/book/${item.id}?name=${item.name}`)}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#70520014]">
          <IoMdWallet className="text-[24px] text-yellow-500" />
        </div>
        <div className="book-info">
          <p className="text-[16px] capitalize text-gray-800">{item.name}</p>
          <p className="text-[10px] font-medium text-gray-500">
            {item.updatedAt}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-[15px]">
          <p
            className={`font-medium text-[14px] ${item.balance >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {item.balance}
          </p>
        </div>
      </section>{" "}
    </>
  );
};

export default Book;
