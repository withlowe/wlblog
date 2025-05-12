"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/admin")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would be sent to an API
    // For static export, we're using localStorage
    const newPost = {
      title,
      slug,
      content,
      excerpt,
      date: new Date().toISOString(),
    }

    const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]")
    localStorage.setItem("posts", JSON.stringify([...existingPosts, newPost]))

    router.push("/admin")
  }

  const generateSlug = () => {
    setSlug(
      title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, ""),
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-normal">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={generateSlug} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} required />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Save Post</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
