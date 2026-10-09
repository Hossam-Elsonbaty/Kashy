import axios from "axios";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/sonbaty cashbook2.png";

const accountApiUrl = "https://kashly.runasp.net/api/Account";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCodeRequested, setIsCodeRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const requestResetCode = async (): Promise<void> => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      await axios.post(`${accountApiUrl}/RequestPasswordReset`, {
        emailOrPhone: emailOrPhone.trim(),
        emailLang: "en",
      });
      setIsCodeRequested(true);
    } catch (error: unknown) {
      console.error("Password reset request failed:", error);
      setErrorMessage("Unable to request a reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailOrPhone.trim()) {
      setErrorMessage("Enter your email address or phone number.");
      return;
    }

    await requestResetCode();
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!/^\d{6}$/.test(resetCode)) {
      setErrorMessage("Enter the 6-digit reset code.");
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 100) {
      setErrorMessage("Password must be between 6 and 100 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${accountApiUrl}/ResetPassword`, {
        emailOrPhone: emailOrPhone.trim(),
        resetCode,
        newPassword,
      });
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      console.error("Password reset failed:", error);
      setErrorMessage("Unable to reset your password. Check the code and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-900">
      <div className="flex h-60 flex-col items-center justify-center gap-4">
        <img src={logo} alt="Sonbaty Cashbook Logo" className="w-42" />
        <h1 className="text-gray-400">
          {isCodeRequested ? "Reset your password" : "Recover your account"}
        </h1>
      </div>

      {isCodeRequested ? (
        <form
          className="flex flex-1 flex-col gap-5 rounded-t-2xl bg-white p-4 pt-8"
          onSubmit={handleResetPassword}
          noValidate
        >
          <p className="text-sm text-gray-500">
            If an account exists for {emailOrPhone.trim()}, a reset code has been
            sent. Enter the 6-digit code and choose a new password.
          </p>
          <div className="flex flex-col gap-2">
            <label htmlFor="resetCode" className="text-sm text-gray-500">
              RESET CODE
            </label>
            <input
              id="resetCode"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              value={resetCode}
              onChange={(event) => setResetCode(event.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl bg-gray-200 p-4"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="newPassword" className="text-sm text-gray-500">
              NEW PASSWORD
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-xl bg-gray-200 p-4"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm text-gray-500">
              CONFIRM NEW PASSWORD
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl bg-gray-200 p-4"
              required
            />
          </div>
          {errorMessage && (
            <p role="alert" className="text-sm text-red-700">
              {errorMessage}
            </p>
          )}
          <button
            className="w-full rounded-2xl bg-[#f0b100] p-4 text-white disabled:opacity-60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Resetting password..." : "Reset password"}
          </button>
          <button
            type="button"
            className="text-sm font-semibold text-[#b88700]"
            onClick={() => void requestResetCode()}
            disabled={isLoading}
          >
            Resend code
          </button>
          <button
            type="button"
            className="text-sm text-gray-500"
            onClick={() => {
              setIsCodeRequested(false);
              setErrorMessage("");
            }}
          >
            Use a different email or phone number
          </button>
        </form>
      ) : (
        <form
          className="flex flex-1 flex-col gap-5 rounded-t-2xl bg-white p-4 pt-8"
          onSubmit={handleRequestCode}
          noValidate
        >
          <p className="text-sm text-gray-500">
            Enter the email address or phone number associated with your account.
          </p>
          <div className="flex flex-col gap-2">
            <label htmlFor="emailOrPhone" className="text-sm text-gray-500">
              EMAIL OR PHONE
            </label>
            <input
              id="emailOrPhone"
              type="text"
              autoComplete="username"
              placeholder="Email address or phone number"
              value={emailOrPhone}
              onChange={(event) => setEmailOrPhone(event.target.value)}
              className="w-full rounded-xl bg-gray-200 p-4"
              required
            />
          </div>
          {errorMessage && (
            <p role="alert" className="text-sm text-red-700">
              {errorMessage}
            </p>
          )}
          <button
            className="w-full rounded-2xl bg-[#f0b100] p-4 text-white disabled:opacity-60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sending code..." : "Send reset code"}
          </button>
          <div className="text-center">
            <Link to="/login" className="font-semibold text-[#b88700]">
              Back to login
            </Link>
          </div>
        </form>
      )}
    </main>
  );
};

export default ForgotPassword;
