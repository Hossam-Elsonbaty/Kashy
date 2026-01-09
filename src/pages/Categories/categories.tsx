import { useState } from "react";
import Navbar from "./components/navbar";

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
  const [categories, setCategories] = useState<Category[]>();
  return (
    <main>
      <Navbar />
      {}
    </main>
  );
};

export default Categories;
