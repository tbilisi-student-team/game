import {NextApiRequest, NextApiResponse} from 'next';

import {Emotion} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const emotionData = req.body;

      const {
        text,
        authorName,
        TopicId,
      } = emotionData;

      if (
        typeof text === 'string' &&
        typeof authorName === 'string' &&
        typeof TopicId === 'number'
      ) {
        const emotion = await Emotion.create({
          text,
          authorName,
          TopicId,
        });

        const emotions = await Emotion.findAll({ where: { TopicId } })

        res.status(200).send(emotions);
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
