import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signup, clearPendingSignupData } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get pending signup data from Redux
  const { pendingSignupData, isSigningUp } = useSelector((state) => state.auth);

  // Redirect if no pending data (user refreshed or came directly)
  useEffect(() => {
    if (!pendingSignupData) {
      navigate("/register");
    }
  }, [pendingSignupData, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!pendingSignupData) return;

    try {
      await dispatch(
        signup({
          ...pendingSignupData,
          otp,
        })
      ).unwrap();

      // Clear pending data after successful signup
      dispatch(clearPendingSignupData());

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleResend = async () => {
    if (!pendingSignupData?.email) return;

    setIsResending(true);
    try {
      await dispatch(sendOtp({ email: pendingSignupData.email })).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setIsResending(false);
    }
  };

  if (!pendingSignupData) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Verify Your Email
          </h2>
          <p className="text-center text-gray-400 mb-2">
            We've sent a verification code to
          </p>
          <p className="text-center text-blue-400 font-medium mb-8">
            {pendingSignupData.email}
          </p>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-center text-2xl tracking-widest"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSigningUp || otp.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSigningUp ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Verify & Create Account"
              )}
            </button>
          </form>

          {/* Resend Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-blue-400 hover:text-blue-300 font-medium transition duration-200 disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend"}
              </button>
            </p>
          </div>

          {/* Back to Register */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                dispatch(clearPendingSignupData());
                navigate("/register");
              }}
              className="text-gray-500 hover:text-gray-300 text-sm transition duration-200"
            >
              ← Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;