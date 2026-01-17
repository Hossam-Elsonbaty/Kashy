/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState } from "react";
import { AlertCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast,{ Toaster } from "react-hot-toast";
import instance from "../../../instance";

export default function DeleteAccountScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const userDataString = localStorage.getItem("user");
      if (!userDataString) {
        toast.error("User data not found");
        return;
      }
      setIsDeleting(true);
      const response = await instance.delete(`/api/User`);
      if (!response.status) {
        const errorData = await response;
        throw new Error(errorData.data.message || "Failed to delete account");
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsModalOpen(false);
      toast.success("Your account has been deleted successfully");
      window.location.assign("/login");
    } catch (error: any) {
      console.error("Delete account error:", error);
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };
  const showDeleteConfirmation = () => {
    setIsModalOpen(true);
  };
  const navigate = useNavigate();
  return (
    <>
      <div className="flex-1 bg-gray-50 min-h-screen overflow-y-auto">
        <Toaster />
        <div className="flex items-center gap-2 p-4 border-b">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
          </button>
          <h2 className="font-medium text-gray-800">Delete Account</h2>
        </div>
        <div className="bg-white rounded-lg p-3 max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold text-red-600 mb-4">
            Delete Account
          </h1>

          {/* Warning Box */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-semibold">
                Warning!
              </span>
            </div>
            <p className="text-red-700 text-sm">
              This action is permanent and cannot be undone.
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6 leading-6">
            Once you delete your account, all your data will be permanently removed including purchased courses and learning progress.
          </p>

          {/* Delete Button */}
          <button
            onClick={showDeleteConfirmation}
            className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-lg transition-colors"
          >
            <span className="text-white text-center font-semibold text-base">
              Delete My Account
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
              Are you sure?
            </h2>

            {/* Message */}
            <p className="text-sm text-center text-gray-600 mb-6 leading-6">
              Once you confirm, your account will be permanently deleted and you won't be able to recover it. All your courses and data will be lost forever.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                <span className="text-gray-700 text-center font-semibold">
                  Cancel
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
                    Confirm
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