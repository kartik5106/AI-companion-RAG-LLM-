import './App.css';
import React from 'react';
import SpeechInput from './components/SpeechInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';


const App:React.FC= ()=> {
 
  return (
    <>
<div className='flex shadow-xl border-[2px]  flex-row justify-center flex-wrap content-between text-2xl  w-[35vw] m-auto mt-10 h-[85vh] rounded-2xl p-4'>
  <div className='rounded-[3px]  w-[100%] p-3 text-white' style={{backgroundColor:"#5A189A"}} > 
    <h2>
    <FontAwesomeIcon icon={faRobot} className='mr-4'/>
      Memeaid</h2>
  </div>
  <div className='bg-blue-100 h-[calc(100%-100px)] w-[100%]'>
    chats
  </div>
  <div> 
    <SpeechInput />
  </div>
</div>

    </>
  )
}

export default App
