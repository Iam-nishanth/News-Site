import Categories from "@/components/Categories";
import ContactForm from "@/components/ContactForm";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Link from "next/link";
import React from "react";

const ContactSection = () => {
  return (
    <MaxWidthWrapper className="flex gap-10 items-start relative lg:flex-row flex-col">
      <div className="w-full flex flex-col gap-6 py-6 font-Gentium italic text-base font-normal leading-7">
        <div className="w-full h-auto border-b-2 border-gray-300" />
        {/* ---------------------Google map----------------------- */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.3420349707!2d78.2432327045384!3d17.412281015881696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1710410522802!5m2!1sen!2sin"
          className="border-0 w-full min-h-[350px] brightness-75"
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          aria-label="Google map"
        ></iframe>

        <div>
          <h3 className=" text-2xl font-Roboto not-italic font-bold">
            Get in touch with us
          </h3>
          <div>
            <ContactForm />
          </div>
        </div>

        {/* --------------Advertising------------ */}
        <div className="w-full flex flex-col gap-3">
          <h3 className=" text-2xl font-Roboto not-italic font-bold">
            Advertising
          </h3>
          <div className="w-full flex flex-col gap-6">
            <div className="flex gap-1 md:gap-3 flex-col md:flex-row">
              <h4 className="not-italic font-semibold font-Roboto">
                Magazine Advertising Enquries :
              </h4>
              <p>
                Please Call{" "}
                <Link
                  className="not-italic font-medium text-blue-600"
                  href="tel:"
                >
                  Company No.
                </Link>
              </p>
            </div>
            <div className="flex gap-1 md:gap-3 flex-col md:flex-row">
              <h4 className="not-italic font-semibold font-Roboto">
                Online Advertising Enquries :
              </h4>
              <p>
                Please email to{" "}
                <Link
                  className="not-italic font-medium text-blue-600"
                  href="tel:"
                >
                  onlineAdvertisingqueries@aa.com
                </Link>
              </p>
            </div>
            <div className="flex gap-1 md:gap-3 flex-col md:flex-row">
              <h4 className="not-italic font-semibold font-Roboto">
                Media Pack and Rate card :
              </h4>
              <p>
                Please Call{" "}
                <Link
                  className="not-italic font-medium text-blue-600"
                  href="tel:"
                >
                  please click here..
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <aside className="w-full max-w-full lg:max-w-[300px] static sm:sticky top-0 h-auto lg:h-screen justify-center items-center lg:flex">
        <Categories />
      </aside>
    </MaxWidthWrapper>
  );
};

export default ContactSection;
