import { InferGetServerSidePropsType, NextPageContext } from 'next';

export const getServerSideProps = async ({ query }: NextPageContext) => {
  return {
    props: {
      channel: query.channel || null,
      limit: parseInt(query.limit as string) || 5,
    },
  };
};

const Home = ({
  channel,
  limit,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      Hello, World {channel} {limit}
    </div>
  );
};

export default Home;
