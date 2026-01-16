/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Types
interface UserData {
  _id: string;
  email?: string;
  [key: string]: any;
}

interface FormData {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface LanguageContextType {
  language: string;
}

// Mock Language Context Hook (replace with your actual context)
const useLanguage = (): LanguageContextType => {
  const [language] = useState("en");
  return { language };
};

export default function SecurityScreen() {
  const { language } = useLanguage();
  const lang = language === "ar" ? "ar" : "en";
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  }); 

  const newPassword = watch("newPassword");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const data = JSON.parse(userDataString);
        setUserData(data);
        setValue("email", data.email || "");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log(data);
    
    if (!userData?._id) {
      alert(
        lang === "ar" ? "لم يتم العثور على معلومات المستخدم" : "User data not found"
      );
      return;
    }

    setIsSubmitting(true);

    // try {
    //   const token = localStorage.getItem("token");

    //   const response = await fetch(
    //     `https://darreb-academy-backend.vercel.app/api/users/change-password/${userData._id}`,
    //     {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: JSON.stringify({
    //         oldPassword: data.oldPassword,
    //         newPassword: data.newPassword,
    //         confirmPassword: data.confirmPassword,
    //       }),
    //     }
    //   );

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || "Failed to change password");
    //   }

    //   const result = await response.json();
    //   const updatedUser = result.data;
    //   setUserData(updatedUser);
    //   localStorage.setItem("userData", JSON.stringify(updatedUser));

    //   alert(
    //     lang === "ar" ? "تم تغيير كلمة المرور بنجاح" : "Password changed successfully"
    //   );

    //   // Clear password fields
    //   setValue("oldPassword", "");
    //   setValue("newPassword", "");
    //   setValue("confirmPassword", "");
    // } catch (err: any) {
    //   console.error("Password change error:", err);
    //   alert(
    //     err.message ||
    //       (lang === "ar" ? "فشل تغيير كلمة المرور" : "Failed to change password")
    //   );
    // } finally {
    //   setIsSubmitting(false);
    // }
  };
  const navigate = useNavigate();
  return (
    <div className="flex-1 bg-gray-50 min-h-screen overflow-y-auto">
      <Toaster />
      <div className="flex items-center gap-2 p-4 border-b">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
        </button>
        <h2 className="font-medium text-gray-800">Account settings</h2>
      </div>
      <div className="bg-white rounded-lg p-3 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1 text-center text-gray-800">
          {lang === "ar" ? "الحساب" : "Account"}
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          {lang === "ar"
            ? "قم بتعديل إعدادات حسابك وتغيير كلمة المرور هنا."
            : "Edit your account settings and change your password here."}
        </p>

        <div>
          {/* Email (Disabled) */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="text-sm font-semibold mb-3 text-gray-800 block">
              {lang === "ar" ? "البريد الإلكتروني:" : "Email:"}
            </label>
            <Controller
              control={control}
              name="email"
              render={({ field: { value } }) => (
                <input
                  type="email"
                  value={value}
                  disabled
                  placeholder={lang === "ar" ? "البريد الإلكتروني" : "Email"}
                  className="w-full px-4 py-3 text-base text-gray-500 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              )}
            />
          </div>

          {/* Old Password */}
          <div className="mb-6">
            <label className="text-sm font-semibold mb-3 text-gray-800 block">
              {lang === "ar" ? "كلمة المرور القديمة:" : "Old Password:"}
            </label>
            <Controller
              control={control}
              name="oldPassword"
              rules={{
                required:
                  lang === "ar" ? "كلمة المرور مطلوبة" : "Password is required",
              }}
              render={({ field: { onChange, value } }) => (
                <input
                  type="password"
                  value={value}
                  onChange={onChange}
                  placeholder={lang === "ar" ? "كلمة المرور القديمة" : "Old Password"}
                  className={`w-full px-4 py-3 text-base text-gray-700 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.oldPassword ? "border-red-500" : "border-amber-200"
                  }`}
                />
              )}
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="mb-6">
            <label className="text-sm font-semibold mb-3 text-gray-800 block">
              {lang === "ar" ? "كلمة المرور الجديدة:" : "New Password:"}
            </label>
            <Controller
              control={control}
              name="newPassword"
              rules={{
                required:
                  lang === "ar"
                    ? "كلمة المرور الجديدة مطلوبة"
                    : "New Password is required",
                minLength: {
                  value: 8,
                  message:
                    lang === "ar"
                      ? "يجب أن تكون كلمة المرور على الأقل 8 أحرف"
                      : "Password must be at least 8 characters",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <input
                  type="password"
                  value={value}
                  onChange={onChange}
                  placeholder={lang === "ar" ? "كلمة المرور الجديدة" : "New Password"}
                  className={`w-full px-4 py-3 text-base text-gray-700 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.newPassword ? "border-red-500" : "border-amber-200"
                  }`}
                />
              )}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="text-sm font-semibold mb-3 text-gray-800 block">
              {lang === "ar" ? "تأكيد كلمة المرور:" : "Confirm Password:"}
            </label>
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required:
                  lang === "ar"
                    ? "يرجى تأكيد كلمة المرور"
                    : "Please confirm your password",
                validate: (value) =>
                  value === newPassword ||
                  (lang === "ar"
                    ? "كلمات المرور غير متطابقة"
                    : "Passwords do not match"),
              }}
              render={({ field: { onChange, value } }) => (
                <input
                  type="password"
                  value={value}
                  onChange={onChange}
                  placeholder={lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
                  className={`w-full px-4 py-3 text-base text-gray-700 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    errors.confirmPassword ? "border-red-500" : "border-amber-200"
                  }`}
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
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
                {lang === "ar" ? "تغيير كلمة المرور" : "Change Password"}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}