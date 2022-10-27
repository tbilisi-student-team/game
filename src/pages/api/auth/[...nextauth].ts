import NextAuth, {NextAuthOptions} from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Yandex from 'next-auth/providers/yandex';
import {RoutePaths} from '@/types/RoutePaths';
import CredentialsProvider from "next-auth/providers/credentials";
import {signin, signup} from "@/remoteAPI/auth";
import {NextApiRequest, NextApiResponse} from "next";
import {getCurrentUser} from "@/remoteAPI/users";
import {User, YandexUser} from "@/db/sequelize";

export const authOptions: (req: NextApiRequest, res: NextApiResponse) => NextAuthOptions = (req, res) => { return {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Yandex({
      clientId: process.env.NEXT_PUBLIC_YANDEX_ID!,
      clientSecret: process.env.YANDEX_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        login: {},
        password: {},
      },
      async authorize(credentials, req) {
        try {
          console.log(credentials);
          if (credentials == null) {
            return null;
          }
          return { id: req.query?.id };
        }
        catch (error) {
          console.error(error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    newUser: RoutePaths.User,
  },
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      console.log('signIn', user, account, profile, credentials);
      if (account.provider == 'yandex' && typeof profile.id == 'string') {
        const yUser = await YandexUser.findOne({where: {id: profile.id}});
        if (yUser) {
          await yUser.update({data: JSON.stringify(profile)});
        }
        else {
          await YandexUser.create({id: profile.id, data: JSON.stringify(profile)});
        }
        let headers;
        try
        {
          const user = await User.findOne({where: {YandexUserId: profile.id}});
          if (user) {
            const signinResponse = await signin({login: profile.default_email as string, password: 'Passw0rd!'});
            console.log(signinResponse);
            headers = signinResponse.headers;
          } else {
            const signupResponse = await signup({
              login: profile.default_email as string,
              email: profile.default_email as string,
              phone: '1234567890',
              password: 'Passw0rd!',
              first_name: profile.first_name as string,
              second_name: profile.last_name as string,
            });
            console.log(signupResponse);
            if (signupResponse) {
              await User.create({
                id: signupResponse.data.id,
                YandexUserId: profile.id,
              });
            }
            headers = signupResponse.headers;
          }
        }
        catch (error) {
          console.error(error);
          throw error;
        }
        const cookies = headers['set-cookie'];
        if (cookies) {
          res.setHeader('set-cookie', cookies);
        }
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      console.log('jwt', token, account, profile);
      // Persist the OAuth access_token and or the user id to the token right after signin
      // if (account) {
      //   token.accessToken = account.access_token
      //   token.id = profile.id
      // }
      return token;
    },
    async session({ session , user, token}) {
      console.log('session', session, token, user);
      if (req && req.query.update && req.body) {
        console.log(req.body);
        // const ypUser:
      }
      return session;
    },
  }
}}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, authOptions(req, res))
}

export default handler;
