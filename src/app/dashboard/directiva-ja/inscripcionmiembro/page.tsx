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
      miembros: [], // 👈 CLAVE
      createdAt: Timestamp.now(),
    });

    setGrupoId(docRef.id);
  };

  /* ===== AGREGAR MIEMBRO ===== */
  const agregarMiembro = async () => {
    if (!miembro.trim() || !grupoId) return;

    const nuevosMiembros = [
      ...miembros,
      { nombre: miembro.trim() },
    ];

    await updateDoc(doc(db, "grupos_gp", grupoId), {
      miembros: nuevosMiembros,
    });

    setMiembros(nuevosMiembros);
    setMiembro("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Inscripción de Miembros GP
        </h1>

        {!grupoId && (
          <>
            <input
              placeholder="Nombre del Grupo Pequeño"
              value={nombreGrupo}
              onChange={(e) => setNombreGrupo(e.target.value)}
              className="w-full mb-4 p-3 border rounded-xl"
            />

            <input
              placeholder="Nombre del Líder"
              value={lider}
              onChange={(e) => setLider(e.target.value)}
              className="w-full mb-4 p-3 border rounded-xl"
            />

            <button
              onClick={crearGrupo}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl"
            >
              Crear grupo
            </button>
          </>
        )}

        {grupoId && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Grupo: {nombreGrupo}
            </h2>

            <div className="flex gap-2 mb-6">
              <input
                placeholder="Nombre del miembro"
                value={miembro}
                onChange={(e) => setMiembro(e.target.value)}
                className="flex-1 p-3 border rounded-xl"
              />
              <button
                onClick={agregarMiembro}
                className="bg-indigo-600 text-white px-6 rounded-xl"
              >
                Agregar
              </button>
            </div>

            <ul className="space-y-2 mb-6">
              {miembros.length === 0 && (
                <li className="text-slate-500">
                  Aún no hay miembros registrados
                </li>
              )}

              {miembros.map((m, i) => (
                <li
                  key={i}
                  className="bg-slate-100 p-3 rounded-xl"
                >
                  {i + 1}. 👤 {m.nombre}
                </li>
              ))}
            </ul>
          </>
        )}

        <Link
          href="/dashboard"
          className="text-indigo-600 font-semibold hover:underline"
        >
          ← Volver al menú
        </Link>

      </div>
    </main>
  );
}
