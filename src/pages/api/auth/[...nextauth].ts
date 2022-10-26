import NextAuth, {NextAuthOptions} from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Yandex from 'next-auth/providers/yandex';
import {RoutePaths} from '@/types/RoutePaths';
import CredentialsProvider from "next-auth/providers/credentials";
import {signin} from "@/remoteAPI/auth";
import {NextApiRequest, NextApiResponse} from "next";
import {getCurrentUser} from "@/remoteAPI/users";
import {User} from '@/db/sequelize';

const authOptions: (req: NextApiRequest, res: NextApiResponse) => NextAuthOptions = (req, res) => { return {
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

          const payload = {
            login: credentials.login,
            password: credentials.password,
          }

          const response = await signin(payload);
          const cookies = response.headers['set-cookie'];
          console.log(cookies);

          if (cookies) {
            res.setHeader('set-cookie', cookies);
            const cookie = cookies.map(cookie => cookie.split(';')[0]).reverse().slice(0, 2).join(';');
            const userResponse = await getCurrentUser({headers: {cookie}});
            const user = userResponse.data;
            return userResponse.data;
          }

          return null;
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
