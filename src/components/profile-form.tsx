'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { toast } from 'sonner';
import { User } from '@prisma/client';
import { LucideEye, LucideEyeOff } from 'lucide-react';
import { LoadingButton } from './ui/loadingButton';
const profileFormSchema = z
    .object({
        name: z.string().min(2, {
            message: 'Name must be at least 2 characters.'
        }),
        email: z.string().email({
            message: 'Please enter a valid email address.'
        }),
        phoneNo: z.string().optional(),
        password: z.string().optional(),
        confirmPassword: z.string().optional()
    })
    .refine(
        (data) => {
            if (data.password && !data.confirmPassword) return false;
            if (!data.password && data.confirmPassword) return false;
            if (data.password && data.confirmPassword && data.password !== data.confirmPassword) return false;
            return true;
        },
        {
            message: 'Passwords do not match',
            path: ['confirmPassword']
        }
    );

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm({ user }: { user: User }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const toggle = () => setShowPassword((prev) => !prev);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            phoneNo: user.phoneNo || '',
            password: '',
            confirmPassword: ''
        }
    });

    function onSubmit(data: ProfileFormValues) {
        setIsLoading(true);

        // In a real application, you would update the user profile here
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Profile updated successfully');
        }, 1000);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="pt-4 border-t">
                            <h3 className="text-lg font-medium mb-4">Change Password</h3>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter your password" type={showPassword ? 'text' : 'password'} className="tracking-wider" />
                                                </FormControl>
                                                <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    {!showPassword ? (
                                                        <LucideEye className="cursor-pointer hover:stroke-blue-500" />
                                                    ) : (
                                                        <LucideEyeOff className="cursor-pointer stroke-blue-500 hover:stroke-red-300" />
                                                    )}
                                                </button>
                                            </div>
                                            <FormDescription>Leave blank if you don't want to change your password</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm New Password</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input {...field} placeholder="Confirm your password" type={showPassword ? 'text' : 'password'} className="tracking-wider" />
                                                </FormControl>
                                                <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    {!showPassword ? (
                                                        <LucideEye className="cursor-pointer hover:stroke-blue-500" />
                                                    ) : (
                                                        <LucideEyeOff className="cursor-pointer stroke-blue-500 hover:stroke-red-300" />
                                                    )}
                                                </button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <LoadingButton type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </LoadingButton>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
