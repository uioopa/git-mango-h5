import { NextResponse } from "next/server"
import {
  fetchGitHubUser,
  fetchGitHubRepos,
  filterRelevantRepos,
  extractSkillsFromRepos,
  formatGitHubReposForCV,
} from "@/lib/github"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "GitHub username is required" }, { status: 400 })
  }

  try {
    // Fetch GitHub user data
    const user = await fetchGitHubUser(username)

    // Fetch repositories
    const allRepos = await fetchGitHubRepos(username)

    if (!allRepos || allRepos.length === 0) {
      return NextResponse.json({
        user,
        skills: [],
        projects: [],
        error: "No repositories found for this user",
      })
    }

    // Filter relevant repositories
    const relevantRepos = filterRelevantRepos(allRepos)

    // Extract skills from repositories
    const skills = extractSkillsFromRepos(allRepos) // Use all repos for skills extraction

    // Format repositories for CV
    const formattedRepos = formatGitHubReposForCV(relevantRepos)

    return NextResponse.json({
      user,
      skills,
      projects: formattedRepos,
      repoCount: allRepos.length,
    })
  } catch (error) {
    console.error("Error fetching GitHub data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch GitHub data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
