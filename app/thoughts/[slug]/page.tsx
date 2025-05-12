import Image from "next/image"
import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/posts"

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article>
      <h1 className="text-2xl font-normal mb-8">{post.title}</h1>
      <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />

      {post.images &&
        post.images.map((image, index) => (
          <div key={index} className="my-8">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt || ""}
              width={600}
              height={400}
              className="bg-black"
            />
          </div>
        ))}
    </article>
  )
}
