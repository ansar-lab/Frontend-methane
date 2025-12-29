import VoiceAgent from "@/components/VoiceAgent";

export default function Index() {
  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/Screenshot 2025-12-29 183452.png"
          alt="Chatbot Screenshot"
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <VoiceAgent />
    </div>
  );
}
