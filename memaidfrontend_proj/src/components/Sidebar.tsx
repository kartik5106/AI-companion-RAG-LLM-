import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <button
        className="fixed top-6 left-4 text-white w-10 z-50 p-2 bg-gray-700 rounded"
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={isOpen ? faBars : faBars} size="lg" />
      </button>

      <div
        className={`fixed left-0 top-0 h-full bg-[#2F2F2F] text-white w-[20vw] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-center items-center h-[10vh]">
          <h2 className="pt-5 text-xl">History</h2>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
