"use client";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loadingButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { forgotPassword } from "@/utils/actions/authActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email!"),
});

type InputType = z.infer<typeof FormSchema>;

const ForgotPassword = () => {
  const {
    handleSubmit,
    reset,
    control,
    register,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const formSubmit: SubmitHandler<InputType> = async (data) => {
    try {
      const response: any = await forgotPassword(data.email);
      if (response.error) {
        toast.error("Error", {
          description: "User does not exist",
        });
      } else
        toast.success("Success", {
          description: "Link to reset password sent to your mail",
        });
    } catch (error: any) {
      toast.error("Error", {
        description: "Something went wrong",
      });
    }
  };

  return (
    <MaxWidthWrapper className="flex flex-col sm:flex-row justify-center items-center h-full sm:min-h-[500px] pt-5 sm:pt-0">
      <div
        className="w-full relative h-full flex flex-col min-h-full flex-1 justify-center items-center gap-3
      -"
      >
        <h1 className="text-3xl font-semibold font-Roboto">Forgot Password</h1>
        <Image
          src="/images/authentication.svg"
          alt="forgot-password"
          width={400}
          height={400}
          className="hidden sm:block"
        />
      </div>
      <div className="w-full sm:max-w-[300px] lg:max-w-[500px] flex flex-col items-center h-full min-h-[300px] justify-center">
        <form
          className="w-full flex flex-col justify-center items-center gap-6"
          onSubmit={handleSubmit(formSubmit)}
        >
          <div className="w-full max-w-[500px] flex gap-3 flex-col">
            <Label
              className={cn("pl-3 text-base", errors?.email && "text-red-400")}
              htmlFor="email"
            >
              Email <span className=" text-red-500">*</span>
            </Label>
            <Input
              {...register("email")}
              placeholder="Please enter your email"
            />
            {errors?.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <LoadingButton
            loading={isSubmitting}
            disabled={isSubmitting}
            type="submit"
            variant="default"
          >
            {isSubmitting ? "Please wait" : "Submit"}
          </LoadingButton>
        </form>
      </div>
    </MaxWidthWrapper>
  );
};

export default ForgotPassword;
