// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request: NextRequestWithAuth) {
    // console.log(request.nextUrl.pathname)
    // console.log(request.nextauth.token)
  
  },
  {
    callbacks: {
        
      authorized: ({ token }) => {
        console.log('callback authorized', token)

        return redirect('/mediwise?error=hi')
        return !!token
      },
    },
  }
);

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|$|assets|images).*)",
  ],
  // matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
