"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Grupo = {
  id: string;
  nombreGrupo: string;
  lider: string;
};

type Miembro = {
  id: string;
  nombre: string;
};

export default function VerMiembrosGP() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoActivo, setGrupoActivo] = useState<Grupo | null>(null);
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [totalMiembros, setTotalMiembros] = useState(0);

  /* ======= GRUPOS EN TIEMPO REAL ======= */
  useEffect(() => {
    const q = query(collection(db, "grupos_gp"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data: Grupo[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Grupo, "id">),
      }));
      setGrupos(data);
    });

    return () => unsub();
  }, []);

  /* ======= MIEMBROS DEL GRUPO SELECCIONADO ======= */
  useEffect(() => {
    if (!grupoActivo) return;

    const miembrosRef = collection(db, "grupos_gp", grupoActivo.id, "miembros");

    const unsub = onSnapshot(miembrosRef, (snapshot) => {
      const data: Miembro[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre,
      }));
      setMiembros(data);
    });

    return () => unsub();
  }, [grupoActivo]);

  /* ======= TOTAL DE MIEMBROS ======= */
  useEffect(() => {
    if (grupos.length === 0) {
      setTotalMiembros(0);
      return;
    }

    const unsubList: (() => void)[] = [];
    let total = 0;

    grupos.forEach((g) => {
      const ref = collection(db, "grupos_gp", g.id, "miembros");
      const unsub = onSnapshot(ref, (snapshot) => {
        total += snapshot.size;
        setTotalMiembros((prev) => prev + snapshot.size);
      });
      unsubList.push(unsub);
    });

    return () => unsubList.forEach((u) => u());
  }, [grupos]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Miembros por Grupo Pequeño
        </h1>

        {/* ======= TOTALES ======= */}
        <div className="mb-6 flex justify-between text-gray-700 font-semibold">
          <div>Total Grupos: {grupos.length}</div>
          <div>Total Miembros: {totalMiembros}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ======= LISTA DE GRUPOS ======= */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Grupos inscritos
            </h2>

            {grupos.length === 0 && (
              <p className="text-gray-500">
                No hay grupos registrados
              </p>
            )}

            <ul className="space-y-3">
              {grupos.map((grupo) => (
                <li
                  key={grupo.id}
                  onClick={() => setGrupoActivo(grupo)}
                  className={`p-4 rounded-xl cursor-pointer transition
                    ${
                      grupoActivo?.id === grupo.id
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 hover:bg-slate-200"
                    }
                  `}
                >
                  <strong>{grupo.nombreGrupo}</strong>
                  <p className="text-sm opacity-80">
                    Líder: {grupo.lider}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* ======= MIEMBROS ======= */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Miembros
            </h2>

            {!grupoActivo && (
              <p className="text-gray-500">
                Selecciona un grupo
              </p>
            )}

            {grupoActivo && miembros.length === 0 && (
              <p className="text-gray-500">
                Este grupo no tiene miembros
              </p>
            )}

            <ul className="space-y-2">
              {miembros.map((m, i) => (
                <li
                  key={m.id}
                  className="bg-slate-100 p-3 rounded-xl"
                >
                  {i + 1}. 👤 {m.nombre}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ======= VOLVER ======= */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard/directiva-ja/menu"
            className="text-indigo-600 font-semibold hover:underline"
          >
            ← Volver al menú
          </Link>
        </div>

      </div>
    </main>
  );
}
