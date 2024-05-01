"use client"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
    const router = useRouter()

    const termsAndConditions = [
        {
          title: "Acceptance of Terms",
          description:
            "By accessing or using our healthcare services system, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any part of these terms, you may not access or use the system.",
        },
        {
          title: "User Accounts",
          description:
            "You may be required to create a user account to access certain features of the system. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        },
        {
          title: "Use of Services",
          description:
            "Our healthcare services system is intended for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers regarding your medical condition.",
        },
        {
          title: "Privacy Policy",
          description:
            "We are committed to protecting your privacy and the confidentiality of your personal information. Our Privacy Policy outlines how we collect, use, and disclose your information. By using our system, you consent to the terms of our Privacy Policy.",
        },
        {
            title: "Disclaimer of Warranties",
            description:
              "Our healthcare services system is provided on an `as is` and `as available` basis, without any warranties of any kind, express or implied. We do not warrant that the system will be error-free or uninterrupted, or that any defects will be corrected.",
          },
      ];

  return (
    <div className="bg-white dark:bg-zinc-800 md:h-auto flex items-center">
        <ArrowLeft
          className="w-7 h-7 cursor-pointer rounded-md  absolute top-5 left-5 text-black"
          onClick={() => router.push(`/mediwise`)}
        />
    <div className="container mx-auto px-10 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-10">Terms & Conditions</h1>

        <ul className="flex flex-col gap-y-5">
          {termsAndConditions.map((termAndCondition, index) => {
            return (
              <li key={index} className="flex flex-col">
                <h2 className="font-bold">{termAndCondition.title}</h2>
                <p className=" font-light">{termAndCondition.description}</p>
              </li>
            );
          })}
        </ul>

        <div className='my-10'>
            If you have any questions or concerns about these Terms and Conditions, please contact us at <span className='font-semibold'>Mediwise@gmail.com</span> .
        </div>

        <div className='my-10'>
            By using our healthcare services system, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.

        </div>
    </div>
</div>
  )
}

export default Page