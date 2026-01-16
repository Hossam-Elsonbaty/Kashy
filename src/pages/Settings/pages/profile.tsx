// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { ArrowLeft } from "lucide-react";
// import  { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { toast,Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import instance from "../../../instance";

// // Types
// interface User {
//   accessToken: string;
//   email: string;
//   fullName: string;
//   id: string;
//   pictureUrl: null;
//   refreshToken: string;
//   roles: string[];
//   userName: string;
// }

// interface FormData {
//   fullName: string;
// }

// export default function ProfileScreen() {
//   const [userData, setUserData] = useState<User | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const {
//     control,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<FormData>({
//     defaultValues: {
//       fullName: "",
//     },
//   });

//   useEffect(() => {
//     loadUserData();
//   }, []);

//   const loadUserData = async () => {
//     try {
//       const userDataString = localStorage.getItem("user");
//       if (userDataString) {
//         const data = JSON.parse(userDataString);
//         setUserData(data);
//         setValue("fullName", data.fullName || "");
//       }
//     } catch (error) {
//       console.error("Error loading user data:", error);
//     }
//   };
//   const onSubmit = async (data: FormData) => {
//     if (!userData?.id) {
//       toast.error("User data not found")
//       return;
//     }
//     console.log(data);
//     setIsSubmitting(true);
//     try {
//       const response = instance.patch(
//         `/api/User/update-profile-basic`,
//         {
//           fullName: data.fullName,
//         }
//       );
//       if (!(await response).status) {
//         toast.error("User data not found")
//         throw new Error("Update failed");
//       }
//       const result = await response;
//       const updatedUser = result.data;
//       setUserData(updatedUser);
//       localStorage.setItem("userData", JSON.stringify(updatedUser));
//       toast.success("Profile updated successfully")
//     } catch (err: any) {
//       console.error("Update error:", err);
//       toast.error("Failed to update profile")
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   const navigate = useNavigate();
//   return (
//     <div className="flex-1 min-h-screen overflow-y-auto">
//       <Toaster/>
//       <div className="flex items-center gap-2 p-4 border-b">
//         <button onClick={() => navigate(-1)}>
//           <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
//         </button>
//         <h2 className="font-medium text-gray-800">Profile Settings</h2>
//       </div>
//       <div className="bg-white  rounded-lg  p-3 max-w-2xl mx-auto">
//         <h1 className="text-2xl font-semibold mb-1 text-center text-gray-800">
//           Public Profile
//         </h1>
//         <p className="text-sm text-gray-500 mb-6 text-center">
//           Add information about yourself
//         </p>
//         <div>
//           {/* Full Name */}
//           <div className="mb-6">
//             <label className="text-sm font-semibold mb-3 text-gray-800 block">
//               Full Name
//             </label>
//             <Controller
//               control={control}
//               name="fullName"
//               rules={{
//                 required: "Full name is required",
//               }}
//               render={({ field: { onChange, value } }) => (
//                 <input
//                   type="text"
//                   value={value}
//                   onChange={onChange}
//                   placeholder="Full Name"
//                   className={`w-full px-4 py-3 text-base text-gray-700 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
//                     errors.fullName ? "border-red-500" : "border-gray-200"
//                   }`}
//                 />
//               )}
//             />
//             {errors.fullName && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.fullName.message}
//               </p>
//             )}
//           </div>
//           {/* Save Button */}
//           <button
//             onClick={handleSubmit(onSubmit)}
//             disabled={isSubmitting}
//             className={`w-full py-3 rounded-lg transition-colors ${
//               isSubmitting 
//                 ? "bg-gray-400 cursor-not-allowed" 
//                 : "bg-amber-600 hover:bg-amber-700"
//             }`}
//           >
//             {isSubmitting ? (
//               <div className="flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//               </div>
//             ) : (
//               <span className="text-white text-center font-semibold text-base">
//                 Save
//               </span>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft, Trash2, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import instance from "../../../instance";

// Types
interface User {
  accessToken: string;
  email: string;
  fullName: string;
  id: string;
  pictureUrl: null;
  refreshToken: string;
  roles: string[];
  userName: string;
  phoneNumberCode?: string;
  phoneNumber?: string;
}

