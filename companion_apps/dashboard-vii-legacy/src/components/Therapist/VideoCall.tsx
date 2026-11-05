import { useState, useRef } from 'react';
import { message } from 'antd';
import { FaVideo, FaMicrophone, FaPhoneSlash } from 'react-icons/fa';

export default function VideoCall() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peerConnection = new RTCPeerConnection();
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

      peerConnectionRef.current = peerConnection;
      setIsCallActive(true);
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to update therapist: ${errorMessage}`);
   
    }
  };

  const endCall = () => {
    const tracks = (localVideoRef.current?.srcObject as MediaStream)?.getTracks();
    if (tracks) {
      tracks.forEach((track: MediaStreamTrack) => track.stop());
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setIsCallActive(false);
  };

  const toggleMute = () => {
    const audioTracks = (localVideoRef.current?.srcObject as MediaStream)?.getAudioTracks();
    if (audioTracks && audioTracks.length > 0) {
      audioTracks[0].enabled = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    const videoTracks = (localVideoRef.current?.srcObject as MediaStream)?.getVideoTracks();
    if (videoTracks && videoTracks.length > 0) {
      videoTracks[0].enabled = !isVideoOn;
      setIsVideoOn(!isVideoOn);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-semibold mb-4">Video Call</h2>
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4">
        {isCallActive ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-full bg-gray-800 rounded-lg"
          ></video>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Start a call to begin video chat</p>
          </div>
        )}
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleVideo}
          className={`p-2 rounded-full ${
            isVideoOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
          } text-white`}
        >
          <FaVideo />
        </button>
        <button
          onClick={toggleMute}
          className={`p-2 rounded-full ${
            !isMuted ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
          } text-white`}
        >
          <FaMicrophone />
        </button>
        {isCallActive ? (
          <button
            onClick={endCall}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
          >
            <FaPhoneSlash />
          </button>
        ) : (
          <button
            onClick={startCall}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
          >
            Start Call
          </button>
        )}
      </div>
    </div>
  );
}
