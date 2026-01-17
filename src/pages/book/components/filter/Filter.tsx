// /* eslint-disable @typescript-eslint/no-explicit-any */
// import './_filter.scss';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
// import { useDispatch, useSelector } from 'react-redux';
// import { Input } from '../../../../components/ui/input';
// import { useEffect, useState } from 'react';
// import { format } from "date-fns"
// import type { AppDispatch } from '../../../../store/Store';
// import { categoriesAction } from '../../../../store/slices/categoriesSlice';
// import { PaymentMethodsAction } from '../../../../store/slices/paymentMethodSlice';
// import { getCashbookById } from '../../../../store/slices/singleCashbookSlice';
// import { useParams } from 'react-router-dom';

// export interface Category {
//   id: string;
//   name: string;
//   description: null;
//   parentCategoryId: null;
//   level: number;
//   type: number;
//   subCategories: [];
// }

// export interface PaymentMethod {
//   id: string;
//   name: string;
// }

// interface FilterParams {
//   type?: number;
//   categoryId?: string;
//   paymentMethodId?: string;
//   fromDate?: string;
//   toDate?: string;
//   searchableLetters?: string | null;
// }

// const BookFilter = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { currentCategories } = useSelector((state: any) => state.categories);
//   const { currentPaymentMethods } = useSelector((state: any) => state.PaymentMethods);
//   const {id} = useParams(); 
//   const [filters, setFilters] = useState<FilterParams>({});
//   const handleChange = (field: string, value: string | number) => {
//     const updatedFilters = { ...filters };
//     switch (field) {
//       case "fromDate":
//         if (value) {
//           updatedFilters.fromDate = value as string; // Keep in yyyy-MM-dd format
//         } else {
//           delete updatedFilters.fromDate; // Remove if cleared
//         }
//         break;
//       case "toDate":
//         if (value) {
//           updatedFilters.toDate = value as string; // Keep in yyyy-MM-dd format
//         } else {
//           delete updatedFilters.toDate; // Remove if cleared
//         }
//         break;
//       case "categoryId":
//         if (value === 'all') {
//           delete updatedFilters.categoryId; // Remove filter
//         } else {
//           updatedFilters.categoryId = value as string;
//         }
//         break;
//       case "paymentMethodId":
//         if (value === 'all') {
//           delete updatedFilters.paymentMethodId; // Remove filter
//         } else {
//           updatedFilters.paymentMethodId = value as string;
//         }
//         break;
//       case "searchableLetters":
//         if (value === 'all') {
//           delete updatedFilters.searchableLetters; // Remove filter
//         } else {
//           updatedFilters.searchableLetters = value as string;
//         }
//         break;
//       case "type":
//         if (value === 'all') {
//           delete updatedFilters.type; // Remove filter
//         } else {
//           updatedFilters.type = Number(value);
//         }
//         break;
//       default:
//         break;
//     }
//     setFilters(updatedFilters);
//     applyFilters(updatedFilters);
//   };
//   const applyFilters = (currentFilters: FilterParams) => {
//     const queryParams = new URLSearchParams();
//     if (currentFilters.type !== undefined) {
//       queryParams.append('type', currentFilters.type.toString());
//     }
//     if (currentFilters.categoryId && currentFilters.categoryId !== 'all') {
//       queryParams.append('categoryId', currentFilters.categoryId);
//     }
//     if (currentFilters.paymentMethodId && currentFilters.paymentMethodId !== 'all') {
//       queryParams.append('paymentMethodId', currentFilters.paymentMethodId);
//     }
//     if (currentFilters.fromDate) {
//       const formattedFromDate = format(new Date(currentFilters.fromDate), "MM-dd-yyyy");
//       queryParams.append('fromDate', formattedFromDate);
//     }
//     if (currentFilters.toDate) {
//       const formattedToDate = format(new Date(currentFilters.toDate), "MM-dd-yyyy");
//       queryParams.append('toDate', formattedToDate);
//     }
//     if (currentFilters.searchableLetters) {
//       queryParams.append('searchableLetters', currentFilters.searchableLetters);
//     }
//     const queryString = queryParams.toString();
//     const fullUrl = `${id}?${queryString}`;
//     dispatch(getCashbookById(fullUrl));
//   };

//   useEffect(() => {
//     dispatch(categoriesAction());
//     dispatch(PaymentMethodsAction());
    
//   }, [dispatch]);

//   return (
//     <div className='filter flex flex-col gap-2'>
//       <div className='filter-swiper'>
//         <div className='cell'>
//           <label className="text-sm font-medium mb-1 block">From Date</label>
//           <Input
//             type="date"
//             value={filters.fromDate || ""}
//             onChange={(e) => handleChange("fromDate", e.target.value)}
//           />
//         </div>
//         <div className='cell'>
//           <label className="text-sm font-medium mb-1 block">To Date</label>
//           <Input
//             type="date"
//             value={filters.toDate || ""}
//             onChange={(e) => handleChange("toDate", e.target.value)}
//           />
//         </div>
//         <div className='cell'>
//           <label className="text-sm font-medium mb-1 block">Category</label>
//           <Select onValueChange={(val) => handleChange("categoryId", val)}>
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="Select category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               {currentCategories && currentCategories.map((cat: Category) =>
//                 <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
//               )}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className='cell'>
//           <label className="text-sm font-medium mb-1 block">Payment Method</label>
//           <Select onValueChange={(val) => handleChange("paymentMethodId", val)}>
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="Select Payment Method" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Methods</SelectItem>
//               {currentPaymentMethods && currentPaymentMethods.map((method: PaymentMethod) =>
//                 <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
//               )}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className='cell'>
//           <label className="text-sm font-medium mb-1 block">Entry Type</label>
//           <Select onValueChange={(val) => handleChange("type", val)}>
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="Select Entry Type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Types</SelectItem>
//               <SelectItem value="1">Cash IN</SelectItem>
//               <SelectItem value="0">Cash Out</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//       <div className='px-2'>
//         <Input
//           className=''
//           type="text"
//           value=""
//           placeholder='search...'
//           onChange={(e) => handleChange("searchableLetters", e.target.value)}
//         />
//       </div>
//     </div>
//   );
// };

