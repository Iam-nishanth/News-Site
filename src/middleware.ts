export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/profile', '/admin', '/editor', '/preview/:path*', '/users']
};
