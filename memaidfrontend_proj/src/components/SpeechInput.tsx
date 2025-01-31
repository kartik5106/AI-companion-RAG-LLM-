import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

interface SpeechInputProps {
  onSpeechOutput: (transcript: string) => void;
}

const SpeechInput: React.FC<SpeechInputProps> = ({ onSpeechOutput }) => {
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
      onSpeechOutput(transcript); // Pass the transcript to the parent component
    };

    mic.onerror = (event: any) => {
      console.log(event.error);
    };
  };

  const handleSubmit = () => {
    onSpeechOutput(note); // Send the current note as output
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(); // Trigger output on Enter key press
    }
  };

  return (
    <>
      <div className="container flex bg-white w-[96%] h-[60px] rounded-xl">
        <div className="flex-rows flex text-[18px] bg-gray-800 items-center justify-between w-[100%]" style={{ backgroundColor: "#2F2F2F" }}>
          <input
            type="text"
            className="w-[90%] ml-[-10px] text-white bt-[3px] bg-gray-800 rounded-2xl h-[60px] focus:outline-none focus:ring-0 pl-[15px]"
            placeholder="Ask anything..."
            value={note}
            style={{ backgroundColor: "#2F2F2F" }}
            onChange={(e) => setNote(e.target.value)}  
            onKeyDown={handleKeyPress} // Listen for Enter key press
          />
          <button onClick={handleSubmit}>
            <FontAwesomeIcon icon={faPaperPlane} className="text-[20px]" color="gray" />
          </button>
          <button onClick={() => setIsListening((prevState) => !prevState)} className="mt-[5px]">
            {isListening ? (
              <FontAwesomeIcon icon={faMicrophone} className="text-[25px] ml-5" color="red" />
            ) : (
              <FontAwesomeIcon icon={faMicrophone} className="text-[25px] ml-5" color="gray" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default SpeechInput;
