import Link from "next/link"
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CVCardProps {
  cv: {
    id: string
    title: string
    lastUpdated: string
    theme: string
  }
}

export function CVCard({ cv }: CVCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle>{cv.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>Last updated: {formatDate(cv.lastUpdated)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-40 rounded-md border bg-muted p-2">
          <div className="h-full w-full rounded bg-card p-4">
            <div className="mb-2 h-4 w-24 rounded bg-muted-foreground/20"></div>
            <div className="space-y-2">
              <div className="h-2 w-full rounded bg-muted-foreground/20"></div>
              <div className="h-2 w-full rounded bg-muted-foreground/20"></div>
              <div className="h-2 w-3/4 rounded bg-muted-foreground/20"></div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Theme: {cv.theme.charAt(0).toUpperCase() + cv.theme.slice(1)}
        </div>
        <Link href={`/preview?id=${cv.id}`}>
          <Button variant="outline" size="sm">
            Preview
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
