import BreadCrumb from "@/views/BreadCrumb";
import ContactSection from "@/views/ContactSection";
import NewsSectionTwo from "@/views/NewsSection_2";
import PopularSection from "@/views/PopularSection";
import React from "react";

export default function ContactPage() {
  return (
    <main className="pt-4">
      <BreadCrumb pageName="Contact" />
      <ContactSection />
      <NewsSectionTwo heading="" />
      <PopularSection />
    </main>
  );
}
