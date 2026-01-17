import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer" />
        </button>
        <h2 className="font-medium text-gray-800">Payment Methods</h2>
      </div>
    </div>
  );
};

export default Navbar;
