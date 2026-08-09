import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL
    ? `${process.env.BETTER_AUTH_URL}/api/auth`
    : 'http://localhost:3000/api/auth',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectURL: '/dashboard',
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      twoFactorEnabled: {
        type: 'boolean',
        defaultValue: false,
      },
      twoFactorSecret: {
        type: 'string',
        required: false,
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
