import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">
        Dashboard JA
      </h1>

      <div className="grid gap-8 md:grid-cols-3">

        {/* Directiva JA → LOGIN OBLIGATORIO */}
        <Link href="/login">
          <div className="group cursor-pointer rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
            <div className="mb-4 text-4xl">🏛️</div>
            <h2 className="text-2xl font-semibold mb-2">
              Directiva JA
            </h2>
            <p className="text-indigo-100">
              Gestión y liderazgo de Jóvenes Adventistas.
            </p>
            <span className="mt-4 inline-block text-sm opacity-80 group-hover:opacity-100">
              Entrar →
            </span>
          </div>
        </Link>

        {/* Inscripcion miembro GP */}
        <Link href="/dashboard/directiva-ja/inscripcionmiembro">
          <div className="group cursor-pointer rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 p-6 text-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
            <div className="mb-4 text-4xl">🧭</div>
            <h2 className="text-2xl font-semibold mb-2">
              Crear GP y miembros
            </h2>
            <p className="text-emerald-100">
              Registro y crecimiento de la comunidad.
            </p>
            <span className="mt-4 inline-block text-sm opacity-80 group-hover:opacity-100">
              Entrar →
            </span>
          </div>
        </Link>

        {/* Miembros GP */}
        <Link href="/dashboard/directiva-ja/miembros">
          <div className="group cursor-pointer rounded-3xl bg-gradient-to-br from-pink-500 to-orange-500 p-6 text-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
            <div className="mb-4 text-4xl">👥</div>
            <h2 className="text-2xl font-semibold mb-2">
              Miembros GP
            </h2>
            <p className="text-pink-100">
              Nuestra comunidad
            </p>
            <span className="mt-4 inline-block text-sm opacity-80 group-hover:opacity-100">
              Entrar →
            </span>
          </div>
        </Link>

      </div>
    </main>
  );
}
