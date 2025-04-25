import Image from "next/image";
import Link from "next/link";
import React from "react";

const Category = () => (
  <Link href="/" className="w-full h-auto">
    <div className="w-full h-14 relative group overflow-hidden">
      <div className=" w-full h-full relative z-0">
        <Image
          src="/images/test.jpg"
          alt="placeholder"
          layout="fill"
          className="object-cover brightness-50 group-hover:scale-110 transition-all duration-500"
        />
      </div>
      <div className="w-full h-full absolute top-0 flex justify-around items-center">
        <p className="text-base font-medium text-white font-Roboto">Category</p>
        <div className=" w-8 h-6 bg-blue-500 text-center">
          <span className=" text-white text-sm tracking-wide">10</span>
        </div>
      </div>
    </div>
  </Link>
);

const Categories = () => {
  return (
    <div className="w-full max-w-full lg:max-w-[300px] flex flex-col gap-3">
      <h3 className=" text-2xl font-medium font-Roboto text-center">
        Categories
      </h3>
      <hr className="border-b border-gray-500" />
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-col gap-5">
        <Category />
        <Category />
        <Category />
        <Category />
        <Category />
        <Category />
      </div>
    </div>
  );
};

export default Categories;