interface FormData {
  fullName: string;
  phoneNumberCode: string;
  phoneNumber: string;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      phoneNumberCode: "+20",
      phoneNumber: "",
    },
  });

  const phoneNumber = watch("phoneNumber");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = localStorage.getItem("user");
      if (userDataString) {
        const data = JSON.parse(userDataString);
        setUserData(data);
        setValue("fullName", data.fullName || "");
        
        if (data.phoneNumber && data.phoneNumberCode) {
          setHasPhone(true);
          setValue("phoneNumberCode", data.phoneNumberCode);
          setValue("phoneNumber", data.phoneNumber);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!userData?.id) {
      toast.error("User data not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        fullName: data.fullName,
      };
      // Only include phone data if user is adding/editing phone
      if (data.phoneNumber) {
        payload.phoneNumberCode = data.phoneNumberCode;
        payload.phoneNumber = data.phoneNumber;
      }

      const response = await instance.patch(
        `/api/User/update-profile-basic`,
        payload
      );

      if (!response.status) {
        toast.error("Update failed");
        throw new Error("Update failed");
      }
      console.log(response.data);
      
      const updatedUser = response.data;
      setUserData(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (data.phoneNumber) {
        setHasPhone(true);
        setIsEditingPhone(false);
      }
      toast.success("Profile updated successfully");
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePhone = async () => {
    if (!userData?.id) {
      toast.error("User data not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await instance.patch(
        `/api/User/update-profile-basic`,
        {
          fullName: userData.fullName,
          phoneNumberCode: "",
          phoneNumber: "",
        }
      );

      if (!response.status) {
        toast.error("Delete failed");
        throw new Error("Delete failed");
      }

      const updatedUser = response.data;
      setUserData(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setHasPhone(false);
      setValue("phoneNumberCode", "+20");
      setValue("phoneNumber", "");
      
      toast.success("Phone number deleted successfully");
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error("Failed to delete phone number");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPhone = () => {
    setIsEditingPhone(true);
  };

  const handleCancelEdit = () => {
    setIsEditingPhone(false);
    if (userData?.phoneNumber && userData?.phoneNumberCode) {
      setValue("phoneNumberCode", userData.phoneNumberCode);
      setValue("phoneNumber", userData.phoneNumber);
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Enter' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'Home' ||
      e.key === 'End'
    ) {
      return;
    }
    
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    
    // Prevent if not a number
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex-1 min-h-screen overflow-y-auto">
      <Toaster />
      <div className="flex items-center gap-2 p-4 border-b">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
        </button>
        <h2 className="font-medium text-gray-800">Profile Settings</h2>
      </div>
      <div className="bg-white rounded-lg p-3 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1 text-center text-gray-800">
          Public Profile
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Add information about yourself
        </p>
        <div>
          {/* Full Name */}
          <div className="mb-6">
            <label className="text-sm font-semibold mb-3 text-gray-800 block">
              Full Name
            </label>
            <Controller
              control={control}
              name="fullName"
              rules={{
                required: "Full name is required",
              }}
              render={({ field: { onChange, value } }) => (
                <input
                  type="text"
                  value={value}
                  onChange={onChange}
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 text-base text-gray-700 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.fullName ? "border-red-500" : "border-gray-200"
                  }`}
                />
              )}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone Number Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">
                Phone Number
              </label>
              {hasPhone && !isEditingPhone && (
                <div className="flex gap-2">
                  <button
                    onClick={handleEditPhone}
                    className="text-amber-600 hover:text-amber-700 p-1"
                    title="Edit phone number"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDeletePhone}
                    disabled={isSubmitting}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Delete phone number"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {hasPhone && !isEditingPhone ? (
              <div className="w-full px-4 py-3 text-base text-gray-700 border border-gray-200 rounded-lg bg-gray-50">
                {userData?.phoneNumberCode} {userData?.phoneNumber}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Controller
                    control={control}
                    name="phoneNumberCode"
                    rules={{
                      required: phoneNumber ? "Country code is required" : false,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <select
                        value={value}
                        onChange={onChange}
                        className={`px-4 py-3 text-base text-gray-700 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          errors.phoneNumberCode ? "border-red-500" : "border-gray-200"
                        }`}
                      >
                        <option value="+20">+20</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+91">+91</option>
                        <option value="+86">+86</option>
                        <option value="+966">+966</option>
                        <option value="+971">+971</option>
                      </select>
                    )}
                  />
                  <Controller
                    control={control}
                    name="phoneNumber"
                    rules={{
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: "Please enter a valid phone number (10-15 digits)",
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <input
                        type="tel"
                        value={value}
                        onChange={onChange}
                        onKeyDown={handlePhoneKeyDown}
                        placeholder="Phone Number"
                        className={`flex-1 px-4 py-3 text-base text-gray-700 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          errors.phoneNumber ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                    )}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.phoneNumber.message}
                  </p>
                )}
                {errors.phoneNumberCode && (
                  <p className="text-red-500 text-sm">
                    {errors.phoneNumberCode.message}
                  </p>
                )}
                {isEditingPhone && (
                  <button
                    onClick={handleCancelEdit}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            ) : (
              <span className="text-white text-center font-semibold text-base">
                Save
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}