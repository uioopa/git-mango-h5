"use client"

import { useState } from "react"
import { Share2, Loader2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCV } from "@/lib/cv-context"

interface ShareButtonProps {
  className?: string
}

export function ShareButton({ className }: ShareButtonProps) {
  const { cvData } = useCV()
  const [isOpen, setIsOpen] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  const handleShare = async () => {
    try {
      setIsSharing(true)

      // In a real app, this would create a shareable link on the server
      // For now, we'll just create a URL with the CV data encoded in the hash
      const baseUrl = window.location.origin

      // Create a unique ID for this CV based on timestamp
      const cvId = Date.now().toString()

      // Store the CV data in localStorage with the ID as the key
      localStorage.setItem(`shared-cv-${cvId}`, JSON.stringify(cvData))

      const url = `${baseUrl}/preview?id=${cvId}`

      setShareUrl(url)
      setIsOpen(true)
    } catch (error) {
      console.error("Error sharing CV:", error)
      toast({
        title: "Share Failed",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setIsCopied(true)

    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard",
    })

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <>
      <Button
        variant="outline"
        className={`justify-start w-full ${className}`}
        onClick={handleShare}
        disabled={isSharing}
      >
        {isSharing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating link...
          </>
        ) : (
          <>
            <Share2 className="mr-2 h-4 w-4" />
            Share CV
          </>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your CV</DialogTitle>
            <DialogDescription>Anyone with this link can view your CV.</DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2">
            <Input value={shareUrl} readOnly />
            <Button size="icon" onClick={copyToClipboard}>
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
