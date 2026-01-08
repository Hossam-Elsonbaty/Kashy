import React, { useState, useEffect } from "react";

// Types
interface UserData {
  _id: string;
  profilePic?: string;
  [key: string]: unknown;
}

interface LanguageContextType {
  language: string;
}

// Mock Language Context Hook (replace with your actual context)
const useLanguage = (): LanguageContextType => {
  const [language] = useState("en"); // Default to English
  return { language };
};

export default function PhotoScreen() {
  const { language } = useLanguage();
  const lang = language === "ar" ? "ar" : "en";
  const [userData, setUserData] = useState<UserData | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const data = JSON.parse(userDataString);
        setUserData(data);
        setPreview(data.profilePic);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const pickImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(
          lang === "ar" ? "الرجاء اختيار ملف صورة" : "Please select an image file"
        );
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!preview || preview === userData?.profilePic) {
      alert(
        lang === "ar" ? "الرجاء اختيار صورة جديدة" : "Please select a new image"
      );
      return;
    }

    if (!userData?._id) {
      alert(
        lang === "ar" ? "لم يتم العثور على معلومات المستخدم" : "User data not found"
      );
      return;
    }

    setIsUploading(true);

    // try {
    //   const token = localStorage.getItem("token");

    //   // Convert base64 to blob
    //   const base64Response = await fetch(preview);
    //   const blob = await base64Response.blob();

    //   // Create form data
    //   const formData = new FormData();
    //   formData.append("profilePic", blob, "photo.jpg");

    //   const response = await fetch(
    //     `https://darreb-academy-backend.vercel.app/api/users/update-pic/${userData._id}`,
    //     {
    //       method: "PUT",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: formData,
    //     }
    //   );

    //   if (!response.ok) {
    //     throw new Error("Upload failed");
    //   }

    //   const result = await response.json();
    //   const updatedUser = result.data;
    //   setUserData(updatedUser);
    //   localStorage.setItem("userData", JSON.stringify(updatedUser));

    //   alert(
    //     lang === "ar" ? "تم تحديث الصورة بنجاح" : "Photo updated successfully"
    //   );
    // } catch (err: any) {
    //   console.error("Upload error:", err);
    //   alert(
    //     err.message ||
    //       (lang === "ar" ? "فشل تحميل الصورة" : "Failed to upload photo")
    //   );
    // } finally {
    //   setIsUploading(false);
    // }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen overflow-y-auto">
      <div className="bg-white  rounded-lg m-4 p-6 max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold text-center mb-1 text-gray-800">
          {lang === "ar" ? "الصورة" : "Photo"}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {lang === "ar"
            ? "أضف صورة جميلة لنفسك لملفك الشخصي."
            : "Add a nice photo of yourself for your profile."}
        </p>

        {/* Image Preview */}
        <label className="text-sm font-medium mb-2 text-gray-800 block">
          {lang === "ar" ? "معاينة الصورة" : "Image Preview"}
        </label>
        <div className="w-full h-64 border border-amber-200 rounded-lg mb-6 overflow-hidden bg-gray-100">
          {preview ? (
            <img
              src={preview}
              alt="Profile preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex h-full justify-center items-center">
              <span className="text-gray-400">
                {lang === "ar" ? "لا توجد صورة" : "No Image"}
              </span>
            </div>
          )}
        </div>

        {/* Add/Change Image */}
        <label className="text-sm font-medium mb-3 text-gray-800 block">
          {lang === "ar" ? "إضافة / تغيير الصورة" : "Add / Change Image"}
        </label>

        {/* Pick Image Button */}
        <label
          className={`block py-4 rounded-lg mb-3 cursor-pointer text-center ${
            isUploading ? "bg-gray-300" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={pickImage}
            disabled={isUploading}
            className="hidden"
          />
          <span className="text-gray-700 font-medium">
            {lang === "ar" ? "اختر صورة" : "Choose Image"}
          </span>
        </label>

        {/* Upload Button */}
        <button
          onClick={uploadImage}
          disabled={isUploading || !preview}
          className={`w-full py-4 rounded-lg ${
            isUploading || !preview 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-amber-600 hover:bg-amber-700"
          } transition-colors`}
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          ) : (
            <span className="text-white text-center font-semibold text-base">
              {lang === "ar" ? "حفظ" : "Save"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}