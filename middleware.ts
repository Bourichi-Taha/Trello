import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/select-org(.*)',
  '/organisation(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
  let path = "/select-org";
  if (auth().orgId) {
    path = `/organisation/${auth().orgId}`;
  }
  if (auth().userId && !isProtectedRoute(req) && !req.url.includes('api')) {
    const url = new URL(path, req.url);
    return NextResponse.redirect(url);
  }

});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};