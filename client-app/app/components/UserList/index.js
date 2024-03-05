"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmptyUserList from "../EmptyUserList";
import { toaster, toasterError } from "../Genric/toaster";
import Navbar from "../Navbar";
import { getAllUsersData, deleteUser } from "../Genric/method";
import Image from "next/image";

const UserList = () => {
  const [usersData, setUsersData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.log("Please login for access this route");
    } else {
      fetchUserList();
    }
  }, []);

  const fetchUserList = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await getAllUsersData(accessToken);
      setUsersData(response);
    } catch (error) {
      toasterError(error.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await deleteUser(accessToken, userId);
      toaster(response?.data?.message);
      fetchUserList();
    } catch (error) {
      toasterError(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto px-4 sm:px-6 lg:px-64 py-36">
        {usersData?.data?.data?.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Phone Number
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersData?.data?.data.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Image
                        src="/delete.svg"
                        width={25}
                        height={25}
                        alt="Close Icon"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyUserList />
        )}
      </div>
    </>
  );
};

export default UserList;
