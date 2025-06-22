import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecentArticles from '@/components/recent-articles';
import StatsCards from '@/components/stats-cards';
import TopCategories from '@/components/top-categories';
import RecentComments from '@/components/recent-comments';
import AdminWrapper from '@/components/admin-components/AdminWrapper';

export default async function AdminDashboard() {
    return (
        <AdminWrapper className="flex flex-col gap-5 py-3">
            <StatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RecentArticles />
                    </CardContent>
                </Card>

                <div className="space-y-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TopCategories />
                        </CardContent>
                    </Card>

                    {/* <Card>
                        <CardHeader>
                            <CardTitle>Recent Comments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentComments />
                        </CardContent>
                    </Card> */}
                </div>
            </div>
        </AdminWrapper>
    );
}
