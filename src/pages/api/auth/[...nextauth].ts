import NextAuth, {NextAuthOptions} from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Yandex from 'next-auth/providers/yandex';
import {RoutePaths} from '@/types/RoutePaths';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Yandex({
      clientId: process.env.YANDEX_ID!,
      clientSecret: process.env.YANDEX_SECRET!,
    })
  ],
  pages: {
    newUser: RoutePaths.User,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(user, account, profile, email, credentials);
      return true;
    }
  }
}

export default NextAuth(authOptions)
