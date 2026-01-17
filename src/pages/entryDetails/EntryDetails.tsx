import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import instance from "../../instance";
import { useNavigate, useParams } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
// import { HiDotsVertical } from "react-icons/hi";
import toast, { Toaster } from "react-hot-toast";
import ConfirmDelete from "../../components/ConfirmDelete";
import Loader from "../../components/Loader";
interface EntryDetailsProps {
  id: string;
  name: string;
  categoryName: string;
  paymentMethodName: string;
  createdAt: string;
  createdBy: string;
  updatedBy: string;
  updatedAt: string;
  amount: number;
  entryType: number;
}
export default function EntryDetails() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [entryDetails, setEntryDetails] = useState<EntryDetailsProps>();
  const { entryId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    instance
      .get(`/api/entry/${entryId}`)
      .then((response) => {
        console.log(response.data);
        setEntryDetails(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false))
    }, [entryId]);
    const handleDeleteEntry = ()=> {
    instance
      .delete(`/api/entry/${entryId}`)
      .then((response) => {
        console.log(response.data);
        toast.success("Successfully deleted")
        setIsDropdownOpen(false)
        setIsModalOpen(false)
        setTimeout(()=>{
          navigate(-1)
        },600)
      })
      .catch((error) => {
        toast.error("Operation failed");
        console.log(error);
      });
  }
  const formattedDate = entryDetails?.createdAt
    ? format(new Date(entryDetails.createdAt), "dd MMM yyyy, hh:mm a")
    : "";
  const entryTypeLabel = entryDetails?.entryType === 1 ? "Cash In" : "Cash Out";
  if (loading)
  return (
    <main className="flex items-center justify-center h-dvh">
      <Loader/>
    </main>
  )
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-center"/>
      <ConfirmDelete isOpen={isModalOpen} handleOpen={()=>setIsModalOpen(false)} handleDelete={handleDeleteEntry}/>
      {/* Options dropdown*/}
      <div
        id="dropdownDots"
        className={`${isDropdownOpen ? "block" : "hidden"} z-10 absolute right-12 top-4  bg-gray-200 divide-y p-2 divide-gray-100 rounded-lg custom-shadow w-24`}
      >
        <ul
          className="text-sm flex flex-col gap-2"
          aria-labelledby="dropdownMenuIconButton"
        >
          <li className="">
            <button
            onClick={()=>setIsModalOpen(true)}
              className="block hover:bg-red-800 text-white  bg-red-700 p-1 med-rounded text-center w-full"
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
          </button>
          <h2 className="font-medium text-gray-800">Entry Details</h2>
        </div>
        {/* <button onClick={()=>setIsDropdownOpen(!isDropdownOpen)}>
          <HiDotsVertical className="w-5 h-5 text-gray-800" />
        </button> */}
      </div>
      {/* Content */}
      <div className="p-4 flex-1">
        <Card className="rounded-xs overflow-hidden border-t-amber-400 border-t-4">
          <CardContent className=" space-y-4">
            {/* Top Info */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">
                {entryTypeLabel}
              </span>
              <span className="text-gray-500 text-sm">On {formattedDate}</span>
            </div>
            {/* Amount */}
            <p
              className={`text-3xl font-semibold ${
                entryDetails?.entryType === 1
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {entryDetails?.amount}
            </p>
            {/* Payment Method */}
            <div className="flex flex-wrap gap-2">
              
              {entryDetails?.paymentMethodName && (
                <span className="bg-amber-400 text-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                  {entryDetails?.paymentMethodName}
                </span>
              )}
              {entryDetails?.categoryName && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                  {entryDetails?.categoryName}
                </span>
              )}
            </div>
            {/* Edit Button */}
            <div className="border-t pt-3 flex justify-center">
              <Button
                onClick={() => navigate("edit-entry")}
                variant="ghost"
                className="text-amber-400 font-medium flex items-center gap-1"
              >
                <Pencil className="w-4 h-4" /> Edit Entry
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Created / Updated Info */}
        <div className="mt-4 text-center text-gray-600 text-sm space-y-1">
          <p>
            Created By{" "}
            <span className="text-amber-400 font-medium">
              {entryDetails?.createdBy}
            </span>
          </p>
          <p className="text-gray-400">
            On{" "}
            {entryDetails?.createdAt
              ? format(new Date(entryDetails.createdAt), "dd MMM yyyy, hh:mm a")
              : ""}
          </p>
          {entryDetails?.updatedAt && (
            <p className="text-gray-400">
              Last updated by{" "}
              <span className="text-blue-600 font-medium">
                {entryDetails?.updatedBy}
              </span>{" "}
              on{" "}
              {entryDetails?.updatedAt
                ? format(
                    new Date(entryDetails.updatedAt),
                    "dd MMM yyyy, hh:mm a"
                  )
                : ""}
            </p>
          )}
        </div>
      </div>
      {/* Bottom Share Button */}
      <div className="p-4 bg-white border-t">
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white flex gap-2">
          <FaWhatsapp className="text-2xl" /> Share Entry
        </Button>
      </div>
    </div>
  );
}
