"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/parallax";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  Parallax,
  EffectFade,
  Keyboard,
} from "swiper/modules";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CarouselComponent = () => {
  return (
    <Swiper
      modules={[
        Navigation,
        Pagination,
        Scrollbar,
        A11y,
        Autoplay,
        Parallax,
        EffectFade,
        Keyboard,
      ]}
      spaceBetween={50}
      slidesPerView={1}
      autoplay
      className=""
      keyboard
      parallax
      pagination={{ clickable: true }}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log("slide change")}
    >
      <SwiperSlide className="flex justify-center">
        <div className="flex justify-center gap-x-10 w-[70%] flex-col lg:flex-row mx-auto">
          <div className="flex-1 flex justify-center">
            <img className=" object-cover" src={"/images/Clogo.png"} />
          </div>
          <div className="flex flex-col gap-y-10 py-10  flex-1 mt-10">
            <h1 className="text-2xl md:text-5xl text-[#137174]  font-extrabold">
              A path to a better health
            </h1>
            <p className=" text-sm md:text-xl  text-black dark:text-white text-justify">
              A platform gives healthcare providers the tools they need to
              manage medical inventory effectively, ensuring that patients get
              the treatment they deserve, when they need it.
            </p>
            <Link href={"/mediwise/register"} className="w-fit">
              <Button
                variant={"outline"}
                className="w-fit text-md text-primary text-sm md:text-xl border-primary hover:text-primary"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide className="flex justify-center">
        <div className="flex justify-center gap-x-10 w-[70%] flex-col lg:flex-row mx-auto">
          <div className="flex-1 flex justify-center">
            <img className=" object-cover" src={"/images/pics/slide1.png"} />
          </div>
          <div className="flex flex-col gap-y-10 py-10  flex-1 mt-10">
            <h1 className="text-2xl md:text-5xl text-[#137174] font-extrabold">
              PEDIATRICIAN
            </h1>
            <p className="text-sm md:text-xl text-black dark:text-white text-justify">
              A pediatrician is a doctor who focuses on the health of infants,
              children, adolescents and young adults.
            </p>
            <Link href={"/mediwise/register"} className="w-fit">
              <Button
                variant={"outline"}
                className="w-fit text-md text-sm md:text-xl text-primary border-primary hover:text-primary"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className="flex justify-center ">
        <div className=" flex flex-col  gap-x-10 w-[70%] mx-auto lg:flex-row-reverse ">
          <div className="flex-1 flex justify-center">
            <img className=" object-cover" src={"/images/pics/slide2.png"} />
          </div>
          <div className="flex flex-col gap-y-10 py-10  flex-1 mt-10">
            <h1 className="text-2xl md:text-5xl text-[#137174] font-extrabold">DENTIST</h1>
            <p className="text-sm md:text-xl  text-black  dark:text-white text-justify">
              To provide outstanding dental care with a commitment of
              honesty,compassion, quality and integrity. To change lives
              everyday by creating healthy and beautiful smiles.
            </p>
            <Link href={"/mediwise/register"} className="w-fit">
              <Button
                variant={"outline"}
                className="w-fit text-md text-sm md:text-xl text-primary self-start border-primary hover:text-primary"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex justify-center gap-x-10 w-[70%] flex-col lg:flex-row mx-auto">
          <div className="flex-1 flex justify-center">
            <img className=" object-cover" src={"/images/pics/slide3.png"} />
          </div>
          <div className="flex flex-col gap-y-10 py-10 flex-1 mt-10">
            <h1 className="text-2xl md:text-5xl  text-[#137174] font-extrabold">
              GENERAL PRACTITIONER
            </h1>
            <p className="text-sm md:text-xl  text-black dark:text-white text-justify">
              A general practitioner focuses on your overall health: physical
              and mental. They serve an important role in a much wider
              healthcare system. One of their main goals is to keep you healthy
              and out of the hospital.
            </p>
            <Link href={"/mediwise/register"} className="w-fit">
              <Button
                variant={"outline"}
                className="w-fit text-md text-sm md:text-xl text-primary border-primary hover:text-primary"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default CarouselComponent;
