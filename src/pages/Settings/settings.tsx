import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ChevronRight, LogOut, Settings as SettingsIcon, Trash2, LockKeyhole, Aperture, ArrowLeft } from "lucide-react";
import userPic from "../../assets/user-pic-male.jpg";
interface User {
  accessToken: string;
  email: string;
  fullName: string;
  id: string;
  pictureUrl: null;
  refreshToken: string;
  roles: string[];
  userName: string;
}
export default function Settings() {
  const navigate = useNavigate();
  const userData = localStorage.getItem('user')
  const user: User | null = userData? JSON.parse(userData) : null
  const handleLogout = ()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.assign('login')
  }
  return (
    <main className="max-w-md mx-auto bg-white min-h-screen flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
        </button>
        <h2 className="font-medium text-gray-800">Settings</h2>
      </div>
      {/* Profile Section */}
      <section className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src={user?.pictureUrl?`https://pub-8520bfdb90294c88a1d3e0d20ed986ef.r2.dev/${user.pictureUrl}`:userPic}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{user?.fullName}'s Business</h3>
          </div>
        </div>
      </section>
      {/* General Settings */}
      <section className="px-4">
        <h4 className="text-sm text-gray-500 mb-2">General Settings</h4>
        <div className="flex flex-col gap-3">
          <Link to="/settings/profile" className="flex justify-between items-center cursor-pointer bg-gray-200 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-500">Profile Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link to="/settings/profile-pic" className="flex justify-between items-center bg-gray-200 p-4 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <Aperture className="w-5 h-5 text-amber-500"/>
              <span className="text-sm font-medium text-gray-500">Profile Picture</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link to="/settings/security" className="flex justify-between items-center bg-gray-200 p-4 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <LockKeyhole className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-500">Security</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link to="/settings/delete-account" className="flex justify-between items-center bg-gray-200 p-4 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <Trash2  className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-500">Delete Account</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </section>
      {/* Logout */}
      <div className="px-4 mt-6">
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </main>
  );
}
