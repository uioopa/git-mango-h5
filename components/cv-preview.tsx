"use client"

import { useState } from "react"
import { Github, Mail, MapPin, Phone, Globe, Linkedin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCV } from "@/lib/cv-context"

export function CVPreview() {
  const { cvData, updateTheme } = useCV()
  const [activeTheme, setActiveTheme] = useState(cvData.theme || "modern")

  // Update the theme in context when it changes in the preview
  const handleThemeChange = (theme: string) => {
    setActiveTheme(theme)
    updateTheme(theme)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Present"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={activeTheme} onValueChange={handleThemeChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modern">Modern</TabsTrigger>
          <TabsTrigger value="minimal">Minimal</TabsTrigger>
          <TabsTrigger value="classic">Classic</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
        </TabsList>
        <TabsContent value="modern">
          <div id="cv-preview-content" className="rounded-lg border bg-white p-8 shadow-sm">
            <div className="mb-8 border-b pb-8">
              <h1 className="mb-2 text-4xl font-bold text-gray-900">{cvData.personal.fullName || "Your Name"}</h1>
              <h2 className="mb-4 text-xl font-medium text-gray-600">{cvData.personal.jobTitle || "Your Job Title"}</h2>
              <p className="mb-6 text-gray-700">
                {cvData.personal.summary || "Your professional summary will appear here."}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {cvData.personal.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{cvData.personal.email}</span>
                  </div>
                )}
                {cvData.personal.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{cvData.personal.phone}</span>
                  </div>
                )}
                {cvData.personal.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{cvData.personal.location}</span>
                  </div>
                )}
                {cvData.personal.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>{cvData.personal.website}</span>
                  </div>
                )}
                {cvData.personal.linkedin && (
                  <div className="flex items-center gap-1">
                    <Linkedin className="h-4 w-4" />
                    <span>{cvData.personal.linkedin}</span>
                  </div>
                )}
                {cvData.personal.github && (
                  <div className="flex items-center gap-1">
                    <Github className="h-4 w-4" />
                    <span>{cvData.personal.github}</span>
                  </div>
                )}
              </div>
            </div>

            {cvData.experience.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Experience</h3>
                <div className="space-y-6">
                  {cvData.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <div className="mb-1 flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                        <span className="text-sm text-gray-600">
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                        </span>
                      </div>
                      <div className="mb-2 flex items-center justify-between">
                        <h5 className="text-md font-medium text-gray-700">{exp.company}</h5>
                        <span className="text-sm text-gray-600">{exp.location}</span>
                      </div>
                      <p className="whitespace-pre-line text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cvData.education.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Education</h3>
                <div className="space-y-6">
                  {cvData.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <div className="mb-1 flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </h4>
                        <span className="text-sm text-gray-600">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                      <div className="mb-2 flex items-center justify-between">
                        <h5 className="text-md font-medium text-gray-700">{edu.institution}</h5>
                        <span className="text-sm text-gray-600">{edu.location}</span>
                      </div>
                      <p className="text-gray-700">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cvData.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, index) => (
                    <span key={index} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {cvData.projects.length > 0 && (
              <div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Projects</h3>
                <div className="space-y-6">
                  {cvData.projects.map((project, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
                        <span className="text-sm text-gray-600">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </span>
                      </div>
                      <p className="mb-2 text-gray-700">{project.description}</p>
                      {project.technologies && (
                        <div className="mb-2 text-sm text-gray-600">
                          <strong>Technologies:</strong> {project.technologies}
                        </div>
                      )}
                      <div className="flex gap-4 text-sm">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            GitHub Repository
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!cvData.personal.fullName &&
              !cvData.experience.length &&
              !cvData.education.length &&
              !cvData.skills.length &&
              !cvData.projects.length && (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                  <p>Your CV preview will appear here. Start by filling out your information in the form.</p>
                </div>
              )}
          </div>
        </TabsContent>

        <TabsContent value="minimal">
          <div id="cv-preview-content" className="rounded-lg border bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{cvData.personal.fullName || "Your Name"}</h1>
              <h2 className="mb-4 text-lg font-medium text-gray-600">{cvData.personal.jobTitle || "Your Job Title"}</h2>
              <div className="mb-4 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                {cvData.personal.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{cvData.personal.email}</span>
                  </div>
                )}
                {cvData.personal.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{cvData.personal.phone}</span>
                  </div>
                )}
                {cvData.personal.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{cvData.personal.location}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-4 text-sm text-gray-600">
                {cvData.personal.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>{cvData.personal.website}</span>
                  </div>
                )}
                {cvData.personal.linkedin && (
                  <div className="flex items-center gap-1">
                    <Linkedin className="h-4 w-4" />
                    <span>{cvData.personal.linkedin}</span>
                  </div>
                )}
                {cvData.personal.github && (
                  <div className="flex items-center gap-1">
                    <Github className="h-4 w-4" />
                    <span>{cvData.personal.github}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-center text-gray-700">
                {cvData.personal.summary || "Your professional summary will appear here."}
              </p>
            </div>

            {cvData.experience.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 after:ml-4 after:inline-block after:h-[1px] after:w-full after:max-w-[100px] after:bg-gray-300 after:align-middle">
                  Experience
                </h3>
                <div className="space-y-6">
                  {cvData.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="mb-1 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                        <span className="text-sm text-gray-600">
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                        </span>
                      </div>
                      <div className="mb-2 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h5 className="text-md font-medium text-gray-700">{exp.company}</h5>
                        <span className="text-sm text-gray-600">{exp.location}</span>
                      </div>
                      <p className="whitespace-pre-line text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cvData.education.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 after:ml-4 after:inline-block after:h-[1px] after:w-full after:max-w-[100px] after:bg-gray-300 after:align-middle">
                  Education
                </h3>
                <div className="space-y-6">
                  {cvData.education.map((edu, index) => (
                    <div key={index}>
                      <div className="mb-1 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </h4>
                        <span className="text-sm text-gray-600">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                      <div className="mb-2 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h5 className="text-md font-medium text-gray-700">{edu.institution}</h5>
                        <span className="text-sm text-gray-600">{edu.location}</span>
                      </div>
                      <p className="text-gray-700">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cvData.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 after:ml-4 after:inline-block after:h-[1px] after:w-full after:max-w-[100px] after:bg-gray-300 after:align-middle">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {cvData.skills.map((skill, index) => (
                    <span key={index} className="text-gray-700">
                      {skill}
                      {index < cvData.skills.length - 1 && "•"}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {cvData.projects.length > 0 && (
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900 after:ml-4 after:inline-block after:h-[1px] after:w-full after:max-w-[100px] after:bg-gray-300 after:align-middle">
                  Projects
                </h3>
                <div className="space-y-6">
                  {cvData.projects.map((project, index) => (
                    <div key={index}>
                      <div className="mb-1 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
                        <span className="text-sm text-gray-600">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </span>
                      </div>
                      <p className="mb-2 text-gray-700">{project.description}</p>
                      {project.technologies && (
                        <div className="mb-2 text-sm text-gray-600">
                          <strong>Technologies:</strong> {project.technologies}
                        </div>
                      )}
                      <div className="flex gap-4 text-sm">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 hover:underline"
                          >
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 hover:underline"
                          >
                            GitHub Repository
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!cvData.personal.fullName &&
              !cvData.experience.length &&
              !cvData.education.length &&
              !cvData.skills.length &&
              !cvData.projects.length && (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                  <p>Your CV preview will appear here. Start by filling out your information in the form.</p>
                </div>
              )}
          </div>
        </TabsContent>

        <TabsContent value="classic">
          <div id="cv-preview-content" className="rounded-lg border bg-white p-8 shadow-sm">
            <div className="mb-8 border-b-2 border-gray-900 pb-4">
              <h1 className="mb-2 text-center text-4xl font-bold uppercase tracking-wider text-gray-900">
                {cvData.personal.fullName || "Your Name"}
              </h1>
              <h2 className="mb-4 text-center text-xl font-medium text-gray-700">
                {cvData.personal.jobTitle || "Your Job Title"}
              </h2>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                {cvData.personal.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{cvData.personal.email}</span>
                  </div>
                )}
                {cvData.personal.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{cvData.personal.phone}</span>
                  </div>
                )}
                {cvData.personal.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{cvData.personal.location}</span>
                  </div>
                )}
                {cvData.personal.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>{cvData.personal.website}</span>
                  </div>
                )}
                {cvData.personal.linkedin && (
                  <div className="flex items-center gap-1">
                    <Linkedin className="h-4 w-4" />
                    <span>{cvData.personal.linkedin}</span>
                  </div>
                )}
                {cvData.personal.github && (
                  <div className="flex items-center gap-1">
                    <Github className="h-4 w-4" />
                    <span>{cvData.personal.github}</span>
                  </div>
                )}
              </div>
            </div>

            {cvData.personal.summary && (
              <div className="mb-8">
                <h3 className="mb-2 border-b text-2xl font-bold uppercase tracking-wider text-gray-900">
                  Professional Summary
                </h3>
                <p className="text-gray-700">{cvData.personal.summary}</p>
              </div>
            )}

            {cvData.experience.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 border-b text-2xl font-bold uppercase tracking-wider text-gray-900">
                  Professional Experience
                </h3>
                <div className="space-y-6">
                  {cvData.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="mb-1 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h4 className="text-lg font-bold text-gray-900">{exp.position}</h4>
                        <span className="text-sm font-medium text-gray-600">
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                        </span>
                      </div>
                      <div className="mb-2 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h5 className="text-md font-semibold text-gray-700">
                          {exp.company}
                          {exp.location && `, ${exp.location}`}
                        </h5>
                      </div>
                      <p className="whitespace-pre-line text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cvData.education.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 border-b text-2xl font-bold uppercase tracking-wider text-gray-900">Education</h3>
                <div className="space-y-6">
                  {cvData.education.map((edu, index) => (
                    <div key={index}>
                      <div className="mb-1 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h4 className="text-lg font-bold text-gray-900">
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </h4>
                        <span className="text-sm font-medium text-gray-600">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                      <div className="mb-2 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h5 className="text-md font-semibold text-gray-700">
                          {edu.institution}
                          {edu.location && `, ${edu.location}`}
                        </h5>
                      </div>
                      <p className="text-gray-700">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cvData.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 border-b text-2xl font-bold uppercase tracking-wider text-gray-900">
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-x-1 gap-y-2">
                  {cvData.skills.map((skill, index) => (
                    <span key={index} className="text-gray-700">
                      {skill}
                      {index < cvData.skills.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {cvData.projects.length > 0 && (
              <div>
                <h3 className="mb-4 border-b text-2xl font-bold uppercase tracking-wider text-gray-900">Projects</h3>
                <div className="space-y-6">
                  {cvData.projects.map((project, index) => (
                    <div key={index}>
                      <div className="mb-1 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h4 className="text-lg font-bold text-gray-900">{project.name}</h4>
                        <span className="text-sm font-medium text-gray-600">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </span>
                      </div>
                      <p className="mb-2 text-gray-700">{project.description}</p>
                      {project.technologies && (
                        <div className="mb-2 text-sm text-gray-600">
                          <strong>Technologies:</strong> {project.technologies}
                        </div>
                      )}
                      <div className="flex gap-4 text-sm">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-gray-900 hover:underline"
                          >
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-gray-900 hover:underline"
                          >
                            GitHub Repository
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!cvData.personal.fullName &&
              !cvData.experience.length &&
              !cvData.education.length &&
              !cvData.skills.length &&
              !cvData.projects.length && (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                  <p>Your CV preview will appear here. Start by filling out your information in the form.</p>
                </div>
              )}
          </div>
        </TabsContent>

        <TabsContent value="github">
          <div id="cv-preview-content" className="rounded-lg border bg-white p-8 shadow-sm">
            <div className="mb-8 flex flex-col md:flex-row md:gap-8">
              <div className="mb-4 md:mb-0 md:w-1/4">
                <div className="mb-4 h-48 w-48 overflow-hidden rounded-full border-4 border-gray-200">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-2 text-sm">
                  {cvData.personal.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{cvData.personal.email}</span>
                    </div>
                  )}
                  {cvData.personal.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{cvData.personal.phone}</span>
                    </div>
                  )}
                  {cvData.personal.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{cvData.personal.location}</span>
                    </div>
                  )}
                  {cvData.personal.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <a
                        href={cvData.personal.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  {cvData.personal.linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-gray-500" />
                      <a
                        href={cvData.personal.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {cvData.personal.github && (
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4 text-gray-500" />
                      <a
                        href={cvData.personal.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        GitHub
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:w-3/4">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">{cvData.personal.fullName || "Your Name"}</h1>
                <h2 className="mb-4 text-xl font-medium text-gray-600">
                  {cvData.personal.jobTitle || "Your Job Title"}
                </h2>
                <div className="mb-6 rounded-lg bg-gray-100 p-4">
                  <p className="text-gray-700">
                    {cvData.personal.summary || "Your professional summary will appear here."}
                  </p>
                </div>
                {cvData.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-3 text-xl font-semibold text-gray-900">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {cvData.projects.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
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
                    className="h-6 w-6 text-gray-700"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  Projects
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {cvData.projects.map((project, index) => (
                    <div key={index} className="rounded-lg border bg-gray-50 p-4 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
                        <div className="flex gap-2">
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-md bg-gray-200 p-1 text-gray-700 hover:bg-gray-300"
                              title="Live Demo"
                            >
                              <Globe className="h-4 w-4" />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-md bg-gray-200 p-1 text-gray-700 hover:bg-gray-300"
                              title="GitHub Repository"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="mb-2 text-sm text-gray-700">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.split(", ").map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-2 text-xs text-gray-600">
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cvData.experience.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
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
                    className="h-6 w-6 text-gray-700"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  Experience
                </h3>
                <div className="space-y-6">
                  {cvData.experience.map((exp, index) => (
                    <div key={index} className="rounded-lg border bg-gray-50 p-4 shadow-sm">
                      <div className="mb-1 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                        <span className="text-sm text-gray-600">
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                        </span>
                      </div>
                      <div className="mb-2 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h5 className="text-md font-medium text-gray-700">{exp.company}</h5>
                        <span className="text-sm text-gray-600">{exp.location}</span>
                      </div>
                      <p className="whitespace-pre-line text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cvData.education.length > 0 && (
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
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
                    className="h-6 w-6 text-gray-700"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                  </svg>
                  Education
                </h3>
                <div className="space-y-6">
                  {cvData.education.map((edu, index) => (
                    <div key={index} className="rounded-lg border bg-gray-50 p-4 shadow-sm">
                      <div className="mb-1 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </h4>
                        <span className="text-sm text-gray-600">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                      <div className="mb-2 flex flex-col justify-between sm:flex-row sm:items-center">
                        <h5 className="text-md font-medium text-gray-700">{edu.institution}</h5>
                        <span className="text-sm text-gray-600">{edu.location}</span>
                      </div>
                      <p className="text-gray-700">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!cvData.personal.fullName &&
              !cvData.experience.length &&
              !cvData.education.length &&
              !cvData.skills.length &&
              !cvData.projects.length && (
                <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                  <p>Your CV preview will appear here. Start by filling out your information in the form.</p>
                </div>
              )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
