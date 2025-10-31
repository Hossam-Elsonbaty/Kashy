import { IoMdAdd } from "react-icons/io";
import { useState, useEffect } from "react";
import './_addBtn.scss'
import DialogDemo from "../../../../components/DialogDemo";
export const AddBtn = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [open, setOpen] = useState(false)
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
    window.addEventListener('scroll', handleScroll);    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <div onClick={() => setOpen(true)} className={`float-btn bg-amber-400 ${isMinimized ? 'minimized' : ''}`}>
        <IoMdAdd className='text-amber-700'/>
        <p className='text-amber-700'>Add New Book</p>
      </div>
      <DialogDemo open={open} onOpenChange={setOpen} />
    </>
  );
};