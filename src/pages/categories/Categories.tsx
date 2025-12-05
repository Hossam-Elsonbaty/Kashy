import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/Store";
import {
  fetchCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "../../store/slices/categoriesSlice";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ArrowLeft, Plus, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import ConfirmDelete from "../../components/ConfirmDelete";
import Loader from "../../components/Loader";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import type { Category } from "../../models/category";

export default function Categories() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading } = useSelector(
    (state: RootState) => state.categories
  );

  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Form State
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  const filteredCategories = categories.filter(
    (cat) => cat.type === (activeTab === "income" ? 1 : 0)
  );

  const handleCreate = () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    dispatch(createCategoryAction({
      name: categoryName.trim(),
      description: categoryDescription.trim() || undefined,
      type: activeTab === "income" ? 1 : 0
    }))
      .unwrap()
      .then(() => {
        toast.success("Category created successfully");
        setIsCreateDialogOpen(false);
        setCategoryName("");
        setCategoryDescription("");
      })
      .catch((err) => {
        toast.error("Failed to create category");
        console.error(err);
      });
  };

  const handleEdit = () => {
    if (!categoryName.trim() || !selectedCategory) {
      toast.error("Category name is required");
      return;
    }
    dispatch(
      updateCategoryAction({
        id: selectedCategory.id,
        name: categoryName.trim(),
        description: categoryDescription.trim() || undefined,
        type: selectedCategory.type,
        parentId: selectedCategory.parentCategoryId || undefined,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Category updated successfully");
        setIsEditDialogOpen(false);
        setSelectedCategory(null);
        setCategoryName("");
        setCategoryDescription("");
      })
      .catch((err) => {
        toast.error("Failed to update category");
        console.error(err);
      });
  };

  const handleDelete = () => {
    if (!selectedCategory) return;
    dispatch(deleteCategoryAction(selectedCategory.id))
      .unwrap()
      .then(() => {
        toast.success("Category deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedCategory(null);
      })
      .catch((err) => {
        toast.error("Failed to delete category");
        console.error(err);
      });
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  if (loading && categories.length === 0) {
    return (
      <main className="flex items-center justify-center h-dvh">
        <Loader />
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <ConfirmDelete
        isOpen={isDeleteDialogOpen}
        handleOpen={() => setIsDeleteDialogOpen(false)}
        handleDelete={handleDelete}
      />

      {/* Header */}
      <header className="p-4 border-b flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-lg font-semibold">Categories</h2>
      </header>

      {/* Tabs */}
      <div className="p-4 pb-0">
        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as "expense" | "income")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense" className="flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4 text-red-500" />
              Expense
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center gap-2">
              <ArrowDownCircle className="w-4 h-4 text-green-500" />
              Income
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Create Button */}
      <div className="p-4">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className={`w-full flex items-center justify-center gap-2 ${
            activeTab === "income" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          <Plus className="w-4 h-4" />
          Add New {activeTab === "income" ? "Income" : "Expense"} Category
        </Button>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No {activeTab} categories found.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium">{category.name}</div>
                  {category.description && (
                    <div className="text-xs text-gray-500">{category.description}</div>
                  )}
                  {category.subCategories && category.subCategories.length > 0 && (
                     <div className="text-xs text-gray-400 mt-1">
                       {category.subCategories.length} sub-categories
                     </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(category)}
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(category)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create {activeTab === "income" ? "Income" : "Expense"} Category</DialogTitle>
            <DialogDescription>
              Add a new category for your {activeTab}s.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="category-name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Groceries"
                className="mt-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreate();
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="category-desc">Description (Optional)</Label>
              <Input
                id="category-desc"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Short description"
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setCategoryName("");
                setCategoryDescription("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-category-name">Name</Label>
              <Input
                id="edit-category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="mt-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEdit();
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="category-desc">Description (Optional)</Label>
              <Input
                id="category-desc"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Short description"
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedCategory(null);
                setCategoryName("");
                setCategoryDescription("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
