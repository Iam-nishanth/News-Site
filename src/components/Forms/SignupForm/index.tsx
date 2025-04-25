'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerUser } from '@/utils/actions/authActions';
import { LucideEye, LucideEyeOff } from 'lucide-react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { LoadingButton } from '@/components/ui/loadingButton';
import { useDialogContext } from '@/context/State';

const phoneNumberRegex = /^\d{3}-\d{3}-\d{4}$|^\d{10}$/;

const FormSchema = z
    .object({
        name: z.string().min(1, 'Username is required').max(100),
        email: z.string().min(1, 'Email is required').email('Invalid email'),
        phoneNo: z.string().regex(phoneNumberRegex, 'Invalid Phone No.'),
        password: z.string().min(1, 'Password is required').min(8, 'Password must have than 8 characters'),
        confirmPassword: z.string().min(1, 'Password confirmation is required')
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Password do not match'
    });

type FormType = z.infer<typeof FormSchema>;

const SignUpForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toggle = () => setShowPassword((prev) => !prev);

    const { setOpen } = useDialogContext();
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    });

    const onSubmit: SubmitHandler<FormType> = async (values) => {
        const { confirmPassword, ...user } = values;
        try {
            const res = await registerUser(user);
            reset();
            toast.success('Success', {
                description: 'Created Successfully'
            });
            router.refresh();
            setOpen(false);
        } catch (error) {
            router.refresh();
            setOpen(false);
            toast.error('Error', {
                description: 'Registration failed'
            });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
                <div className="space-y-2">
                    <Label className={cn('pl-2 text-base font-medium', errors?.name && 'text-red-600')} htmlFor="name">
                        Name <span className="text-red-600">*</span>
                    </Label>
                    <Input {...register('name')} placeholder="Enter name" />
                    {errors?.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label className={cn('pl-2 text-base font-medium', errors?.email && 'text-red-600')} htmlFor="email">
                        Email <span className="text-red-600">*</span>
                    </Label>
                    <Input {...register('email')} placeholder="Enter email" />
                    {errors?.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label className={cn('pl-2 text-base font-medium', errors?.phoneNo && 'text-red-600')} htmlFor="phoneNo">
                        Phone Number <span className="text-red-600">*</span>
                    </Label>
                    <Input {...register('phoneNo')} placeholder="Enter Phone Number" />
                    {errors?.phoneNo && <p className="text-red-500">{errors.phoneNo.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label className={cn('pl-2 text-base font-medium', errors?.email && 'text-red-600')} htmlFor="password">
                        Password <span className="text-red-600">*</span>
                    </Label>
                    <Input {...register('password')} type="password" placeholder="Create a password" />
                    {errors?.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label className={cn('pl-2 text-base font-medium', errors?.password && 'text-red-600')} htmlFor="confirmPassword">
                        Confirm Password <span className="text-red-600">*</span>
                    </Label>
                    <div className="w-full relative flex items-center">
                        <Input {...register('confirmPassword')} placeholder="Confirm password" type={showPassword ? 'text' : 'password'} className="tracking-wider " />
                        {!showPassword ? (
                            <LucideEye className="absolute right-3 cursor-pointer hover:stroke-blue-500" onClick={toggle} />
                        ) : (
                            <LucideEyeOff className="absolute right-3 cursor-pointer stroke-blue-500 hover:stroke-red-300" onClick={toggle} />
                        )}
                    </div>
                    {errors?.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                </div>
                <LoadingButton loading={isSubmitting} disabled={isSubmitting} type="submit" variant="default" className="w-full mt-6 uppercase font-semibold tracking-wider">
                    {isSubmitting ? 'Please wait' : 'Add User'}
                </LoadingButton>
            </form>
        </div>
    );
};

export default SignUpForm;
