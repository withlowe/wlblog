import Link from "next/link"

export default function Sidebar() {
  return (
    <header className="mb-10">
      <nav className="flex flex-row gap-6 font-sans text-sm">
        <Link
          href="/about"
          className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors no-underline"
        >
          About
        </Link>
        <Link
          href="/thoughts"
          className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors no-underline"
        >
          Notes
        </Link>
        <Link
          href="/projects"
          className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors no-underline"
        >
          Photos
        </Link>
      </nav>
    </header>
  )
}
