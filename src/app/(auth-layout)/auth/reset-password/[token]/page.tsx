import ResetPasswordForm from "@/components/Forms/ResetPassword";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { verifyJWT } from "@/utils/actions/jwt";
import Image from "next/image";

interface ResetPasswordProps {
  params: {
    token: string;
  };
}

const ResetPasswordPage = ({ params }: ResetPasswordProps) => {
  const payload = verifyJWT(params.token);

  if (!payload) {
    return (
      <MaxWidthWrapper className=" min-h-[70vh] flex flex-col justify-center items-center">
        <h1 className="text-2xl sm:text-3xl font-bold font-Gentium text-red-600 -mb-10 sm:mb-0">
          URL is not valid or expired
        </h1>
        <div className="w-full ">
          <div className="w-full min-h-[400px] relative">
            <Image
              src="/images/error.svg"
              alt="Not-Valid"
              fill
              objectFit="contain"
            />
          </div>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper className="flex flex-col sm:flex-row justify-center items-center h-full sm:min-h-[500px] pt-5 sm:pt-0">
      <div
        className="w-full relative h-full flex flex-col min-h-full flex-1 justify-center items-center gap-3
      -"
      >
        <h1 className="text-3xl font-semibold font-Roboto pb-4 sm:pb-0">
          Reset Password
        </h1>
        <Image
          src="/images/authentication.svg"
          alt="forgot-password"
          width={400}
          height={400}
          className="hidden sm:block"
        />
      </div>
      <div className="w-full sm:max-w-[300px] lg:max-w-[500px] flex gap-3 flex-col">
        <ResetPasswordForm passwordToken={params.token} />
      </div>
    </MaxWidthWrapper>
  );
};

export default ResetPasswordPage;
