"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useCV, type Experience } from "@/lib/cv-context"

const workExperienceSchema = z.object({
  experiences: z.array(
    z.object({
      company: z.string().min(1, { message: "Company name is required" }),
      position: z.string().min(1, { message: "Position is required" }),
      startDate: z.string().min(1, { message: "Start date is required" }),
      endDate: z.string().optional(),
      current: z.boolean().optional(),
      location: z.string().optional(),
      description: z.string().optional(),
    }),
  ),
})

type WorkExperienceValues = z.infer<typeof workExperienceSchema>

export function WorkExperienceForm() {
  const { cvData, updateExperience } = useCV()

  const form = useForm<WorkExperienceValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      experiences:
        cvData.experience.length > 0
          ? cvData.experience
          : [
              {
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                current: false,
                location: "",
                description: "",
              },
            ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  })

  function onSubmit(data: WorkExperienceValues) {
    updateExperience(data.experiences as Experience[])
    toast({
      title: "Work experience saved",
      description: "Your work experience has been saved successfully.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <h3 className="text-lg font-medium mb-4">Experience {index + 1}</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`experiences.${index}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experiences.${index}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experiences.${index}.startDate`}
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
                  name={`experiences.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="month" placeholder="Present" {...field} />
                      </FormControl>
                      <FormDescription>Leave empty if this is your current job</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experiences.${index}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`experiences.${index}.description`}
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your responsibilities and achievements"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Use bullet points to highlight key achievements</FormDescription>
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
              company: "",
              position: "",
              startDate: "",
              endDate: "",
              current: false,
              location: "",
              description: "",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Experience
        </Button>
        <Button type="submit" className="ml-auto block">
          Save Work Experience
        </Button>
      </form>
    </Form>
  )
}
