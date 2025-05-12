"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

type Project = {
  title: string
  slug: string
  description: string
  link?: string
  technologies: string[]
  date: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem("projects")
    const loadedProjects = savedProjects ? JSON.parse(savedProjects) : []
    setProjects(loadedProjects)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-normal mb-8">Photos</h1>

      {projects.length === 0 ? (
        <div className="prose dark:prose-invert">
          <p>No projects have been added yet.</p>
          <p>
            Projects can be added through the admin interface. This page will display your portfolio of work, showcasing
            your skills and accomplishments.
          </p>
        </div>
      ) : (
        <div className="post-list">
          {projects.map((project) => (
            <article key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="no-underline">
                <h2 className="hover:underline">{project.title}</h2>
              </Link>
              <div className="metadata">{formatDate(project.date)}</div>
              <p className="text-gray-600 dark:text-gray-400">
                {project.description.replace(/<[^>]*>/g, "").substring(0, 160)}
                {project.description.length > 160 ? "..." : ""}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
