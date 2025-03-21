import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to the App</h1>
      <p><Link href="/login">Go to Login</Link></p>
    </div>
  );
}
