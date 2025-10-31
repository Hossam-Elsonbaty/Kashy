import { Link } from "react-router-dom"

const PageNotFound = () => {
  return (
    <main className="flex gap-8 flex-col items-center justify-center bg-amber-500 h-dvh">
      <p className="text-amber-700 text-xl">
        404 | Page Not Found
      </p>
      <Link to="/" className="p-3 bg-amber-700 rounded-xl text-white">Back Home</Link>
    </main>
  )
}

export default PageNotFound
