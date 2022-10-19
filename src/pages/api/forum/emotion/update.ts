import {NextApiRequest, NextApiResponse} from 'next';

import {Comment} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const data = JSON.parse(req.body);

      const {
        commentId,
        emotionText,
      } = data;

      if (
        typeof commentId === 'number' &&
        typeof emotionText === 'string'
      ) {
        let comment = await Comment.findOne({ where: { id: commentId }, raw: true, });

        if (comment) {
          comment.update({ emotions: [ ...comment.emotions, emotionText ] })
        } else {
          res.status(404).send('404 Not Found.')
        }

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
