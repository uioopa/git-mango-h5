"use client"

import { useState } from "react"
import { Clock, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export function VersionHistory() {
  const [confirmRevertOpen, setConfirmRevertOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)

  // Mock data for version history
  const versions = [
    {
      id: 1,
      date: "2023-05-15T14:30:00Z",
      changes: "Updated work experience and skills",
    },
    {
      id: 2,
      date: "2023-05-10T09:45:00Z",
      changes: "Added new project and updated summary",
    },
    {
      id: 3,
      date: "2023-05-05T16:20:00Z",
      changes: "Initial CV creation",
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  const handleRevert = (versionId: number) => {
    setSelectedVersion(versionId)
    setConfirmRevertOpen(true)
  }

  const confirmRevert = () => {
    toast({
      title: "Version Restored",
      description: `Your CV has been reverted to version from ${formatDate(
        versions.find((v) => v.id === selectedVersion)?.date || "",
      )}`,
    })
    setConfirmRevertOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-medium">Version History</h3>
        <div className="space-y-4">
          {versions.map((version) => (
            <div key={version.id} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{formatDate(version.date)}</div>
                  <div className="text-sm text-muted-foreground">{version.changes}</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleRevert(version.id)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={confirmRevertOpen} onOpenChange={setConfirmRevertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Revert</DialogTitle>
            <DialogDescription>
              Are you sure you want to revert to this version? This will replace your current CV with this version.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRevertOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRevert}>Confirm Revert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
