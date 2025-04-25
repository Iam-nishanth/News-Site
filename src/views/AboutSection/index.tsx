import Categories from "@/components/Categories";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Link from "next/link";
import React from "react";

const AboutSection = () => {
  return (
    <MaxWidthWrapper className="flex gap-10 items-start relative lg:flex-row flex-col">
      <div className="w-full flex flex-col gap-6 py-6 font-Gentium italic text-base font-normal leading-7">
        {/* ---------------------About Company and Quote----------------------- */}
        <div className="w-full h-auto border-b-2 border-gray-300" />
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos
          odio, earum aperiam eligendi accusantium non illum. At doloremque ex
          assumenda sint, quod debitis soluta a earum. Aliquid rem incidunt
          repellat. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Dignissimos odio, earum aperiam eligendi accusantium non illum. At
          doloremque ex assumenda sint, quod debitis soluta a earum. Aliquid rem
          incidunt repellat. Lorem ipsum dolor, sit amet consectetur adipisicing
          elit. Dignissimos odio, earum aperiam eligendi accusantium non illum.
          At doloremque ex assumenda sint, quod debitis soluta a earum. Aliquid
          rem incidunt repellat.
        </p>
        <div className="w-full flex dark:bg-[#322c2c] bg-[#eeeeee] justify-center items-center">
          <p className="w-full max-w-[90%]  text-center py-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea nihil,
            animi quo est eveniet laudantium quidem aliquam obcaecati sequi?
            Earum saepe distinctio facere odit voluptatibus ex modi voluptatem
            illum id? Earum saepe distinctio facere odit voluptatibus ex modi
            voluptatem illum id?
          </p>
        </div>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos
          odio, earum aperiam eligendi accusantium non illum. At doloremque ex
          assumenda sint, quod debitis soluta a earum. Aliquid rem incidunt
          repellat. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Dignissimos odio, earum aperiam eligendi accusantium non illum. At
          doloremque ex assumenda sint, quod debitis soluta a earum. Aliquid rem
          incidunt repellat. Lorem ipsum dolor, sit amet consectetur adipisicing
          elit. Dignissimos odio, earum aperiam eligendi accusantium non illum.
          At doloremque ex assumenda sint, quod debitis soluta a earum. Aliquid
          rem incidunt repellat.
        </p>
        {/* ----------------Business Queries------------------ */}
        <div>
          <h3 className=" text-2xl font-Roboto not-italic font-bold">
            For Business Queries
          </h3>
          <p>
            To help us ensure that we provide our readers with the best possible
            service, if you have any comments about the customer support you
            have received, please let us know by emailing to{" "}
            <Link
              className="not-italic font-medium text-blue-600"
              href="mailto:"
            >
              companysupport@emailto.com
            </Link>{" "}
            For quick answers to frequently asked questions regarding our
            digital edition, please visit our{" "}
            <Link className="not-italic font-medium text-blue-600" href="/faq">
              FAQ page
            </Link>
            . Alternatively, you can email us at digital@emailtu.co or call {""}
            <Link className="not-italic font-medium text-blue-600" href="tel:">
              Company No.
            </Link>
          </p>
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

export default AboutSection;
