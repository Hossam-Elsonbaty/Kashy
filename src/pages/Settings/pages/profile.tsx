/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

// Types
interface UserData {
  _id: string;
  fullName?: string;
  headline?: string;
  bio?: string;
  [key: string]: any;
}

interface FormData {
  fullName: string;
  headline: string;
  bio: string;
}

interface LanguageContextType {
  language: string;
}

// Mock Language Context Hook (replace with your actual context)
const useLanguage = (): LanguageContextType => {
  const [language] = useState("en");
  return { language };
};

export default function ProfileScreen() {
  const { language } = useLanguage();
  const lang = language === "ar" ? "ar" : "en";
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      headline: "",
      bio: "",
    },
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const data = JSON.parse(userDataString);
        setUserData(data);
        setValue("fullName", data.fullName || "");
        setValue("headline", data.headline || "");
        setValue("bio", data.bio || "");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!userData?._id) {
      alert(
        lang === "ar" ? "لم يتم العثور على معلومات المستخدم" : "User data not found"
      );
      return;
    }
    console.log(data);
    setIsSubmitting(true);

    // try {
    //   const token = localStorage.getItem("token");
      
    //   const response = await fetch(
    //     `https://darreb-academy-backend.vercel.app/api/users/${userData._id}`,
    //     {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: JSON.stringify({
    //         fullName: data.fullName,
    //         headline: data.headline,
    //         bio: data.bio,
    //       }),
    //     }
    //   );

    //   if (!response.ok) {
    //     throw new Error("Update failed");
    //   }

    //   const result = await response.json();
    //   const updatedUser = result.data;
    //   setUserData(updatedUser);
    //   localStorage.setItem("userData", JSON.stringify(updatedUser));

    //   alert(
    //     lang === "ar" ? "تم تحديث الملف الشخصي بنجاح" : "Profile updated successfully"
    //   );
    // } catch (err: any) {
    //   console.error("Update error:", err);
    //   alert(
    //     err.message ||
    //       (lang === "ar" ? "فشل تحديث الملف الشخصي" : "Failed to update profile")
    //   );
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen overflow-y-auto">
      <div className="bg-white  rounded-lg m-4 p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1 text-center text-gray-800">
          {lang === "ar" ? "الملف الشخصي العام" : "Public Profile"}
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          {lang === "ar" ? "أضف معلومات عن نفسك" : "Add information about yourself"}
        </p>

        <div>
          {/* Full Name */}
          <div className="mb-6">
            <label className="text-sm font-semibold mb-3 text-gray-800 block">
              {lang === "ar" ? "الأساسيات:" : "Basics:"}
            </label>

            <Controller
              control={control}
              name="fullName"
              rules={{
                required: lang === "ar" ? "الاسم الكامل مطلوب" : "Full name is required",
              }}
              render={({ field: { onChange, value } }) => (
                <input
                  type="text"
                  value={value}
                  onChange={onChange}
                  placeholder={lang === "ar" ? "الاسم الكامل" : "Full Name"}
                  className={`w-full px-4 py-3 text-base text-gray-700 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.fullName ? "border-red-500" : "border-amber-200"
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

          {/* Headline */}
          <div className="mb-6">
            <Controller
              control={control}
              name="headline"
              render={({ field: { onChange, value } }) => (
                <input
                  type="text"
                  value={value}
                  onChange={onChange}
                  placeholder={lang === "ar" ? "العنوان" : "Headline"}
                  maxLength={60}
                  className="w-full px-4 py-3 text-base text-gray-700 border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              )}
            />
            <p className="text-xs text-gray-500 mt-2">
              {lang === "ar"
                ? 'أضف عنوانًا احترافيًا مثل، "مدرب في Udemy".'
                : 'Add a professional headline like, "Instructor at Udemy".'}
            </p>
          </div>

          {/* Biography */}
          <div className="mb-6">
            <label className="text-sm font-semibold mb-2 text-gray-800 block">
              {lang === "ar" ? "السيرة الذاتية" : "Biography"}
            </label>

            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, value } }) => (
                <textarea
                  value={value}
                  onChange={onChange}
                  placeholder={lang === "ar" ? "السيرة الذاتية" : "Biography"}
                  rows={4}
                  className="w-full px-4 py-3 text-base text-gray-700 border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              )}
            />
            <p className="text-xs text-gray-500 mt-2">
              {lang === "ar"
                ? "لا يُسمح بإضافة روابط أو رموز خصم."
                : "Links and coupon codes are not permitted."}
            </p>
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
                {lang === "ar" ? "حفظ" : "Save"}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}