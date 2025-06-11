
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Button from './Button';
import CameraIcon from './icons/CameraIcon';
import Modal from './Modal'; // Assuming Modal is available

interface FaceCaptureClientProps {
  onCapture: (faceData: string) => void;
  promptMessage?: string;
  isVerification?: boolean;
}

const FaceCaptureClient: React.FC<FaceCaptureClientProps> = ({ 
  onCapture, 
  promptMessage = "Position your face within the frame.",
  isVerification = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = useCallback(async () => {
    setError(null);
    setShowPlaceholder(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera access denied or not available. Using placeholder.");
      setShowPlaceholder(true);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  }, [stream]);

  useEffect(() => {
    if (isModalOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera(); // Cleanup on unmount or when modal closes
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]); // Removed startCamera and stopCamera from deps as they are stable due to useCallback with empty deps

  const handleCapture = () => {
    setIsCapturing(true);
    // Simulate capture delay
    setTimeout(() => {
      let faceData = `simulated_face_data_${Date.now()}`;
      if (videoRef.current && stream) {
        // In a real scenario, you'd capture a frame and process it.
        // For this simulation, we just generate a placeholder.
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            faceData = canvas.toDataURL('image/jpeg', 0.5); // Example: use actual frame data
        }
      }
      onCapture(faceData);
      setIsModalOpen(false);
      setIsCapturing(false);
    }, 1500); // Simulate processing time
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    stopCamera();
  };
  
  const buttonText = isVerification ? "Verify Identity" : "Capture Face";

  return (
    <>
      <Button onClick={openModal} variant="secondary" leftIcon={<CameraIcon className="w-5 h-5" />}>
        {buttonText}
      </Button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={buttonText} size="md">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-gray-600 text-center">{promptMessage}</p>
          <div className="w-full h-64 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
            {error && showPlaceholder && (
              <div className="text-center p-4">
                 <CameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-red-500">{error}</p>
                <p className="text-xs text-gray-500 mt-1">A placeholder image will be used for registration/verification.</p>
              </div>
            )}
            {!error && <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />}
          </div>
          {error && !showPlaceholder && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
            <Button variant="ghost" onClick={closeModal} disabled={isCapturing}>Cancel</Button>
            <Button onClick={handleCapture} isLoading={isCapturing} disabled={isCapturing}>
                {isCapturing ? (isVerification ? "Verifying..." : "Capturing...") : (isVerification ? "Verify" : "Capture")}
            </Button>
        </div>
      </Modal>
    </>
  );
};

export default FaceCaptureClient;
