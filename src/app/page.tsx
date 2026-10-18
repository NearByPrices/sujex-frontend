export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sujay ERP + CRM
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Multi-tenant SaaS platform for small and medium businesses
          </p>
          <div className="space-x-4">
            <a
              href="/auth/login"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </a>
            <a
              href="/auth/signup"
              className="inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg border border-indigo-600 hover:bg-indigo-50 transition"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
