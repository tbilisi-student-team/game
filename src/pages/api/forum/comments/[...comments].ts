import {NextApiRequest, NextApiResponse} from 'next';
import {Comment} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const requestQueryIds = req.query.ids;

      let comments = [];

      if (Array.isArray(requestQueryIds) && !!requestQueryIds.length) {
        comments = await Comment.findAll({ where: { id: requestQueryIds }, raw: true, })
      } else {
        comments = await Comment.findAll({ raw: true });
      }

      res.status(200).send(comments);
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
