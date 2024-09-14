import React from "react";

// Footer component
const Footer = () => {
  return (
    <footer className="mt-20">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <LogoSection />
          <LinksSection />
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <BottomSection />
      </div>
    </footer>
  );
};

// Logo section component
const LogoSection = () => {
  return (
    <div className="mb-6 md:mb-0">
      <a href="/dashboard" className="flex items-center">
        <img src="/cap.png" className="h-12 me-3" alt="FlowBite Logo" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
          WisdomHub
        </span>
      </a>
    </div>
  );
};

// Links section component
const LinksSection = () => {
  return (
    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
      <div>
        <h2 className="mb-6 text-sm font-semibold text-white">Resources</h2>
        <ul className="text-gray-500 dark:text-gray-400 font-medium">
          <li className="mb-4">
            <a href="https://flowbite.com/" className="hover:underline">
              Flowbite
            </a>
          </li>
          <li>
            <a href="https://tailwindcss.com/" className="hover:underline">
              Tailwind CSS
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="mb-6 text-sm font-semibold text-white">Follow us</h2>
        <ul className="text-gray-500 dark:text-gray-400 font-medium">
          <li className="mb-4">
            <a
              href="https://github.com/GurnishS/WisdomHub"
              className="hover:underline "
            >
              Github
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/gurnish-singh-sangha-16b19428b/" className="hover:underline">
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="mb-6 text-sm font-semibold text-white">Legal</h2>
        <ul className="text-gray-500 dark:text-gray-400 font-medium">
          <li className="mb-4">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Terms &amp; Conditions
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Bottom section component
const BottomSection = () => {
  return (
    <div className="sm:flex sm:items-center sm:justify-between">
      <span className="text-sm sm:text-center text-white">
        © 2024{" "}
        <a href="/admin/adminPanel.html" className="hover:underline">
          Wisdom Hub
        </a>
        . All Rights Reserved.
      </span>
      <SocialMediaIcons />
    </div>
  );
};

// Social media icons component
const SocialMediaIcons = () => {
  return (
    <div className="flex mt-4 sm:justify-center sm:mt-0">
      <a
        href="#"
        className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 8 19"
        >
          {/* Facebook SVG Path */}
        </svg>
        <span className="sr-only">Facebook page</span>
      </a>
      {/* Repeat the same for other social media icons */}
    </div>
  );
};

export default Footer;
