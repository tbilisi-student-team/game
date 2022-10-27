import {NextApiRequest, NextApiResponse} from 'next';
import {Topic} from '@/db/sequelize';
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions(req, res))
    if (session) {
      if (req.method === 'GET') {
        const topics = await Topic.findAll();

        res.status(200).send(topics);
      } else {
        res.status(405).send('405 Method Not Allowed.')
      }
    } else {
      res.status(401)
    }
    res.end()
  }
  catch (error) {
    console.error('API error', error);
    res.status(500).send(error);
  }
};

export default handler;
