import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { ChevronRight, Pencil, LogOut, Users, HelpCircle, Settings as SettingsIcon, User, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  
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
            src="https://via.placeholder.com/60"
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-sm">HossamElsonbaty’s Business</h3>
            <p className="text-xs text-red-500 flex items-center gap-1">
              ⚠️ Incomplete business profile
            </p>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
              <div className="h-2 bg-red-400 rounded-full" style={{ width: "20%" }} />
            </div>
          </div>
          <Button size="icon" variant="ghost">
            <Pencil className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </section>

      {/* General Settings */}
      <section className="px-4">
        <h4 className="text-sm text-gray-500 mb-2">General Settings</h4>

        <div className="space-y-2">
          <div className="flex justify-between items-center py-3 border-b cursor-pointer">
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">App Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex justify-between items-center py-3 border-b cursor-pointer">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Your Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex justify-between items-center py-3 border-b cursor-pointer">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">About CashBook</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div 
            className="flex justify-between items-center py-3 border-b cursor-pointer"
            onClick={() => navigate("/categories")}
          >
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Categories</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </section>

      <Separator className="my-6" />

      {/* Business Section */}
      <section className="px-4">
        <div className="flex justify-between items-center py-3 border-b cursor-pointer">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">Business Team</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        <div className="flex justify-between items-center py-3 border-b cursor-pointer">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">Requests</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </section>

      <Separator className="my-6" />

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
