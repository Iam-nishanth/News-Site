import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ExternalLinkIcon, TrashIcon } from "lucide-react"

export default function UserComments() {
  // In a real application, you would fetch this data from your database
  const comments = [
    {
      id: "1",
      article: "New Technology Breakthrough in AI Development",
      articleSlug: "new-technology-breakthrough-in-ai-development",
      comment: "This is a fascinating development! I wonder how this will impact the industry in the coming years.",
      date: "2023-05-15 14:30",
    },
    {
      id: "2",
      article: "Global Climate Summit Reaches Historic Agreement",
      articleSlug: "global-climate-summit-reaches-historic-agreement",
      comment: "It's about time we saw some real action on climate change. This agreement seems promising.",
      date: "2023-05-14 09:15",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">On: {comment.article}</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="text-red-500">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm mb-3">{comment.comment}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {comment.date}
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLinkIcon className="h-4 w-4 mr-1" />
                    View Article
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>You haven't made any comments yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
