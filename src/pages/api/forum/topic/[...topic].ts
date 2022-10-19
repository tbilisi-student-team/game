import {NextApiRequest, NextApiResponse} from 'next';

import {Topic} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const requestQueryId = req.query.id;

      if (typeof requestQueryId === 'string') {
        const topicId = parseInt(requestQueryId, 10);

        const topic = await Topic.findOne({ where: { id: topicId }, raw: true, });

        if (topic) {
          res.status(200).send(topic);
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
