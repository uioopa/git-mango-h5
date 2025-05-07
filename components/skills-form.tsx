"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Github, Loader2, Plus, X } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useCV } from "@/lib/cv-context"

const skillsSchema = z.object({
  skill: z.string().min(1, { message: "Skill cannot be empty" }).optional(),
})

type SkillsValues = z.infer<typeof skillsSchema>

export function SkillsForm() {
  const { cvData, updateSkills } = useCV()
  const [skills, setSkills] = useState<string[]>(cvData.skills || [])
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)

  const form = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skill: "",
    },
  })

  // Check for GitHub data on component mount
  useEffect(() => {
    const githubData = localStorage.getItem("githubData")
    if (githubData) {
      try {
        const data = JSON.parse(githubData)
        if (data.skills && data.skills.length > 0 && skills.length === 0) {
          // Add GitHub skills to existing skills without duplicates
          const newSkills = [...new Set([...skills, ...data.skills])]
          setSkills(newSkills)
          updateSkills(newSkills)
          setImportSuccess(`${data.skills.length} skills loaded from GitHub.`)
        }
      } catch (error) {
        console.error("Error parsing GitHub data:", error)
      }
    }
  }, [skills, updateSkills])

  function onSubmit(data: SkillsValues) {
    if (data.skill && !skills.includes(data.skill)) {
      const newSkills = [...skills, data.skill]
      setSkills(newSkills)
      updateSkills(newSkills)
      form.reset()
    }
  }

  function removeSkill(skillToRemove: string) {
    const newSkills = skills.filter((skill) => skill !== skillToRemove)
    setSkills(newSkills)
    updateSkills(newSkills)
  }

  function saveSkills() {
    updateSkills(skills)
    toast({
      title: "Skills saved",
      description: "Your skills have been saved successfully.",
    })
  }

  async function importFromGitHub() {
    setImportError(null)
    setImportSuccess(null)

    // Use existing username or prompt for a new one
    let username = ""
    const githubData = localStorage.getItem("githubData")

    if (githubData) {
      try {
        const data = JSON.parse(githubData)
        if (data.user && data.user.login) {
          username = data.user.login
        }
      } catch (error) {
        console.error("Error parsing GitHub data:", error)
      }
    }

    if (!username) {
      username = prompt("Please enter your GitHub username")
      if (!username) return
    }

    try {
      setIsImporting(true)

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

      if (data.skills && data.skills.length > 0) {
        // Add GitHub skills to existing skills without duplicates
        const newSkills = [...new Set([...skills, ...data.skills])]
        setSkills(newSkills)
        updateSkills(newSkills)

        setImportSuccess(`Successfully imported ${data.skills.length} skills from GitHub.`)

        toast({
          title: "Skills Imported",
          description: `Successfully imported ${data.skills.length} skills from GitHub.`,
        })

        // Save GitHub data for other components
        localStorage.setItem("githubData", JSON.stringify(data))
      } else {
        setImportError("No skills could be extracted from your GitHub repositories.")

        toast({
          title: "No Skills Found",
          description: "No skills could be extracted from your GitHub repositories.",
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
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Skills</h3>
        <Button type="button" variant="outline" size="sm" onClick={importFromGitHub} disabled={isImporting}>
          {isImporting ? (
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

      {importError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error importing skills</AlertTitle>
          <AlertDescription>{importError}</AlertDescription>
        </Alert>
      )}

      {importSuccess && (
        <Alert className="mb-4">
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>{importSuccess}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="skill"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Add Skill</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a skill" {...field} />
                </FormControl>
                <FormDescription>Press Enter or click Add to add a skill</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-8">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>
      </Form>

      <div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div key={skill} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 rounded-full p-1 hover:bg-primary/20"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {skill}</span>
              </button>
            </div>
          ))}
          {skills.length === 0 && <p className="text-muted-foreground">No skills added yet</p>}
        </div>
      </div>

      <Button onClick={saveSkills} className="mt-6">
        Save Skills
      </Button>
    </div>
  )
}
