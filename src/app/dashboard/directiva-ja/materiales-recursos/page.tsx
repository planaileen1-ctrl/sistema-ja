import Link from "next/link";

export default function MaterialesRecursosPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-sky-100 to-cyan-200 p-8">
      <div className="max-w-5xl mx-auto">

        {/* TÍTULO */}
        <h1 className="text-4xl font-bold mb-4 text-slate-800 text-center">
          📚 Materiales y Recursos JA
        </h1>

        <p className="text-center text-slate-600 mb-10">
          Recursos oficiales para fortalecer el Ministerio Joven
        </p>

        {/* GRID DE TARJETAS */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">

          {/* TARJETAS OFICIALES */}

          <Link href="/dashboard/directiva-ja/materiales-recursos/manual-ministerio-joven">
            <div className="group cursor-pointer rounded-3xl bg-linear-to-br from-indigo-500 to-blue-600 p-6 text-white shadow-xl transition hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-4 text-5xl">📘</div>
              <h2 className="text-2xl font-semibold mb-2">
                Manual del Ministerio Joven
              </h2>
              <p className="text-indigo-100 text-sm">
                Lineamientos, estructura y fundamentos oficiales del Ministerio Joven.
              </p>
              <span className="mt-6 inline-block text-sm font-semibold opacity-80 group-hover:opacity-100">
                Ver manual →
              </span>
            </div>
          </Link>

          <Link href="/dashboard/directiva-ja/materiales-recursos/accion-joven">
            <div className="group cursor-pointer rounded-3xl bg-linear-to-br from-green-500 to-emerald-600 p-6 text-white shadow-xl transition hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-4 text-5xl">📰</div>
              <h2 className="text-2xl font-semibold mb-2">
                Revista Acción Joven
              </h2>
              <p className="text-green-100 text-sm">
                Accede a la revista oficial del Ministerio Joven, con artículos y recursos actualizados.
              </p>
              <span className="mt-6 inline-block text-sm font-semibold opacity-80 group-hover:opacity-100">
                Ver revista →
              </span>
            </div>
          </Link>

          {/* TARJETAS FUTURAS */}

          <div className="rounded-3xl bg-white/60 p-6 text-slate-600 shadow-inner">
            <div className="mb-4 text-5xl">🗓️</div>
            <h2 className="text-xl font-semibold mb-2">
              Programas JA
            </h2>
            <p className="text-sm">
              Descubre los programas y actividades oficiales para fortalecer el Ministerio Joven. Próximamente disponibles.
            </p>
          </div>

          <div className="rounded-3xl bg-white/60 p-6 text-slate-600 shadow-inner">
            <div className="mb-4 text-5xl">🎓</div>
            <h2 className="text-xl font-semibold mb-2">
              Capacitaciones
            </h2>
            <p className="text-sm">
              Cursos y talleres para líderes y jóvenes del ministerio. Próximamente disponibles.
            </p>
          </div>

        </div>

        {/* VOLVER */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline"
          >
            ← Volver al Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}
