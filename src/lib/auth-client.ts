import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import dotenv from "dotenv";

dotenv.config();
export const { signIn, signOut, signUp, useSession } = createAuthClient({
  baseURL: "https://admin-panel-iota-blond.vercel.app/" as string,
  plugins: [customSessionClient<typeof auth>()],
});