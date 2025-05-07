import Link from "next/link"

import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-header"
import { GitMangoLogo } from "@/components/git-mango-logo"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Create Professional CVs with GitHub Integration
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Generate beautiful, customizable CVs that showcase your GitHub projects and contributions. Export to
                    PDF or Markdown and share with potential employers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/create">
                    <Button size="lg">Create Your CV</Button>
                  </Link>
                  <Link href="/templates">
                    <Button variant="outline" size="lg">
                      Browse Templates
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 blur-xl"></div>
                  <div className="relative h-full w-full rounded-lg border bg-background p-4 shadow-lg">
                    <div className="h-full w-full rounded bg-muted p-6">
                      <div className="mb-4 h-8 w-40 rounded bg-muted-foreground/20"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-muted-foreground/20"></div>
                        <div className="h-4 w-full rounded bg-muted-foreground/20"></div>
                        <div className="h-4 w-2/3 rounded bg-muted-foreground/20"></div>
                      </div>
                      <div className="mt-6 space-y-2">
                        <div className="h-4 w-full rounded bg-muted-foreground/20"></div>
                        <div className="h-4 w-full rounded bg-muted-foreground/20"></div>
                        <div className="h-4 w-3/4 rounded bg-muted-foreground/20"></div>
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="h-20 rounded bg-muted-foreground/20"></div>
                        <div className="h-20 rounded bg-muted-foreground/20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to create professional CVs that stand out
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <GitMangoLogo className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">GitHub Integration</h3>
                <p className="text-center text-muted-foreground">
                  Automatically import your repositories and contributions from GitHub
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M2 15h10" />
                    <path d="m9 18 3-3-3-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Multiple Export Formats</h3>
                <p className="text-center text-muted-foreground">Export your CV as PDF or Markdown for easy sharing</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313-12.454z" />
                    <path d="m17 4 3 3" />
                    <path d="m14 7 3 3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Customizable Themes</h3>
                <p className="text-center text-muted-foreground">
                  Choose from multiple themes to match your personal style
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 Git Mango. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
