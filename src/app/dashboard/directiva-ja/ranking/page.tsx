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

  // Calcular estrellas con color según puntos
  const obtenerEstrellas = (total: number) => {
    const estrellas: { color: string; label: string }[] = [];
    if (total >= 5000) estrellas.push({ color: "#cd7f32", label: "Bronce" }); // bronce
    if (total >= 10000) estrellas.push({ color: "#b87333", label: "Cobre" }); // cobre
    if (total >= 15000) estrellas.push({ color: "#c0c0c0", label: "Plata" }); // plata
    if (total >= 20000) estrellas.push({ color: "#ffd700", label: "Oro" }); // oro
    return estrellas;
  };

  useEffect(() => {
    const cargarRanking = async () => {
      const q = query(collection(db, "evaluaciones_gp"));
      const snap = await getDocs(q);

      const acumulado: Record<string, number> = {};

      snap.forEach((doc) => {
        const data = doc.data();
        const grupo = data.grupoEvaluado;
        const total = data.totalPuntos || 0;

        if (!acumulado[grupo]) acumulado[grupo] = 0;
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
            Aún no hay evaluaciones registradas
          </p>
        )}

        {ranking.map((gp, index) => {
          const estrellas = obtenerEstrellas(gp.total);

          return (
            <div key={gp.grupo} style={fila}>
              <span style={posicion}>
                {index + 1}
              </span>

              <span style={grupo}>{gp.grupo}</span>
              <span style={puntaje}>{gp.total} pts</span>

              {/* Estrellas de colores */}
              <span style={{ display: "flex", gap: 4, marginLeft: 10 }}>
                {estrellas.map((e, i) => (
                  <span
                    key={i}
                    title={e.label}
                    style={{
                      display: "inline-block",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: e.color,
                      textAlign: "center",
                      color: "#fff",
                      fontWeight: "bold",
                      lineHeight: "20px",
                      fontSize: 14,
                    }}
                  >
                    ★
                  </span>
                ))}
              </span>
            </div>
          );
        })}

        <button
          onClick={() => router.push("/dashboard/directiva-ja/menu")}
          style={btn}
        >
          Volver al Menú
        </button>
      </div>
    </main>
  );
}

/* ========= ESTILOS ========= */

const bg: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#fef3c7,#fde68a)",
  padding: 24,
};

const card: React.CSSProperties = {
  maxWidth: 700,
  margin: "0 auto",
  background: "#fff",
  padding: 28,
  borderRadius: 24,
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
};

const title: React.CSSProperties = {
  textAlign: "center",
  fontSize: 26,
  marginBottom: 20,
};

const fila: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 16px",
  borderBottom: "1px solid #eee",
};

const posicion: React.CSSProperties = { fontSize: 22, width: 40 };
const grupo: React.CSSProperties = { fontWeight: 600 };
const puntaje: React.CSSProperties = { fontWeight: 700 };

const btn: React.CSSProperties = {
  marginTop: 20,
  width: "100%",
  padding: 14,
  borderRadius: 14,
  background: "#4f46e5",
  color: "#fff",
  cursor: "pointer",
};
