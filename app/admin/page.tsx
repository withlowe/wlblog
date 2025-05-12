"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authenticate } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const success = await authenticate(username, password)
      if (success) {
        setIsLoggedIn(true)
        localStorage.setItem("isLoggedIn", "true")
      } else {
        setError("Invalid credentials")
      }
    } catch (err) {
      setError("Login failed")
    }
  }

  // Check if user is already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
  }, [])

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-normal mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-normal">Admin Dashboard</h1>
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem("isLoggedIn")
            setIsLoggedIn(false)
          }}
        >
          Logout
        </Button>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">Posts Management</h2>
            <Button onClick={() => router.push("/admin/new-post")}>Create New Post</Button>
          </div>
          <div className="border rounded-md p-4">
            <PostList />
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">Projects Management</h2>
            <Button onClick={() => router.push("/admin/new-project")}>Create New Project</Button>
          </div>
          <div className="border rounded-md p-4">
            <ProjectList />
          </div>
        </TabsContent>

        <TabsContent value="about" className="space-y-4 mt-4">
          <h2 className="text-xl">Edit About Page</h2>
          <div className="border rounded-md p-4">
            <EditAboutPage />
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-4 mt-4">
          <h2 className="text-xl">Export Content</h2>
          <div className="border rounded-md p-4">
            <ExportPosts />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <h2 className="text-xl">Account Settings</h2>
          <div className="border rounded-md p-4">
            <ChangePassword />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PostList() {
  const [posts, setPosts] = useState(() => {
    // In a real app, this would be fetched from an API
    // For static export, we're using localStorage
    const savedPosts = localStorage.getItem("posts")
    return savedPosts ? JSON.parse(savedPosts) : []
  })
  const router = useRouter()

  const handleDelete = (slug: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const updatedPosts = posts.filter((post: any) => post.slug !== slug)
      localStorage.setItem("posts", JSON.stringify(updatedPosts))
      setPosts(updatedPosts)
    }
  }

  const handleEdit = (slug: string) => {
    router.push(`/admin/edit-post/${slug}`)
  }

  return (
    <div className="space-y-2">
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((post: any) => (
            <li key={post.slug} className="flex justify-between items-center border-b pb-2">
              <span>{post.title}</span>
              <div className="space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(post.slug)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(post.slug)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState({ text: "", type: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ text: "", type: "" })

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords don't match", type: "error" })
      return
    }

    // In a real app, this would call an API
    // For static export, we're simulating password change
    if (currentPassword === "password") {
      // Update the password (in a real app)
      // For demo, we'll just show success
      setMessage({ text: "Password changed successfully", type: "success" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      setMessage({ text: "Current password is incorrect", type: "error" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {message.text && <p className={message.type === "error" ? "text-red-500" : "text-green-500"}>{message.text}</p>}
      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Change Password</Button>
    </form>
  )
}

function ExportPosts() {
  const [isExporting, setIsExporting] = useState(false)
  const [message, setMessage] = useState("")

  const handleExport = async () => {
    setIsExporting(true)
    setMessage("")

    try {
      // Get posts from localStorage
      const posts = JSON.parse(localStorage.getItem("posts") || "[]")

      // Get static posts from the function
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

      const allPosts = [...staticPosts, ...posts]

      // Import JSZip dynamically
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()

      // Convert HTML content to markdown-like format (simplified)
      const htmlToMarkdown = (html: string) => {
        return html
          .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
          .replace(/<ul>(.*?)<\/ul>/gs, "$1\n")
          .replace(/<li>(.*?)<\/li>/g, "- $1\n")
          .replace(/<[^>]*>/g, "")
          .trim()
      }

      // Add each post as a markdown file
      allPosts.forEach((post: any) => {
        const markdown = `---
title: ${post.title}
date: ${post.date}
excerpt: ${post.excerpt}
slug: ${post.slug}
---

${htmlToMarkdown(post.content)}
`
        zip.file(`${post.slug}.md`, markdown)
      })

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" })

      // Create a download link
      const url = URL.createObjectURL(content)
      const link = document.createElement("a")
      link.href = url
      link.download = "blog-posts.zip"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setMessage("Posts exported successfully!")
    } catch (error) {
      console.error("Export failed:", error)
      setMessage("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <p>Export all your blog posts as Markdown files in a zip archive.</p>
      {message && <p className={message.includes("failed") ? "text-red-500" : "text-green-500"}>{message}</p>}
      <Button onClick={handleExport} disabled={isExporting}>
        {isExporting ? "Exporting..." : "Export Posts as Markdown"}
      </Button>
    </div>
  )
}

function ProjectList() {
  const [projects, setProjects] = useState(() => {
    // In a real app, this would be fetched from an API
    // For static export, we're using localStorage
    const savedProjects = localStorage.getItem("projects")
    return savedProjects ? JSON.parse(savedProjects) : []
  })
  const router = useRouter()

  const handleDelete = (slug: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = projects.filter((project: any) => project.slug !== slug)
      localStorage.setItem("projects", JSON.stringify(updatedProjects))
      setProjects(updatedProjects)
    }
  }

  const handleEdit = (slug: string) => {
    router.push(`/admin/edit-project/${slug}`)
  }

  return (
    <div className="space-y-2">
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects yet</p>
      ) : (
        <ul className="space-y-2">
          {projects.map((project: any) => (
            <li key={project.slug} className="flex justify-between items-center border-b pb-2">
              <span>{project.title}</span>
              <div className="space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(project.slug)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(project.slug)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function EditAboutPage() {
  const [content, setContent] = useState("")
  const [message, setMessage] = useState({ text: "", type: "" })

  useEffect(() => {
    // Load about page content from localStorage or use default
    const savedContent = localStorage.getItem("aboutPageContent")
    if (savedContent) {
      setContent(savedContent)
    } else {
      // Default content
      setContent(`
<p>
  This is a minimalist blog created with Next.js, inspired by the clean design of shud.in. It features a simple
  content management system and authentication for managing blog posts.
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
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Save about page content to localStorage
    localStorage.setItem("aboutPageContent", content)
    setMessage({ text: "About page updated successfully", type: "success" })

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: "", type: "" })
    }, 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message.text && <p className={message.type === "error" ? "text-red-500" : "text-green-500"}>{message.text}</p>}
      <div className="space-y-2">
        <Label htmlFor="about-content">About Page Content (HTML)</Label>
        <Textarea id="about-content" value={content} onChange={(e) => setContent(e.target.value)} rows={12} required />
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  )
}
