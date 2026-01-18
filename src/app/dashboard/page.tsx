import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <h1 className="text-4xl font-bold mb-12 text-gray-800 text-center">
        IGLESIA FLORIDA NORTE - MENÚ PRINCIPAL
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {/* Directiva JA → LOGIN OBLIGATORIO */}
        <Link href="/login">
          <div className="group relative cursor-pointer rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105">
            <div className="mb-4 text-5xl text-center">🏛️</div>
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Directiva JA
            </h2>
            <p className="text-indigo-100 text-center text-sm">
              Gestión y liderazgo de Jóvenes Adventistas.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold opacity-80 group-hover:opacity-100 text-center">
              Entrar →
            </span>
          </div>
        </Link>

        {/* Inscripcion miembro GP */}
        <Link href="/dashboard/directiva-ja/inscripcionmiembro">
          <div className="group relative cursor-pointer rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 p-6 text-white shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105">
            <div className="mb-4 text-5xl text-center">🧭</div>
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Crear GP y miembros
            </h2>
            <p className="text-emerald-100 text-center text-sm">
              Registro y crecimiento de la comunidad.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold opacity-80 group-hover:opacity-100 text-center">
              Entrar →
            </span>
          </div>
        </Link>

        {/* Miembros GP */}
        <Link href="/dashboard/directiva-ja/miembros">
          <div className="group relative cursor-pointer rounded-3xl bg-gradient-to-br from-pink-500 to-orange-500 p-6 text-white shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105">
            <div className="mb-4 text-5xl text-center">👥</div>
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Miembros GP
            </h2>
            <p className="text-pink-100 text-center text-sm">
              Nuestra comunidad
            </p>
            <span className="mt-4 inline-block text-sm font-semibold opacity-80 group-hover:opacity-100 text-center">
              Entrar →
            </span>
          </div>
        </Link>

        {/* Materiales y Recursos JA */}
        <Link href="/dashboard/directiva-ja/materiales-recursos">
          <div className="group relative cursor-pointer rounded-3xl bg-gradient-to-br from-cyan-500 to-sky-600 p-6 text-white shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105">
            <div className="mb-4 text-5xl text-center">📚</div>
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Materiales y Recursos JA
            </h2>
            <p className="text-cyan-100 text-center text-sm">
              Manuales, guías, programas y recursos oficiales.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold opacity-80 group-hover:opacity-100 text-center">
              Entrar →
            </span>
          </div>
        </Link>

      </div>
    </main>
  );
}
