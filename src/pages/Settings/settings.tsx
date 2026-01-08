import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ChevronRight, LogOut, Settings as SettingsIcon, Trash2, LockKeyhole, Aperture } from "lucide-react";
import userPic from "../../assets/user-pic-male.jpg"
export default function Settings() {
  return (
    <main className="max-w-md mx-auto bg-white min-h-screen flex flex-col gap-5">
      {/* Header */}
      <header className="p-4 border-b">
        <h2 className="text-lg font-semibold">Settings</h2>
      </header>
      {/* Profile Section */}
      <section className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src={userPic}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-sm">HossamElsonbaty’s Business</h3>
          </div>
        </div>
      </section>
      {/* General Settings */}
      <section className="px-4">
        <h4 className="text-sm text-gray-500 mb-2">General Settings</h4>
        <div className="flex flex-col gap-3">
          <Link to="/settings/profile" className="flex justify-between items-center cursor-pointer bg-[#4a4a4a] p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-50">Profile Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link to="/settings/profile-pic" className="flex justify-between items-center bg-[#4a4a4a] p-4 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <Aperture className="w-5 h-5 text-amber-500"/>
              <span className="text-sm font-medium text-gray-50">Profile Picture</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link to="/settings/security" className="flex justify-between items-center bg-[#4a4a4a] p-4 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <LockKeyhole className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-50">Security</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link to="/settings/delete-account" className="flex justify-between items-center bg-[#4a4a4a] p-4 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <Trash2  className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-50">Delete Account</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </section>
      {/* Logout */}
      <div className="px-4 pb-10">
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </main>
  );
}
