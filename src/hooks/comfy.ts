import ComfyJS, { OnMessageFlags, OnMessageExtra } from 'comfy.js';
import { useEffect, useState } from 'react';

type ComfyCommandType = {
  user: string;
  command: string;
  message: string;
  flags: OnMessageFlags;
  extra: OnMessageExtra;
};

type ComfyChatType = {
  user: string;
  message: string;
  flags: OnMessageFlags;
  self: boolean;
  extra: OnMessageExtra;
};

export const useComfyCommand = () => {
  const [userInteraction, setUserInteraction] = useState<ComfyCommandType>();

  ComfyJS.onCommand = (user, command, message, flags, extra) => {
    setUserInteraction({
      user,
      command,
      message,
      flags,
      extra,
    });
  };

  return userInteraction;
};

export const useComfyChat = () => {
  const [userInteraction, setUserInteraction] = useState<ComfyChatType>();

  useEffect(() => {
    console.log('triggered');
  }, []);

  ComfyJS.onChat = (user, message, flags, self, extra) => {
    setUserInteraction({
      user,
      message,
      flags,
      self,
      extra,
    });
  };

  return userInteraction;
};

const comfy = { useComfyCommand, useComfyChat };

export default comfy;
