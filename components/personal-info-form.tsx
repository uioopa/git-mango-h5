"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Github, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useCV, type PersonalInfo } from "@/lib/cv-context"

const personalInfoSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url({
      message: "Please enter a valid LinkedIn URL.",
    })
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url({
      message: "Please enter a valid GitHub URL.",
    })
    .optional()
    .or(z.literal("")),
  summary: z
    .string()
    .max(500, {
      message: "Summary must not exceed 500 characters.",
    })
    .optional(),
})

type PersonalInfoValues = z.infer<typeof personalInfoSchema>

export function PersonalInfoForm() {
  const [isImporting, setIsImporting] = useState(false)
  const { cvData, updatePersonalInfo } = useCV()

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: cvData.personal,
  })

  // Check for GitHub data on component mount
  useEffect(() => {
    const githubData = localStorage.getItem("githubData")
    if (githubData) {
      try {
        const data = JSON.parse(githubData)
        if (data.user) {
          const user = data.user

          // Update form with GitHub data if fields are empty
          if (!form.getValues("fullName") && user.name) {
            form.setValue("fullName", user.name)
          }
          if (!form.getValues("location") && user.location) {
            form.setValue("location", user.location)
          }
          if (!form.getValues("website") && user.blog) {
            form.setValue("website", user.blog)
          }
          if (!form.getValues("github") && user.html_url) {
            form.setValue("github", user.html_url)
          }
          if (!form.getValues("email") && user.email) {
            form.setValue("email", user.email)
          }
          if (!form.getValues("summary") && user.bio) {
            form.setValue("summary", user.bio)
          }

          // Set job title based on bio if available and field is empty
          if (!form.getValues("jobTitle") && user.bio) {
            const jobTitleMatch = user.bio.match(/(Software Engineer|Developer|Programmer|Engineer|Architect)/i)
            if (jobTitleMatch) {
              form.setValue("jobTitle", jobTitleMatch[0])
            }
          }
        }
      } catch (error) {
        console.error("Error parsing GitHub data:", error)
      }
    }
  }, [form])

  function onSubmit(data: PersonalInfoValues) {
    updatePersonalInfo(data as PersonalInfo)
    toast({
      title: "Personal information saved",
      description: "Your personal information has been saved successfully.",
    })
  }

  async function importFromGitHub() {
    // Prompt for GitHub username if not already connected
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
      const response = await fetch(`/api/github?username=${username}`)

      if (!response.ok) {
        throw new Error("Failed to fetch GitHub data")
      }

      const data = await response.json()

      if (data.user) {
        const user = data.user

        // Update form with GitHub data
        form.setValue("fullName", user.name || "")
        form.setValue("location", user.location || "")
        form.setValue("website", user.blog || "")
        form.setValue("github", user.html_url || "")
        form.setValue("email", user.email || "")
        form.setValue("summary", user.bio || "")

        // Set job title based on bio if available
        if (user.bio) {
          const jobTitleMatch = user.bio.match(/(Software Engineer|Developer|Programmer|Engineer|Architect)/i)
          if (jobTitleMatch) {
            form.setValue("jobTitle", jobTitleMatch[0])
          }
        }

        toast({
          title: "Profile Imported",
          description: "Successfully imported your GitHub profile information.",
        })

        // Save GitHub data for other components
        localStorage.setItem("githubData", JSON.stringify(data))

        // Save the form data to context
        onSubmit(form.getValues())
      } else {
        toast({
          title: "Import Failed",
          description: "Could not find GitHub profile information.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error importing from GitHub:", error)
      toast({
        title: "Import Failed",
        description: "Failed to import profile from GitHub. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Personal Information</h3>
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="San Francisco, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://johndoe.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief summary of your professional background and goals"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Keep your summary concise and highlight your key strengths.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Personal Information</Button>
      </form>
    </Form>
  )
}
