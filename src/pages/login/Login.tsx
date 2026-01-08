import axios from "axios";
import logo from '../../assets/sonbaty cashbook2.png';
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import './_login.scss'
import type { LoginFormData, LoginFormErrors } from "../../models/register";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const api_url:string = 'https://kashly.runasp.net/api/Account/Login';
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isErrorSubmit, setIsErrorSubmit] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        api_url,
        {
          emailOrPhone: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      navigate("/",{ replace: true });
    } catch (error: unknown) {
      console.log(error);
      setIsErrorSubmit(true)
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="flex flex-col bg-gray-900 h-screen">
      <div className="flex items-center flex-col gap-4 h-90 justify-center">
        <img src={logo} alt="Sonbaty Cashbook Logo" className="w-42"/>
        <h1 className="text-gray-400">Please sign up to your existing Account</h1>
      </div>
      <form className="bg-white w-full rounded-t-2xl flex flex-col gap-9 p-4 h-full pt-8" onSubmit={handleSubmit} noValidate>
        <div className="flex gap-2 flex-col">
          <label className="text-gray-500 text-sm"> EMAIL </label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error p-4 w-full rounded-xl bg-gray-200" : "p-4 w-full rounded-xl bg-gray-200"}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="flex gap-2 flex-col relative">
          <label className="text-gray-500 text-sm"> PASSWORD </label>
          <input
            type={showPassword?"text" : "password"}
            name="password"
            placeholder="*************"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error p-4 w-full rounded-xl bg-gray-200" : "p-4 w-full rounded-xl bg-gray-200"}
            required
          />
          <button className="absolute right-5 top-11" onClick={()=>setShowPassword(!showPassword)}>
            {showPassword?
            <FaRegEye className="text-lg text-gray-400"/>
            :
            <FaRegEyeSlash className="text-lg text-gray-400"/>
            }
          </button>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        <button 
          className="w-full bg-[#f0b100] rounded-2xl p-4 text-white "
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <div className="flex gap-2 justify-center">
          <p className="text-gray-400">Don't have an account ?</p>
          <Link to="/sign-up" className="text-[#f0b100] font-bold ">SIGN UP</Link>
        </div>
      </form>
      {isErrorSubmit && (
        <span className="text-danger">
          Invalid credentials. Please try again.
        </span>
      )}
    </main>
  );
};

export default Login;
