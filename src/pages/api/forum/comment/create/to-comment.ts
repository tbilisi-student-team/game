import {NextApiRequest, NextApiResponse} from 'next';

import {Comment} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const commentData = JSON.parse(req.body);

      const {
        text,
        authorName,
        ParentCommentId,
      } = commentData;

      if (
        typeof text === 'string' &&
        typeof authorName === 'string' &&
        typeof ParentCommentId === 'number'
      ) {
        const comment = await Comment.create({
          text,
          authorName,
          ParentCommentId,
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