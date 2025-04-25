// "use client";
// import React from "react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// interface AuthProps {
//   children: React.ReactNode;
// }

// const user = false;
// const loading = false;

// const withAuth = <P extends AuthProps>(
//   WrappedComponent: React.ComponentType<P>
// ) => {
//   const AuthHOC = (props: Omit<P, keyof AuthProps>) => {
//     const router = useRouter();

//     useEffect(() => {
//       if (!loading && !user) {
//         router.push("/sign-in");
//       }
//     }, [user, loading]);

//     if (loading || !user) {
//       return null;
//     }

//     return <WrappedComponent {...(props as P)} />;
//   };

//   return AuthHOC;
// };

// export default withAuth;
