import ComfyJS from 'comfy.js';
import { AnimatePresence, motion } from 'framer-motion';
import { InferGetServerSidePropsType, NextPageContext } from 'next';
import { YouTubeVideo } from 'play-dl';
import { useEffect, useState } from 'react';
import Youtube from 'react-youtube';

import { isDev } from '@/constants';
import { useComfyChat, useComfyCommand } from '@/hooks/comfy';
import { trpc } from '@/utils/trpc';

export const getServerSideProps = async ({ query }: NextPageContext) => {
  return {
    props: {
      limit: parseInt(query.limit as string) || 5,
      rewardId: (query.rewardId as string) || null,
      channel: (query.channel as string) || null,
    },
  };
};

export default function OnRedeem({
  limit,
  rewardId,
  channel,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [user, message, flags, self, extra] = useComfyChat();
  const [_u, command, _m, commandFlags, _e, timestamp] = useComfyCommand();
  const { mutate } = trpc.searchVid.useMutation();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  useEffect(() => {
    if (flags?.customReward && extra?.customRewardId === rewardId) {
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
  }, [
    channel,
    extra?.customRewardId,
    flags?.customReward,
    message,
    mutate,
    rewardId,
    user,
  ]);

  useEffect(() => {
    if (
      command === 'ytstop' &&
      (commandFlags?.broadcaster || commandFlags?.mod)
    ) {
      setVideos(([playing, ...queue]) => queue);
    }
  }, [command, commandFlags?.broadcaster, commandFlags?.mod, timestamp]);

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
            onEnd={() => setVideos(([playing, ...queue]) => queue)}
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
