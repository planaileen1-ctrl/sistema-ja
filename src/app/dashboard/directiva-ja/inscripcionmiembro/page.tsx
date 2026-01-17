"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  addDoc,
  onSnapshot,
  Timestamp,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Miembro = {
  id: string;
  nombre: string;
};

export default function InscripcionMiembroPage() {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [lider, setLider] = useState("");
  const [grupoId, setGrupoId] = useState<string | null>(null);

  const [miembro, setMiembro] = useState("");
  const [miembros, setMiembros] = useState<Miembro[]>([]);

  /* ======= CREAR GRUPO (UNA SOLA VEZ) ======= */
  const crearGrupo = async () => {
    if (!nombreGrupo || !lider) {
      alert("Ingresa nombre del grupo y líder");
      return;
    }

    const docRef = await addDoc(collection(db, "grupos_gp"), {
      nombreGrupo,
      lider,
      createdAt: Timestamp.now(),
    });

    setGrupoId(docRef.id);
  };

  /* ======= ESCUCHA MIEMBROS EN TIEMPO REAL ======= */
  useEffect(() => {
    if (!grupoId) return;

    const miembrosRef = collection(
      db,
      "grupos_gp",
      grupoId,
      "miembros"
    );

    const unsub = onSnapshot(miembrosRef, (snapshot) => {
      const data: Miembro[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre,
      }));
      setMiembros(data);
    });

    return () => unsub();
  }, [grupoId]);

  /* ======= AGREGAR MIEMBRO ======= */
  const agregarMiembro = async () => {
    if (!miembro || !grupoId) return;

    await addDoc(
      collection(db, "grupos_gp", grupoId, "miembros"),
      {
        nombre: miembro,
        createdAt: Timestamp.now(),
      }
    );

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
              {miembros.map((m, i) => (
                <li
                  key={m.id}
                  className="bg-slate-100 p-3 rounded-xl"
                >
                  {i + 1}. 👤 {m.nombre}
                </li>
              ))}
            </ul>
          </>
        )}

        <Link
          href="/dashboard/directiva-ja/menu"
          className="text-indigo-600 font-semibold hover:underline"
        >
          ← Volver al menú
        </Link>

      </div>
    </main>
  );
}
