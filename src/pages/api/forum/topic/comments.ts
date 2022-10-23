import {NextApiRequest, NextApiResponse} from 'next';
import {Comment} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const requestQueryTopicId = req.query.topicId;

      if (typeof requestQueryTopicId === 'string') {
        const comments = await Comment.findAll({ where: { TopicId: requestQueryTopicId } });

        res.status(200).send(comments);
      } else {
        res.status(400).send('400 Bad Request.')
      }
    } else {
      res.status(405).send('405 Method Not Allowed.')
    }
  }
  catch (error) {
    console.error('API error', error);
    res.status(500).send(error);
  }
};

export default handler;
