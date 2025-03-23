import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              correo: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" }
          });
          
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Error en la autenticación");
          }
          
          return {
            id: data.user.id,
            email: data.user.correo,
            name: data.user.nombre,
            role: data.user.role,
            backendTokens: {
              accessToken: data.token
            }
          };
        } catch (error) {
          console.error("Error en autorización:", error);
          return null;
        }
      }
    })
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
      session.user = token;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
