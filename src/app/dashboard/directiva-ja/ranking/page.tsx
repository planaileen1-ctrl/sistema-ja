"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type RankingGP = {
  grupo: string;
  total: number;
};

export default function RankingGPPage() {
  const router = useRouter();
  const [ranking, setRanking] = useState<RankingGP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarRanking = async () => {
      const q = query(collection(db, "calificaciones_gp"));
      const snap = await getDocs(q);

      const acumulado: Record<string, number> = {};

      snap.forEach((doc) => {
        const data = doc.data();
        const grupo = data.grupo;
        const total = data.total || 0;

        if (!acumulado[grupo]) {
          acumulado[grupo] = 0;
        }

        acumulado[grupo] += total;
      });

      const resultado: RankingGP[] = Object.entries(acumulado)
        .map(([grupo, total]) => ({ grupo, total }))
        .sort((a, b) => b.total - a.total);

      setRanking(resultado);
      setLoading(false);
    };

    cargarRanking();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        ⏳ Cargando ranking...
      </div>
    );
  }

  return (
    <main style={bg}>
      <div style={card}>
        <h1 style={title}>🏆 Ranking General GP</h1>

        {ranking.length === 0 && (
          <p style={{ textAlign: "center" }}>
            Aún no hay calificaciones registradas
          </p>
        )}

        {ranking.map((gp, index) => (
          <div key={gp.grupo} style={fila}>
            <span style={posicion}>
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
              {index > 2 && index + 1}
            </span>

            <span style={grupo}>{gp.grupo}</span>
            <span style={puntaje}>{gp.total} pts</span>
          </div>
        ))}

        <button onClick={() => router.back()} style={btn}>
          Volver
        </button>
      </div>
    </main>
  );
}

/* ========= ESTILOS ========= */

const bg = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#fef3c7,#fde68a)",
  padding: 24,
};

const card = {
  maxWidth: 600,
  margin: "0 auto",
  background: "#fff",
  padding: 28,
  borderRadius: 24,
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
};

const title = {
  textAlign: "center" as const,
  fontSize: 26,
  marginBottom: 20,
};

const fila = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 16px",
  borderBottom: "1px solid #eee",
};

const posicion = { fontSize: 22, width: 40 };
const grupo = { fontWeight: 600 };
const puntaje = { fontWeight: 700 };

const btn = {
  marginTop: 20,
  width: "100%",
  padding: 14,
  borderRadius: 14,
  background: "#4f46e5",
  color: "#fff",
};
