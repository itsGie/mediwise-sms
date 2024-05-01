"use client";

import { cn } from "@/lib/utils";
import { ClipLoader } from "react-spinners";
import { Loader2 as LoaderLucide } from "lucide-react";

type LoaderProps = {
  size?: number;
};
export const Loader: React.FC<LoaderProps> = ({ size = 55 }) => {
  return (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center">
      <ClipLoader color="#1CA54E" size={size} />
    </div>
  );
};

export const Loader2: React.FC<LoaderProps> = ({ size = 55, }) => {
  return (
      <LoaderLucide className={cn("animate-spin mr-2",)} size={size}/> 
  );
};