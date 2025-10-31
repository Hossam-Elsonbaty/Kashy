import { MdBook } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { useState } from "react";
import './_footer.scss'
const Footer = () => {
  const [activeTab, setActiveTab] = useState<'cashbooks' | 'settings'>('cashbooks');
  
  return (
    <footer className="home-footer bg-white">
      <div 
        onClick={() => setActiveTab('cashbooks')} 
        className={`col flex-center ${activeTab === 'cashbooks' ? 'active' : ''}`}
      >
        <MdBook className={activeTab === 'cashbooks' ? 'active' : ''} />
        <p className={activeTab === 'cashbooks' ? 'active' : ''}>Cashbooks</p>
      </div>
      <div 
        onClick={() => setActiveTab('settings')} 
        className={`col flex-center ${activeTab === 'settings' ? 'active' : ''}`}
      >
        <IoSettings className={activeTab === 'settings' ? 'active' : ''} />
        <p className={activeTab === 'settings' ? 'active' : ''}>Settings</p>
      </div>
    </footer>
  )
}

export default Footer