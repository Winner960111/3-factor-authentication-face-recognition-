"use client";
import React, { useRef, useEffect } from "react";

interface WebcamCaptureProps {
  onCapture: (image: string) => void; // Change to accept an image string
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Create a ref for the canvas

  useEffect(() => {
    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };

    startVideo();
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        // Set canvas dimensions to match video
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        // Draw the video frame to the canvas
        context.drawImage(videoRef.current, 0, 0);

        // Get the image data URL
        const imageSrc = canvasRef.current.toDataURL("image/png");

        // Pass the image data URL to the onCapture prop
        onCapture(imageSrc);
      } 
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} /> {/* Hidden canvas */}
      <button onClick={handleCapture}>Capture</button>
    </div>
  );
};

export default WebcamCapture;


// import React, { useRef, useEffect } from 'react';
// import { loadFaceApiModels, detectFace } from '../utils/faceApi';

// const CaptureButton: React.FC = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     const initializeCamera = async () => {
//       await loadFaceApiModels();
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     };

//     initializeCamera();

//     return () => {
//       if (videoRef.current) {
//         const stream = videoRef.current.srcObject as MediaStream;
//         stream.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, []);

//   const handleCapture = async () => {
//     if (videoRef.current) {
//       const imageCapture = new ImageCapture(videoRef.current.srcObject.getVideoTracks()[0]);
//       const imageBitmap = await imageCapture.grabFrame();
//       // Process the imageBitmap for face detection...
//       await detectFace(imageBitmap);
//     }
//   };

//   return (
//     <div>
//       <video ref={videoRef} autoPlay style={{ display: 'none' }} />
//       <button onClick={handleCapture}>Capture</button>
//     </div>
//   );
// };

// export default CaptureButton;