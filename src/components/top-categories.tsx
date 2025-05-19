import { getTopCategories } from '@/utils/actions/dashboardActions';
import { Progress } from '@/components/ui/progress';

export default async function TopCategories() {
    const categories = await getTopCategories();

    if (!categories || categories.length === 0) {
        return <div className="text-center py-4">No categories found</div>;
    }

    const maxArticles = Math.max(...categories.map((cat) => cat._count.news));

    return (
        <div className="space-y-4">
            {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">{category.title}</span>
                        <span className="text-muted-foreground">{category._count.news} articles</span>
                    </div>
                    <Progress value={(category._count.news / maxArticles) * 100} className="h-2" />
                </div>
            ))}
        </div>
    );
}
