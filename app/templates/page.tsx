import { TemplateCard } from "@/components/template-card"
import { AppHeader } from "@/components/app-header"

export default function TemplatesPage() {
  // Mock data for CV templates
  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "A clean, modern design with a focus on readability",
      thumbnail: "/placeholder.svg?height=300&width=200",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "A minimalist design that lets your content shine",
      thumbnail: "/placeholder.svg?height=300&width=200",
    },
    {
      id: "classic",
      name: "Classic",
      description: "A traditional CV layout that's proven effective",
      thumbnail: "/placeholder.svg?height=300&width=200",
    },
    {
      id: "github",
      name: "GitHub",
      description: "Highlights your GitHub projects and contributions",
      thumbnail: "/placeholder.svg?height=300&width=200",
    },
    {
      id: "developer",
      name: "Developer",
      description: "Designed specifically for software developers",
      thumbnail: "/placeholder.svg?height=300&width=200",
    },
    {
      id: "creative",
      name: "Creative",
      description: "A bold design for those who want to stand out",
      thumbnail: "/placeholder.svg?height=300&width=200",
    },
  ]

  return (
    <>
      <AppHeader />
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">CV Templates</h1>
          <p className="text-muted-foreground">Choose a template for your CV</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </>
  )
}
