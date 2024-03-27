import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>This is the landing page</h1>
      <Link href={'/app'}>Get started</Link>
    </div>
  )
}