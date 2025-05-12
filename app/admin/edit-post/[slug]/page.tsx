"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { notFound } from "next/navigation"

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/admin")
      return
    }

    // Load post data
    const posts = JSON.parse(localStorage.getItem("posts") || "[]")
    const post = posts.find((p: any) => p.slug === params.slug)

    if (post) {
      setTitle(post.title)
      setSlug(post.slug)
      setContent(post.content)
      setExcerpt(post.excerpt)
      setIsLoading(false)
    } else {
      // Check if it's a static post
      const staticPosts = [
        {
          title: "Good Design",
          slug: "good-design",
          date: "2023-05-15",
          excerpt: "The quality of a design does not escalate proportionally with its complexity.",
          content: `
            <p>The other day I was chatting with Paco Coursey regarding this matter. Sometimes, we have devoted excessive attention to extravagant elements, disregarding the ultimate goal. The term "fancy" can be substituted with various other aspects. In general, the quality of a design does not escalate proportionally with its complexity.</p>
            
            <p>Over the past few years, we have consciously abandoned embellishments such as lights, shadows, and textures in our UI designs. Nevertheless, we are now gradually reintegrating them. This shift should not be misconstrued as a regression from the era of flat design or a reembrace of skeuomorphic design; instead, it represents a progressive leap propelled by a deeper comprehension of design principles.</p>
          `,
        },
        {
          title: "Minimalism in Web Design",
          slug: "minimalism-in-web-design",
          date: "2023-06-22",
          excerpt: "Exploring the principles of minimalist web design and its impact on user experience.",
          content: `
            <p>Minimalism in web design is not just about using less; it's about achieving more with less. By removing unnecessary elements and focusing on what truly matters, we create experiences that are more intuitive and enjoyable for users.</p>
            
            <p>The key principles of minimalist design include:</p>
            <ul>
              <li>Simplicity in layout and navigation</li>
              <li>Limited color palette</li>
              <li>Generous use of whitespace</li>
              <li>Typography as a design element</li>
              <li>Removal of decorative elements that don't serve a purpose</li>
            </ul>
            
            <p>When implemented thoughtfully, minimalism can significantly improve user experience by reducing cognitive load and helping users focus on the content that matters most.</p>
          `,
        },
      ]

      const staticPost = staticPosts.find((p) => p.slug === params.slug)

      if (staticPost) {
        setTitle(staticPost.title)
        setSlug(staticPost.slug)
        setContent(staticPost.content)
        setExcerpt(staticPost.excerpt)
        setIsLoading(false)
        setError("Note: This is a static post. Changes will create a new version in your local storage.")
      } else {
        notFound()
      }
    }
  }, [params.slug, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Get existing posts
    const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]")

    // Find the post index
    const postIndex = existingPosts.findIndex((p: any) => p.slug === params.slug)

    // Update or add the post
    const updatedPost = {
      title,
      slug,
      content,
      excerpt,
      date: new Date().toISOString(),
    }

    if (postIndex !== -1) {
      // Update existing post
      existingPosts[postIndex] = updatedPost
    } else {
      // Add as a new post (for static posts being edited)
      existingPosts.push(updatedPost)
    }

    localStorage.setItem("posts", JSON.stringify(existingPosts))
    router.push("/admin")
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-normal">Edit Post</h1>
      {error && <p className="text-amber-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
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
          <Label htmlFor="content">Content (HTML)</Label>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} required />
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
