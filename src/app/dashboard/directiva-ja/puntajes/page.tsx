"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import React from "react";

/* ================= CONFIG ================= */

const criterios = [
  "Uniforme completo",
  "Puntual inicio del programa",
  "Ordenados",
  "Grupo completo",
];

// cada estrella = 5 puntos → total 100
const estrellasAPuntos = (e: number) => e * 5;

/* ========================================= */

export default function CalificarGP() {
  const router = useRouter();

  const [calificador, setCalificador] = useState("");
  const [grupo, setGrupo] = useState("");
  const [calificaciones, setCalificaciones] = useState<Record<string, number>>(
    {}
  );

  const [bloqueado, setBloqueado] = useState(false);
  const [pinIngresado, setPinIngresado] = useState("");
  const [pinCorrecto, setPinCorrecto] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);

  const fecha = new Date().toISOString().split("T")[0];
  const hora = new Date().toLocaleTimeString();

  /* ======= cargar PIN desde Firebase ======= */
  useEffect(() => {
    const cargarPin = async () => {
      const ref = doc(db, "configuracion", "seguridad");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setPinCorrecto(snap.data().pinDirectora);
      }
    };

    cargarPin();
  }, []);

  const seleccionarEstrella = (criterio: string, valor: number) => {
    if (bloqueado) return;

    setCalificaciones((prev) => ({
      ...prev,
      [criterio]: valor,
    }));
  };

  const totalPuntos = Object.values(calificaciones).reduce(
    (acc, e) => acc + estrellasAPuntos(e),
    0
  );

  const yaFueCalificado = async () => {
    const q = query(
      collection(db, "calificaciones_gp"),
      where("grupo", "==", grupo),
      where("fecha", "==", fecha)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      setBloqueado(true);
      return true;
    }
    return false;
  };

  const guardarCalificacion = async () => {
    if (!calificador || !grupo) {
      alert("Completa todos los campos");
      return;
    }

    if (Object.keys(calificaciones).length !== criterios.length) {
      alert("Califica todos los criterios");
      return;
    }

    if (!bloqueado) {
      const existe = await yaFueCalificado();
      if (existe) return;
    }

    await addDoc(collection(db, "calificaciones_gp"), {
      calificador,
      grupo,
      criterios: calificaciones,
      total: totalPuntos,
      fecha,
      hora,
      createdAt: Timestamp.now(),
    });

    setGuardado(true);
    setBloqueado(false);
  };

  const autorizarPin = () => {
    if (pinIngresado === pinCorrecto) {
      setBloqueado(false);
      setPinIngresado("");
      alert("PIN correcto. Puedes calificar nuevamente.");
    } else {
      alert("PIN incorrecto");
    }
  };

  return (
    <main style={bg}>
      <div style={card}>
        <h1 style={title}>Hoja de Calificación GP</h1>

        <input
          placeholder="Nombre del calificador"
          value={calificador}
          onChange={(e) => setCalificador(e.target.value)}
          style={input}
        />

        <input
          placeholder="Nombre del Grupo Pequeño"
          value={grupo}
          onChange={(e) => setGrupo(e.target.value)}
          style={input}
        />

        <div style={meta}>
          <span>📅 {fecha}</span>
          <span>⏰ {hora}</span>
        </div>

        {bloqueado && (
          <div style={bloque}>
            <strong>🔒 Este GP ya fue calificado hoy</strong>

            <input
              type="password"
              maxLength={4}
              placeholder="PIN directora"
              value={pinIngresado}
              onChange={(e) => setPinIngresado(e.target.value)}
              style={input}
            />

            <button onClick={autorizarPin} style={btnDanger}>
              Autorizar nueva calificación
            </button>
          </div>
        )}

        {criterios.map((criterio) => (
          <div key={criterio} style={criterioBox}>
            <strong>{criterio}</strong>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              {[1, 2, 3, 4, 5].map((n) => {
                const activa = n <= (calificaciones[criterio] || 0);

                return (
                  <button
                    key={n}
                    onClick={() => seleccionarEstrella(criterio, n)}
                    style={{
                      ...estrella,
                      color: activa ? "#facc15" : "#d1d5db",
                      transform: activa ? "scale(1.25)" : "scale(1)",
                    }}
                  >
                    ★
                  </button>
                );
              })}
            </div>

            <small>Puntaje: {(calificaciones[criterio] || 0) * 5} / 25</small>
          </div>
        ))}

        <h2 style={total}>Total: {totalPuntos} / 100</h2>

        {guardado && <div style={ok}>✅ Calificación guardada</div>}

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={guardarCalificacion} style={btnPrimary}>
            Guardar
          </button>
          <button
            onClick={() => router.push("/dashboard/directiva-ja/menu")}
            style={btnSec}
          >
            Volver
          </button>
        </div>
      </div>
    </main>
  );
}

/* ========= ESTILOS TIPADOS ========= */

const bg: React.CSSProperties = {
  minHeight: "100vh",
  padding: 24,
  background: "linear-gradient(135deg,#e0e7ff,#f5e8ff)",
};

const card: React.CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  background: "#fff",
  padding: 32,
  borderRadius: 24,
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
};

const title: React.CSSProperties = {
  textAlign: "center",
  fontSize: 26,
  marginBottom: 20,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  marginBottom: 10,
  border: "1px solid #ddd",
};

const meta: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 13,
  opacity: 0.6,
  marginBottom: 16,
};

const criterioBox: React.CSSProperties = {
  border: "1px solid #eee",
  padding: 16,
  borderRadius: 16,
  marginBottom: 14,
};

const estrella: React.CSSProperties = {
  fontSize: 38,
  background: "none",
  border: "none",
  cursor: "pointer",
  transition: "all .15s ease",
};

const total: React.CSSProperties = {
  textAlign: "center",
  margin: "20px 0",
};

const btnPrimary: React.CSSProperties = {
  flex: 1,
  background: "#4f46e5",
  color: "#fff",
  padding: 14,
  borderRadius: 14,
  border: "none",
};

const btnSec: React.CSSProperties = {
  flex: 1,
  background: "#e5e7eb",
  padding: 14,
  borderRadius: 14,
  border: "none",
};

const btnDanger: React.CSSProperties = {
  background: "#dc2626",
  color: "#fff",
  padding: 12,
  borderRadius: 12,
  width: "100%",
  border: "none",
};

const bloque: React.CSSProperties = {
  background: "#fff3cd",
  padding: 16,
  borderRadius: 16,
  marginBottom: 16,
};

const ok: React.CSSProperties = {
  background: "#dcfce7",
  padding: 12,
  borderRadius: 12,
  textAlign: "center",
};
