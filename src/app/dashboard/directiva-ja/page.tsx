import Link from "next/link";

export default function DirectivaJAPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">

      {/* Volver al Dashboard */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-indigo-700 font-semibold hover:underline"
        >
          ← Volver al menú principal
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-10 text-gray-800">
        Panel Directiva JA
      </h1>

      <div className="grid gap-8 md:grid-cols-3">

        {/* Editar Grupos GP */}
        <Link href="/dashboard/directiva-ja/grupos">
          <div className="group cursor-pointer rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-xl transition hover:-translate-y-2 hover:shadow-2xl">
            <div className="mb-4 text-4xl">🗂️</div>
            <h2 className="text-2xl font-semibold mb-2">
              Editar Grupos GP
            </h2>
            <p className="text-blue-100">
              Crear, editar y organizar los Grupos Pequeños.
            </p>
            <span className="mt-4 inline-block text-sm opacity-80 group-hover:opacity-100">
              Entrar →
            </span>
          </div>
        </Link>

        {/* Calificar GP */}
        <Link href="/dashboard/directiva-ja/calificar">
          <div className="group cursor-pointer rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-xl transition hover:-translate-y-2 hover:shadow-2xl">
            <div className="mb-4 text-4xl">⭐</div>
            <h2 className="text-2xl font-semibold mb-2">
              Calificar GP
            </h2>
            <p className="text-emerald-100">
              Evaluar desempeño y asignar puntajes.
            </p>
            <span className="mt-4 inline-block text-sm opacity-80 group-hover:opacity-100">
              Entrar →
            </span>
          </div>
        </Link>

        {/* Puntajes Totales */}
        <Link href="/dashboard/directiva-ja/puntajes">
          <div className="group cursor-pointer rounded-3xl bg-gradient-to-br from-pink-500 to-orange-500 p-6 text-white shadow-xl transition hover:-translate-y-2 hover:shadow-2xl">
            <div className="mb-4 text-4xl">🏆</div>
            <h2 className="text-2xl font-semibold mb-2">
              Puntajes Totales
            </h2>
            <p className="text-pink-100">
              Ranking general y resultados finales.
            </p>
            <span className="mt-4 inline-block text-sm opacity-80 group-hover:opacity-100">
              Ver →
            </span>
          </div>
        </Link>

      </div>
    </main>
  );
}
