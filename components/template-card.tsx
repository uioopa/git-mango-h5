import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface TemplateCardProps {
  template: {
    id: string
    name: string
    description: string
    thumbnail: string
  }
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          src={template.thumbnail || "/placeholder.svg"}
          alt={template.name}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Link href={`/create?template=${template.id}`} className="flex-1">
            <Button className="w-full">
              <Check className="mr-2 h-4 w-4" />
              Use Template
            </Button>
          </Link>
          <Link href={`/templates/${template.id}`}>
            <Button variant="outline">Preview</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
