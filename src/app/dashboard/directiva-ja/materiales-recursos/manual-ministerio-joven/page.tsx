"use client";

import Link from "next/link";

export default function ManualMinisterioJovenPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            📘 Manual del Ministerio Joven
          </h1>

          <Link
            href="/dashboard/directiva-ja/materiales-recursos"
            className="text-indigo-600 font-semibold hover:underline"
          >
            ← Volver a Materiales
          </Link>
        </div>

        {/* VISOR PDF */}
        <div className="w-full h-[75vh]">
          <iframe
            src="/Manual-Del-Ministerio-Joven-ESP-SUDAMERICA.pdf"
            className="w-full h-full border-none"
          />
        </div>

        {/* DESCARGA */}
        <div className="p-4 text-center bg-slate-50">
          <a
            href="/Manual-Del-Ministerio-Joven-ESP-SUDAMERICA.pdf"
            download
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:bg-indigo-700 transition"
          >
            ⬇️ Descargar Manual
          </a>
        </div>

      </div>
    </main>
  );
}
