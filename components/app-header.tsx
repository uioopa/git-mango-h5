import Link from "next/link"
import { siteConfig } from "@/config/site"
import { GitMangoLogo } from "@/components/git-mango-logo"

export function AppHeader({ user = null }: { user?: any }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <GitMangoLogo className="h-6 w-6 text-primary" />
            <span className="font-bold">{siteConfig.name}</span>
          </Link>
        </div>
        <nav className="ml-auto flex items-center space-x-4">
          <Link href="/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
          <Link href="/templates" className="text-sm font-medium">
            Templates
          </Link>
          <Link href="/about" className="text-sm font-medium">
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}
