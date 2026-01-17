import { MdBook } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import './_footer.scss'
import { Layers2 ,CreditCard} from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  const params = window.location.pathname;
  return (
    <footer className="home-footer bg-white">
      <Link to="/" 
        className={`col flex-center ${params === '/' ? 'active' : ''}`}
      >
        <MdBook className={params === '/' ? 'active' : ''} />
        <p className={params === '/' ? 'active' : ''}>Cashbooks</p>
      </Link>
      <Link to="/categories"
        className={`col flex-center ${params === '/categories' ? 'active' : ''}`}
      >
        <Layers2 className={params === '/categories' ? 'active w-5' : 'w-5'}/>
        <p className={params === '/categories' ? 'active' : ''}>Categories</p>
      </Link>
      <Link to="/payment-methods"
        className={`col flex-center ${params === '/payment-methods' ? 'active' : ''}`}
      >
        <CreditCard className={params === '/payment-methods' ? 'active w-5' : 'w-5'}/>
        <p className={params === '/payment-methods' ? 'active' : ''}>PaymentMethods</p>
      </Link>
      <Link to="/settings"
        className={`col flex-center ${params === '/settings' ? 'active' : ''}`}
      >
        <IoSettings className={params === '/settings' ? 'active' : ''} />
        <p className={params === '/settings' ? 'active' : ''}>Settings</p>
      </Link>
    </footer>
  )
}

export default Footer