import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Edit2Icon, TrashIcon } from "lucide-react"

export default function UserDrafts() {
  // In a real application, you would fetch this data from your database
  const drafts = [
    {
      id: "1",
      title: "The Future of Renewable Energy",
      slug: "the-future-of-renewable-energy",
      category: "Environment",
      date: "2023-05-18",
      tags: ["Energy", "Environment", "Technology"],
    },
    {
      id: "2",
      title: "Exploring the Latest Advancements in Quantum Computing",
      slug: "exploring-the-latest-advancements-in-quantum-computing",
      category: "Technology",
      date: "2023-05-16",
      tags: ["Quantum", "Computing", "Research"],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Draft Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {drafts.length > 0 ? (
            drafts.map((draft) => (
              <div key={draft.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{draft.title}</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Edit2Icon className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-500">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {draft.date}
                  <span className="mx-2">•</span>
                  {draft.category}
                  <span className="mx-2">•</span>
                  <Badge variant="outline">Draft</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {draft.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Continue Editing
                  </Button>
                  <Button variant="default" size="sm">
                    Publish
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>You don't have any draft articles yet.</p>
              <Button variant="default" className="mt-4">
                Create New Article
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
