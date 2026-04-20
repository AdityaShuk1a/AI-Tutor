import React, {useState} from 'react'
import Navbar from '../components/Navbar';
import Mascot from '../components/Mascot';
import '../styles/home.css';
import VoiceModule from '../components/VoiceModule';

export function Tutor() {
  const [step, setStep] = useState('teaching'); // 'teaching' or 'quiz'

  return (
    <div className='main-container'>
      <Navbar />
      <Mascot />
      <VoiceModule onSend={() => {}} />
    </div>
  );
}