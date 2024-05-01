import { Button } from "@/components/ui/button";
import React from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import CarouselComponent from "./components/Carousel";

const page = async () => {
  const session = await getSession();
  if (session?.user) {
    return session.user.role === Role.STOCK_MANAGER
      ? redirect(`/sms/dashboard`)
      : redirect(`/mediwise/${session.user.role.toLowerCase()}`);
  }

  return (
    <div className="flex flex-col  w-full mx-auto dark:bg-dark">
      <Navbar />
    <div className="flex flex-col  w-full mx-auto items-center gap-y-16 dark:bg-dark overflow-x-hidden">
      <div
        className="w-full flex justify-center  h-fit md:h-[800px] items-center bg-[#def0db]  dark:bg-gray-800"
        id="home"
      >
        <CarouselComponent />
      </div>
      <div
        id="about-us"
        className="w-full flex justify-center  h-fit md:h-[700px]  dark:bg-gray-800"
      >
        <div className="w-[95%] md:w-[85%] flex flex-col md:flex-row-reverse gap-x-10 gap-y-10 items-center">
          <img
            src="/images/pics/content2.png"
            className="w-full md:w-[60%] h-[500px] object-contain rounded-"
            alt=""
          />
          <div className="flex flex-col w-full md:w-[50%] gap-y-10">
            <h1 className="text-center md:text-left font-bold text-2xl md:text-[40px] uppercase text-[#137174]">
              Find Out A Little More About Us
            </h1>
            <p className="text-black md:text-lg  text-justify dark:text-white text-sm ">
              MediWise, a meticulously designed web-based and mobile
              application, is tailor-made for use by the City Health Department
              and Barangays. This essential intermediary platform fosters
              seamless communication, coordination, and information exchange
              within a city`s healthcare framework. The innovative system
              significantly streamlines healthcare data, resource, and service
              flows, ultimately aiming to boost efficiency and effectiveness in
              delivering healthcare services to the community. Serving as a
              central repository for critical healthcare data and enabling
              real-time collaboration, MediWise empowers healthcare
              professionals and local authorities to join forces, ensuring
              residents receive optimal care. In an age where swift information
              and resource exchange is pivotal, MediWise stands as a vital tool
              for enhancing the overall healthcare experience in a city.
            </p>
          </div>
        </div>
      </div>

      <div className="w-[75%] flex flex-col " id="guidelines">
        <h1 className="text-center text-[25px] font-semibold my-20 uppercase">
          A Few Guidelines On How To Use It
        </h1>

        <div className="flex flex-col md:flex-row gap-x-20 gap-y-10">
          <div className="shadow-2xl border-[.5px] p-10 text-center font-semibold rounded-xl dark:bg-gray-800">
            <h2>Login/Signup</h2>
            <img src="/images/1.png" alt="" />
          </div>

          <div className="shadow-2xl border-[.5px] p-10 text-center font-semibold rounded-xl dark:bg-gray-800">
            <h2>Make an Appointment</h2>
            <img src="/images/2.png" alt="" />
          </div>

          <div className="shadow-2xl border-[.5px] p-10 text-center font-semibold rounded-xl dark:bg-gray-800">
            <h2>Go to your local Barangay.</h2>
            <img src="/images/3.png" alt="" />
          </div>
        </div>
      </div>

      <div
        className=" w-full p-10 h-[600px] flex items-center relative bg-[#c5ebd3] dark:bg-gray-800"
        id="contact-us"
        style={{
          clipPath: "polygon(0 0, 100% 3%, 100% 100%, 0 98%)",
        }}
      >
        <img
          src="/images/contact2.png"
          className="absolute top-0 left-0 w-[200px] md:w-[300px] lg:w-[400px]"
          alt=""
        />
        <img
          src="/images/contact4.png"
          className="absolute bottom-0 right-0 w-[200px] md:w-[300px] lg:w-[400px]"
        />
        <div className="flex flex-col gap-y-10 w-[90%] md:w-[50%] mx-auto z-10 dark:bg-black bg-opacity-30 p-10 rounded-xl">
          <h1 className="text-lg md:text-3xl uppercase text-center">
            C o n t a c t &nbsp; U s
          </h1>
          <p className=" text-center text-sm md:text-lg">
            You can contact us from here, you can write a message to us, we will
            gladly assist you.
          </p>

          <div className="flex justify-evenly">
            <div className="address flex-1">
              <h3 className="font-semibold text-sm md:text-xl">Location</h3>
              <p className="line-clamp-1">Caloocan City North - Philippines</p>
            </div>

            <div className="Phone flex-1">
              <h3 className="font-semibold text-sm md:text-xl">Email</h3>
              <p className="line-clamp-1">Mediwise@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <footer className=" dark:bg-gray-900 w-full">
        <div className="mx-auto w-full max-w-screen-xl py-3">
          <div className="md:flex md:justify-evenly">
            <div className="mb-6 md:mb-0">
              <a href="#" className="flex items-center">
                <img
                  src="/images/bhaLogo.png"
                  className="w-36"
                  alt="Mediwise Logo"
                />
                <img
                  src="/images/mediwiseLogo.png"
                  className="w-36"
                  alt="Mediwise Logo"
                />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-[#137174] uppercase dark:text-white ">
                  Quick links
                </h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li>
                    <a href="#home" className="hover:underline">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#about-us" className="hover:underline">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#guidelines" className="hover:underline">
                      Guidelines
                    </a>
                  </li>
                  <li>
                    <a href="#contact-us" className="hover:underline">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-[#137174] uppercase dark:text-white">
                  Our team
                </h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li>
                    <a href="/mediwise/team" className="hover:underline ">
                      Team
                    </a>
                  </li>
                  {/* <li>
                    <a href="#home" className="hover:underline">
                      Our mission
                    </a>
                  </li> */}
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-[#137174] uppercase dark:text-white">
                  Legal
                </h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li>
                    <a
                      href="mediwise/privacy-policy"
                      className="hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="mediwise/terms-conditions" className="hover:underline">
                      Terms &amp; Conditions
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © 2023{" "}
              <a  className="hover:underline">
                Mediwise™
              </a>
              . All Rights Reserved.
            </span>
            <div className="flex mt-4 sm:justify-center sm:mt-0">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 8 19"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="sr-only">Facebook page</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 21 16"
                >
                  <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                </svg>
                <span className="sr-only">Discord community</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 17"
                >
                  <path
                    fill-rule="evenodd"
                    d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="sr-only">Twitter page</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="sr-only">GitHub account</span>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="sr-only">Dribbble account</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );
};

export default page;
