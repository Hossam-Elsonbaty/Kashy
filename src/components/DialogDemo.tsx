/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import instance from "../instance";
import { useDispatch } from "react-redux";
import { cashbooksAction } from "../store/slices/cashbooksSlice";
import type { AppDispatch } from "../store/Store";
import { getCashbookById } from "../store/slices/singleCashbookSlice";

interface User {
  accessToken: string;
  email: string;
  fullName: string;
  id: string;
  pictureUrl: null;
  refreshToken: string;
  roles: string[];
  userName: string;
}
function DialogDemo({
  open ,
  onOpenChange,
  isUpdate,
  book_name,
  id
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isUpdate:boolean;
  book_name:string;
  id:string
}) {
  const dispatch = useDispatch<AppDispatch>()
  const userString = localStorage.getItem("user");
  const user: User | null = userString ? JSON.parse(userString) : null;
  const userId = user ? user.id : null;
  // const userId = JSON.parse(localStorage.getItem('user')).id;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    console.log("Submitting data:", formData);
    try {
      const res = await instance.post(`/api/Cashbook`, {
        userId,
        name: formData.name,
        description: formData.description,
      });
      onOpenChange(false);
      console.log(res);
      dispatch(cashbooksAction())
    } catch (err) {
      console.error("Error:", err);
    }
  };
  const handleUpdate = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    console.log("Submitting data:", formData);
    try {
      await instance.put(`/api/Cashbook/${id}`, {
        id,
        name: formData.name,
        description: formData.description,
      });
      onOpenChange(false);
      dispatch(cashbooksAction())
      dispatch(getCashbookById(id))
    } catch (err) {
      console.error("Error:", err);
    }
  };
  useEffect(()=>{
    if (book_name) {
      setFormData((prev) => ({
        ...prev,
        name: book_name,
      }));
    }
  },[book_name, id])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={isUpdate?handleUpdate:handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Book Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {!isUpdate&&
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            }
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">{isUpdate?"Update":"Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogDemo;
