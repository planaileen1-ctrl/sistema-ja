"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

/* ========= INTERFACES ========= */

interface Invitado {
  nombre: string;
  edad: number | null;
}

interface Grupo {
  id: string;
  nombreGrupo: string;
  lider: string;
}

/* ========= COMPONENTE ========= */

export default function EvaluacionGP() {
  const router = useRouter();

  // Datos fijos
  const [calificador, setCalificador] = useState("");
  const [grupoPertenece, setGrupoPertenece] = useState("");

  // Grupo evaluado
  const [grupoEvaluado, setGrupoEvaluado] = useState("");

  // Grupos cargados desde Firebase (SIN DEDUPLICAR)
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  // Criterios
  const [puntosAsistencia, setPuntosAsistencia] = useState(0);
  const [puntosPresentacion, setPuntosPresentacion] = useState(0);

  // Invitados
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [nombreInvitado, setNombreInvitado] = useState("");
  const [edadInvitado, setEdadInvitado] = useState("");

  const [guardado, setGuardado] = useState(false);

  // Fecha y hora
  const fecha = new Date().toISOString().split("T")[0];
  const hora = new Date().toLocaleTimeString();

  /* ========= FUNCIONES ========= */

  // 🔥 CARGAR GRUPOS (MOSTRAR TODOS)
  const cargarGrupos = async () => {
    try {
      const snapshot = await getDocs(collection(db, "grupos_gp"));

      const lista: Grupo[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.nombreGrupo && data.lider) {
          lista.push({
            id: doc.id,
            nombreGrupo: data.nombreGrupo,
            lider: data.lider,
          });
        }
      });

      lista.sort((a, b) =>
        a.nombreGrupo.localeCompare(b.nombreGrupo)
      );

      setGrupos(lista);
    } catch (error) {
      console.error("Error al cargar grupos:", error);
    }
  };

  // Cargar invitados de la última evaluación
  const cargarInvitadosAntiguos = async (nombreGrupo: string) => {
    try {
      if (!nombreGrupo) return;

      const q = query(
        collection(db, "evaluaciones_gp"),
        where("grupoEvaluado", "==", nombreGrupo),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setInvitados(data.invitados || []);
      } else {
        setInvitados([]);
      }
    } catch (e) {
      console.error("Error al cargar invitados antiguos:", e);
      setInvitados([]);
    }
  };

  useEffect(() => {
    cargarGrupos();
  }, []);

  useEffect(() => {
    cargarInvitadosAntiguos(grupoEvaluado);
  }, [grupoEvaluado]);

  /* ========= PUNTAJES ========= */

  const puntosPorInvitado = (edad: number | null) =>
    edad && edad >= 16 && edad <= 29 ? 800 : 0;

  const totalPuntosInvitados = invitados.reduce(
    (acc, inv) => acc + puntosPorInvitado(inv.edad),
    0
  );

  const totalPuntos =
    puntosAsistencia + puntosPresentacion + totalPuntosInvitados;

  /* ========= ACCIONES ========= */

  const agregarInvitado = () => {
    if (!nombreInvitado || !edadInvitado) {
      alert("Completa nombre y edad");
      return;
    }

    const edad = Number(edadInvitado);
    if (isNaN(edad) || edad <= 0) {
      alert("Edad inválida");
      return;
    }

    setInvitados([...invitados, { nombre: nombreInvitado, edad }]);
    setNombreInvitado("");
    setEdadInvitado("");
  };

  const guardarEvaluacion = async () => {
    if (!calificador || !grupoPertenece || !grupoEvaluado) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    try {
      await addDoc(collection(db, "evaluaciones_gp"), {
        calificador,
        grupoPertenece,
        grupoEvaluado,
        puntosAsistencia,
        puntosPresentacion,
        invitados,
        totalPuntos,
        fecha,
        hora,
        createdAt: Timestamp.now(),
      });

      setGuardado(true);
      setGrupoEvaluado("");
      setPuntosAsistencia(0);
      setPuntosPresentacion(0);
      setInvitados([]);
    } catch (e) {
      console.error(e);
      alert("Error al guardar evaluación");
    }
  };

  /* ========= UI ========= */

  return (
    <main style={bg}>
      <div style={card}>
        <h1 style={title}>Evaluación Grupo Pequeño</h1>

        <input
          type="text"
          placeholder="Nombre del calificador"
          value={calificador}
          onChange={(e) => setCalificador(e.target.value)}
          style={input}
        />

        <input
          type="text"
          placeholder="Grupo al que pertenece"
          value={grupoPertenece}
          onChange={(e) => setGrupoPertenece(e.target.value)}
          style={input}
        />

        <label style={{ fontWeight: 600 }}>Grupo a evaluar</label>
        <select
          value={grupoEvaluado}
          onChange={(e) => setGrupoEvaluado(e.target.value)}
          style={input}
        >
          <option value="">-- Selecciona un grupo --</option>
          {grupos.map((g) => (
            <option key={g.id} value={g.nombreGrupo}>
              {g.nombreGrupo} — Líder: {g.lider}
            </option>
          ))}
        </select>

        <div style={fechaHora}>
          📅 {fecha} | ⏰ {hora}
        </div>

        <div style={criterioBox}>
          <strong>Asistencia puntual</strong>
          <input
            type="number"
            value={puntosAsistencia}
            onChange={(e) => setPuntosAsistencia(Number(e.target.value))}
            style={input}
          />
        </div>

        <div style={criterioBox}>
          <strong>Invitados</strong>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Nombre"
              value={nombreInvitado}
              onChange={(e) => setNombreInvitado(e.target.value)}
              style={{ ...input, flex: 2 }}
            />
            <input
              placeholder="Edad"
              value={edadInvitado}
              onChange={(e) => setEdadInvitado(e.target.value)}
              style={{ ...input, flex: 1 }}
            />
            <button onClick={agregarInvitado} style={btnSmall}>
              +
            </button>
          </div>

          <ul>
            {invitados.map((inv, i) => (
              <li key={i}>
                {inv.nombre} ({inv.edad}) → {puntosPorInvitado(inv.edad)} pts
              </li>
            ))}
          </ul>
        </div>

        <div style={criterioBox}>
          <strong>Presentación</strong>
          <input
            type="number"
            value={puntosPresentacion}
            onChange={(e) => setPuntosPresentacion(Number(e.target.value))}
            style={input}
          />
        </div>

        <h2 style={total}>Total: {totalPuntos} puntos</h2>

        {guardado && <div style={ok}>✅ Evaluación guardada</div>}

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={guardarEvaluacion} style={btnPrimary}>
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

/* ========= ESTILOS ========= */

const bg: React.CSSProperties = {
  minHeight: "100vh",
  padding: "1.5rem",
  background: "linear-gradient(135deg,#e0e7ff,#f5e8ff)",
};

const card: React.CSSProperties = {
  maxWidth: "48rem",
  margin: "0 auto",
  background: "#fff",
  padding: "2rem",
  borderRadius: "1.5rem",
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
};

const title: React.CSSProperties = {
  textAlign: "center",
  fontSize: "1.6rem",
  marginBottom: "1rem",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.75rem",
  border: "1px solid #aaa",
  marginBottom: "0.6rem",
};

const fechaHora: React.CSSProperties = {
  marginBottom: "1rem",
  fontSize: "0.9rem",
};

const criterioBox: React.CSSProperties = {
  border: "1px solid #eee",
  padding: "1rem",
  borderRadius: "1rem",
  marginBottom: "1rem",
};

const total: React.CSSProperties = {
  textAlign: "center",
  fontSize: "1.3rem",
  fontWeight: 600,
};

const btnPrimary: React.CSSProperties = {
  flex: 1,
  background: "#4f46e5",
  color: "#fff",
  padding: "0.9rem",
  borderRadius: "0.8rem",
  border: "none",
};

const btnSec: React.CSSProperties = {
  flex: 1,
  background: "#e5e7eb",
  padding: "0.9rem",
  borderRadius: "0.8rem",
  border: "none",
};

const btnSmall: React.CSSProperties = {
  background: "#22c55e",
  color: "#fff",
  padding: "0.5rem 0.8rem",
  borderRadius: "0.5rem",
  border: "none",
};

const ok: React.CSSProperties = {
  background: "#dcfce7",
  padding: "0.75rem",
  borderRadius: "0.75rem",
  textAlign: "center",
  marginBottom: "1rem",
};
