"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Github, Loader2, Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useCV, type Project } from "@/lib/cv-context"

const projectsSchema = z.object({
  projects: z.array(
    z.object({
      name: z.string().min(1, { message: "Project name is required" }),
      description: z.string().min(1, { message: "Description is required" }),
      url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
      githubUrl: z.string().url({ message: "Please enter a valid GitHub URL" }).optional().or(z.literal("")),
      technologies: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
  ),
})

type ProjectsValues = z.infer<typeof projectsSchema>

export function ProjectsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [githubUsername, setGithubUsername] = useState("")
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)
  const { cvData, updateProjects } = useCV()

  const form = useForm<ProjectsValues>({
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      projects:
        cvData.projects.length > 0
          ? cvData.projects
          : [
              {
                name: "",
                description: "",
                url: "",
                githubUrl: "",
                technologies: "",
                startDate: "",
                endDate: "",
              },
            ],
    },
  })

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "projects",
  })

  // Check for GitHub data on component mount
  useEffect(() => {
    const githubData = localStorage.getItem("githubData")
    if (githubData) {
      try {
        const data = JSON.parse(githubData)
        if (data.user && data.user.login) {
          setGithubUsername(data.user.login)
        }
        if (data.projects && data.projects.length > 0 && cvData.projects.length === 0) {
          replace(data.projects)
          updateProjects(data.projects)
          setImportSuccess(`${data.projects.length} projects loaded from GitHub.`)
        }
      } catch (error) {
        console.error("Error parsing GitHub data:", error)
      }
    }
  }, [cvData.projects.length, replace, updateProjects])

  function onSubmit(data: ProjectsValues) {
    updateProjects(data.projects as Project[])
    toast({
      title: "Projects saved",
      description: "Your projects have been saved successfully.",
    })
  }

  async function importFromGitHub() {
    setImportError(null)
    setImportSuccess(null)

    // Use existing username or prompt for a new one
    let username = githubUsername

    if (!username) {
      // Try to get from localStorage first
      const githubData = localStorage.getItem("githubData")
      if (githubData) {
        try {
          const data = JSON.parse(githubData)
          if (data.user && data.user.login) {
            username = data.user.login
            setGithubUsername(username)
          }
        } catch (error) {
          console.error("Error parsing GitHub data:", error)
        }
      }

      // If still no username, prompt for it
      if (!username) {
        const promptedUsername = prompt("Please enter your GitHub username")
        if (!promptedUsername) return
        username = promptedUsername
        setGithubUsername(username)
      }
    }

    try {
      setIsLoading(true)

      // Add a timestamp to prevent caching issues
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/github?username=${username}&t=${timestamp}`)

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.projects && data.projects.length > 0) {
        // Replace existing projects with GitHub projects
        replace(data.projects)
        updateProjects(data.projects)

        setImportSuccess(`Successfully imported ${data.projects.length} projects from GitHub.`)

        toast({
          title: "GitHub Projects Imported",
          description: `Successfully imported ${data.projects.length} projects from GitHub.`,
        })

        // Save GitHub data for other components
        localStorage.setItem("githubData", JSON.stringify(data))
      } else {
        setImportError("No public repositories found for this username.")

        toast({
          title: "No Projects Found",
          description: "No public repositories found for this username.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error importing from GitHub:", error)

      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setImportError(errorMessage)

      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Your Projects</h3>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="GitHub username"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              className="w-40 h-9"
            />
            <Button type="button" variant="outline" size="sm" onClick={importFromGitHub} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-4 w-4" />
                  Import from GitHub
                </>
              )}
            </Button>
          </div>
        </div>

        {importError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error importing projects</AlertTitle>
            <AlertDescription>{importError}</AlertDescription>
          </Alert>
        )}

        {importSuccess && (
          <Alert className="mb-4">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{importSuccess}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border p-6 relative">
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              )}
              <h3 className="text-lg font-medium mb-4">Project {index + 1}</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`projects.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`projects.${index}.technologies`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies Used</FormLabel>
                      <FormControl>
                        <Input placeholder="React, Node.js, MongoDB" {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated list of technologies</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`projects.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://myproject.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`projects.${index}.githubUrl`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/username/repo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`projects.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`projects.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="month" placeholder="Present" {...field} />
                      </FormControl>
                      <FormDescription>Leave empty for ongoing projects</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`projects.${index}.description`}
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project, its features, and your role"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() =>
            append({
              name: "",
              description: "",
              url: "",
              githubUrl: "",
              technologies: "",
              startDate: "",
              endDate: "",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Project
        </Button>
        <Button type="submit" className="ml-auto block">
          Save Projects
        </Button>
      </form>
    </Form>
  )
}
