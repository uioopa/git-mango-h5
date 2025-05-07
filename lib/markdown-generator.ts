// Markdown generation functionality

export interface CVData {
  personal: {
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
  experience: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    current: boolean
    location: string
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    location: string
    description: string
  }>
  skills: string[]
  projects: Array<{
    name: string
    description: string
    url: string
    githubUrl: string
    technologies: string
    startDate: string
    endDate: string
  }>
}

export function generateMarkdown(cvData: CVData): string {
  let markdown = ""

  // Personal Information
  markdown += `# ${cvData.personal.fullName}\n\n`
  markdown += `## ${cvData.personal.jobTitle}\n\n`

  // Contact Information
  markdown += "## Contact Information\n\n"
  if (cvData.personal.email) markdown += `- Email: ${cvData.personal.email}\n`
  if (cvData.personal.phone) markdown += `- Phone: ${cvData.personal.phone}\n`
  if (cvData.personal.location) markdown += `- Location: ${cvData.personal.location}\n`
  if (cvData.personal.website) markdown += `- Website: [${cvData.personal.website}](${cvData.personal.website})\n`
  if (cvData.personal.linkedin) markdown += `- LinkedIn: [LinkedIn Profile](${cvData.personal.linkedin})\n`
  if (cvData.personal.github) markdown += `- GitHub: [GitHub Profile](${cvData.personal.github})\n`
  markdown += "\n"

  // Summary
  if (cvData.personal.summary) {
    markdown += "## Summary\n\n"
    markdown += `${cvData.personal.summary}\n\n`
  }

  // Skills
  if (cvData.skills.length > 0) {
    markdown += "## Skills\n\n"
    cvData.skills.forEach((skill) => {
      markdown += `- ${skill}\n`
    })
    markdown += "\n"
  }

  // Experience
  if (cvData.experience.length > 0) {
    markdown += "## Experience\n\n"
    cvData.experience.forEach((exp) => {
      markdown += `### ${exp.position}\n`
      markdown += `**${exp.company}** | ${exp.location} | `
      markdown += `${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : "Present"}\n\n`
      markdown += `${exp.description.replace(/\n/g, "\n\n")}\n\n`
    })
  }

  // Education
  if (cvData.education.length > 0) {
    markdown += "## Education\n\n"
    cvData.education.forEach((edu) => {
      markdown += `### ${edu.degree} in ${edu.field}\n`
      markdown += `**${edu.institution}** | ${edu.location} | `
      markdown += `${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : "Present"}\n\n`
      if (edu.description) markdown += `${edu.description}\n\n`
    })
  }

  // Projects
  if (cvData.projects.length > 0) {
    markdown += "## Projects\n\n"
    cvData.projects.forEach((project) => {
      markdown += `### ${project.name}\n\n`
      markdown += `${project.description}\n\n`
      markdown += `**Technologies:** ${project.technologies}\n\n`
      if (project.url) markdown += `- [Live Demo](${project.url})\n`
      if (project.githubUrl) markdown += `- [GitHub Repository](${project.githubUrl})\n`
      markdown += "\n"
    })
  }

  return markdown
}

function formatDate(dateString: string): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export function downloadMarkdown(markdown: string, filename = "cv.md"): void {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
