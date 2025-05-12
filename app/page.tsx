import Link from "next/link"
import { getPosts } from "@/lib/posts"
import { formatDate } from "@/lib/utils"

export default function Home() {
  const posts = getPosts()

  return (
    <div>
      <h1 className="text-2xl font-normal mb-8">Recent Thoughts</h1>
      <div className="post-list">
        {posts.slice(0, 5).map((post) => (
          <article key={post.slug}>
            <Link href={`/thoughts/${post.slug}`} className="no-underline">
              <h2 className="hover:underline">{post.title}</h2>
            </Link>
            <div className="metadata">{formatDate(post.date)}</div>
            <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
          </article>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/thoughts" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 font-sans text-sm">
          View all thoughts →
        </Link>
      </div>
    </div>
  )
}
