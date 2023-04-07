import ComfyJS from 'comfy.js';

const useComfy = (channel: string) => {
  ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if (flags.broadcaster && command === 'test') {
      console.log('!test was typed in chat');
    }
  };

  ComfyJS.Init(channel);
};

export default useComfy;
