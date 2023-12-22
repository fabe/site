import { useState, useEffect } from "react";

export const useAudio = (url) => {
  if (typeof Audio === "undefined") {
    return;
  }

  const [audio] = useState(new Audio(url));

  const play = () => {
    audio.play();
  };

  useEffect(() => {
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  return play;
};
