import {NextApiRequest, NextApiResponse} from 'next';

import {Comment} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const commentData = req.body;

      const {
        text,
        authorName,
        TopicId,
      } = commentData;

      if (
        typeof text === 'string' &&
        typeof authorName === 'string' &&
        typeof TopicId === 'number'
      ) {
        const comment = await Comment.create({
          text,
          authorName,
          TopicId,
        });

        const comments = await Comment.findAll({ where: { TopicId } });

        res.status(200).send({ comments, comment });
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
