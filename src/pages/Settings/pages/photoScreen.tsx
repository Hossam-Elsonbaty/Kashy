/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import instance from "../../../instance";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Types
interface UserData {
  id: string;
  pictureUrl?: string;
  [key: string]: unknown;
}

export default function PhotoScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = localStorage.getItem("user");
      if (userDataString) {
        const data = JSON.parse(userDataString);
        setUserData(data);
        setPreview(data.pictureUrl);
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
        toast.error("Please select an image file")
        return;
      }
      // Store the actual file
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      toast.error("Please select a new image")
      return;
    }
    if (!userData?.id) {
      toast.error("User data not found")
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      // Change "pictureUrl" to "file" to match backend expectation
      formData.append("file", selectedFile);
      
      const response = await instance.patch(
        `/api/User/change-profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (!response.status || response.status !== 200) {
        toast.error("Failed to upload photo")
        throw new Error("Upload failed");
      }
      
      const updatedUser = response.data;
      setUserData(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Photo updated successfully")
      // Clear the selected file after successful upload
      setSelectedFile(null);
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Failed to upload photo")
    } finally {
      setIsUploading(false);
    }
  };
  const navigate = useNavigate();
  return (
    <div className="flex-1  min-h-screen overflow-y-auto">
      <Toaster/>
      <div className="flex items-center gap-2 p-4 border-b">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
        </button>
        <h2 className="font-medium text-gray-800">Profile Picture</h2>
      </div>
      <div className="bg-white rounded-lg p-3 max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold text-center mb-1 text-gray-800">
          Photo
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Add a nice photo of yourself for your profile.
        </p>
        <label className="text-sm font-medium mb-2 text-gray-800 block">
          Image Preview
        </label>
        <div className="w-full h-64 border border-gray-200 rounded-lg mb-6 overflow-hidden bg-gray-100">
          {preview ? (
            <img
              src={`https://pub-8520bfdb90294c88a1d3e0d20ed986ef.r2.dev/${preview}`}
              alt="Profile preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex h-full justify-center items-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <label className="text-sm font-medium mb-3 text-gray-800 block">
          Add / Change Image
        </label>
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
          <span className="text-gray-700 font-medium">Choose Image</span>
        </label>
        <button
          onClick={uploadImage}
          disabled={isUploading || !selectedFile}
          className={`w-full py-4 rounded-lg ${
            isUploading || !selectedFile
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
              Save
            </span>
          )}
        </button>
      </div>
    </div>
  );
}