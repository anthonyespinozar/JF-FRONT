import CredentialsProvider from "next-auth/providers/credentials";
import { postRequest } from "@/utils/api";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.correo || !credentials?.password) {
          throw new Error("Correo y contraseña son requeridos");
        }

        try {
          const response = await postRequest("auth/login", {
            correo: credentials.correo,
            password: credentials.password
          });

          if (!response || !response.token || !response.user) {
            throw new Error('Credenciales inválidas');
          }

          return {
            id: response.user.id,
            name: response.user.nombre,
            email: response.user.correo,
            role: response.user.rol,
            backendTokens: {
              accessToken: response.token
            }
          };
        } catch (error) {
          throw new Error(error.message || "Error en la autenticación");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          ...user
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        ...token
      };
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === 'development',
}; 