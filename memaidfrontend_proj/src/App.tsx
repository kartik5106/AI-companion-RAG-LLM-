import React, { useState } from "react";
import "./App.css";
import SpeechInput from "./components/SpeechInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [output, setOutput] = useState<string>("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSpeechOutput = (transcript: string) => {
    setOutput(transcript);
  };

  return (
    <div
      className={`flex h-[100vh] transition-all duration-300 bg-gray-400 ${
        isSidebarOpen ? "ml-[20vw]" : "ml-0"
      }`}
      style={{ backgroundColor: "#212121" }}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex justify-center items-center flex-col flex-wrap content-between text-2xl w-[100%] mb-10 rounded-2xl p-4">
        <div className="rounded-[3px] w-[100%] p-3 text-white" style={{ backgroundColor: "#212121" }}>
          <h2 className="mr-20 flex justify-end">
            <FontAwesomeIcon icon={faRobot} className="mr-4 pt-1" />
            Memaid
          </h2>
        </div>
        <div className="p-[20px] h-[70vh] text-white text-xl w-[90%]">
          <p>{output}</p> 
        </div>
        <div className="h-[10vh] w-[90%] shadow-xl rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#2F2F2F" }}>
          <SpeechInput onSpeechOutput={handleSpeechOutput} />
        </div>
      </div>
    </div>
  );
};

export default App;
