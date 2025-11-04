import { useState, type ChangeEvent, type FormEvent } from "react";
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dispatch = useDispatch<AppDispatch>()
  const userString = localStorage.getItem("user");
  const user: User | null = userString ? JSON.parse(userString) : null;
  const userId = user ? user.id : null;
  // const userId = JSON.parse(localStorage.getItem('user')).id;
  console.log(userId);
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
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
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogDemo;
