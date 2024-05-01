"use client";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { Button } from "@/components/ui/button";

// type and validation for excel sheet to json

const RegistrationTermsAndCondition = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "registerTermsAndCondition";

  const termsAndConditions = [
    {
      title: "Registration Eligibility",
      description:
        "By registering for our health services, you affirm that you are at least 18 years of age or have obtained parental consent to use our services",
    },
    {
      title: "Accuracy of Information",
      description:
        "You agree to provide accurate, current, and complete information during the registration process. Any changes to your information must be promptly updated.",
    },
    {
      title: "Confidentiality",
      description:
        "We are committed to protecting your privacy and the confidentiality of your personal health information. Your data will be handled in accordance with applicable laws and regulations.",
    },
    {
      title: "Service Limitations",
      description:
        "Our health services are provided for informational purposes only and are not a substitute for professional medical advice, diagnosis, or treatment. You should always consult with qualified healthcare professionals regarding your health concerns.",
    },
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" p-10 bg-white text-black max-h-[80%] dark:bg-[#020817] dark:text-white rounded-md flex flex-col items-center justify-center">
        <h1 className="text-xl text-center font-bold">Healthcare Registration</h1>
        <ul className="flex flex-col gap-y-5 overflow-y-auto">
          {termsAndConditions.map((termAndCondition, index) => {
            return (
              <li key={index} className="flex flex-col">
                <h2 className="font-bold">{termAndCondition.title}</h2>
                <p className=" font-light">{termAndCondition.description}</p>
              </li>
            );
          })}
        </ul>

        <div className="my-10">
          By registering for our health services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
        </div>

        <Button onClick={onClose}>Okay</Button>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationTermsAndCondition;
