import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { format } from "date-fns"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import instance from "../../instance"
import toast, { Toaster } from 'react-hot-toast';
const AddEntry = () => {
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
    paymentMethodName:"cash",
    categoryId:''
  })
  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted Data:", formData)
    instance.post('/api/entry',{
      cashbookId: formData.cashbookId,
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
        navigate(`/book/${id}`)
      }, 500);
    })
    .catch(err=>toast.error("Operation failed" + err))
  }
  console.log(location,type,id);
  
  return (
    <main className="max-w-md mx-auto p-5 space-y-5 flex flex-col gap-10 h-dvh">
      <Toaster position="top-center"/>
      <h2 className={`text-center ${type === "in"? "text-green-700" :"text-red-700"}  font-semibold text-lg`}>
        {type === "in"? "Add Cash In Entry" : "Add Cash Out Entry"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10 h-full" >
        {/* Date and Time Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <Label>Date</Label>
            <div className="relative mt-2">
              <Input
                type="date"
                value={formData.creationDate}
                onChange={(e) => handleChange("creationDate", e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1">
            <Label>Time</Label>
            <div className="relative mt-2">
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
          <Select disabled onValueChange={(val) => handleChange("categoryId", val)} >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Sales</SelectItem>
              <SelectItem value="1">Refund</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Payment Mode */}
        <div>
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
        </div>
        {/* Save Button */}
        <Button type="submit" className="w-full mt-auto">
          Save
        </Button>
      </form>
    </main>
  )
}

export default AddEntry
