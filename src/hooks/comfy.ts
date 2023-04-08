import ComfyJS, {
  OnMessageFlags,
  OnMessageExtra,
  OnCommandExtra,
} from 'comfy.js';
import { useState } from 'react';

export const useComfyCommand = () => {
  const [userInteraction, setUserInteraction] = useState<
    [string, string, string, OnMessageFlags, OnCommandExtra, number] | []
  >([]);

  ComfyJS.onCommand = (user, command, message, flags, extra) => {
    setUserInteraction([
      user,
      command,
      message,
      flags,
      extra,
      new Date().getTime(),
    ]);
  };

  return userInteraction;
};

export const useComfyChat = () => {
  const [userInteraction, setUserInteraction] = useState<
    [string, string, OnMessageFlags, boolean, OnMessageExtra, number] | []
  >([]);

  ComfyJS.onChat = (user, message, flags, self, extra) => {
    setUserInteraction([
      user,
      message,
      flags,
      self,
      extra,
      new Date().getTime(),
    ]);
  };

  return userInteraction;
};

const comfy = { useComfyCommand, useComfyChat };

export default comfy;
