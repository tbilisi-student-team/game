import {NextApiRequest, NextApiResponse} from 'next';

import {Topic} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const requestQueryId = req.query.id;

      if (typeof requestQueryId === 'string') {
        const commentId = parseInt(requestQueryId, 10);

        const comment = await Topic.findOne({ where: { id: commentId }, raw: true, });

        if (comment) {
          res.status(200).send(comment);
        } else {
          res.status(404).send('404 Not Found');
        }
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
