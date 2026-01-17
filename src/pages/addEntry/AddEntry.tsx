/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { format } from "date-fns"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import instance from "../../instance"
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "../../store/Store"
import { categoriesAction } from "../../store/slices/categoriesSlice"
import Loader from "../../components/Loader"
import PageNotFound from "../../components/PageNotFound"
import { PaymentMethodsAction } from "../../store/slices/paymentMethodSlice"
export interface Category {
  id: string;
  name: string;
  description: null;
  parentCategoryId: null;
  level: number;
  type: number;
  subCategories: [];
}
export interface PaymentMethod {
  id: string;
  name: string;
}
const AddEntry = () => {
  const { currentCategories, status } = useSelector((state: any) => state.categories);
  const { currentPaymentMethods } = useSelector((state: any) => state.PaymentMethods);
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation();
  const navigate = useNavigate();
  const {id} = useParams()
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  const [formData, setFormData] = useState({
    cashbookId: id,
    amount:0,
    creationDate: format(new Date(), "yyyy-MM-dd"),
    creationTime: format(new Date(), "HH:mm:ss"),
    name: "",
    paymentMethodId:"",
    categoryId:''
  })
  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  useEffect(()=>{
    dispatch(categoriesAction())
    dispatch(PaymentMethodsAction())
  },[dispatch])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted Data:", formData)
    instance.post('/api/entry',{
      cashbookId: formData.cashbookId,
      categoryId: formData.categoryId || null,
      paymentMethodId: formData.paymentMethodId || null,
      amount: formData.amount,
      creationDate: formData.creationDate,
      creationTime: formData.creationTime,
      name: formData.name,
      entryType: type==="in" ? 1 : 0
    })
    .then(res=>{
      console.log(res)
      toast.success("Successful operation")
      setTimeout(() => {
        navigate(-1)
      }, 500);
    })
    .catch(err=>toast.error("Operation failed" + err))
  }
  console.log(location,type,id);
  if (status === "loading") {
    return <Loader/>;
  }
  if (status === "failed") {
    return <PageNotFound/>;
  }
  return (
    <main className="max-w-md mx-auto space-y-5 flex flex-col gap-0 h-dvh">
      <Toaster position="top-center"/>
      <h2 className={`text-center ${type === "in"? "text-green-700" :"text-red-700"}  font-semibold p-4 text-lg`}>
        {type === "in"? "Add Cash In Entry" : "Add Cash Out Entry"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col p-3 gap-10 h-full" >
        {/* Date and Time Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <Label>Date</Label>
            <div className="relative mt-2 max-w-36">
              <Input
                type="date"
                value={formData.creationDate}
                onChange={(e) => handleChange("creationDate", e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1">
            <Label>Time</Label>
            <div className="relative mt-2 max-w-39">
              <Input
                type="time"
                value={formData.creationTime}
                onChange={(e) => handleChange("creationTime", e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Name */}
        <div>
          <Label htmlFor="amount">
            Label <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Entry label"
            required
            className="mt-2"
          />
        </div>
        {/* Amount */}
        <div>
          <Label htmlFor="amount">
            Amount <span className="text-red-500">*</span>
          </Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange("amount", Number(e.target.value))}
            placeholder="Enter amount"
            required
            className="mt-2"
          />
        </div>
        {/* Category */}
        <div>
          <Label className="mb-2">Category</Label>
          <Select onValueChange={(val) => handleChange("categoryId", val)} >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {currentCategories&& currentCategories.map((cat:Category)=>
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        {/* Payment Mode */}
        <div>
          <Label className="mb-2">Payment Method</Label>
          <Select onValueChange={(val) => handleChange("paymentMethodId", val)} >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Payment Method" />
            </SelectTrigger>
            <SelectContent>
              {currentPaymentMethods&& currentPaymentMethods.map((method:PaymentMethod)=>
                <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        {/* <div>
          <Label>Payment Method</Label>
          <div className="flex gap-2 mt-1">
            <Button
              type="button"
              variant={formData.paymentMethodName === "cash" ? "default" : "outline"}
              onClick={() => handleChange("paymentMethodName", 0)}
            >
              Cash
            </Button>
            <Button
              disabled
              type="button"
              variant={formData.paymentMethodName === "online" ? "default" : "outline"}
              onClick={() => handleChange("paymentMethodName", 1)}
            >
              Online
            </Button>
          </div>
        </div> */}
        {/* Save Button */}
        <Button type="submit" className="w-full mt-auto">
          Save
        </Button>
      </form>
    </main>
  )
}

export default AddEntry