// export default BookFilter;
/* eslint-disable @typescript-eslint/no-explicit-any */
import './_filter.scss';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../../../../components/ui/input';
import { useEffect, useState } from 'react';
import { format } from "date-fns"
import type { AppDispatch } from '../../../../store/Store';
import { categoriesAction } from '../../../../store/slices/categoriesSlice';
import { PaymentMethodsAction } from '../../../../store/slices/paymentMethodSlice';
import { getCashbookById } from '../../../../store/slices/singleCashbookSlice';
import { useParams } from 'react-router-dom';

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

interface FilterParams {
  type?: number | string;
  categoryId?: string;
  paymentMethodId?: string;
  fromDate?: string;
  toDate?: string;
  searchableLetters?: string;
}

const BookFilter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentCategories } = useSelector((state: any) => state.categories);
  const { currentPaymentMethods } = useSelector((state: any) => state.PaymentMethods);
  const { id } = useParams(); 
  const [filters, setFilters] = useState<FilterParams>({
    type: 'all',
    categoryId: 'all',
    paymentMethodId: 'all',
    searchableLetters: ''
  });
  const handleChange = (field: string, value: string | number) => {
    const updatedFilters = { ...filters };
    
    switch (field) {
      case "fromDate":
        if (value) {
          updatedFilters.fromDate = value as string;
        } else {
          delete updatedFilters.fromDate;
        }
        break;
      case "toDate":
        if (value) {
          updatedFilters.toDate = value as string;
        } else {
          delete updatedFilters.toDate;
        }
        break;
      case "categoryId":
        updatedFilters.categoryId = value as string;
        break;
      case "paymentMethodId":
        updatedFilters.paymentMethodId = value as string;
        break;
      case "searchableLetters":
        updatedFilters.searchableLetters = value as string;
        break;
      case "type":
        updatedFilters.type = value;
        break;
      default:
        break;
    }
    
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const applyFilters = (currentFilters: FilterParams) => {
    const queryParams = new URLSearchParams();
    
    if (currentFilters.type !== undefined && currentFilters.type !== 'all') {
      queryParams.append('type', currentFilters.type.toString());
    }
    if (currentFilters.categoryId && currentFilters.categoryId !== 'all') {
      queryParams.append('categoryId', currentFilters.categoryId);
    }
    if (currentFilters.paymentMethodId && currentFilters.paymentMethodId !== 'all') {
      queryParams.append('paymentMethodId', currentFilters.paymentMethodId);
    }
    if (currentFilters.fromDate) {
      const formattedFromDate = format(new Date(currentFilters.fromDate), "MM-dd-yyyy");
      queryParams.append('fromDate', formattedFromDate);
    }
    if (currentFilters.toDate) {
      const formattedToDate = format(new Date(currentFilters.toDate), "MM-dd-yyyy");
      queryParams.append('toDate', formattedToDate);
    }
    if (currentFilters.searchableLetters && currentFilters.searchableLetters.trim() !== '') {
      queryParams.append('searchableLetters', currentFilters.searchableLetters);
    }
    
    const queryString = queryParams.toString();
    const fullUrl = queryString ? `${id}?${queryString}` : id;
    dispatch(getCashbookById(fullUrl || ''));
  };
  useEffect(() => {
    dispatch(categoriesAction());
    dispatch(PaymentMethodsAction());
  }, []);
  return (
    <div className='filter flex flex-col gap-2'>
      <div className='filter-swiper'>
        <div className='cell'>
          <label className="text-sm font-medium mb-1 block">From Date</label>
          <Input
            type="date"
            value={filters.fromDate || ""}
            onChange={(e) => handleChange("fromDate", e.target.value)}
          />
        </div>
        <div className='cell'>
          <label className="text-sm font-medium mb-1 block">To Date</label>
          <Input
            type="date"
            value={filters.toDate || ""}
            onChange={(e) => handleChange("toDate", e.target.value)}
          />
        </div>
        <div className='cell'>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select 
            value={filters.categoryId} 
            onValueChange={(val) => handleChange("categoryId", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {currentCategories && currentCategories.map((cat: Category) =>
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className='cell'>
          <label className="text-sm font-medium mb-1 block">Payment Method</label>
          <Select 
            value={filters.paymentMethodId} 
            onValueChange={(val) => handleChange("paymentMethodId", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              {currentPaymentMethods && currentPaymentMethods.map((method: PaymentMethod) =>
                <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className='cell'>
          <label className="text-sm font-medium mb-1 block">Entry Type</label>
          <Select 
            value={filters.type?.toString()} 
            onValueChange={(val) => handleChange("type", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Entry Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="1">Cash IN</SelectItem>
              <SelectItem value="0">Cash Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='px-2'>
        <Input
          type="text"
          value={filters.searchableLetters || ''}
          placeholder='search...'
          onChange={(e) => handleChange("searchableLetters", e.target.value)}
        />
      </div>
    </div>
  );
};

export default BookFilter;