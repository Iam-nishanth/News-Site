import Footer from "@/components/Footer";
import Navbar from "@/components/Header/Navbar";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
