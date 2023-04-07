import '@/styles/globals.css';
import ComfyJS from 'comfy.js';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { trpc } from '@/utils/trpc';

import type { AppType } from 'next/app';

const App: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    ComfyJS.Init(
      router.query.channel as string,
      (router.query.replier as string) || undefined
    );
  }, [router.query.channel, router.query.replier]);

  return <Component {...pageProps} />;
};

export default trpc.withTRPC(App);
