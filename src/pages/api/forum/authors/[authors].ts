import {NextApiRequest, NextApiResponse} from 'next';
import {Author} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const requestQueryIds = req.query.ids;

      let authors = [];

      if (Array.isArray(requestQueryIds) && !!requestQueryIds.length) {
        authors = await Author.findAll({ where: { id: requestQueryIds }, raw: true, })
      } else {
        authors = await Author.findAll({ raw: true });
      }

      res.status(200).send(authors);
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
