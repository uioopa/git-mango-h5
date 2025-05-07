"use client"

import { useState } from "react"
import { FileDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { generateMarkdown, downloadMarkdown } from "@/lib/markdown-generator"
import { useCV } from "@/lib/cv-context"

interface ExportMarkdownButtonProps {
  filename?: string
  className?: string
}

export function ExportMarkdownButton({ filename = "cv.md", className }: ExportMarkdownButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { cvData } = useCV()

  const handleExport = async () => {
    try {
      setIsExporting(true)

      // Check if we have data to export
      if (!cvData || Object.keys(cvData).length === 0) {
        throw new Error("No CV data available to export")
      }

      // Generate markdown
      const markdown = generateMarkdown(cvData)

      // Download markdown
      downloadMarkdown(markdown, filename)

      toast({
        title: "Markdown Exported",
        description: `Your CV has been exported as ${filename}`,
      })
    } catch (error) {
      console.error("Error exporting Markdown:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export Markdown. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      variant="outline"
      className={`justify-start w-full ${className}`}
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-4 w-4" />
          Export as Markdown
        </>
      )}
    </Button>
  )
}
