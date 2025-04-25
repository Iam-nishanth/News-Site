'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
import { submitContactForm } from '@/utils/actions/userActions';

const contactValidation = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email({
        message: 'Must be a valid email'
    }),
    subject: z.string().min(1, { message: 'Subject is required' }),
    message: z.string().optional()
});

export type ContactValidationSchema = z.infer<typeof contactValidation>;

const ContactForm = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm<ContactValidationSchema>({
        resolver: zodResolver(contactValidation)
    });
    const onSubmit: SubmitHandler<ContactValidationSchema> = async (data) => {
        const response = await submitContactForm(data);
        if (response?.status !== 'success') toast.error('Something went wrong');
        toast.success('Form Submitted');
    };

    return (
        <div className="w-full py-5 px-2">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[500px] flex flex-col gap-3">
                <div className="w-full flex flex-col gap-3">
                    <Label className="text-base font-medium font-Roboto not-italic tracking-wide">
                        Name <span className="font-base text-red-500">*</span>
                    </Label>
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input placeholder="Your Name" className="tracking-wide font-normal text-sm" type="text" {...field} />}
                    />
                    {errors.name && <p className="text-sm text-red-600 font-normal ">{errors.name.message}</p>}
                </div>
                <div className="w-full flex flex-col gap-3">
                    <Label className="text-base font-medium font-Roboto not-italic tracking-wide">
                        Email <span className="font-base text-red-500">*</span>
                    </Label>
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input placeholder="Your Email" className="tracking-wide font-normal text-sm" type="email" {...field} />}
                    />
                    {errors.email && <p className="text-sm text-red-600 font-normal ">{errors.email.message}</p>}
                </div>
                <div className="w-full flex flex-col gap-3">
                    <Label className="text-base font-medium font-Roboto not-italic tracking-wide">
                        Subject <span className="font-base text-red-500">*</span>
                    </Label>
                    <Controller
                        name="subject"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input className="tracking-wide font-normal text-sm" type="text" placeholder="Your issue/suggestion" {...field} />}
                    />
                    {errors.subject && <p className="text-sm text-red-600 font-normal ">{errors.subject.message}</p>}
                </div>
                <div className="w-full flex flex-col gap-3">
                    <Label className="text-base font-medium font-Roboto not-italic tracking-wide">Message</Label>
                    <Controller
                        name="message"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Textarea className="tracking-wide font-normal text-sm" placeholder="Please enter your Message" {...field} />}
                    />
                    {errors.message && <p className="text-sm text-red-600 font-normal ">{errors.message.message}</p>}
                </div>
                <Button className=" bg-button hover:bg-button_hover text-sm uppercase tracking-wide font-medium text-white mt-4" type="submit" onSubmit={handleSubmit(onSubmit)}>
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default ContactForm;
