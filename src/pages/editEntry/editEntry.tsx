import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { format } from "date-fns"
import { useNavigate, useParams } from "react-router-dom"
import instance from "../../instance"
import toast, { Toaster } from "react-hot-toast"
import { ArrowLeft } from "lucide-react";
import { PiTrashSimpleBold } from "react-icons/pi";
import ConfirmDelete from "../../components/ConfirmDelete"
import Loader from "../../components/Loader"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../store/Store"
import { fetchCategoriesAction } from "../../store/slices/categoriesSlice"
import { flattenCategories } from "../../lib/utils"
const EditEntry = () => {
  const { entryId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  const [loading, setLoading] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    cashbookId: "",
    amount: 0,
    creationDate: "",
    creationTime: "",
    name: "",
    paymentMethodName: "cash",
    entryType: 1, 
    categoryId: "",
    categoryName: "",
  })

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.entryType
  );
  const flattenedCategories = flattenCategories(filteredCategories);

  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch]);
  // Fetch entry data on mount
  useEffect(() => {
    console.log(entryId);
    instance
      .get(`/api/Entry/${entryId}`)
      .then((res) => {
        console.log(res.data);
        const data = res.data
        const parsedDate = new Date(data.createdAt);
        setFormData({
          cashbookId: data.id,
          amount: data.amount,
          creationDate: format(parsedDate, "yyyy-MM-dd"),
          creationTime: format(parsedDate, "HH:mm:ss"),
          name: data.name,
          paymentMethodName: data.paymentMethodName || "cash",
          entryType: data.entryType,
          categoryId: data.categoryId || "",
          categoryName: data.categoryName || ""
        })
      })
      .catch((err) => {
        toast.error(err)
        console.log(err);
      })
      .finally(() => setLoading(false))
  }, [entryId])
  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const handleDeleteEntry = ()=> {
    instance
      .delete(`/api/entry/${entryId}`)
      .then((response) => {
        console.log(response.data);
        toast.success("Successfully deleted")
        setIsModalOpen(false)
        setTimeout(()=>{
          navigate(-2)
        },600)
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData);
    instance
      .put(`/api/Entry/${entryId}`, {
        id: formData.cashbookId,
        amount: formData.amount,
        creationDate: formData.creationDate,
        creationTime: formData.creationTime,
        name: formData.name,
        entryType: formData.entryType,
        categoryId: formData.categoryId || undefined,
        // paymentMethodName: formData.paymentMethodName,
      })
      .then(() => {
        toast.success("Entry updated successfully")
        setTimeout(() => {
          navigate(-1)
        }, 600)
      })
      .catch((err) =>{
        toast.error("Failed to update entry")
        console.log(err);
      })
  }
  if (loading)
    return (
      <main className="flex items-center justify-center h-dvh">
        <Loader/>
      </main>
    )
  return (
    <main className="max-w-md mx-auto flex flex-col gap-3 h-dvh">
      <Toaster position="top-center" />
      <ConfirmDelete isOpen={isModalOpen} handleOpen={()=>setIsModalOpen(false)} handleDelete={handleDeleteEntry}/>
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <button onClick={()=>navigate(-1)}>
            <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
          </button>
          <h2 className="font-medium text-gray-800">Edit Entry</h2>
        </div>
        <button 
        onClick={()=>setIsModalOpen(true)}
        >
          <PiTrashSimpleBold className="w-5 h-5 text-red-800" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col p-3 gap-10 h-full">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={formData.entryType === 1 ? "default" : "outline"}
            className={formData.entryType === 1 ?" bg-green-600  text-white" :""}
            onClick={() => handleChange("entryType", 1)}
          >
            Cash In
          </Button>
          <Button
            type="button"
            variant={formData.entryType === 0 ? "default" : "outline"}
            className={formData.entryType === 0?" bg-red-600  text-white":""}
            onClick={() => handleChange("entryType", 0)}
          >
            Cash Out
          </Button>
        </div>
        {/* Date and Time */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex-1">
            <Label>Date</Label>
            <div className="relative mt-2 max-w-36">
              <Input
                className="mt-2 p-1"
                type="date"
                value={formData.creationDate}
                onChange={(e) => handleChange("creationDate", e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1">
            <Label>Time</Label>
            <div className="relative mt-2 max-w-36">
              <Input
                className="mt-2 p-1"
                type="time"
                value={formData.creationTime}
                onChange={(e) => handleChange("creationTime", e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Name */}
        <div>
          <Label htmlFor="name">
            Label <span className="text-red-500">*</span>
          </Label>
          <Input
            className="mt-2"
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Entry label"
            required
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
          <Select
            value={formData.categoryId || undefined} // this line is giving the following error: ncaught Error: A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder
            onValueChange={(val) => handleChange("categoryId", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category (optional)" />
            </SelectTrigger>
            <SelectContent>
              {flattenedCategories.length === 0 ? (
                <SelectItem value="" disabled>No categories available</SelectItem>
              ) : (
                flattenedCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {"parentCategoryId" in category && category.parentCategoryId 
                      ? `— ${category.name}` 
                      : category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        {/* Payment Method */}
        <div>
          <Label>Payment Method</Label>
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant={
                formData.paymentMethodName === "cash" ? "default" : "outline"
              }
              onClick={() => handleChange("paymentMethodName", "cash")}
            >
              Cash
            </Button>
            <Button
              disabled
              type="button"
              variant={
                formData.paymentMethodName === "online" ? "default" : "outline"
              }
              onClick={() => handleChange("paymentMethodName", "online")}
            >
              Online
            </Button>
          </div>
        </div>
        {/* Save Button */}
        <Button type="submit" className="w-full mt-auto">
          Update Entry
        </Button>
      </form>
    </main>
  )
}

export default EditEntry
