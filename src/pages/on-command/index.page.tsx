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
  const userInteraction = useComfyCommand();
  const { mutate } = trpc.searchVid.useMutation();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [playing, setPlaying] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    if (
      userInteraction &&
      userInteraction.command === 'ytwatch' &&
      (userInteraction.flags.broadcaster ||
        allowed.filter(
          (flag) => userInteraction.flags[flag as keyof OnMessageFlags]
        ).length)
    ) {
      mutate(userInteraction.message, {
        onSuccess: (data) => {
          if (data.length) {
            setVideos((current) => [...current, data[0] as YouTubeVideo]);
            ComfyJS.Say(
              `@${userInteraction.user} queued ${data[0].title}`,
              channel!
            );
          } else {
            ComfyJS.Say(
              `No videos found @${userInteraction.user}! Deadge`,
              channel!
            );
          }
        },
      });
    }
  }, [allowed, channel, mutate, userInteraction]);

  useEffect(() => {
    if (!playing && videos.length) {
      setVideos(([toPlay, ...queue]) => {
        setPlaying(toPlay);

        return queue;
      });
    }
  }, [playing, videos.length]);

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          className="player-bg"
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
        >
          <Youtube
            videoId={playing.id}
            onEnd={() => setPlaying(null)}
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
