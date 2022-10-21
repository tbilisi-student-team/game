import {NextApiRequest, NextApiResponse} from 'next';

import {Topic} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const topicData = JSON.parse(req.body);

      const {
        title,
        text,
        authorName,
      } = topicData;

      if (
        typeof title === 'string' &&
        typeof text === 'string' &&
        typeof authorName === 'string'
      ) {
        const topic = await Topic.create({
          title,
          text,
          authorName,
        });

        res.status(200).send(topic);
      } else {
        res.status(400).send('400 Bad Request.');
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
