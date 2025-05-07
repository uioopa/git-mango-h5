import { NextResponse } from "next/server"

// In a real application, this would connect to a database
// For this example, we'll use in-memory storage

let cvs = [
  {
    id: "1",
    title: "Software Developer CV",
    lastUpdated: "2023-05-15T10:30:00Z",
    theme: "modern",
    data: {
      personal: {
        fullName: "John Doe",
        jobTitle: "Senior Software Engineer",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        website: "https://johndoe.com",
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe",
        summary:
          "Experienced software engineer with 8+ years of experience in full-stack development. Passionate about creating efficient, scalable, and maintainable code. Strong expertise in JavaScript, TypeScript, React, and Node.js.",
      },
      experience: [
        {
          company: "Tech Solutions Inc.",
          position: "Senior Software Engineer",
          startDate: "2020-01",
          endDate: "",
          current: true,
          location: "San Francisco, CA",
          description:
            "• Led a team of 5 developers to build a new customer-facing portal\n• Reduced page load time by 40% through performance optimizations\n• Implemented CI/CD pipeline that reduced deployment time by 60%\n• Mentored junior developers and conducted code reviews",
        },
        {
          company: "WebDev Co.",
          position: "Software Engineer",
          startDate: "2017-03",
          endDate: "2019-12",
          current: false,
          location: "Seattle, WA",
          description:
            "• Developed and maintained multiple React applications\n• Collaborated with UX designers to implement responsive designs\n• Integrated third-party APIs and services\n• Participated in agile development processes",
        },
      ],
      education: [
        {
          institution: "University of Washington",
          degree: "Master's",
          field: "Computer Science",
          startDate: "2015-09",
          endDate: "2017-06",
          location: "Seattle, WA",
          description: "Specialized in Software Engineering. GPA: 3.8/4.0",
        },
        {
          institution: "California State University",
          degree: "Bachelor's",
          field: "Computer Science",
          startDate: "2011-09",
          endDate: "2015-06",
          location: "Los Angeles, CA",
          description: "Minor in Mathematics. GPA: 3.7/4.0",
        },
      ],
      skills: [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "PostgreSQL",
        "GraphQL",
        "Docker",
        "AWS",
        "Git",
        "CI/CD",
        "Agile",
        "TDD",
        "REST APIs",
        "Redux",
        "Jest",
      ],
      projects: [
        {
          name: "E-commerce Platform",
          description:
            "Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented features like user authentication, product catalog, shopping cart, and payment processing.",
          url: "https://ecommerce-project.com",
          githubUrl: "https://github.com/johndoe/ecommerce",
          technologies: "React, Node.js, Express, MongoDB, Stripe API",
          startDate: "2021-03",
          endDate: "2021-08",
        },
        {
          name: "Task Management App",
          description:
            "Developed a task management application with real-time updates using React, TypeScript, and Firebase. Implemented drag-and-drop functionality and user authentication.",
          url: "https://task-app.com",
          githubUrl: "https://github.com/johndoe/task-app",
          technologies: "React, TypeScript, Firebase, Material UI",
          startDate: "2020-06",
          endDate: "2020-09",
        },
      ],
    },
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    const cv = cvs.find((cv) => cv.id === id)
    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }
    return NextResponse.json(cv)
  }

  return NextResponse.json(
    cvs.map((cv) => ({
      id: cv.id,
      title: cv.title,
      lastUpdated: cv.lastUpdated,
      theme: cv.theme,
    })),
  )
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const newCV = {
      id: Date.now().toString(),
      title: data.title || "Untitled CV",
      lastUpdated: new Date().toISOString(),
      theme: data.theme || "modern",
      data: data.data,
    }

    cvs.push(newCV)

    return NextResponse.json({
      success: true,
      cv: {
        id: newCV.id,
        title: newCV.title,
        lastUpdated: newCV.lastUpdated,
        theme: newCV.theme,
      },
    })
  } catch (error) {
    console.error("Error creating CV:", error)
    return NextResponse.json({ error: "Failed to create CV" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
    }

    const index = cvs.findIndex((cv) => cv.id === data.id)

    if (index === -1) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 })
    }

    cvs[index] = {
      ...cvs[index],
      title: data.title || cvs[index].title,
      lastUpdated: new Date().toISOString(),
      theme: data.theme || cvs[index].theme,
      data: data.data || cvs[index].data,
    }

    return NextResponse.json({
      success: true,
      cv: {
        id: cvs[index].id,
        title: cvs[index].title,
        lastUpdated: cvs[index].lastUpdated,
        theme: cvs[index].theme,
      },
    })
  } catch (error) {
    console.error("Error updating CV:", error)
    return NextResponse.json({ error: "Failed to update CV" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
  }

  const initialLength = cvs.length
  cvs = cvs.filter((cv) => cv.id !== id)

  if (cvs.length === initialLength) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    message: "CV deleted successfully",
  })
}
