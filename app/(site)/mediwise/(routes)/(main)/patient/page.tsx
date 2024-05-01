"use client";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center w-full gap-y-32 pb-10">
      <div className=" bg-[#def0db] w-full min-h-[700px] flex items-center">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          {/* Left Column (Image) */}
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <img
              src="/images/bhaLogo2.png"
              alt="Your Image"
              className="mx-auto lg:mx-0 w-full rounded-lg object-contain mt-20 md:mt-0"
            />
          </div>

          {/* Right Column (Text) */}
          <div className="w-full  lg:pl-10 text-black gap-y-3 py-10 overflow-x-hidden">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4  text-wrap">
              {" "}
              <span className="text-primary">Bringin Health</span> To <br />{" "}
              Life For The Whole Family
            </h1>
            <p className="text-md text-black mb-8">
              Utilizing all of our knowledge, potential and experties in
              contemporary medicine, We strive to get the best results possible
            </p>
            <Button
              className="bg-[#af5c18]"
              onClick={() => {
                router.push("patient/appointments");
              }}
            >
              Request an appointment
            </Button>

            {/* <div className=" flex justify-between mt-20">
              <span className="flex flex-col">
                <span className="font-extrabold text-3xl">24/7</span>
                <span className="font-semibold">Online Support</span>
              </span>

              <span className="flex flex-col">
                <span className="font-extrabold text-3xl">80+</span>
                <span className="font-semibold">Doctor</span>
              </span>

              <span className="flex flex-col">
                <span className="font-extrabold text-3xl">100k+</span>
                <span className="font-semibold">Customer</span>
              </span>
            </div> */}
          </div>
        </div>
      </div>

      <section className=" flex flex-col justify-between w-[90%] lg:w-[60%] ">
        <div className="w-full flex flex-col font-semibold gap-y-3 ">
          <span className="text-primary text-[20px]">
            Welcome To MediWise Barangay Health Center
          </span>

          <h1 className="text-5xl ">
            We Care About Your{" "}
            <span className="text-primary">
              {" "}
              <br /> Health
            </span>
          </h1>
        </div>
        <div className="flex flex-col w-full items-center gap-y-5 mt-10">
          <p className="text-[20px]">
            We will treat your health condition with a satisfying experience and
            professional service by an expert doctor
          </p>
        </div>
      </section>

      <section className="w-[90%] lg:w-[60%] -mt-20  max-h-[400px] grid sm:grid-cols-1 md:grid-cols-4  lg:grid-cols-4 grid-rows-1 gap-5">
        <div className="col-span-2">
          <img
            src="/images/pics/new-content1.jpg"
            className=" rounded-md  h-full w-full object-cover"
            alt=""
          />
        </div>
        <div className="flex flex-col col-span-1 gap-5">
          <img
            src="/images/pics/new-content2.jpg"
            className=" rounded-md h-[100px] w-full object-cover flex-1"
            alt=""
          />
          <img
            src="/images/pics/new-content4.jpg"
            className=" rounded-md h-[100px] w-full object-cover flex-1"
            alt=""
          />
        </div>
        <div className="col-span-1">
          <img src="/images/pics/new-content3.jpg" className=" rounded-md  h-full w-full object-cover object-top " alt="" />
        </div>
      </section>

      
    </div>
  );
};

export default Page;
