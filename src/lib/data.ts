
import { betterFetch } from "@better-fetch/fetch";
import { headers } from "next/headers";
import { Session } from "./auth";

/**
 * Retrieves the user's authentication session data from the API
 *
 * This function fetches the current user session by forwarding cookies from the incoming request
 * to the authentication endpoint. It's used in server components to check authentication status
 * and access user information.
 *
 * @async
 * @returns {Promise<Object|null>} The user session object if authenticated, null otherwise
 */
export async function getSession() {
const headersList = await headers();
const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
    baseURL: process.env.BETTER_AUTH_URL,
    headers: {
    // get the cookie from the request
    cookie: headersList.get("cookie") || "",
    },
});
return session?.user ? session.user : null;
}