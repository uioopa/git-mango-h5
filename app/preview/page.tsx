"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CVPreview } from "@/components/cv-preview"
import { ExportPDFButton } from "@/components/export-pdf-button"
import { ExportMarkdownButton } from "@/components/export-markdown-button"
import { ShareButton } from "@/components/share-button"
import { useCV } from "@/lib/cv-context"
import { AppHeader } from "@/components/app-header"

export default function PreviewPage() {
  const { cvData } = useCV()
  const [activeTab, setActiveTab] = useState("preview")
  const searchParams = useSearchParams()
  const sharedId = searchParams.get("id")
  const [isSharedView, setIsSharedView] = useState(false)

  // Check if this is a shared view
  useEffect(() => {
    if (sharedId) {
      // Try to load the shared CV data
      const sharedData = localStorage.getItem(`shared-cv-${sharedId}`)
      if (sharedData) {
        setIsSharedView(true)
        // In a real app, we would fetch the shared CV data from the server
        // For now, we'll just use the current CV data
      }
    }
  }, [sharedId])

  return (
    <>
      <AppHeader />
      <div className="container py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Preview Your Git Mango CV</h1>
            <p className="text-muted-foreground">
              {isSharedView ? "This is a shared CV view" : "Review and make final adjustments before exporting"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <ExportPDFButton
                    cvElementId="cv-preview-content"
                    filename={`${cvData.title.replace(/\s+/g, "-").toLowerCase()}.pdf`}
                    className="w-full"
                  />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <ExportMarkdownButton
                    filename={`${cvData.title.replace(/\s+/g, "-").toLowerCase()}.md`}
                    className="w-full"
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {!isSharedView && (
              <>
                <ShareButton />
                <Link href="/create">
                  <Button variant="outline">Edit CV</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 w-full">
            <TabsTrigger value="preview" className="flex-1">
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <CVPreview />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
