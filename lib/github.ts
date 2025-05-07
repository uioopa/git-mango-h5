// GitHub API integration

export interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  html_url: string
  bio: string
  location: string
  email: string
  blog: string
  public_repos: number
  followers: number
  following: number
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string
  fork: boolean
  created_at: string
  updated_at: string
  pushed_at: string
  homepage: string
  stargazers_count: number
  watchers_count: number
  language: string
  forks_count: number
  topics: string[]
}

export interface GitHubContribution {
  date: string
  count: number
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const response = await fetch(`https://api.github.com/users/${username}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub user: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub repos: ${response.statusText}`)
  }

  return response.json()
}

export function filterRelevantRepos(repos: GitHubRepo[]): GitHubRepo[] {
  // Sort by stars and updated date
  return repos
    .sort((a, b) => {
      // First sort by stars
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count
      }
      // Then by last updated date
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
    .slice(0, 10) // Limit to 10 most relevant repos
}

export function extractSkillsFromRepos(repos: GitHubRepo[]): string[] {
  const skills = new Set<string>()

  // Extract languages
  repos.forEach((repo) => {
    if (repo.language) {
      skills.add(repo.language)
    }
  })

  // Extract topics
  repos.forEach((repo) => {
    if (repo.topics && repo.topics.length > 0) {
      repo.topics.forEach((topic) => {
        // Filter out non-skill topics
        if (topic.length > 1 && !topic.includes("awesome") && !topic.includes("list")) {
          // Convert kebab-case to readable format
          const formattedTopic = topic
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
          skills.add(formattedTopic)
        }
      })
    }
  })

  return Array.from(skills)
}

export function formatGitHubReposForCV(repos: GitHubRepo[]): any[] {
  return repos.map((repo) => {
    // Extract technologies from topics and language
    let technologies = repo.language || ""
    if (repo.topics && repo.topics.length > 0) {
      const techTopics = repo.topics
        .map((topic) =>
          topic
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        )
        .join(", ")

      if (technologies && techTopics) {
        technologies += ", " + techTopics
      } else if (techTopics) {
        technologies = techTopics
      }
    }

    return {
      name: repo.name,
      description: repo.description || `A ${repo.language || "code"} project`,
      url: repo.homepage || "",
      githubUrl: repo.html_url,
      technologies: technologies,
      startDate: repo.created_at.substring(0, 7),
      endDate: "",
    }
  })
}
