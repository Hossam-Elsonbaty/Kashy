import { MdBook } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { useState } from "react";
import './_footer.scss'
import { Link } from "react-router-dom";
import { Layers2 } from "lucide-react";
const Footer = () => {
  const [activeTab, setActiveTab] = useState<'cashbooks' | 'settings' | 'categories'>('cashbooks');
  
  return (
    <footer className="home-footer bg-white">
      <div 
        onClick={() => setActiveTab('cashbooks')} 
        className={`col flex-center ${activeTab === 'cashbooks' ? 'active' : ''}`}
      >
        <MdBook className={activeTab === 'cashbooks' ? 'active' : ''} />
        <p className={activeTab === 'cashbooks' ? 'active' : ''}>Cashbooks</p>
      </div>
      <Link to="/categories"
        onClick={() => setActiveTab('categories')} 
        className={`col flex-center ${activeTab === 'categories' ? 'active' : ''}`}
      >
        <Layers2 className={activeTab === 'settings' ? 'active' : ''}/>
        <p className={activeTab === 'categories' ? 'active' : ''}>Categories</p>
      </Link>
      <Link to="/settings"
        onClick={() => setActiveTab('settings')} 
        className={`col flex-center ${activeTab === 'settings' ? 'active' : ''}`}
      >
        <IoSettings className={activeTab === 'settings' ? 'active' : ''} />
        <p className={activeTab === 'settings' ? 'active' : ''}>Settings</p>
      </Link>
    </footer>
  )
}

export default Footer