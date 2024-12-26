import { createAPIFileRoute } from '@tanstack/start/api';
import { OAuth2RequestError } from 'arctic';
import { parseCookies } from 'vinxi/http';
import {
  createSession,
  generateSessionToken,
  github,
  setSessionTokenCookie,
} from '../../../server/auth';
import { PrismaClient } from '@prisma/client';

interface GitHubUser {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string;
  location: string | null;
  login: string;
}

export const APIRoute = createAPIFileRoute('/api/auth/callback/github')({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    const cookies = parseCookies();
    const storedState = cookies.github_oauth_state;

    if (!code || !state || !storedState || state !== storedState) {
      return new Response(null, {
        status: 400,
      });
    }

    const PROVIDER_ID = 'github';

    try {
      const prismaClient = new PrismaClient();
      const tokens = await github.validateAuthorizationCode(code);
      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      });
      const providerUser: GitHubUser = await githubUserResponse.json();

      console.log(`providerUser ${JSON.stringify(providerUser)}`);

      const existingUser = await prismaClient.oAuthAccount.findFirst({
        where: {
          providerId: PROVIDER_ID,
          providerUserId: providerUser.id.toString(),
        },
      });

      if (existingUser) {
        const token = generateSessionToken();
        const session = await createSession(token, existingUser.userId);
        setSessionTokenCookie(token, session.expires);
        return new Response(null, {
          status: 302,
          headers: {
            Location: '/',
          },
        });
      } else {
        if (providerUser.email) {
          const existingUserByEmail = await prismaClient.user.findFirst({
            where: {
              email: providerUser.email,
            },
          });

          if (existingUserByEmail) {
            await prismaClient.oAuthAccount.create({
              data: {
                providerId: PROVIDER_ID,
                providerUserId: providerUser.id,
                userId: existingUserByEmail.id,
              },
            });
            const token = generateSessionToken();
            const session = await createSession(token, existingUserByEmail.id);
            setSessionTokenCookie(token, session.expires);
            return new Response(null, {
              status: 302,
              headers: {
                Location: '/',
              },
            });
          }
        }
      }

      const userId = await prismaClient.$transaction(async (tx) => {
        const newUser = await prismaClient.user.create({
          data: {
            email: providerUser.email,
            name: providerUser.name || providerUser.login,
            password: '',
          },
        });

        const oauthAccount = await prismaClient.oAuthAccount.create({
          data: {
            providerId: PROVIDER_ID,
            providerUserId: providerUser.id.toString(),
            userId: newUser.id,
          },
        });

        return newUser.id;
      });

      const token = generateSessionToken();
      const session = await createSession(token, userId);
      setSessionTokenCookie(token, session.expires);
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/',
        },
      });
    } catch (e) {
      console.log(e);
      if (e instanceof OAuth2RequestError) {
        return new Response(null, {
          status: 400,
        });
      }
      return new Response(null, {
        status: 500,
      });
    }
  },
});
