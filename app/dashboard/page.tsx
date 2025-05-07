import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CVCard } from "@/components/cv-card"
import { AppHeader } from "@/components/app-header"

export default function DashboardPage() {
  // Mock data for saved CVs
  const savedCVs = [
    {
      id: "1",
      title: "Software Developer CV",
      lastUpdated: "2023-05-15T10:30:00Z",
      theme: "modern",
    },
    {
      id: "2",
      title: "Frontend Engineer CV",
      lastUpdated: "2023-04-20T14:45:00Z",
      theme: "minimal",
    },
    {
      id: "3",
      title: "Full Stack Developer CV",
      lastUpdated: "2023-03-10T09:15:00Z",
      theme: "classic",
    },
  ]

  return (
    <>
      <AppHeader />
      <div className="container py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your CVs</h1>
            <p className="text-muted-foreground">Manage and edit your saved CVs</p>
          </div>
          <Link href="/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New CV
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedCVs.map((cv) => (
            <CVCard key={cv.id} cv={cv} />
          ))}
        </div>

        {savedCVs.length === 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>No CVs Found</CardTitle>
              <CardDescription>You haven't created any CVs yet. Get started by creating your first CV.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New CV
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  )
}
