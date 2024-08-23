import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCaptured, setIsCaptured] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the camera", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.scale(-1, 1); // This inverts the image horizontally
        context.translate(-canvasRef.current.width, 0); // This moves the inverted image back into view
        context.drawImage(videoRef.current, 0, 0);
        setIsCaptured(true);
      }
    }
  };

  const retake = () => {
    setIsCaptured(false);
  };

  const saveImage = () => {
    if (canvasRef.current) {
      const imageSrc = canvasRef.current.toDataURL("image/jpeg");
      onCapture(imageSrc);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-md">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full rounded-lg ${
            isCaptured ? "hidden" : "block"
          } transform scale-x-[-1]`}
        />
        <canvas
          ref={canvasRef}
          className={`w-full rounded-lg ${isCaptured ? "block" : "hidden"}`}
        />
      </div>
      <div className="flex space-x-4">
        {!isCaptured ? (
          <Button onClick={captureImage}>
            <Camera className="mr-2 h-4 w-4" /> Capture
          </Button>
        ) : (
          <>
            <Button onClick={saveImage} variant="default">
              <Check className="mr-2 h-4 w-4" /> Use Photo
            </Button>
            <Button onClick={retake} variant="secondary">
              <RotateCcw className="mr-2 h-4 w-4" /> Retake
            </Button>
          </>
        )}
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CameraCapture;
