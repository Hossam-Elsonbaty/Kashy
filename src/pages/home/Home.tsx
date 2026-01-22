import { AddBtn } from "./components/AddNewBtn/AddBtn";
import Book from "./components/cashbook/Book";
import Footer from "./components/footer/Footer";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cashbooksAction } from "../../store/slices/cashbooksSlice";
import Loader from "../../components/Loader";
import type { AppDispatch, RootState } from "../../store/Store";
import { EmptyState } from "../../components/EmptyData";
import userPic from "../../assets/user-pic-male.jpg";
import { Input } from "../../components/ui/input";

interface UserDataModel {
  accessToken: string;
  email: string;
  fullName: string;
  id: string;
  pictureUrl: string | null;
  refreshToken: string;
  roles: string[];
  userName: string;
}
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
const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dataTest = useSelector((state: RootState) => state.cashbooks.cashbooks);
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const userDataStr = localStorage.getItem("user");
  const userData: UserDataModel | null = userDataStr
    ? JSON.parse(userDataStr)
    : null;
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCashbooks = useMemo(() => {
    if (!searchQuery.trim()) {
      return dataTest;
    }
    
    return dataTest.filter((cashbook:Item) => {
      const cashbookName = cashbook.name || "";
      return cashbookName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [dataTest, searchQuery]);
  useEffect(() => {
    dispatch(cashbooksAction());
  }, [dispatch]);
  return (
    <main className="h-screen flex flex-col justify-between">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col ">
            <nav className=" bg-white sticky top-0 flex flex-col ">
              <section className="flex items-center gap-3 p-2 border-b border-gray-150">
                <img
                  src={
                    userData?.pictureUrl
                      ? `https://pub-8520bfdb90294c88a1d3e0d20ed986ef.r2.dev/${userData.pictureUrl}`
                      : userPic
                  }
                  alt="userImg"
                  className="w-10 h-10 rounded-full"
                />
                <div className=" cursor-pointer">
                  <p className="font-bold text-sm text-stone-900">
                    {userData?.fullName}
                  </p>
                </div>
              </section>
              <section className="flex justify-between items-center px-4 py-2 bg-white">
                <p className="font-semibold text-xs text-gray-500 ">
                  Your Books ({filteredCashbooks.length})
                </p>
                <Input
                  type="text"
                  placeholder="Search By Cashbook Name"
                  className="w-[70%] px-2 m-0 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </section>
            </nav>
            <AddBtn />
            {filteredCashbooks.length > 0 ? (
              filteredCashbooks.map((item, i) => <Book item={item} key={i} />)
            ) : searchQuery.trim() ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-gray-500 font-medium mb-2">No results found</p>
                <p className="text-gray-400 text-sm">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
          <Footer />
        </>
      )}
    </main>
  );
};

export default Home;
