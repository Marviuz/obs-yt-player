import '@/styles/globals.css';
import ComfyJS from 'comfy.js';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { trpc } from '@/utils/trpc';

import type { AppType } from 'next/app';

const App: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const hasReplier = (router.query.replier as string)?.startsWith('oauth:');
    const replier = hasReplier
      ? (router.query.replier as string)
      : process.env.NEXT_PUBLIC_REPLIER!;

    ComfyJS.Init(router.query.channel as string, replier);
  }, [router.query.channel, router.query.replier]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default trpc.withTRPC(App);
