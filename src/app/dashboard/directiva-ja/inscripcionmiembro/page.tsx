"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ===== TIPOS ===== */
type Miembro = {
  nombre: string;
};

export default function InscripcionMiembroPage() {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [lider, setLider] = useState("");
  const [grupoId, setGrupoId] = useState<string | null>(null);

  const [miembro, setMiembro] = useState("");
  const [miembros, setMiembros] = useState<Miembro[]>([]);

  /* ===== CREAR GRUPO (UNA SOLA VEZ) ===== */
  const crearGrupo = async () => {
    if (!nombreGrupo.trim() || !lider.trim()) {
      alert("Ingresa nombre del grupo y líder");
      return;
    }

    const docRef = await addDoc(collection(db, "grupos_gp"), {
      nombreGrupo: nombreGrupo.trim(),
      lider: lider.trim(),
      miembros: [],
      createdAt: Timestamp.now(),
    });

    setGrupoId(docRef.id);
  };

  /* ===== AGREGAR MIEMBRO ===== */
  const agregarMiembro = async () => {
    if (!miembro.trim() || !grupoId) return;

    const nuevosMiembros = [...miembros, { nombre: miembro.trim() }];

    await updateDoc(doc(db, "grupos_gp", grupoId), {
      miembros: nuevosMiembros,
    });

    setMiembros(nuevosMiembros);
    setMiembro("");
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur p-8 rounded-3xl shadow-2xl">

        {/* ===== TÍTULO ===== */}
        <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">
          📝 Inscripción de Miembros GP
        </h1>

        {/* ===== CREAR GRUPO ===== */}
        {!grupoId && (
          <div className="space-y-4">
            <input
              placeholder="Nombre del Grupo Pequeño"
              value={nombreGrupo}
              onChange={(e) => setNombreGrupo(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              placeholder="Nombre del Líder"
              value={lider}
              onChange={(e) => setLider(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={crearGrupo}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.01] transition"
            >
              Crear grupo
            </button>
          </div>
        )}

        {/* ===== AGREGAR MIEMBROS ===== */}
        {grupoId && (
          <>
            <div className="mb-6 text-center">
              <div className="text-sm text-slate-500">
                Grupo creado
              </div>
              <div className="text-xl font-bold text-indigo-700">
                {nombreGrupo}
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <input
                placeholder="Nombre del miembro"
                value={miembro}
                onChange={(e) => setMiembro(e.target.value)}
                className="flex-1 p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={agregarMiembro}
                className="bg-indigo-600 text-white px-6 rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
              >
                Agregar
              </button>
            </div>

            <ul className="space-y-3 mb-8">
              {miembros.length === 0 && (
                <li className="text-slate-500 text-center">
                  Aún no hay miembros registrados
                </li>
              )}

              {miembros.map((m, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-4 rounded-xl shadow-sm"
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                    {i + 1}
                  </span>
                  <span className="font-medium text-slate-700">
                    {m.nombre}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* ===== VOLVER ===== */}
        <div className="text-center">
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
