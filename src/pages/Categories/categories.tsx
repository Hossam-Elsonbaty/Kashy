/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import { EmptyState } from "../../components/EmptyData";
import instance from "../../instance";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/Store";
import { categoriesAction } from "../../store/slices/categoriesSlice";
import Loader from "../../components/Loader";
import PageNotFound from "../../components/PageNotFound";
import { Layers2, Pencil, Trash2 } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import ConfirmDelete from "../../components/ConfirmDelete";
import Footer from "../home/components/footer/Footer";

export interface Category {
  id: string;
  name: string;
  description: null;
  parentCategoryId: null;
  level: number;
  type: number;
  subCategories: [];
}

const Categories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentCategories, status } = useSelector((state: any) => state.categories);
  // const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState<string>("");
  const [isDropUp, setIsDropUp] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [catToUpdate, setCatToUpdate] = useState<string>("");
  const [catToDelete, setCatToDelete] = useState<string>("");
  const [catToUpdateID, setCatToUpdateID] = useState<string>("");
  console.log(currentCategories);
  useEffect(()=>{
    dispatch(categoriesAction());
  },[dispatch])
  const handleAddNewCategory = async()=>{
    try{
      await instance.post('/api/Category',{
        name,
        type:0
      })
      dispatch(categoriesAction())
      setIsDropUp(false)
      toast.success("Category created successfully")
    }
    catch(error){
      console.log(error);
      toast.error("Operation failed")
    }
  }
  const handleUpdateCategory = async()=>{
    if(catToUpdate&&catToUpdateID){
      try{
        await instance.put(`/api/Category/${catToUpdateID}`,{
          id:catToUpdateID,
          name:catToUpdate,
          type:0
        })
        dispatch(categoriesAction())
        toast.success("Category update successfully");
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
        await instance.delete(`/api/Category/${catToDelete}?deleteRelated=true`)
        dispatch(categoriesAction())
        setIsDropUp(false)
        toast.success("Category Deleted successfully");
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
  if (status === "failed") {
    return <PageNotFound/>;
  }
  const handleUpdate = (item:Category)=>{
    setIsUpdate(true)
    setCatToUpdateID(item.id)
    setCatToUpdate(item.name)
  }
  const handleDelete = (id:string)=>{
    setIsModalOpen(true);
    setCatToDelete(id)
  }
  return (
    <main className="h-screen flex flex-col justify-between">
      <Toaster position="top-center"/>
      <ConfirmDelete
        isOpen={isModalOpen}
        handleOpen={() => setIsModalOpen(false)}
        handleDelete={handleDeleteCat}
      />
      <div>
        <Navbar />
        <div className="flex flex-col gap-3 p-4">
          <button className="p-4 border border-gray-300 text-gray-700"onClick={()=>setIsDropUp(true)}>Add New Category</button>
          {currentCategories.length>0?
          currentCategories?.map((item:Category)=>
          <div key={item.id} className="bg-gray-200 p-2 flex items-center rounded-2xl gap-5">
            <span className="bg-gray-800 p-2 rounded-[50%] w-10 h-10 items-center flex justify-center">
              <Layers2 className="w-5 text-amber-400 "/>
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
          <EmptyState description="There are no categories to show."actionLabel="Add New Category" onAction={()=>setIsDropUp(true)}/>
          }
        </div>
      </div>
      <Footer/>
      {
        isDropUp?
        <div className="w-screen bg-black/60 h-screen fixed top-0" onClick={()=>{setIsDropUp(false)}}>
          <div onClick={(e) => e.stopPropagation()} className="bg-gray-100 fixed w-full bottom-0 flex flex-col gap-3 p-4 rounded-t-xl">
            <input type="text" placeholder="Category Name" className="w-full p-3 border border-gray-300 rounded-xs" onChange={(e)=>setName(e.target.value)} />
            <button disabled={name?.length<2} className={name?.length<2?"flex items-center p-4 justify-center text-sm text-gray-300 font-semibold bg-gray-400 rounded-sm ":"cursor-pointer font-semibold text-sm flex items-center p-4 justify-center text-amber-800 bg-amber-500 rounded-sm "} onClick={handleAddNewCategory}>
              <p className="text-amber-800 font-semibold text-sm"></p>Add New Category
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
            <input type="text" value={catToUpdate} placeholder="Category Name" className="w-full p-3 border border-gray-300 rounded-xs" onChange={(e)=>setCatToUpdate(e.target.value)} />
            <button disabled={catToUpdate?.length<2} className={catToUpdate?.length<2?"flex items-center p-4 justify-center text-sm text-gray-300 font-semibold bg-gray-400 rounded-sm ":"cursor-pointer font-semibold text-sm flex items-center p-4 justify-center text-amber-800 bg-amber-500 rounded-sm "} onClick={handleUpdateCategory}>
              <p className="text-amber-800 font-semibold text-sm"></p>Update Category
            </button>
          </div>
        </div>
        :
        <></>
      }
    </main>
  );
};

export default Categories;
