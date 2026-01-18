"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type RankingGP = {
  grupo: string;
  total: number;
};

type Nivel = {
  nombre: string;
  min: number;
  color: string;
};

const NIVELES: Nivel[] = [
  { nombre: "Bronce", min: 5000, color: "#cd7f32" },
  { nombre: "Cobre", min: 10000, color: "#b87333" },
  { nombre: "Plata", min: 15000, color: "#c0c0c0" },
  { nombre: "Oro", min: 20000, color: "#ffd700" },
];

export default function RankingGPPage() {
  const router = useRouter();
  const [ranking, setRanking] = useState<RankingGP[]>([]);
  const [loading, setLoading] = useState(true);

  const obtenerEstrellas = (total: number) =>
    NIVELES.filter((n) => total >= n.min);

  const obtenerProgreso = (total: number) => {
    const actual = [...NIVELES].reverse().find((n) => total >= n.min);
    const siguiente = NIVELES.find((n) => n.min > total);

    if (!siguiente) {
      return { porcentaje: 100, texto: "Nivel máximo alcanzado" };
    }

    const base = actual ? actual.min : 0;
    const porcentaje = ((total - base) / (siguiente.min - base)) * 100;

    return {
      porcentaje: Math.max(0, Math.min(100, porcentaje)),
      texto: `Progreso a ${siguiente.nombre}`,
    };
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
    return <div style={{ padding: 40, textAlign: "center" }}>⏳ Cargando ranking...</div>;
  }

  return (
    <main style={bg}>
      <div style={card}>
        <h1 style={title}>🏆 Ranking General GP</h1>

        {ranking.map((gp, index) => {
          const estrellas = obtenerEstrellas(gp.total);
          const progreso = obtenerProgreso(gp.total);

          return (
            <div key={gp.grupo} className="fila">
              <div className="posicion">{index + 1}</div>

              <div className="contenido">
                <div className="grupo">{gp.grupo}</div>
                <div className="puntaje">{gp.total} pts</div>

                <div className="estrellas">
                  {estrellas.map((e, i) => (
                    <div key={i} className="estrella">
                      <div style={{ background: e.color }}>★</div>
                      <small>{e.nombre}</small>
                    </div>
                  ))}
                </div>

                <div className="progreso">
                  <small>{progreso.texto}</small>
                  <div className="barra">
                    <div
                      className="barra-fill"
                      style={{ width: `${progreso.porcentaje}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <button onClick={() => router.push("/dashboard/directiva-ja/menu")} style={btn}>
          Volver al Menú
        </button>
      </div>

      {/* ESTILOS RESPONSIVE */}
      <style>{`
        .fila {
          display: flex;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid #eee;
        }

        .posicion {
          font-size: 22px;
          width: 40px;
          text-align: center;
          font-weight: bold;
        }

        .contenido {
          flex: 1;
        }

        .grupo {
          font-weight: 600;
        }

        .puntaje {
          margin-top: 4px;
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          background: #eef2ff;
          font-weight: 800;
          font-size: 13px;
        }

        .estrellas {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .estrella {
          text-align: center;
          animation: fadeIn 0.4s ease forwards;
        }

        .estrella div {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          color: #fff;
          font-weight: bold;
          line-height: 22px;
        }

        .estrella small {
          font-size: 10px;
        }

        .progreso {
          margin-top: 8px;
        }

        .barra {
          height: 6px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .barra-fill {
          height: 100%;
          background: #4f46e5;
          transition: width 0.4s ease;
        }

        @media (max-width: 640px) {
          .fila {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .posicion {
            width: auto;
          }

          .estrellas {
            justify-content: center;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  );
}

/* ========= ESTILOS BASE ========= */

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

const btn: React.CSSProperties = {
  marginTop: 20,
  width: "100%",
  padding: 14,
  borderRadius: 14,
  background: "#4f46e5",
  color: "#fff",
  cursor: "pointer",
};
