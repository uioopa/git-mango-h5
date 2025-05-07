"use client"

import { useState } from "react"
import { FileDown, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { generatePDF } from "@/lib/pdf-generator"

interface ExportPDFButtonProps {
  cvElementId: string
  filename?: string
  redirectToPreview?: boolean
  className?: string
}

export function ExportPDFButton({
  cvElementId,
  filename = "cv.pdf",
  redirectToPreview = false,
  className,
}: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const router = useRouter()

  const handleExport = async () => {
    try {
      setIsExporting(true)

      // Get the CV element
      const cvElement = document.getElementById(cvElementId)

      if (!cvElement) {
        if (redirectToPreview) {
          // If we're not on the preview page, redirect there first
          toast({
            title: "Redirecting to Preview",
            description: "You'll be redirected to the preview page to export your CV",
          })
          router.push("/preview")
          return
        } else {
          throw new Error("CV element not found")
        }
      }

      // Generate PDF
      await generatePDF(cvElement, { filename })

      toast({
        title: "PDF Exported",
        description: `Your CV has been exported as ${filename}`,
      })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
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
          Export as PDF
        </>
      )}
    </Button>
  )
}
