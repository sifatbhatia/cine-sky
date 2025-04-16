import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-4 px-6 bg-[#1d0811] text-white/80 text-sm">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-2">
        <p>© {new Date().getFullYear()} CineSky. All rights reserved.</p>
        <p>
          Formerly known as{' '}
          <Link 
            href="https://filmtherv2.netlify.app/" 
            className="text-[#e43c1c] hover:text-[#f04d2e] underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            FilmTher
          </Link>
          {' '}by{' '}
          <Link 
            href="https://siftion.com" 
            className="text-[#e43c1c] hover:text-[#f04d2e] underline"
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