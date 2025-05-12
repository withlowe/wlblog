// In a real application, this would fetch from a database or API
// For a static site, we're using a combination of pre-defined posts and localStorage

type Post = {
  title: string
  slug: string
  content: string
  excerpt: string
  date: string
  images?: { src: string; alt: string }[]
}

// Sample posts for static generation
const staticPosts: Post[] = [
  {
    title: "Good Design",
    slug: "good-design",
    date: "2023-05-15",
    excerpt: "The quality of a design does not escalate proportionally with its complexity.",
    content: `
      <p>The other day I was chatting with Paco Coursey regarding this matter. Sometimes, we have devoted excessive attention to extravagant elements, disregarding the ultimate goal. The term "fancy" can be substituted with various other aspects. In general, the quality of a design does not escalate proportionally with its complexity.</p>
      
      <p>Over the past few years, we have consciously abandoned embellishments such as lights, shadows, and textures in our UI designs. Nevertheless, we are now gradually reintegrating them. This shift should not be misconstrued as a regression from the era of flat design or a reembrace of skeuomorphic design; instead, it represents a progressive leap propelled by a deeper comprehension of design principles.</p>
    `,
    images: [
      {
        src: "/placeholder.svg?key=x0byd",
        alt: "Graph showing relationship between good design and fancy design",
      },
      {
        src: "/placeholder.svg?key=250fs",
        alt: "Graph showing complexity in design",
      },
    ],
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

export function getPosts(): Post[] {
  if (typeof window === "undefined") {
    // During static generation, return only static posts
    return staticPosts
  }

  // In the browser, combine static posts with any from localStorage
  try {
    const localPosts = JSON.parse(localStorage.getItem("posts") || "[]")
    return [...staticPosts, ...localPosts]
  } catch (error) {
    console.error("Failed to load posts from localStorage", error)
    return staticPosts
  }
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getPosts()
  return posts.find((post) => post.slug === slug)
}
