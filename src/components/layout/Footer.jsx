import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-primary dark:bg-neutral-950 text-primary-foreground dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl">spa</span>
              <h2 className="text-2xl font-serif font-bold tracking-tight">
                HarbLoom
              </h2>
            </div>
            <p className="text-base text-primary-foreground/80 dark:text-gray-300 font-sans leading-relaxed max-w-sm">
              Your digital guide to AYUSH-recognized medicinal plants. Discover
              the healing power of nature with scientific accuracy.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-serif font-bold text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-base text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors font-sans"
                  to="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-base text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors font-sans"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  className="text-base text-primary-foreground/80 dark:text-gray-300 hover:text-white transition-colors font-sans"
                  to="/references"
                >
                  References
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-serif font-bold text-lg">Disclaimer</h3>
            <p className="text-sm text-primary-foreground/70 dark:text-gray-400 font-sans leading-relaxed">
              Information is based on AYUSH and other educational sources. This
              platform is for informational purposes only and does not
              substitute professional medical advice.
            </p>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-primary-foreground/20 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center text-sm text-primary-foreground/60 dark:text-gray-400 font-sans">
          <p>
            &copy; {new Date().getFullYear()} Harbloom. Created by Pradipta
            Karmakar
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a className="hover:text-white transition-colors" href="#">
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  clipRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </a>
            <a className="hover:text-white transition-colors" href="#">
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a className="hover:text-white transition-colors" href="#">
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12.019c0 4.962 3.591 9.154 8.356 9.879v-6.988H8.05v-2.89h2.306v-2.227c0-2.288 1.354-3.564 3.424-3.564.986 0 1.828.073 2.074.106v2.585h-1.52c-1.112 0-1.328.528-1.328 1.3v1.7h2.86l-.372 2.89h-2.488v6.988C18.409 21.173 22 16.981 22 12.019c0-5.523-4.477-10.019-10-10.019z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
