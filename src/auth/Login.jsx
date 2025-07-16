import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { usePostMutation } from "../service/apiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../ui/Loader";

export function Login() {
  const [postMutation, { isLoading }] = usePostMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password?.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await postMutation({
        path: "/auth/login",
        body: values,
        method: "POST",
      });

      if (response?.data?.token) {
        await dispatch(login(response));
        toast.success("Login successful! Redirecting...");
        navigate("/");
      } else {
        toast.error(
          response?.error?.data?.message ||
            "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Login failed. Please check your credentials."
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="font-bold mb-2 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl text-white">
                Welcome Back
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 px-2">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Login Form */}
            <div className="w-full max-w-sm sm:max-w-md mx-auto">
              <div className="backdrop-blur-sm bg-gray-800/50 p-6 sm:p-8 rounded-2xl border border-gray-700 shadow-2xl">
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validate={validate}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-4 sm:space-y-6">
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
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70 text-sm sm:text-base"
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
                        <Field
                          type="password"
                          name="password"
                          placeholder="Enter your password"
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70 text-sm sm:text-base"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-xs sm:text-sm text-red-400 mt-1"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="w-full py-2.5 sm:py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
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
                              Loging In...
                            </span>
                          </div>
                        ) : (
                          "Login"
                        )}
                      </button>

                      {/* Register Link */}
                      <div className="text-center mt-4 sm:mt-6">
                        <p className="text-gray-400 text-sm sm:text-base">
                          Don't have an account?{" "}
                          <Link
                            to="/auth/register"
                            className="text-green-400 hover:text-green-300 underline transition-colors duration-200"
                          >
                            Register Now
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

export default Login;
