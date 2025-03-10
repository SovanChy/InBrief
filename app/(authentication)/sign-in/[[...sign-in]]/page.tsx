"use client";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1a2942]">
      <SignIn />
    </div>
  );
}
