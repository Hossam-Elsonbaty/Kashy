import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Category, SubCategory } from "../models/category";
// import { Category, SubCategory } from "../models/category"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function flattenCategories(categories: Category[]): (Category | SubCategory)[] {
  const flattened: (Category | SubCategory)[] = [];
  
  categories.forEach(cat => {
    flattened.push(cat);
    if (cat.subCategories && cat.subCategories.length > 0) {
      cat.subCategories.forEach(sub => {
        flattened.push(sub);
      });
    }
  });
  
  return flattened;
}
