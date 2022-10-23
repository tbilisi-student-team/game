import {NextApiRequest, NextApiResponse} from 'next';
import {Comment} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const requestQueryParentCommentId = req.query.parentCommentId;

      if (typeof requestQueryParentCommentId === 'string') {
        const childComments = await Comment.findAll({ where: { ParentCommentId: parseInt(requestQueryParentCommentId, 10) } });

        res.status(200).send(childComments);
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
