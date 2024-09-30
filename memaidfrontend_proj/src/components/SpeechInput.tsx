import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMicrophone,faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

const SpeechInput: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    handleListen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue..");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped Mic on Click");
      };
    }

    mic.onstart = () => {
      console.log("Mics on");
    };

    mic.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log(transcript);
      setNote(transcript); 
    };

    mic.onerror = (event: any) => {
      console.log(event.error);
    };
  };



  return (
    <>
      <div className="container flex bg-white w-[100%] h-[60px] rounded-xl">
        <div className="flex-rows flex text-[18px] items-center justify-start">
          <input
            type="text"
            className="w-[380px] ml-[-10px] bt-[3px] rounded-2xl h-[60px] focus:outline-none focus:ring-0 pl-[15px] mr-[45px]"
            placeholder="Ask anything..."
            value={note}   
            onChange={(e) => setNote(e.target.value)}  
          />
          <button>
          <FontAwesomeIcon icon={faPaperPlane} className="text-[25px] mr-[10px]" color="blue" />

          </button>
          
      
          <button onClick={() => setIsListening((prevState) => !prevState)} className="mt-[5px]">
            {isListening ? (
              <FontAwesomeIcon icon={faMicrophone} className="text-[25px]" color="red" />
            ) : (
              <FontAwesomeIcon icon={faMicrophone} className="text-[25px] mr-[6px]" color="gray" />
            )}
          </button>
          
        </div>
      </div>
    </>
  );
};

export default SpeechInput;
