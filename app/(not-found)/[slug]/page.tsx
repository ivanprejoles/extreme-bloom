// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-gradient-to-r from-rose-100 to-teal-100 dark:from-gray-700 dark:via-gray-900 dark:to-black">
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="flex flex-col justify-center text-center gap-6">
          <p className="text-3xl font-semibold text-blue-500">404!</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-500">Page not found.</h1>
          <p className="text-base text-gray-600 dark:text-gray-300">Sorry, we couldn’t find the page you’re looking for.</p>
          <Link className='text-base font-medium text-blue-500' href='/'> Go back home </Link>
        </div>
      </div>
    </div>
  );
}
