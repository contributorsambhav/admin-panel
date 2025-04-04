import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import { redirect } from "next/navigation";

const admin_emails = ["sambhav511974@gmail.com",
"sharmasaurenb@gmail.com",
"manavisharma529@gmail.com",
"pragya.artik@gmail.com",
"chauhananiket2004@gmail.com",
"ujjawalmahesh005@gmail.com",
"anshijain63@gmail.com",
"junejasoham@gmail.com",
"ujjwal.kumar4987@gmail.com",
"23bcs124@nith.ac.in",
"nandinigusain17@gmail.com",
"ishaan.ps@gmail.com",
"rahulyadavjnvshravasti669@gmail.com",
"rishabhchadha21@gmail.com",
"sarthakarora108108@gmail.com",
"bansalishita59@gmail.com",
"archiarchisman@gmail.com",
"ananyapratapsingh7@gmail.com",
"harshitsethi9165@gmail.com",
"prajapatiarjun68663@gmail.com",
"lokeshjaiswal772705@gmail.com",
"harshsaini0107@gmail.com",
"22bma007@nith.ac.in",
"varshneyanurag125@gmail.com"] 

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