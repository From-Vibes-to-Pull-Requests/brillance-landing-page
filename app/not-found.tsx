import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F5F3] flex flex-col items-center justify-center px-4">
      <h1 className="text-[#37322F] text-2xl font-semibold font-sans mb-2">Page not found</h1>
      <p className="text-[#605A57] text-base font-sans mb-6">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#37322F] text-white text-sm font-medium rounded-full font-sans hover:opacity-90 transition-opacity"
      >
        Back to home
      </Link>
    </div>
  )
}
