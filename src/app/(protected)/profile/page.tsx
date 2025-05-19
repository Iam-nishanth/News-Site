import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileForm from '@/components/profile-form';
import UserArticles from '@/components/user-articles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminWrapper from '@/components/admin-components/AdminWrapper';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/auth/sign-in');
    }

    const user = session.user;

    return (
        <AdminWrapper className="flex flex-col gap-5 py-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <Avatar className="h-20 w-20 mb-4">
                            <AvatarImage src={user.image || '/placeholder.svg'} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mt-2">{user.role}</div>
                        <div className="w-full mt-6 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Phone:</span>
                                <span>{user.phoneNo || 'Not provided'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Member since:</span>
                                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2">
                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="articles">Articles</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile">
                            <ProfileForm user={user} />
                        </TabsContent>
                        <TabsContent value="articles">
                            <UserArticles userEmail={user.email} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AdminWrapper>
    );
}
