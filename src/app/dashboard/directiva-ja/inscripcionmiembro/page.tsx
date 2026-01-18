"use client";

import { useState } from "react";
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
  fechaNacimiento: Timestamp;
  edad: number;
  sexo: "Hombre" | "Mujer";
};

export default function InscripcionMiembroPage() {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [lider, setLider] = useState("");
  const [grupoId, setGrupoId] = useState<string | null>(null);

  const [miembro, setMiembro] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");
  const [sexo, setSexo] = useState<"Hombre" | "Mujer" | "">("");
  const [edad, setEdad] = useState<number | null>(null);

  const [miembros, setMiembros] = useState<Miembro[]>([]);

  /* ===== HELPERS ===== */
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const anioActual = new Date().getFullYear();
  const anios = Array.from({ length: 90 }, (_, i) => anioActual - i);

  /* ===== CALCULAR EDAD ===== */
  const calcularEdad = (d: number, m: number, a: number) => {
    const hoy = new Date();
    let e = hoy.getFullYear() - a;
    const mesDiff = hoy.getMonth() + 1 - m;

    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < d)) {
      e--;
    }
    return e;
  };

  /* ===== MANEJAR CAMBIO FECHA ===== */
  const actualizarEdad = (d: string, m: string, a: string) => {
    if (d && m && a) {
      const e = calcularEdad(Number(d), Number(m), Number(a));
      setEdad(e);
    }
  };

  /* ===== CREAR GRUPO ===== */
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
    if (
      !miembro.trim() ||
      !dia ||
      !mes ||
      !anio ||
      !sexo ||
      edad === null ||
      !grupoId
    )
      return;

    const fecha = new Date(
      Number(anio),
      Number(mes) - 1,
      Number(dia)
    );

    const nuevosMiembros: Miembro[] = [
      ...miembros,
      {
        nombre: miembro.trim(),
        fechaNacimiento: Timestamp.fromDate(fecha),
        edad,
        sexo,
      },
    ];

    await updateDoc(doc(db, "grupos_gp", grupoId), {
      miembros: nuevosMiembros,
    });

    setMiembros(nuevosMiembros);
    setMiembro("");
    setDia("");
    setMes("");
    setAnio("");
    setSexo("");
    setEdad(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-6">
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur p-8 rounded-3xl shadow-2xl">

        <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700">
          📝 Inscripción de Miembros GP
        </h1>

        {/* ===== CREAR GRUPO ===== */}
        {!grupoId && (
          <div className="space-y-4">
            <input
              placeholder="Nombre del Grupo Pequeño"
              value={nombreGrupo}
              onChange={(e) => setNombreGrupo(e.target.value)}
              className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-indigo-500"
            />

            <input
              placeholder="Nombre del Líder"
              value={lider}
              onChange={(e) => setLider(e.target.value)}
              className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={crearGrupo}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg hover:scale-[1.01] transition"
            >
              Crear grupo
            </button>
          </div>
        )}

        {/* ===== AGREGAR MIEMBROS ===== */}
        {grupoId && (
          <>
            <div className="mb-6 text-center">
              <div className="text-xl font-bold text-indigo-700">
                {nombreGrupo}
              </div>
            </div>

            <input
              placeholder="Nombre y apellido del miembro"
              value={miembro}
              onChange={(e) => setMiembro(e.target.value)}
              className="w-full p-4 mb-4 rounded-xl border focus:ring-2 focus:ring-indigo-500"
            />

            {/* ===== SEXO ===== */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => setSexo("Hombre")}
                className={`p-4 rounded-xl font-bold ${
                  sexo === "Hombre"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                ♂ Hombre
              </button>

              <button
                onClick={() => setSexo("Mujer")}
                className={`p-4 rounded-xl font-bold ${
                  sexo === "Mujer"
                    ? "bg-pink-600 text-white"
                    : "bg-pink-100 text-pink-700"
                }`}
              >
                ♀ Mujer
              </button>
            </div>

            {/* ===== FECHA ===== */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <select
                value={dia}
                onChange={(e) => {
                  setDia(e.target.value);
                  actualizarEdad(e.target.value, mes, anio);
                }}
                className="p-3 rounded-xl border"
              >
                <option value="">Día</option>
                {dias.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={mes}
                onChange={(e) => {
                  setMes(e.target.value);
                  actualizarEdad(dia, e.target.value, anio);
                }}
                className="p-3 rounded-xl border"
              >
                <option value="">Mes</option>
                {meses.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={anio}
                onChange={(e) => {
                  setAnio(e.target.value);
                  actualizarEdad(dia, mes, e.target.value);
                }}
                className="p-3 rounded-xl border"
              >
                <option value="">Año</option>
                {anios.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* ===== EDAD ===== */}
            {edad !== null && (
              <div className="mb-4 text-center text-lg font-bold text-indigo-700">
                🎂 Edad: {edad} años
              </div>
            )}

            <button
              onClick={agregarMiembro}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold mb-6 shadow-lg"
            >
              Agregar miembro
            </button>

            {/* ===== LISTA ===== */}
            <ul className="space-y-3">
              {miembros.map((m, i) => (
                <li
                  key={i}
                  className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border"
                >
                  <div className="font-bold text-indigo-700">
                    {m.nombre}
                  </div>
                  <div className="text-sm text-slate-600">
                    {m.sexo} · {m.edad} años
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="text-center mt-8">
          <Link
            href="/dashboard"
            className="text-indigo-700 font-bold hover:underline"
          >
            ← Volver al menú
          </Link>
        </div>

      </div>
    </main>
  );
}
