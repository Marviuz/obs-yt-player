import {
  search,
  yt_validate,
  YouTubeVideo,
  extractID,
  video_info,
} from 'play-dl';
import { z } from 'zod';

import { procedure, router } from '../trpc';

export const appRouter = router({
  searchVid: procedure.input(z.string()).mutation(async ({ input }) => {
    if (input.startsWith('https') && yt_validate(input) === 'video') {
      const vid = await video_info(input);
      return [vid.video_details];
    }

    return await search(input);
  }),
});

export type AppRouter = typeof appRouter;
