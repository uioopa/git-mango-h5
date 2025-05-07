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
import { useCV, type Education } from "@/lib/cv-context"

const educationSchema = z.object({
  education: z.array(
    z.object({
      institution: z.string().min(1, { message: "Institution name is required" }),
      degree: z.string().min(1, { message: "Degree is required" }),
      field: z.string().optional(),
      startDate: z.string().min(1, { message: "Start date is required" }),
      endDate: z.string().optional(),
      current: z.boolean().optional(),
      location: z.string().optional(),
      description: z.string().optional(),
    }),
  ),
})

type EducationValues = z.infer<typeof educationSchema>

export function EducationForm() {
  const { cvData, updateEducation } = useCV()

  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education:
        cvData.education.length > 0
          ? cvData.education
          : [
              {
                institution: "",
                degree: "",
                field: "",
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
    name: "education",
  })

  function onSubmit(data: EducationValues) {
    updateEducation(data.education as Education[])
    toast({
      title: "Education saved",
      description: "Your education information has been saved successfully.",
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
              <h3 className="text-lg font-medium mb-4">Education {index + 1}</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`education.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input placeholder="University name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`education.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input placeholder="Bachelor's, Master's, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`education.${index}.field`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study</FormLabel>
                      <FormControl>
                        <Input placeholder="Computer Science, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`education.${index}.location`}
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
                <FormField
                  control={form.control}
                  name={`education.${index}.startDate`}
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
                  name={`education.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="month" placeholder="Present" {...field} />
                      </FormControl>
                      <FormDescription>Leave empty if you're currently studying here</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`education.${index}.description`}
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your studies, achievements, etc."
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
              institution: "",
              degree: "",
              field: "",
              startDate: "",
              endDate: "",
              current: false,
              location: "",
              description: "",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Education
        </Button>
        <Button type="submit" className="ml-auto block">
          Save Education
        </Button>
      </form>
    </Form>
  )
}
