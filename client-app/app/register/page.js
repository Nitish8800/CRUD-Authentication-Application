"use client";

import React, { useEffect, useState } from "react";
import { register } from "../components/Genric/method";
import { toaster, toasterError } from "../components/Genric/toaster";
import { usePathname, useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const pathname = usePathname();
  const isRegisterPage = pathname === "/register";

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && isRegisterPage) {
      router.push("/");
    }
  }, [pathname]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const onInputChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear the error when the user starts typing
  };

  const isInputEmpty = (inputValue) => {
    return inputValue == null || inputValue.trim() === "";
  };

  const validateFields = () => {
    let isValid = true;
    // Name validation
    if (isInputEmpty(signupData.name)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isInputEmpty(signupData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      isValid = false;
    } else if (!emailRegex.test(signupData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }
    // Phone Number validation
    if (isInputEmpty(signupData.phoneNumber)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone Number is required",
      }));
      isValid = false;
    } else if (signupData.phoneNumber.length < 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone Number must be at least 10 characters long",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: "" }));
    }

    // Password validation
    if (isInputEmpty(signupData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      isValid = false;
    } else if (
      signupData.password.length < 8 ||
      signupData.password.length > 20
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be between 8 and 20 characters long",
      }));
      isValid = false;
    } else if (!/[A-Z]/.test(signupData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must contain at least one uppercase letter",
      }));
      isValid = false;
    } else if (!/[a-z]/.test(signupData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must contain at least one lowercase letter",
      }));
      isValid = false;
    } else if (!/\d/.test(signupData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must contain at least one numeric character",
      }));
      isValid = false;
    } else if (!/[^a-zA-Z0-9]/.test(signupData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must contain at least one special character",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
    // Confirm Password validation
    if (signupData.password !== signupData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Passwords do not match",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
    }
    return isValid;
  };

  const submitForm = async () => {
    try {
      if (!validateFields()) {
        return;
      }

      // Remove confirmPassword field before making the request
      const { confirmPassword, ...dataWithoutConfirmPassword } = signupData;

      let response = await register(dataWithoutConfirmPassword);

      router.push("/login");
      toaster(response?.data?.message);
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toasterError(error?.response?.data?.message);
      } else if (error?.response?.data?.err) {
        toasterError(error?.response?.data?.err);
      } else {
        toasterError(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-96 shadow-2xl p-8 bg-white rounded">
        <h1 className="text-4xl font-semibold text-center mb-6">Sign up</h1>

        <div className="mb-4">
          {/* Name Input */}
          <input
            type="text"
            onChange={(e) => onInputChange(e)}
            name="name"
            placeholder="Name"
            className={`w-full border-b-[1px] border-[#949494] p-3 focus:bg-[#f3f7ff] rounded-t-sm outline-0 ${
              errors.name ? "border border-red-500" : ""
            }`}
            autoComplete="on"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}

          {/* Email Input */}
          <input
            type="text"
            onChange={(e) => onInputChange(e)}
            name="email"
            placeholder="Email"
            className={`w-full border-b-[1px] border-[#949494] p-3 mt-6 focus:bg-[#f3f7ff] rounded-t-sm outline-0 ${
              errors.email ? "border border-red-500" : ""
            }`}
            autoComplete="on"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}

          {/* Phone Number Input */}
          <div className="relative mt-6">
            <input
              type="number"
              onChange={(e) => onInputChange(e)}
              name="phoneNumber"
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 10);
              }}
              placeholder="Phone Number"
              className={`w-full border-b-[1px] border-[#949494] p-3 focus:bg-[#f3f7ff] rounded-t-sm outline-0 ${
                errors.phoneNumber ? "border border-red-500" : ""
              }`}
              autoComplete="on"
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}

          {/* Password Input */}
          <div className="relative mt-6">
            <input
              type={showPassword ? "text" : "password"}
              onChange={(e) => onInputChange(e)}
              name="password"
              placeholder="Password"
              className={`w-full border-b-[1px] border-[#949494] p-3 focus:bg-[#f3f7ff] rounded-t-sm outline-0 ${
                errors.password ? "border border-red-500" : ""
              }`}
              autoComplete="on"
            />
            <button
              className="absolute text-sm text-[#555454] hover:text-[#3a3939] top-1/2 transform -translate-y-1/2 right-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}

          {/* Confirm Password Input */}
          <div className="relative mt-6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              onChange={(e) => onInputChange(e)}
              name="confirmPassword"
              placeholder="Confirm Password"
              className={`w-full border-b-[1px] border-[#949494] p-3 focus:bg-[#f3f7ff] rounded-t-sm outline-0 ${
                errors.confirmPassword ? "border border-red-500" : ""
              }`}
              autoComplete="on"
            />
            <button
              className="absolute top-1/2 text-[#555454] hover:text-[#3a3939] text-sm transform -translate-y-1/2 right-3"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          onClick={() => submitForm()}
          className="w-full bg-purple-600 hover:bg-blue-500  border text-white rounded p-2 mt-2 hover:shadow-md"
        >
          Sign up
        </button>
        <p className="text-center mt-2">OR</p>
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-[#fb641b] text-white rounded p-2 mt-2 mb-4 hover:bg-orange-400 hover:shadow-md"
        >
          Already have an account
        </button>
      </div>
    </div>
  );
};

export default SignUp;
