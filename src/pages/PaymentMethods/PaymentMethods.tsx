/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import { EmptyState } from "../../components/EmptyData";
import instance from "../../instance";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/Store";
import { PaymentMethodsAction } from "../../store/slices/paymentMethodSlice";
import Loader from "../../components/Loader";
import PageNotFound from "../../components/PageNotFound";
import { CreditCard, Pencil, Trash2 } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import ConfirmDelete from "../../components/ConfirmDelete";

export interface PaymentMethod {
  id: string;
  name: string;
}

const PaymentMethods = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentPaymentMethods, status } = useSelector((state: any) => state.PaymentMethods);
  // const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState<string>("");
  const [isDropUp, setIsDropUp] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [catToUpdate, setCatToUpdate] = useState<string>("");
  const [catToDelete, setCatToDelete] = useState<string>("");
  const [catToUpdateID, setCatToUpdateID] = useState<string>("");
  console.log(currentPaymentMethods);
  useEffect(()=>{
    dispatch(PaymentMethodsAction());
  },[dispatch])
  const handleAddNewCategory = async()=>{
    try{
      await instance.post('/api/PaymentMethod',{
        name,
      })
      dispatch(PaymentMethodsAction())
      setIsDropUp(false)
      toast.success("PaymentMethod created successfully")
    }
    catch(error){
      console.log(error);
      toast.error("Operation failed")
    }
  }
  const handleUpdateCategory = async()=>{
    if(catToUpdate&&catToUpdateID){
      try{
        await instance.put(`/api/PaymentMethod/${catToUpdateID}`,{
          id:catToUpdateID,
          name:catToUpdate,
          type:0
        })
        dispatch(PaymentMethodsAction())
        toast.success("PaymentMethod update successfully");
        setIsUpdate(false)
      }
      catch(error){
        console.log(error);
        toast.error("Operation failed")
      }
    }
    else{
      toast.error("Operation failed")
    }
  }
  const handleDeleteCat = async()=>{
    if(catToDelete){
      try{
        await instance.delete(`/api/PaymentMethod/${catToDelete}`)
        dispatch(PaymentMethodsAction())
        setIsDropUp(false)
        toast.success("PaymentMethod Deleted successfully");
        setIsModalOpen(false)
      }
      catch(error){
        console.log(error);
        toast.error("Operation failed")
      }
    }
    else{
      toast.error("Operation failed")
    }
  }
  if (status === "loading") {
    return <Loader/>;
  }
  // if (status === "failed") {
  //   return <PageNotFound/>;
  // }
  const handleUpdate = (item:PaymentMethod)=>{
    setIsUpdate(true)
    setCatToUpdateID(item.id)
    setCatToUpdate(item.name)
  }
  const handleDelete = (id:string)=>{
    setIsModalOpen(true);
    setCatToDelete(id)
  }
  return (
    <main>
      <Toaster position="top-center"/>
      <Navbar />
      <ConfirmDelete
        isOpen={isModalOpen}
        handleOpen={() => setIsModalOpen(false)}
        handleDelete={handleDeleteCat}
      />
      <div className="flex flex-col gap-3 p-4">
        <button className="p-4 border border-gray-300 text-gray-700"onClick={()=>setIsDropUp(true)}>Add New PaymentMethod</button>
        {currentPaymentMethods.length>0?
        currentPaymentMethods?.map((item:PaymentMethod)=>
        <div key={item.id} className="bg-gray-200 p-2 flex items-center rounded-2xl gap-5">
          <span className="bg-gray-800 p-2 rounded-[50%] w-10 h-10 items-center flex justify-center">
            <CreditCard className="w-5 text-amber-400 "/>
          </span>
          <p className="capitalize">{item.name}</p>
          <div className="ml-auto mr-2 flex gap-3 items-center">
            <button  onClick={()=>handleUpdate(item)}>
              <Pencil className="w-4 text-gray-700 "/>
            </button>
            <button onClick={()=>handleDelete(item.id)}>
              <Trash2 className="w-4 text-red-700 "/>
            </button>
          </div>
        </div>
        )
        :
        <EmptyState description="There are no PaymentMethods to show."actionLabel="Add New PaymentMethod" onAction={()=>setIsDropUp(true)}/>
        }
      </div>
      {
        isDropUp?
        <div className="w-screen bg-black/60 h-screen fixed top-0" onClick={()=>{setIsDropUp(false)}}>
          <div onClick={(e) => e.stopPropagation()} className="bg-gray-100 fixed w-full bottom-0 flex flex-col gap-3 p-4 rounded-t-xl">
            <input type="text" placeholder="PaymentMethod Name" className="w-full p-3 border border-gray-300 rounded-xs" onChange={(e)=>setName(e.target.value)} />
            <button disabled={name?.length<2} className={name?.length<2?"flex items-center p-4 justify-center text-sm text-gray-300 font-semibold bg-gray-400 rounded-sm ":"cursor-pointer font-semibold text-sm flex items-center p-4 justify-center text-amber-800 bg-amber-500 rounded-sm "} onClick={handleAddNewCategory}>
              <p className="text-amber-800 font-semibold text-sm"></p>Add New PaymentMethod
            </button>
          </div>
        </div>
        :
        <></>
      }
      {
        isUpdate?
        <div className="w-screen bg-black/60 h-screen fixed top-0" onClick={()=>{setIsUpdate(false)}}>
          <div onClick={(e) => e.stopPropagation()} className="bg-gray-100 fixed w-full bottom-0 flex flex-col gap-3 p-4 rounded-t-xl">
            <input type="text" value={catToUpdate} placeholder="PaymentMethod Name" className="w-full p-3 border border-gray-300 rounded-xs" onChange={(e)=>setCatToUpdate(e.target.value)} />
            <button disabled={catToUpdate?.length<2} className={catToUpdate?.length<2?"flex items-center p-4 justify-center text-sm text-gray-300 font-semibold bg-gray-400 rounded-sm ":"cursor-pointer font-semibold text-sm flex items-center p-4 justify-center text-amber-800 bg-amber-500 rounded-sm "} onClick={handleUpdateCategory}>
              <p className="text-amber-800 font-semibold text-sm"></p>Update PaymentMethod
            </button>
          </div>
        </div>
        :
        <></>
      }
    </main>
  );
};

export default PaymentMethods;
