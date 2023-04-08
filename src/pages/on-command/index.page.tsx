import ComfyJS, { OnMessageFlags } from 'comfy.js';
import { AnimatePresence, motion } from 'framer-motion';
import { InferGetServerSidePropsType, NextPageContext } from 'next';
import { YouTubeVideo } from 'play-dl';
import { useEffect, useState } from 'react';
import Youtube from 'react-youtube';

import { isDev } from '@/constants';
import { useComfyCommand } from '@/hooks/comfy';
import { trpc } from '@/utils/trpc';

export const getServerSideProps = async ({ query }: NextPageContext) => {
  return {
    props: {
      limit: parseInt(query.limit as string) || 5,
      channel: (query.channel as string) || null,
      allowed: query.allowed ? (query.allowed as string).split(',') : [],
    },
  };
};

export default function OnCommand({
  limit,
  channel,
  allowed,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [user, command, message, flags, extra, timestamp] = useComfyCommand();
  const { mutate } = trpc.searchVid.useMutation();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  useEffect(() => {
    if (
      command === 'ytwatch' &&
      (flags?.broadcaster ||
        allowed.filter((flag) => flags![flag as keyof OnMessageFlags]).length)
    ) {
      mutate(message!, {
        onSuccess: (data) => {
          if (data.length) {
            setVideos((current) => [...current, data[0] as YouTubeVideo]);
            ComfyJS.Say(`@${user} queued ${data[0].title}`, channel!);
          } else {
            ComfyJS.Say(`No videos found @${user}! Deadge`, channel!);
          }
        },
      });
    }

    if (command === 'ytstop' && (flags?.broadcaster || flags?.mod)) {
      setVideos(([playing, ...queue]) => queue);
    }
  }, [allowed, channel, command, flags, message, mutate, user, timestamp]);

  return (
    <AnimatePresence>
      {videos[0] && (
        <motion.div
          className="player-bg"
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
        >
          <Youtube
            videoId={videos[0].id}
            onEnd={() => setVideos(([toPlay, ...queue]) => queue)}
            opts={{
              width: '1280',
              height: '720',
              playerVars: {
                autoplay: 1,
                playsinline: 1,
                controls: isDev ? 1 : 0,
                end: limit,
              },
            }}
          ></Youtube>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
