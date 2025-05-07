"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface PersonalInfo {
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  github: string
  summary: string
}

export interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  location: string
  description: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  current: boolean
  location: string
  description: string
}

export interface Project {
  name: string
  description: string
  url: string
  githubUrl: string
  technologies: string
  startDate: string
  endDate: string
}

export interface CVData {
  personal: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: string[]
  projects: Project[]
  theme: string
  title: string
}

interface CVContextType {
  cvData: CVData
  updatePersonalInfo: (data: PersonalInfo) => void
  updateExperience: (data: Experience[]) => void
  updateEducation: (data: Education[]) => void
  updateSkills: (data: string[]) => void
  updateProjects: (data: Project[]) => void
  updateTheme: (theme: string) => void
  updateTitle: (title: string) => void
  resetCV: () => void
}

const defaultPersonalInfo: PersonalInfo = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin: "",
  github: "",
  summary: "",
}

const defaultCVData: CVData = {
  personal: defaultPersonalInfo,
  experience: [],
  education: [],
  skills: [],
  projects: [],
  theme: "modern",
  title: "My CV",
}

const CVContext = createContext<CVContextType | undefined>(undefined)

export function CVProvider({ children }: { children: ReactNode }) {
  const [cvData, setCVData] = useState<CVData>(() => {
    // Try to load from localStorage on initial render (client-side only)
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("cvData")
      if (savedData) {
        try {
          return JSON.parse(savedData)
        } catch (error) {
          console.error("Error parsing saved CV data:", error)
        }
      }
    }
    return defaultCVData
  })

  // Save to localStorage whenever cvData changes
  useEffect(() => {
    localStorage.setItem("cvData", JSON.stringify(cvData))
  }, [cvData])

  const updatePersonalInfo = (data: PersonalInfo) => {
    setCVData((prev) => ({ ...prev, personal: data }))
  }

  const updateExperience = (data: Experience[]) => {
    setCVData((prev) => ({ ...prev, experience: data }))
  }

  const updateEducation = (data: Education[]) => {
    setCVData((prev) => ({ ...prev, education: data }))
  }

  const updateSkills = (data: string[]) => {
    setCVData((prev) => ({ ...prev, skills: data }))
  }

  const updateProjects = (data: Project[]) => {
    setCVData((prev) => ({ ...prev, projects: data }))
  }

  const updateTheme = (theme: string) => {
    setCVData((prev) => ({ ...prev, theme }))
  }

  const updateTitle = (title: string) => {
    setCVData((prev) => ({ ...prev, title }))
  }

  const resetCV = () => {
    setCVData(defaultCVData)
  }

  return (
    <CVContext.Provider
      value={{
        cvData,
        updatePersonalInfo,
        updateExperience,
        updateEducation,
        updateSkills,
        updateProjects,
        updateTheme,
        updateTitle,
        resetCV,
      }}
    >
      {children}
    </CVContext.Provider>
  )
}

export function useCV() {
  const context = useContext(CVContext)
  if (context === undefined) {
    throw new Error("useCV must be used within a CVProvider")
  }
  return context
}
