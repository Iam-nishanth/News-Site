"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loadingButton";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { resetPasswordAction } from "@/utils/actions/authActions";
import { toast } from "sonner";

interface ResetProps {
  passwordToken: string;
}

const FormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(
        (value) => /[a-z]/.test(value),
        "Password must contain at least one lowercase letter"
      )
      .refine(
        (value) => /[A-Z]/.test(value),
        "Password must contain at least one uppercase letter"
      )
      .refine(
        (value) => /\d/.test(value),
        "Password must contain at least one number"
      )
      .refine(
        (value) => /[^a-zA-Z\d]/.test(value),
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

type resetType = z.infer<typeof FormSchema>;

const ResetPasswordForm = ({ passwordToken }: ResetProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<resetType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<resetType> = async (data) => {
    try {
      const response = await resetPasswordAction(passwordToken, data.password);
      if (response == "userNotExitst") {
        toast.error("Error", {
          description: "User does not exist",
        });
      } else {
        toast.success("Success", {
          description: "Password reset successful",
        });
      }
    } catch (error) {
      toast("Error", {
        description: "Something went wrong",
      });
    }
  };

  return (
    <form
      className="w-full flex flex-col justify-center items-center space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full flex flex-col gap-6">
        <div className="space-y-2">
          <Label
            className={cn(
              "pl-2 text-base font-medium",
              errors?.password && "text-red-600"
            )}
            htmlFor="email"
          >
            Password <span className="text-red-600">*</span>
          </Label>
          <Input {...register("password")} placeholder="Enter new password" />
          {errors?.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            className={cn(
              "pl-2 text-base font-medium",
              errors?.confirmPassword && "text-red-600"
            )}
            htmlFor="email"
          >
            Confirm Password <span className="text-red-600">*</span>
          </Label>
          <Input
            {...register("confirmPassword")}
            placeholder="Confirm new password"
          />
          {errors?.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
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
  );
};

export default ResetPasswordForm;
