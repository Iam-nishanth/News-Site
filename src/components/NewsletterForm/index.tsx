"use client";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";

type FormValues = {
  email: string;
};

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const NewsletterForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Handle form submission here
  };

  return (
    <form className="flex flex-col py-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col sm:flex-row w-full justify-center items-center h-auto sm:h-[40px] gap-2 sm:gap-0">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              type="email"
              className="border border-gray-300 h-[40px] sm:h-full w-[300px] px-2 text-center  dark:bg-transparent outline-none focus:border-button"
              placeholder="Please enter your e-mail"
              {...field}
            />
          )}
        />

        <Button
          type="submit"
          className="rounded-none text-sm uppercase bg-button hover:bg-button_hover hover:text-white h-full -ml-1 px-8"
        >
          submit
        </Button>
      </div>
      {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
    </form>
  );
};

export default NewsletterForm;
