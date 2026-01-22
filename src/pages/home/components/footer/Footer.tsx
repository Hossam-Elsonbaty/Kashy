import { MdBook } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BiSolidCategory } from "react-icons/bi";
import { MdOutlinePayment } from "react-icons/md";
const Footer = () => {
  const params = window.location.pathname;
  return (
    <footer className=" bg-white flex justify-between sticky bottom-0 shadow-lg">
      <Link
        to="/"
        className={` flex flex-col gap-1 items-center justify-center  p-2 ${params === "/" ? "active border-t-2 border-yellow-500" : ""}`}
      >
        <MdBook
          className={`text-[20px] ${params === "/" ? "text-yellow-500" : "text-gray-500"}`}
        />
        <p
          className={`font-semibold text-[10px] ${params === "/" ? "text-yellow-500" : "text-gray-500"}`}
        >
          Cashbooks
        </p>
      </Link>

      <Link
        to="/categories"
        className={`col flex flex-col gap-1 items-center justify-center  p-2 ${params === "/categories" ? "active border-t-2 border-yellow-500" : ""}`}
      >
        <BiSolidCategory
          className={`text-[20px] ${params === "/categories" ? "text-yellow-500" : "text-gray-500"}`}
        />
        <p
          className={`font-semibold text-[10px] ${params === "/categories" ? "text-yellow-500" : "text-gray-500"}`}
        >
          Categories
        </p>
      </Link>

      <Link
        to="/payment-methods"
        className={`col flex flex-col gap-1 items-center justify-center  p-2 ${params === "/payment-methods" ? "active border-t-2 border-yellow-500" : ""}`}
      >
        <MdOutlinePayment
          className={`text-[20px] ${params === "/payment-methods" ? "text-yellow-500" : "text-gray-500"}`}
        />
        <p
          className={`font-semibold text-[10px] ${params === "/payment-methods" ? "text-yellow-500" : "text-gray-500"}`}
        >
          Payment Methods
        </p>
      </Link>

      <Link
        to="/settings"
        className={`col flex flex-col items-center justify-center gap-1 p-2 ${params === "/settings" ? "active border-t-2 border-yellow-500" : ""}`}
      >
        <IoSettings
          className={`text-[20px] ${params === "/settings" ? "text-yellow-500" : "text-gray-500"}`}
        />
        <p
          className={`font-semibold text-[10px] ${params === "/settings" ? "text-yellow-500" : "text-gray-500"}`}
        >
          Settings
        </p>
      </Link>
    </footer>
  );
};

export default Footer;
