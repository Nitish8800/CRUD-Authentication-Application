"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toaster, toasterError } from "../components/Genric/toaster";
import { login } from "../components/Genric/method";

const Login = () => {
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && isLoginPage) {
      router.push("/");
    }
  }, [pathname]);

  const onInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const isInputEmpty = (inputValue) => {
    return inputValue == null || inputValue.trim() === "";
  };

  const validateFields = () => {
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isInputEmpty(loginData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      isValid = false;
    } else if (!emailRegex.test(loginData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }

    if (isInputEmpty(loginData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }

    return isValid;
  };

  const submitForm = async () => {
    try {
      if (!validateFields()) {
        return;
      }

      const response = await login(loginData);

      if (response.status === 200) {
        toaster(response.data.message);
        const accessToken = response.data.token.accessToken;
        localStorage.setItem("accessToken", accessToken);
        router.push("/");
      } else {
        setErrors({ ...errors, password: response.data.message });
      }
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
        <h1 className="text-4xl font-semibold text-center mb-6">Sign in</h1>

        <div className="mb-4">
          {/* Email Input */}
          <input
            type="text"
            onChange={(e) => onInputChange(e)}
            name="email"
            placeholder="Email"
            className={`w-full border-b-[1px] border-[#949494] p-3 focus:bg-[#f3f7ff] rounded-t-sm outline-0 ${
              errors.email ? "border border-red-500" : ""
            }`}
            autoComplete="on"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}

          {/* Password Input */}
          <input
            type="password"
            onChange={(e) => onInputChange(e)}
            name="password"
            placeholder="Password"
            className={`w-full border-b-[1px] border-[#949494] p-3 mt-6  focus:bg-[#f3f7ff] rounded-t-sm outline-0 ${
              errors.password ? "border border-red-500" : ""
            }`}
            autoComplete="on"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}

          <label className="flex items-center justify-center mt-4">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Remember me</span>
          </label>
        </div>

        <button
          onClick={() => submitForm()}
          className="w-full bg-purple-600 hover:bg-blue-500  border text-white rounded p-2 mt-2 hover:shadow-md"
        >
          Log in
        </button>
        <p className="text-center mt-2">OR</p>
        <button
          onClick={() => router.push("/register")}
          className="w-full bg-[#fb641b] text-white rounded p-2 mt-2 mb-4 hover:bg-orange-400 hover:shadow-md"
        >
          Create an account
        </button>
      </div>
    </div>
  );
};

export default Login;
