import React from 'react';
import { Button } from '@/ui/Button';
import { RoutePaths } from '@/types/index';
import { Layout } from '@/components/Layout';
import { useRouter } from 'next/router';
import { GlobalServerSideProps } from "@/utils/getServerSideProps";

export default function Main(props: GlobalServerSideProps) {
  const router = useRouter();
  console.log(props)
  return (
    <Layout theme={props.theme}>
      <div className='description'>
        <p>
          We offer to your attention a funny game where your character gather fruits for his kids. 
          He should only pick green or ripe fruits. Old fruits are no longer tasty, and if the fruit falls, 
          then oh-oh! Keep in mind that your score depends on the condition of the collected fruits!
           Please use only the mouse to guide the path of the seed. We will save the best results in our 
           leaderboard!
        </p>
        <p>
          Technologies used:
        </p>
          <ul>
            <li>React</li>
            <li>Redux</li>
            <li>NextJS</li>
            <li>NodeJS</li>
            <li>Canvas API</li>
            <li>Service Workers</li>
            <li>PostgreSQL</li>
          </ul>
        <Button disabled={false} name='Start' onSubmit={() => {
          router.push(RoutePaths.Game)
        }} />
      </div>
    </Layout>
  )
}
