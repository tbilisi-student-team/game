import NextAuth, {NextAuthOptions} from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Yandex from 'next-auth/providers/yandex';
import {RoutePaths} from '@/types/RoutePaths';
import CredentialsProvider from "next-auth/providers/credentials";
import {signin} from "@/remoteAPI/auth";
import {NextApiRequest, NextApiResponse} from "next";
import {getCurrentUser} from "@/remoteAPI/users";
import {AxiosRequestHeaders} from "axios";
import {ypTechHTTPClient} from "@/YPTechHTTPClient/ypTechHTTPClient";
import {AXIOS_REQUEST_CONFIG} from "@/config/AxiosRequestConfig";

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
            const cookie = cookies.map(cookie => cookie.split(';')[0]).join(';')
            console.log(cookie);
            // const userResponse = await fetch('https://ya-praktikum.tech/api/v2/auth/user', {
            //   headers: {'cookie': cookies.map(cookie => {
            //     return cookie.split(';')[0];
            //   }).join(';')}
            // });

            const userResponse = await getCurrentUser({headers: {Cookie: cookie}});
            console.log(userResponse);
            // const user = await userResponse.json();
            const user = userResponse.data;
            console.log(user);
            return user;
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
    async signIn({ user, account, profile, email, credentials }) {
      console.log('signIn', user, account, profile, email, credentials);
      return true;
    },
    async session({ session , user}) {
      console.log('session', session, user);

      return session;
    },
  }
}}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, authOptions(req, res))
}

export default handler;
