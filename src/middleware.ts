import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import { redirect } from "next/navigation";

const admin_emails = ["chauhananiket2004@gmail.com"] 

export default async function authMiddleware(request: NextRequest) {
  // extracting out full path of the url except base url
  const { pathname, search, hash } = request.nextUrl;
  const fullPath = `${pathname}${search}${hash}`;

  const { data: session } = await betterFetch<any>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        //get the cookie from the request
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  if (!session) {
    // adding user current route in searchParam
    const redirectURL = new URL("/sign-in", request.url);
    redirectURL.searchParams.set("redirectURL", fullPath);
    return NextResponse.redirect(redirectURL);
  }

  const isAdmin = admin_emails.includes(session.user.email);

  if (!isAdmin) {
    const url = new URL("/unauthorized", request.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // add matcher functions here
  matcher: ["/"],
};