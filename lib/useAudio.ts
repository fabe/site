import { useState, useEffect } from "react";

export const useAudio = (url) => {
  const [audio] = useState(() => {
    if (typeof Audio !== "undefined") {
      return new Audio(url);
    }
    return null;
  });

  const play = () => {
    if (audio) {
      audio.play();
    }
  };

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  return play;
};
