import {NextApiRequest, NextApiResponse} from 'next';
import {Topic} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const requestQueryIds = req.query.ids;

      let topics = [];

      if (Array.isArray(requestQueryIds) && !!requestQueryIds.length) {
        topics = await Topic.findAll({ where: { id: requestQueryIds }, raw: true, })
      } else {
        topics = await Topic.findAll({ raw: true });
      }

      res.status(200).send(topics);
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
