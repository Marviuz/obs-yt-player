import { search } from 'play-dl';
import { z } from 'zod';

import { procedure, router } from '../trpc';

export const appRouter = router({
  searchVid: procedure
    .input(z.string())
    .mutation(async ({ input }) => await search(input)),
});

export type AppRouter = typeof appRouter;
