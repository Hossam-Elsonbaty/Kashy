import { IoMdAdd } from "react-icons/io";
import { useState, useEffect } from "react";
import DialogDemo from "../../../../components/DialogDemo";
export const AddBtn = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsMinimized(true);
      } else if (currentScrollY < lastScrollY) {
        setIsMinimized(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`fixed bottom-[16%] right-[5%] flex items-center gap-[10px] overflow-hidden rounded-[40px] bg-amber-400 p-3 shadow-lg transition-all duration-300 ease-in-out cursor-pointer 
        ${isMinimized ? "w-[45px]" : "w-[175px]"}`}
      >
        <IoMdAdd
          className={`shrink-0 text-[22px] text-primary-foreground transition-transform duration-300 
          ${isMinimized ? "scale-110" : "scale-100"}`}
        />
        <p
          className={`m-0 whitespace-nowrap text-[16px] font-semibold text-primary-foreground transition-opacity duration-200 
          ${isMinimized ? "pointer-events-none opacity-0" : "opacity-100"}`}
        >
          Add New Book
        </p>
      </div>
      <DialogDemo
        open={open}
        onOpenChange={setOpen}
        isUpdate={false}
        book_name=""
        id=""
      />
    </>
  );
};
