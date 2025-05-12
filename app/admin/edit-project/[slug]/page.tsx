"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { notFound } from "next/navigation"

export default function EditProjectPage({ params }: { params: { slug: string } }) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [link, setLink] = useState("")
  const [technologies, setTechnologies] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }

    // Load project data
    const projects = JSON.parse(localStorage.getItem("projects") || "[]")
    const project = projects.find((p: any) => p.slug === params.slug)

    if (project) {
      setTitle(project.title)
      setSlug(project.slug)
      setDescription(project.description)
      setLink(project.link || "")
      setTechnologies(
        Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies || "",
      )
      setIsLoading(false)
    } else {
      notFound()
    }
  }, [params.slug, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Get existing projects
    const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]")

    // Find the project index
    const projectIndex = existingProjects.findIndex((p: any) => p.slug === params.slug)

    if (projectIndex === -1) {
      notFound()
      return
    }

    // Update the project
    const updatedProject = {
      ...existingProjects[projectIndex],
      title,
      slug,
      description,
      link,
      technologies: technologies.split(",").map((tech) => tech.trim()),
      updatedAt: new Date().toISOString(),
    }

    existingProjects[projectIndex] = updatedProject
    localStorage.setItem("projects", JSON.stringify(existingProjects))
    router.push("/admin")
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-normal">Edit Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Project Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description (HTML)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="link">Project Link (optional)</Label>
          <Input id="link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="technologies">Technologies (comma separated)</Label>
          <Input
            id="technologies"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            placeholder="React, Next.js, Tailwind CSS"
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Save Changes</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
