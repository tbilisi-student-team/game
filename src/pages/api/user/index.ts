import {NextApiRequest, NextApiResponse} from 'next';

import {User} from '@/db/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'GET') {
            const id = parseInt(String(req.query.id));
            if (!isNaN(id)) {
                const user = await User.findOne({where: {id: id}});
                if (user) {
                    res.status(200).send(user);
                }
                else {
                    res.status(404).send('user does not exist');
                }
            }
            else {
                res.status(400).send('id is undefined');
            }
        }
        else if (req.method === 'POST') {
            const userData = JSON.parse(req.body);
            if (typeof userData.id === 'number' && typeof userData.theme === 'string') {
                const [user, created] = await User.findOrCreate({
                    where: {id: userData.id},
                    defaults: {
                        id: userData.id,
                        theme: userData.theme,
                    }
                });
                if (!created) {
                    await user.update({theme: userData.theme});
                }
                res.status(200).send(user);
            }
            else {
                console.warn(userData);
                res.status(400).send('unsupported body object');
            }
        }
    }
    catch (error) {
        console.error('API error', error);
        res.status(500).send(error);
    }
};

export default handler;
