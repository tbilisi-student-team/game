import {NextApiRequest, NextApiResponse} from 'next';

import {Comment} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const commentData = JSON.parse(req.body);

      const {
        id,
        text,
        authorId,
        topicId,
      } = commentData;

      if (
        typeof id === 'number' &&
        typeof text === 'string' &&
        typeof authorId === 'number' &&
        typeof topicId === 'number'
      ) {
        const comment = await Comment.create({
          where: { id },
          defaults: {
            id,
            text,
            authorId,
            topicId,
          }
        });

        res.status(200).send(comment);
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
