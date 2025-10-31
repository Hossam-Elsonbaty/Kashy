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
      navigate("/");
    } catch (error: unknown) {
      console.log(error);
      setIsErrorSubmit(true)
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="login-page flex-center">
      <img src={logo} alt="Sonbaty Cashbook Logo" />
      <h1>Welcome Back!</h1>
      <form className="flex-center" onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Please Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="input-group flex items-center">
          <input
            type={showPassword?"text" : "password"}
            name="password"
            placeholder="Your Password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
            required
          />
          <button type="button" className="absolute right-5 " onClick={()=>setShowPassword(!showPassword)}>
            {showPassword?
            <FaRegEye />
            :
            <FaRegEyeSlash />
            }
          </button>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        <button 
          className="btn" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <span>
        Don't have an account? <Link to="/sign-up">Sign Up</Link>
      </span>
      {isErrorSubmit && (
        <span className="text-danger">
          Invalid credentials. Please try again.
        </span>
      )}
    </main>
  );
};

export default Login;
