"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

type Project = {
  title: string
  slug: string
  description: string
  link?: string
  technologies: string[]
  date: string
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem("projects")
    const projects = savedProjects ? JSON.parse(savedProjects) : []

    const foundProject = projects.find((p: Project) => p.slug === params.slug)

    if (foundProject) {
      setProject(foundProject)
    }

    setIsLoading(false)
  }, [params.slug])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!project) {
    notFound()
  }

  return (
    <article>
      <h1 className="text-2xl font-normal mb-8">{project.title}</h1>

      {project.technologies && project.technologies.length > 0 && (
        <div className="metadata mb-8">{project.technologies.join(", ")}</div>
      )}

      <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: project.description }} />

      {project.link && (
        <div className="mt-8">
          <Link
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 metadata"
          >
            Visit Project <ExternalLink size={14} />
          </Link>
        </div>
      )}
    </article>
  )
}
