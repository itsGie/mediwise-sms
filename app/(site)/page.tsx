"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const redirectToPage = (page: "mediwise" | "sms") => {
    router.push(`/${page}`);
  };
  
  // router.push(`/${'mediwise'}`);

  useEffect(() => {
    router.push(`/${'mediwise'}`);
  }, [])

  return (
    <section className="bg-gray-200 dark:bg-gray-900">
      {/* <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full flex flex-col gap-y-3 p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8 ">
          <Button onClick={() => redirectToPage("mediwise")}>Mediwise</Button>
          <Button onClick={() => redirectToPage("sms")}>
            Stock management system
          </Button>
        </div>
      </div> */}
    </section>
  );
};

export default Page;
