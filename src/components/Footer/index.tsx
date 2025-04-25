import React from 'react';
import MaxWidthWrapper from '../common/MaxWidthWrapper';
import Image from 'next/image';
import ScrollToTop from '../common/ScrollToTop';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="w-full bg-[#020817] dark:border-t border-gray-500">
            <MaxWidthWrapper className=" text-white flex flex-col">
                <div className="w-full flex flex-col justify-start gap-3 pt-6 pb-3  pl-2 sm:pl-0">
                    <div className="w-56 h-16 relative">
                        <Image src="/images/Stock-Liv.png" alt="logo" layout="fill" className="object-contain object-left" />
                    </div>
                    <p className=" font-Roboto text-sm w-[75%] sm:w-[400px] text-gray-400">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente, illo eligendi temporibus</p>
                </div>
                <div className="w-full grid grid-cols-3 sm:text-left  sm:grid-cols-6 gap-4 py-8">
                    <div className=" w-full flex flex-col gap-6 sm:border-r border-gray-500 border-none">
                        <Link href="/" className="w-fit font-Roboto font-medium text-sm tracking-wide no-underline hover:text-blue-400">
                            Home
                        </Link>
                        <Link href="/search" className="w-fit font-Roboto font-medium text-sm tracking-wide no-underline hover:text-blue-400">
                            Search
                        </Link>
                    </div>
                    <div className=" w-full flex flex-col gap-6 sm:border-r border-gray-500 border-none">
                        <Link href="/category/business" className="w-fit font-Roboto font-medium text-sm tracking-wide no-underline hover:text-blue-400">
                            Business
                        </Link>
                        <Link href="/category/celebrity" className="w-fit font-Roboto font-medium text-sm tracking-wide no-underline hover:text-blue-400">
                            Celebrity
                        </Link>
                    </div>
                    <div className=" w-full flex flex-col gap-6 sm:border-r border-gray-500 border-none">
                        <Link href="/category/sports" className="w-fit font-Roboto font-medium text-sm tracking-wide no-underline hover:text-blue-400">
                            Sports
                        </Link>
                        <Link href="/category/politics" className="w-fit font-Roboto font-medium text-sm tracking-wide no-underline hover:text-blue-400">
                            Politics
                        </Link>
                    </div>
                    <div className=" w-full flex flex-col gap-6 sm:border-r border-gray-500 border-none">
                        <Link href="/category/lifestyle" className="w-fit font-Roboto font-medium text-sm tracking-wide no-underline hover:text-blue-400">
                            Lifestyle
                        </Link>
                        <Link href="/category/technology" className="w-fit font-Roboto font-medium text-sm tracking-wide no-underline hover:text-blue-400">
                            Technology
                        </Link>
                    </div>
                    <div className=" w-full flex flex-col gap-6 sm:border-r border-gray-500 border-none">
                        <Link href="/category/movies" className="w-fit font-Roboto font-medium text-sm tracking-wide no-underline hover:text-blue-400">
                            Movies
                        </Link>
                        <Link href="/category/tv" className="w-fit font-Roboto font-medium text-sm tracking-wide no-underline hover:text-blue-400">
                            TV
                        </Link>
                    </div>
                    <div className=" w-full flex flex-col gap-6">
                        <Link href="/category/world" className="w-fit font-Roboto font-medium text-sm tracking-wide no-underline hover:text-blue-400">
                            World
                        </Link>
                        <Link href="/category/weather" className="w-fit font-Roboto font-medium text-sm tracking-wide no-underline hover:text-blue-400">
                            Weather
                        </Link>
                    </div>
                </div>
                <hr className=" border border-gray-500" />
                <div className="w-full grid grid-cols-2 text-center sm:text-left sm:grid-cols-4 gap-2 md:gap-0 md:flex md:justify-evenly md:items-center py-3">
                    <Link href="#" className="text-sm no-underline hover:text-blue-400">
                        Terms of Use
                    </Link>
                    <Link href="#" className="text-sm no-underline hover:text-blue-400">
                        About Stock-Liv
                    </Link>
                    <Link href="#" className="text-sm no-underline hover:text-blue-400">
                        Privacy Policy
                    </Link>
                    <Link href="#" className="text-sm no-underline hover:text-blue-400">
                        Parental Guidelines
                    </Link>
                    <Link href="#" className="text-sm no-underline hover:text-blue-400">
                        Contact Us
                    </Link>
                    <Link href="#" className="text-sm no-underline hover:text-blue-400">
                        Help
                    </Link>
                    <Link href="#" className="text-sm no-underline hover:text-blue-400">
                        Advertise
                    </Link>
                    <Link href="#" className="text-sm no-underline hover:text-blue-400">
                        Cookie Policy
                    </Link>
                </div>
                <div className="w-full flex justify-center items-center py-3">
                    <p className="font-Roboto font-normal text-xs sm:text-sm text-gray-400 text-center">
                        © 2024 Stock-Liv. <br className="sm:hidden" /> We are not responsible for the content of external sites. <br className="sm:hidden" /> Read our{' '}
                        <Link href="#" className=" text-blue-500">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
                <ScrollToTop />
            </MaxWidthWrapper>
        </footer>
    );
};

export default Footer;
