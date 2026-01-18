"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ===== TIPOS ===== */
type Miembro = {
  nombre: string;
};

type Grupo = {
  id: string;
  nombreGrupo: string;
  lider: string;
  miembros: Miembro[];
};

export default function VerMiembrosGP() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoActivo, setGrupoActivo] = useState<Grupo | null>(null);
  const [totalMiembros, setTotalMiembros] = useState(0);

  /* ======= GRUPOS + MIEMBROS EN TIEMPO REAL ======= */
  useEffect(() => {
    const q = query(collection(db, "grupos_gp"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data: Grupo[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          nombreGrupo: d.nombreGrupo,
          lider: d.lider,
          miembros: d.miembros || [],
        };
      });

      setGrupos(data);

      const total = data.reduce(
        (acc, g) => acc + (g.miembros?.length || 0),
        0
      );
      setTotalMiembros(total);

      if (grupoActivo) {
        const actualizado = data.find((g) => g.id === grupoActivo.id);
        setGrupoActivo(actualizado || null);
      }
    });

    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur p-8 rounded-3xl shadow-2xl">

        {/* ===== TÍTULO ===== */}
        <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">
          👥 Miembros por Grupo Pequeño
        </h1>

        {/* ======= TOTALES ======= */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="bg-indigo-600 text-white rounded-2xl p-4 text-center shadow">
            <div className="text-sm opacity-80">Total Grupos</div>
            <div className="text-3xl font-bold">{grupos.length}</div>
          </div>

          <div className="bg-pink-500 text-white rounded-2xl p-4 text-center shadow">
            <div className="text-sm opacity-80">Total Miembros</div>
            <div className="text-3xl font-bold">{totalMiembros}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* ======= LISTA DE GRUPOS ======= */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              📌 Grupos inscritos
            </h2>

            {grupos.length === 0 && (
              <p className="text-gray-500">
                No hay grupos registrados
              </p>
            )}

            <ul className="space-y-4">
              {grupos.map((grupo) => {
                const activo = grupoActivo?.id === grupo.id;

                return (
                  <li
                    key={grupo.id}
                    onClick={() => setGrupoActivo(grupo)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 shadow
                      ${
                        activo
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-[1.02]"
                          : "bg-white hover:shadow-lg hover:-translate-y-0.5"
                      }
                    `}
                  >
                    <div className="text-lg font-bold">
                      {grupo.nombreGrupo}
                    </div>

                    <div className={`text-sm mt-1 ${activo ? "opacity-90" : "text-gray-600"}`}>
                      👤 Líder: {grupo.lider}
                    </div>

                    <div className={`text-sm mt-1 ${activo ? "opacity-90" : "text-gray-600"}`}>
                      👥 Miembros: {grupo.miembros.length}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ======= MIEMBROS ======= */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              📋 Miembros
            </h2>

            {!grupoActivo && (
              <p className="text-gray-500">
                Selecciona un grupo para ver sus miembros
              </p>
            )}

            {grupoActivo && grupoActivo.miembros.length === 0 && (
              <p className="text-gray-500">
                Este grupo no tiene miembros
              </p>
            )}

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {grupoActivo?.miembros.map((m, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 p-3 rounded-xl shadow-sm"
                >
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="font-medium text-gray-700">
                    {m.nombre}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ======= VOLVER ======= */}
        <div className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-indigo-700 font-bold hover:underline"
          >
            ← Volver al menú
          </Link>
        </div>

      </div>
    </main>
  );
}
