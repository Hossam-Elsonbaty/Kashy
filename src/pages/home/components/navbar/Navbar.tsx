import { MdPersonAddAlt } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import "./_navbar.scss";
import logo from "../../../../assets/sonbaty cashbook2.png";
interface UserDataModel {
  accessToken: string;
  email: string;
  fullName: string;
  id: string;
  pictureUrl: string | null;
  refreshToken: string;
  roles: string[];
  userName: string;
}
const Navbar = () => {
  const userDataStr = localStorage.getItem("user");
  const userData:UserDataModel | null = userDataStr? JSON.parse(userDataStr) : null;
  console.log(userData);
  return (
    <nav className="home-nav bg-white">
      <img src={userData?.pictureUrl? userData.pictureUrl : logo} alt="userImg" />
      <div className="user-info">
        <p className="text-stone-900">{userData?.fullName}</p>
        <p>Tap to switch accounts</p>
      </div>
      <IoIosArrowDown className="arrow" />
      <button className="btn">
        <MdPersonAddAlt className='icon'/>
      </button>
    </nav>
  );
};

export default Navbar;
