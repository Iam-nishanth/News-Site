export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/profile', '/dashboard', '/editor', '/preview/:path*', '/users']
};
