import Image from "next/image";
import NavbarAvatar from "./NavbarAvatar";
import { IoMdAddCircleOutline } from "react-icons/io";

export default function QuestionModal() {
  return (
    <>
      <a
        href="/thread/create"
        className="slow-bounce focus:animate-none relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-blue transition duration-300 ease-out border-2 border-chart-4 rounded-full shadow-md group bg-chart-4"
      >
        <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-chart-4 group-hover:translate-x-0 ease">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </span>
        <span className="text-lg font-bold absolute flex items-center justify-center w-full h-full text-popover transition-all duration-300 transform group-hover:translate-x-full ease">
          Ask Question
        </span>
        <span className="relative invisible">Ask Question</span>
      </a>
    </>
  );
}
