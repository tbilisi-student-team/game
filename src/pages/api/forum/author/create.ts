import {NextApiRequest, NextApiResponse} from 'next';

import {Author} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const authorData = JSON.parse(req.body);

      const {
        name,
      } = authorData;

      if (typeof name === 'string') {
        const author = await Author.create({
          name
        });

        res.status(200).send(author);
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
