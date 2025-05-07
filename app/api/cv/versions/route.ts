import { NextResponse } from "next/server"

// In a real application, this would connect to a database
// For this example, we'll use in-memory storage

const versions = {
  "1": [
    {
      id: 1,
      date: "2023-05-15T14:30:00Z",
      changes: "Updated work experience and skills",
      data: {}, // This would contain the full CV data at this version
    },
    {
      id: 2,
      date: "2023-05-10T09:45:00Z",
      changes: "Added new project and updated summary",
      data: {},
    },
    {
      id: 3,
      date: "2023-05-05T16:20:00Z",
      changes: "Initial CV creation",
      data: {},
    },
  ],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cvId = searchParams.get("cvId")
  const versionId = searchParams.get("versionId")

  if (!cvId) {
    return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
  }

  const cvVersions = versions[cvId]

  if (!cvVersions) {
    return NextResponse.json({ error: "No versions found for this CV" }, { status: 404 })
  }

  if (versionId) {
    const version = cvVersions.find((v) => v.id.toString() === versionId)

    if (!version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 })
    }

    return NextResponse.json(version)
  }

  return NextResponse.json(
    cvVersions.map((v) => ({
      id: v.id,
      date: v.date,
      changes: v.changes,
    })),
  )
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.cvId) {
      return NextResponse.json({ error: "CV ID is required" }, { status: 400 })
    }

    if (!data.changes) {
      return NextResponse.json({ error: "Changes description is required" }, { status: 400 })
    }

    if (!data.data) {
      return NextResponse.json({ error: "CV data is required" }, { status: 400 })
    }

    if (!versions[data.cvId]) {
      versions[data.cvId] = []
    }

    const newVersion = {
      id: versions[data.cvId].length > 0 ? Math.max(...versions[data.cvId].map((v) => v.id)) + 1 : 1,
      date: new Date().toISOString(),
      changes: data.changes,
      data: data.data,
    }

    versions[data.cvId].unshift(newVersion)

    return NextResponse.json({
      success: true,
      version: {
        id: newVersion.id,
        date: newVersion.date,
        changes: newVersion.changes,
      },
    })
  } catch (error) {
    console.error("Error creating version:", error)
    return NextResponse.json({ error: "Failed to create version" }, { status: 500 })
  }
}
