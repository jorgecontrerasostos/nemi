import { useState } from "react";

type Size = "sm" | "md" | "lg";
type Mood = "default" | "thinking" | "happy" | "curious";

interface Props {
  size?: Size;
  mood?: Mood;
}

const sizeClasses: Record<Size, string> = {
  sm: "w-7 h-7",
  md: "w-10 h-10",
  lg: "w-20 h-20",
};

const textSizeClasses: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-xl",
};

// mood will drive visual variants in V2 — unused for now
export default function NemiAvatar({ size = "sm", mood: _mood = "default" }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0 font-bold text-on-primary-fixed ${textSizeClasses[size]}`}
      >
        N
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-surface-container-lowest flex-shrink-0 overflow-hidden`}>
      <img
        src="/nemi-avatar.png"
        alt="Nemi the axolotl"
        className="w-full h-full object-cover"
        onError={() => setImgFailed(true)}
      />
    </div>
  );
}
