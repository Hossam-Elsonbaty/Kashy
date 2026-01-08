/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../../assets/sonbaty cashbook2.png';
import '../login/_login.scss';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import type { SignupFormData, SignupFormErrors } from "../../models/register";
const Signup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const api_url: string = "https://kashly.runasp.net/api/Account/Register";
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [isErrorSubmit, setIsErrorSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof SignupFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  const validateForm = (): boolean => {
    const newErrors: SignupFormErrors = {};
    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number and special character.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post(
        api_url,
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      navigate("/login", {replace:true});
    } catch (error: unknown) {
      console.error("Signup error:", error);
      setIsErrorSubmit(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="flex flex-col bg-gray-900">
      <div className="flex items-center flex-col gap-4 h-60 justify-center">
        <img src={logo} alt="Sonbaty Cashbook Logo" className="w-42"/>
        <h1 className="text-gray-400">Please sign up to get started</h1>
      </div>
      <form onSubmit={handleSubmit} noValidate className="bg-white w-full rounded-t-2xl flex flex-col gap-4 p-4">
        <div className="flex gap-2 flex-col">
          <label className="text-gray-500 text-sm"> FULL NAME </label>
          <input
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? "p-4 w-full rounded-xl bg-gray-200 error" : "p-4 w-full rounded-xl bg-gray-200"}
            required
          />
          {errors.fullName && (
            <span className="text-red-800">{errors.fullName}</span>
          )}
        </div>
        <div className="flex gap-2 flex-col">
          <label className="text-gray-500 text-sm"> EMAIL </label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "p-4 w-full rounded-xl bg-gray-200 error" : "p-4 w-full rounded-xl bg-gray-200"}
            required
          />
          {errors.email && (
            <span className="text-red-800">{errors.email}</span>
          )}
        </div>
        <div className="flex gap-2 flex-col relative">
          <label className="text-gray-500 text-sm"> PASSWORD </label>
          <input
            type={showPassword?"text" : "password"}
            name="password"
            placeholder="*************"
            value={formData.password}
            onChange={handleChange}
            className={errors.fullName ? " p-4 w-full rounded-xl bg-gray-200 error" : " p-4 w-full rounded-xl bg-gray-200"}
            required
          />
          <button type="button" className="absolute right-5 top-11 " onClick={()=>setShowPassword(!showPassword)}>
            {showPassword?
            <FaRegEye className="text-lg text-gray-400"/>
            :
            <FaRegEyeSlash className="text-lg text-gray-400"/>
            }
          </button>
          {errors.password && (
            <span className="text-red-800">{errors.password}</span>
          )}
        </div>
        <div className="flex gap-2 flex-col relative">
          <label className="text-gray-500 text-sm"> RE-TYPE PASSWORD </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="*************"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.fullName ? "p-4 w-full rounded-xl bg-gray-200 error" : "p-4 w-full rounded-xl bg-gray-200"}
            required
          />
          <button  className="absolute right-5 top-11 " onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword?
            <FaRegEye className="text-lg text-gray-400"/>
            :
            <FaRegEyeSlash className="text-lg text-gray-400"/>
          }
          </button>
          {errors.confirmPassword && (
            <span className="text-red-800">{errors.confirmPassword}</span>
          )}
        </div>
        <button className="w-full bg-[#f0b100] rounded-2xl p-4 text-white " type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "SIGN UP"}
        </button>
        <div className="flex gap-2 justify-center">
          <p className="text-gray-400">Already have an account ?</p>
          <Link to="/login" className="text-[#f0b100] font-bold ">SIGN IN</Link>
        </div>
        {isErrorSubmit && (
        <div className="text-danger text-center">
          Something went wrong. Please try again.
        </div>
        )}
      </form>
      {/* <img src={logo} alt="Sonbaty Cashbook Logo" />
      <h1>Create Your Account</h1>
      <form className="flex-center" onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? "error" : ""}
            required
          />
          {errors.fullName && (
            <span className="error-message">{errors.fullName}</span>
          )}
        </div>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            required
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>
        <div className="input-group password-input flex items-center flex-col">
          <div className="flex items-center">
            <input
              type={showPassword?"text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              required
            />
            <button type="button" className="absolute right-5 " onClick={()=>setShowPassword(!showPassword)}>
              {showPassword?
              <FaRegEye className="icon"/>
              :
              <FaRegEyeSlash className="icon"/>
              }
            </button>
          </div>
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>
        <div className="input-group password-input flex items-center flex-col">
          <div className="flex items-center">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
              required
            />
            <button type="button" className="absolute right-5 " onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword?
              <FaRegEye className="icon"/>
              :
              <FaRegEyeSlash className="icon"/>
            }
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>
        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign up"}
        </button>
      </form>
      <span>
        Already have an account? <Link to="/login">Login</Link>
      </span>
      {isErrorSubmit && (
        <span className="text-danger">
          Something went wrong. Please try again.
        </span>
      )} */}
    </main>
  );
};

export default Signup;
