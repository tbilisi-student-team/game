import {NextApiRequest, NextApiResponse} from 'next';

import {User, YandexUser} from '@/db/sequelize';

import {signin, signup} from "@/remoteAPI/auth";
import {nanoid} from "nanoid";

// type YandexTokenData = {
//     token_type: string,
//     access_token: string,
//     expires_in: number,
//     refresh_token: string,
//     scope: string,
// }

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'GET') {
            console.log('cookies', req.cookies);

            const {code, error} = req.query;
            if (typeof code === 'string') {
                const response = await fetch('https://oauth.yandex.ru/token', {
                    method: 'POST',
                    body: new URLSearchParams({
                        grant_type: 'authorization_code',
                        code,
                        client_id: process.env.NEXT_PUBLIC_YANDEX_ID!,
                        client_secret: process.env.YANDEX_SECRET!,
                    }),
                });
                const tokenData = await response.json();
                console.log(tokenData);

                const {access_token} = tokenData;

                if (access_token) {
                    const resp1 = await fetch('https://login.yandex.ru/info', {
                        headers: {
                            Authorization: `OAuth ${access_token}`
                        }
                    });
                    const info = await resp1.json();

                    console.log(info);

                    const yUser = await YandexUser.findOne({where: {id: info.id}});
                    if (yUser) {
                        await yUser.update({data: JSON.stringify(tokenData)});
                    }
                    else {
                        await YandexUser.create({id: info.id, data: JSON.stringify(tokenData)});
                    }
                    let headers;
                    const user = await User.findOne({where: {YandexUserId: info.id}});
                    if (user) {
                        const signinResponse = await signin({login: info.id, password: 'Passw0rd!'});
                        headers = signinResponse.headers;
                    }
                    else {
                        const signupResponse = await signup({
                            login: info.id,
                            email: nanoid(8) + "@e.mail",
                            phone: '1234567890',
                            password: 'Passw0rd!',
                            first_name: info.first_name,
                            second_name: info.last_name,
                        }, {withCredentials: true});
                        if (signupResponse) {
                            await User.create({
                                id: signupResponse.data.id,
                                YandexUserId: info.id,
                            })
                        }
                        headers = signupResponse.headers;
                    }
                    console.log(headers);
                    const cookies = headers['set-cookie'];
                    console.log(cookies);
                    if (cookies) {
                        res.setHeader('set-cookie', cookies);
                        console.log(res.getHeader('set-cookie'));
                    }
                    res.redirect('/user');
                }
                else {
                    /*
    {
      access_token: 'y0_AgAAAAAAP3eCAAh5XwAAAADRxxinCwEo8PFhSkmU_gbOnVy0aEApUG0',
      expires_in: 31530285,
      refresh_token: '1:4EHA2wIJTAIARbfZ:iMrrV82tEsr_MKG7_ycIzM1-rdfwdIWdM296T2iZ5Z88J_X7YTrGRC9i-RFFPekf1CE-6xDbOu7HzQ:LZXYqwJXv631KrELkQdmyQ',
      token_type: 'bearer'
    }
    {
      id: '4159362',
      login: 'ill-frog',
      client_id: '8bdead37c1ae47f38b253570589183ff',
      display_name: 'Алексей',
      real_name: 'Алексей Артемьев',
      first_name: 'Алексей',
      last_name: 'Артемьев',
      sex: 'male',
      default_email: 'ill-frog@yandex.ru',
      emails: [ 'ill-frog@yandex.ru' ],
      default_avatar_id: '0/0-0',
      is_avatar_empty: true,
      psuid: '1.AAh5Xw.iiKriB_x9KvMpnyoCCwQCQ.KejvGE-E232RN6RvhWNiqA'
    }
                     */

                    res.status(500).send('access_token error');
                }
            }
            else if (error) {
                res.redirect('/');
            }
        }
        else {
            res.status(405).send('');
        }
    }
    catch (error) {
        console.error('API error', error);
        res.status(500).send(error);
    }
};

export default handler;
