"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Github, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { PersonalInfoForm } from "@/components/personal-info-form"
import { WorkExperienceForm } from "@/components/work-experience-form"
import { EducationForm } from "@/components/education-form"
import { SkillsForm } from "@/components/skills-form"
import { ProjectsForm } from "@/components/projects-form"
import { ThemeSelector } from "@/components/theme-selector"
import { Input } from "@/components/ui/input"
import { ExportPDFButton } from "@/components/export-pdf-button"
import { ExportMarkdownButton } from "@/components/export-markdown-button"
import { ShareButton } from "@/components/share-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useCV } from "@/lib/cv-context"
import { AppHeader } from "@/components/app-header"

export default function CreateCVPage() {
  const router = useRouter()
  const { cvData, updateTitle } = useCV()
  const [activeTab, setActiveTab] = useState("personal")
  const [isConnectingGitHub, setIsConnectingGitHub] = useState(false)
  const [githubUsername, setGithubUsername] = useState("")
  const [isGithubDialogOpen, setIsGithubDialogOpen] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [isGithubConnected, setIsGithubConnected] = useState(false)
  const [cvTitle, setCvTitle] = useState(cvData.title || "My CV")

  // Check if GitHub is already connected on component mount
  useEffect(() => {
    const githubData = localStorage.getItem("githubData")
    if (githubData) {
      try {
        const data = JSON.parse(githubData)
        if (data.user && data.user.login) {
          setGithubUsername(data.user.login)
          setIsGithubConnected(true)
        }
      } catch (error) {
        console.error("Error parsing GitHub data:", error)
      }
    }
  }, [])

  const handleConnectGitHub = () => {
    setConnectError(null)
    setIsGithubDialogOpen(true)
  }

  const connectGitHub = async () => {
    if (!githubUsername) {
      toast({
        title: "Username Required",
        description: "Please enter your GitHub username",
        variant: "destructive",
      })
      return
    }

    setConnectError(null)
    setIsConnectingGitHub(true)

    try {
      // Add a timestamp to prevent caching issues
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/github?username=${githubUsername}&t=${timestamp}`)

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Store GitHub data in localStorage
      localStorage.setItem("githubData", JSON.stringify(data))
      setIsGithubConnected(true)

      toast({
        title: "GitHub Connected",
        description: `Successfully connected to GitHub account: ${githubUsername}`,
      })

      setIsGithubDialogOpen(false)

      // Automatically navigate to the projects tab
      setActiveTab("projects")
    } catch (error) {
      console.error("Error connecting to GitHub:", error)

      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setConnectError(errorMessage)

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsConnectingGitHub(false)
    }
  }

  const handlePreview = () => {
    router.push("/preview")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setCvTitle(newTitle)
    updateTitle(newTitle)
  }

  const handleSaveDraft = () => {
    // The CV data is already saved in localStorage via the context
    toast({
      title: "CV Saved",
      description: "Your CV has been saved as a draft.",
    })
  }

  return (
    <>
      <AppHeader />
      <div className="container py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Your Git Mango CV</h1>
            <p className="text-muted-foreground">Fill in your details to generate a professional CV</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleConnectGitHub}>
              <Github className="mr-2 h-4 w-4" />
              {isGithubConnected ? `Connected: ${githubUsername}` : "Connect GitHub"}
            </Button>
            <Button onClick={handlePreview}>Preview CV</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8 grid w-full grid-cols-5">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <PersonalInfoForm />
              </TabsContent>
              <TabsContent value="experience">
                <WorkExperienceForm />
              </TabsContent>
              <TabsContent value="education">
                <EducationForm />
              </TabsContent>
              <TabsContent value="skills">
                <SkillsForm />
              </TabsContent>
              <TabsContent value="projects">
                <ProjectsForm />
              </TabsContent>
            </Tabs>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">CV Settings</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="cv-title" className="mb-2 block font-medium">
                  CV Title
                </label>
                <Input
                  id="cv-title"
                  value={cvTitle}
                  onChange={handleTitleChange}
                  placeholder="Enter a title for your CV"
                />
              </div>
              <div>
                <h3 className="mb-2 font-medium">Select Theme</h3>
                <ThemeSelector />
              </div>
              <div>
                <h3 className="mb-2 font-medium">Export Options</h3>
                <div className="flex flex-col gap-2">
                  <ExportPDFButton
                    cvElementId="cv-preview-content"
                    filename={`${cvTitle.replace(/\s+/g, "-").toLowerCase()}.pdf`}
                    redirectToPreview={true}
                  />
                  <ExportMarkdownButton filename={`${cvTitle.replace(/\s+/g, "-").toLowerCase()}.md`} />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-medium">Save & Share</h3>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="justify-start w-full" onClick={handleSaveDraft}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save Draft
                  </Button>
                  <ShareButton />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={isGithubDialogOpen} onOpenChange={setIsGithubDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect GitHub Account</DialogTitle>
              <DialogDescription>
                Enter your GitHub username to import your repositories and contributions.
              </DialogDescription>
            </DialogHeader>

            {connectError && (
              <Alert variant="destructive">
                <AlertTitle>Error connecting to GitHub</AlertTitle>
                <AlertDescription>{connectError}</AlertDescription>
              </Alert>
            )}

            <div className="py-4">
              <Input
                placeholder="GitHub username"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGithubDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={connectGitHub} disabled={isConnectingGitHub}>
                {isConnectingGitHub ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
