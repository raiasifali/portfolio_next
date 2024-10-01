import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>Welcome to new app!</p>

      <Link href="/users">Users</Link>
    </div>
  );
}
