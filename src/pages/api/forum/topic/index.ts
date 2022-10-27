import {NextApiRequest, NextApiResponse} from 'next';
import {Topic} from '@/db/sequelize';
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions(req, res))
    if (session) {
      if (req.method === 'GET') {
        const topicId = req.query.topicId;

        if (typeof topicId === 'string') {
          const topic = await Topic.findOne({ where: { id: topicId } });

          res.status(200).send(topic);
        } else {
          res.status(400).send('400 Bad request.');
        }
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
