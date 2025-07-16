import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { usePostMutation } from "../service/apiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../ui/Loader";

export function Register() {
  const [postMutation, { isLoading }] = usePostMutation();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = (values) => {
    const errors = {};

    // Name validation
    if (!values.name) {
      errors.name = "Name is required";
    } else if (values.name.length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email address";
    }

    // Password validation
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { ...submitData } = values;
      const response = await postMutation({
        path: "/auth/register",
        body: submitData,
        method: "POST",
      });

      if (response?.data?.user) {
        toast.success("Registration successful! Please sign in.");
        navigate("/auth/login");
      } else {
        toast.error(
          response?.error?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [navigate, token]);

  const getPasswordMatch = (password, confirmPassword) => {
    if (!password || !confirmPassword) return null;
    return password === confirmPassword;
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <section className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-indigo-600 rounded-full mb-4 sm:mb-6">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h2 className="font-bold mb-2 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl text-white">
                Create Account
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 px-2">
                Join us today and get started with your journey
              </p>
            </div>

            {/* Registration Form */}
            <div className="w-full max-w-sm sm:max-w-md mx-auto">
              <div className="backdrop-blur-sm bg-gray-800/50 p-6 sm:p-8 rounded-2xl border border-gray-700 shadow-2xl">
                <Formik
                  initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  }}
                  validate={validate}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, values }) => (
                    <Form className="space-y-4 sm:space-y-6">
                      {/* Full Name Field */}
                      <div className="space-y-2">
                        <label
                          className="block text-sm font-medium text-gray-200"
                          htmlFor="name"
                        >
                          Full Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70 text-sm sm:text-base"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-xs sm:text-sm text-red-400 mt-1"
                        />
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <label
                          className="block text-sm font-medium text-gray-200"
                          htmlFor="email"
                        >
                          Email Address
                        </label>
                        <Field
                          type="email"
                          name="email"
                          placeholder="name@gmail.com"
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70 text-sm sm:text-base"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-xs sm:text-sm text-red-400 mt-1"
                        />
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <label
                          className="block text-sm font-medium text-gray-200"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <Field
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Create a strong password"
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70 text-sm sm:text-base"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                          >
                            {showPassword ? (
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-xs sm:text-sm text-red-400 mt-1"
                        />
                      </div>

                      {/* Confirm Password Field */}
                      <div className="space-y-2">
                        <label
                          className="block text-sm font-medium text-gray-200"
                          htmlFor="confirmPassword"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Field
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            className={`w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70 text-sm sm:text-base ${
                              values.confirmPassword
                                ? getPasswordMatch(
                                    values.password,
                                    values.confirmPassword
                                  )
                                  ? "border-green-500 focus:ring-green-500"
                                  : "border-red-500 focus:ring-red-500"
                                : "border-gray-600 focus:ring-green-500"
                            }`}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                            {values.confirmPassword && (
                              <div className="flex items-center">
                                {getPasswordMatch(
                                  values.password,
                                  values.confirmPassword
                                ) ? (
                                  <svg
                                    className="w-4 h-4 text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="w-4 h-4 text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                )}
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                              {showConfirmPassword ? (
                                <svg
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-xs sm:text-sm text-red-400 mt-1"
                        />
                        {values.confirmPassword && values.password && (
                          <div
                            className={`text-xs sm:text-sm mt-1 ${
                              getPasswordMatch(
                                values.password,
                                values.confirmPassword
                              )
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {getPasswordMatch(
                              values.password,
                              values.confirmPassword
                            )
                              ? "✓ Passwords match"
                              : "✗ Passwords do not match"}
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="w-full py-2.5 sm:py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span className="text-sm sm:text-base">
                              Creating Account...
                            </span>
                          </div>
                        ) : (
                          "Create Account"
                        )}
                      </button>

                      {/* Login Link */}
                      <div className="text-center mt-4 sm:mt-6">
                        <p className="text-gray-400 text-sm sm:text-base">
                          Already have an account?{" "}
                          <Link
                            to="/auth/login"
                            className="text-green-400 hover:text-green-300 underline transition-colors duration-200"
                          >
                            Login
                          </Link>
                        </p>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Register;
