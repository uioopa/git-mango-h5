import { NextResponse } from "next/server"
import { generateMarkdown } from "@/lib/markdown-generator"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Generate markdown from the CV data
    const markdown = generateMarkdown(data)

    return NextResponse.json({
      success: true,
      markdown,
    })
  } catch (error) {
    console.error("Error generating Markdown:", error)
    return NextResponse.json({ error: "Failed to generate Markdown" }, { status: 500 })
  }
}
