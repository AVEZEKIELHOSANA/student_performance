import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
        🎓 Student Performance Prediction System
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Predict your academic performance using machine learning. Get personalized recommendations and early warnings.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-blue-900 text-white px-8 py-3 rounded-md hover:bg-blue-800 transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/register"
          className="border-2 border-blue-900 text-blue-900 px-8 py-3 rounded-md hover:bg-blue-50 transition-colors"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}