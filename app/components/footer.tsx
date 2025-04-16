import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-4 px-6 bg-gray-900 text-gray-300 text-sm">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-2">
        <p>© {new Date().getFullYear()} CineSky. All rights reserved.</p>
        <p>
          Formerly known as{' '}
          <Link 
            href="https://filmtherv2.netlify.app/" 
            className="text-blue-400 hover:text-blue-300 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            FilmTher
          </Link>
          {' '}by{' '}
          <Link 
            href="https://siftion.com" 
            className="text-blue-400 hover:text-blue-300 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Siftion
          </Link>
        </p>
      </div>
    </footer>
  );
} 