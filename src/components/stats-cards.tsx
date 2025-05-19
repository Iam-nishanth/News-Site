import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileTextIcon, FolderIcon, MessageSquareIcon, UsersIcon } from 'lucide-react';
import { getDashboardStats } from '@/utils/actions/dashboardActions';

export default async function StatsCards() {
    const stats = await getDashboardStats();

    const cards = [
        {
            title: 'Total Articles',
            value: stats?.totalArticles ?? 0,
            icon: FileTextIcon,
            color: 'text-blue-600'
        },
        {
            title: 'Categories',
            value: stats?.totalCategories ?? 0,
            icon: FolderIcon,
            color: 'text-green-600'
        },
        {
            title: 'Comments',
            value: stats?.totalComments ?? 0,
            icon: MessageSquareIcon,
            color: 'text-orange-600'
        },
        {
            title: 'Users',
            value: stats?.totalUsers ?? 0,
            icon: UsersIcon,
            color: 'text-purple-600'
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className={`h-4 w-4 ${card.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
