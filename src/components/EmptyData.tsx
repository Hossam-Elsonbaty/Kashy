import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { FolderOpen } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState = ({
  title = "No Data Found",
  description = "There are no books to display right now.",
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <Card className="border-none shadow-none flex flex-col items-center justify-center text-center py-10">
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <FolderOpen className="h-12 w-12 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            <p className="text-gray-500 mt-1">{description}</p>
          </div>
          {actionLabel && onAction && (
            <Button onClick={onAction} className="mt-3">
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
