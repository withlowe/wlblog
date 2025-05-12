"use client"

import { useEffect, useState } from "react"

export default function AboutPage() {
  const [content, setContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load about page content from localStorage or use default
    const savedContent = localStorage.getItem("aboutPageContent")
    if (savedContent) {
      setContent(savedContent)
    } else {
      // Default content
      setContent(`
        <p>
          This is a minimalist blog created with Next.js, inspired by the clean design of shud.in and manuelmoreale.com. 
          It features a simple content management system and authentication for managing blog posts.
        </p>
        <p>
          The site is built as a static export, meaning it can be hosted on any static hosting service without requiring
          a server. Content management is handled client-side using browser storage.
        </p>
        <p>
          In a production environment, you would likely want to replace the localStorage-based content management with a
          headless CMS or a database solution.
        </p>
      `)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-normal mb-8">About</h1>
      <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
