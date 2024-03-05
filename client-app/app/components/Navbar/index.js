"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "../Genric/method";
import { toaster, toasterError } from "../Genric/toaster";

export default function Navbar() {
  const router = useRouter();
  const [navbar, setNavbar] = useState(false);
  const [renderClientContent, setRenderClientContent] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken && isHomePage) {
      router.push("/login");
      router.push("/register");
    }
  }, [pathname]);

  useEffect(() => {
    setRenderClientContent(true);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      let response = await logout();
      router.push("/login");
      localStorage.removeItem("accessToken");
      toaster(response?.data?.message);
    } catch (error) {
      toasterError(error.message);
    }
  };

  return (
    <div>
      <nav className="w-full bg-white fixed top-0 left-0 right-0 z-10 shadow-lg">
        {renderClientContent && (
          <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
            <div>
              <div className="flex items-center justify-between py-3 md:py-5 md:block">
                <div className="md:hidden">
                  <button
                    className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                    onClick={() => setNavbar(!navbar)}
                  >
                    {navbar ? (
                      <Image
                        src="/close.svg"
                        width={30}
                        height={30}
                        alt="Close Icon"
                      />
                    ) : (
                      <Image
                        src="/hamburger-menu.svg"
                        width={30}
                        height={30}
                        alt="Menu Icon"
                        className="focus:border-none active:border-none"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div
                className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                  navbar ? "p-12 md:p-0 block" : "hidden"
                }`}
              >
                <ul className="h-screen md:h-auto items-center justify-center md:flex">
                  <li
                    className={`pb-6 text-xl lg:text-black-600 lg:hover:text-purple-600 xl:hover:text-purple-600 hover:text-white py-6 md:px-6 text-center border-b-2 md:border-b-0  hover:bg-purple-600  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent ${
                      isHomePage ? "text-purple-600" : ""
                    }`}
                  >
                    <Link href="/" onClick={() => setNavbar(!navbar)}>
                      Home
                    </Link>
                  </li>
                  <li
                    className={`pb-6 text-xl lg:text-black-600 lg:hover:text-purple-600 xl:hover:text-purple-600 hover:text-white py-6 md:px-6 text-center border-b-2 md:border-b-0  hover:bg-purple-600  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent ${
                      pathname === "/my-account" ? "text-purple-600" : ""
                    }`}
                  >
                    <Link href="/my-account" onClick={() => setNavbar(!navbar)}>
                      My Account
                    </Link>
                  </li>

                  <li
                    className={`pb-6 text-xl lg:text-black-600 lg:hover:text-purple-600 xl:hover:text-purple-600 hover:text-white py-6 md:px-6 text-center border-b-2 md:border-b-0  hover:bg-purple-600  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent`}
                  >
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
