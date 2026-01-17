"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MenuDirectivaJA() {
  const router = useRouter();

  const cards = [
    {
      title: "Editar GP",
      desc: "Crear, editar y organizar Grupos Pequeños",
      icon: "🛠️",
      gradient: "from-indigo-500 to-purple-600",
      path: "/dashboard/directiva-ja/editar-grupos",
    },
    {
      title: "Calificar GP",
      desc: "Asignar y modificar puntajes por actividad",
      icon: "📊",
      gradient: "from-emerald-500 to-green-600",
      path: "/dashboard/directiva-ja/puntajes",
    },
    {
      title: "GP Ganadores",
      desc: "Ver rankings y GP destacados",
      icon: "🏆",
      gradient: "from-pink-500 to-orange-500",
      path: "/dashboard/directiva-ja/ranking",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">

      {/* Link de regreso al dashboard */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-indigo-700 font-semibold hover:underline"
        >
          ← Volver al menú principal
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-10 text-gray-800">
        Menú Directiva JA
      </h1>

      <div className="grid gap-8 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => router.push(card.path)}
            className={`group cursor-pointer rounded-3xl bg-gradient-to-br ${card.gradient} p-6 text-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl`}
          >
            <div className="mb-4 text-5xl">{card.icon}</div>

            <h2 className="text-2xl font-semibold mb-2">
              {card.title}
            </h2>

            <p className="text-white/80">
              {card.desc}
            </p>

            <span className="mt-4 inline-block text-sm opacity-80 group-hover:opacity-100">
              Entrar →
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
