import  { useState } from "react";
import { AlertCircle, AlertTriangle } from "lucide-react";

// Types
interface LanguageContextType {
  language: string;
}

// Mock Language Context Hook (replace with your actual context)
const useLanguage = (): LanguageContextType => {
  const [language] = useState("en");
  return { language };
};

export default function DeleteAccountScreen() {
  const { language } = useLanguage();
  const lang = language === "ar" ? "ar" : "en";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    // try {
    //   const userDataString = localStorage.getItem("userData");
    //   if (!userDataString) {
    //     alert(
    //       lang === "ar" ? "لم يتم العثور على بيانات المستخدم" : "User data not found"
    //     );
    //     return;
    //   }

    //   const userData = JSON.parse(userDataString);
    //   setIsDeleting(true);

    //   const token = localStorage.getItem("token");
    //   const response = await fetch(
    //     `https://darreb-academy-backend.vercel.app/api/users/${userData._id}`,
    //     {
    //       method: "DELETE",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || "Failed to delete account");
    //   }

    //   // Clear all stored data
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("userData");

    //   setIsModalOpen(false);

    //   // Show success message
    //   alert(
    //     lang === "ar"
    //       ? "تم حذف حسابك بنجاح"
    //       : "Your account has been deleted successfully"
    //   );

    //   // Redirect to home page
    //   window.location.href = "/";
    // } catch (error: any) {
    //   console.error("Delete account error:", error);
    //   alert(
    //     error.message ||
    //       (lang === "ar" ? "فشل حذف الحساب" : "Failed to delete account")
    //   );
    // } finally {
    //   setIsDeleting(false);
    // }
  };

  const showDeleteConfirmation = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex-1 bg-gray-50 min-h-screen overflow-y-auto">
        <div className="bg-white rounded-lg m-4 p-6 max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-red-600 mb-4">
            {lang === "ar" ? "حذف الحساب" : "Delete Account"}
          </h1>

          {/* Warning Box */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-semibold">
                {lang === "ar" ? "تحذير!" : "Warning!"}
              </span>
            </div>
            <p className="text-red-700 text-sm">
              {lang === "ar"
                ? "هذه العملية دائمة ولا يمكن التراجع عنها."
                : "This action is permanent and cannot be undone."}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6 leading-6">
            {lang === "ar"
              ? "بمجرد حذف حسابك، سيتم إزالة جميع بياناتك بشكل دائم بما في ذلك الدورات المشتراة والتقدم في التعلم."
              : "Once you delete your account, all your data will be permanently removed including purchased courses and learning progress."}
          </p>

          {/* Delete Button */}
          <button
            onClick={showDeleteConfirmation}
            className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-lg transition-colors"
          >
            <span className="text-white text-center font-semibold text-base">
              {lang === "ar" ? "حذف حسابي" : "Delete My Account"}
            </span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            {/* Warning Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-center mb-2 text-gray-900">
              {lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?"}
            </h2>

            {/* Message */}
            <p className="text-sm text-center text-gray-600 mb-6 leading-6">
              {lang === "ar"
                ? "بمجرد تأكيدك، سيتم حذف حسابك بشكل دائم ولن تتمكن من استعادته. جميع دوراتك وبياناتك ستُفقد نهائياً."
                : "Once you confirm, your account will be permanently deleted and you won't be able to recover it. All your courses and data will be lost forever."}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="text-gray-700 text-center font-semibold">
                  {lang === "ar" ? "إلغاء" : "Cancel"}
                </span>
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className={`flex-1 py-3 rounded-lg transition-colors ${
                  isDeleting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <span className="text-white text-center font-semibold">
                    {lang === "ar" ? "تأكيد" : "Confirm"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}