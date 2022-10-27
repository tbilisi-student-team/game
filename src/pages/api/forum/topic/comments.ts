import {NextApiRequest, NextApiResponse} from 'next';
import {Comment, Topic} from '@/db/sequelize';
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions(req, res))
    if (session) {
      if (req.method === 'GET') {
        const requestQueryTopicId = req.query.topicId;

        if (typeof requestQueryTopicId === 'string') {
          const comments = await Comment.findAll({ where: { TopicId: parseInt(requestQueryTopicId, 10) } });

          res.status(200).send(comments);
        } else {
          res.status(400).send('400 Bad Request.')
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
