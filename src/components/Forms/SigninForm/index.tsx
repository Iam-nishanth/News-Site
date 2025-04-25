"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/loadingButton";
import { LucideEye, LucideEyeOff } from "lucide-react";
import { useEffect, useState } from "react";

interface SignInFormProps {
  callbackURL?: string;
  callbackError?: string;
}

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const SignInForm = ({ callbackURL, callbackError }: SignInFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const toggle = () => setShowPassword((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const result = await signIn("credentials", {
      username: values.email,
      password: values.password,
      redirect: false,
    });

    if (!result?.ok) {
      toast.error("Error", {
        description: result?.error,
        position: "top-right",
      });
      return;
    } else {
      toast.success("Success", {
        description: "Logged In...",
        position: "top-right",
      });
      router.push(callbackURL ? callbackURL : "/admin");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3"
      >
        <div className="space-y-2">
          <Label
            className={cn(
              "pl-2 text-base font-medium",
              errors?.email && "text-red-600"
            )}
            htmlFor="email"
          >
            Email <span className="text-red-600">*</span>
          </Label>
          <Input {...register("email")} placeholder="Enter you email" />
          {errors?.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            className={cn(
              "pl-2 text-base font-medium",
              errors?.password && "text-red-600"
            )}
            htmlFor="password"
          >
            Password <span className="text-red-600">*</span>
          </Label>
          <div className="w-full relative flex items-center">
            <Input
              {...register("password")}
              placeholder="Enter you password"
              type={showPassword ? "text" : "password"}
              className="tracking-wider "
            />
            {!showPassword ? (
              <LucideEye
                className="absolute right-3 cursor-pointer hover:stroke-blue-500"
                onClick={toggle}
              />
            ) : (
              <LucideEyeOff
                className="absolute right-3 cursor-pointer stroke-blue-500 hover:stroke-red-300"
                onClick={toggle}
              />
            )}
          </div>
          {errors?.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <LoadingButton
          loading={isSubmitting}
          disabled={isSubmitting}
          type="submit"
          variant="default"
          className="w-full mt-6 uppercase font-semibold tracking-wider"
        >
          {isSubmitting ? "Please wait" : "Login"}
        </LoadingButton>
      </form>
      {/* <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        or
      </div>
      <GoogleSignInButton className="">Sign in with Google</GoogleSignInButton>
      <p className="text-center text-base text-gray-600 mt-4 font-medium ">
        If you don&apos;t have an account, please&nbsp;
        <Link className="text-blue-500 hover:underline" href="/auth/sign-up">
          Sign up
        </Link>
      </p> */}
    </div>
  );
};

export default SignInForm;
