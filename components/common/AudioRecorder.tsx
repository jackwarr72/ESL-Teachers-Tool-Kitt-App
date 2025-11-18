import React, { useState, useRef } from 'react';
import { Button } from './FormElements';
import { MicrophoneIcon, StopIcon } from '../Icons';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, disabled = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.addEventListener("dataavailable", event => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop()); // Release the microphone
      });

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check your browser permissions.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {!isRecording ? (
        <Button onClick={handleStartRecording} disabled={disabled} className="flex items-center">
          <MicrophoneIcon className="mr-2" />
          Record Audio
        </Button>
      ) : (
        <Button onClick={handleStopRecording} disabled={disabled} className="flex items-center !bg-red-600 hover:!bg-red-700">
          <StopIcon className="mr-2" />
          Stop Recording
        </Button>
      )}
      {isRecording && (
        <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Recording...</span>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;