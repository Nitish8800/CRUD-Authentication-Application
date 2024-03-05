"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSingleUser, updateMeUser } from "../components/Genric/method";
import { toaster, toasterError } from "../components/Genric/toaster";
import Navbar from "../components/Navbar";

const MyAccount = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isMyAccountPage = pathname === "/my-account";

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken && isMyAccountPage) {
      router.push("/login");
    }
  }, [pathname]);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [userUpdateData, setUserUpdateData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const fetchUserData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await getSingleUser(accessToken);
      const user = response?.data?.data;
      setUserData(user);
      setUserUpdateData(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserUpdateData({ ...userUpdateData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const isInputEmpty = (inputValue) => {
    return inputValue == null;
  };

  const validateFields = () => {
    let isValid = true;

    // Name validation
    if (isInputEmpty(userUpdateData.name)) {
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
    if (isInputEmpty(userUpdateData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      isValid = false;
    } else if (!emailRegex.test(userUpdateData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }

    // Phone Number validation
    if (isInputEmpty(userUpdateData.phoneNumber)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone Number is required",
      }));
      isValid = false;
    } else if (userUpdateData.phoneNumber.length < 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone Number must be at least 10 characters long",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: "" }));
    }

    return isValid;
  };

  const submitForm = async () => {
    try {
      if (!validateFields()) {
        return;
      }
      const accessToken = localStorage.getItem("accessToken");
      const updatedFields = {};

      const updatedName = userUpdateData.name.toString();
      if (userData.name !== updatedName) {
        updatedFields.name = updatedName;
      }

      const updatedEmail = userUpdateData.email.toString();
      if (userData.email !== updatedEmail) {
        updatedFields.email = updatedEmail;
      }

      // Convert phoneNumber to string before comparison
      const updatedPhoneNumber = userUpdateData.phoneNumber.toString();
      if (userData.phoneNumber !== updatedPhoneNumber) {
        updatedFields.phoneNumber = updatedPhoneNumber;
      }

      // Perform update user action only for the updated fields
      if (Object.keys(updatedFields).length > 0) {
        const response = await updateMeUser(updatedFields, accessToken);
        setUserData({ ...userData, ...userUpdateData });
        toaster(response?.data?.message);
      } else {
        toaster("No fields have been updated");
      }
    } catch (error) {
      toasterError("Failed to update");
      console.log(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-36">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`mt-1 p-2 block w-full border border-gray-300 rounded-md ${
                errors.name ? "border border-red-500" : ""
              }`}
              value={userUpdateData.name}
              onChange={(e) => handleInputChange(e)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`mt-1 p-2 block w-full border border-gray-300 rounded-md ${
                errors.email ? "border border-red-500" : ""
              }`}
              value={userUpdateData.email}
              onChange={(e) => handleInputChange(e)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-600"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              className={`mt-1 p-2 block w-full border border-gray-300 rounded-md ${
                errors.phoneNumber ? "border border-red-500" : ""
              }`}
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 10);
              }}
              value={userUpdateData.phoneNumber}
              onChange={(e) => handleInputChange(e)}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>
          <button
            onClick={() => submitForm()}
            className="w-full bg-purple-600 hover:bg-blue-500  border text-white rounded p-2 mt-2 hover:shadow-md"
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
