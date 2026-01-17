"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp } from "firebase/firestore";

interface Invitado {
  nombre: string;
  edad: number | null;
}

interface Grupo {
  id: string;
  nombreGrupo: string;
  lider: string;
}

export default function EvaluacionGP() {
  const router = useRouter();

  // Datos fijos que se conservan
  const [calificador, setCalificador] = useState<string>("");
  const [grupoPertenece, setGrupoPertenece] = useState<string>("");

  // Grupo que va a ser evaluado
  const [grupoEvaluado, setGrupoEvaluado] = useState<string>("");

  // Lista de grupos existentes desde Firebase
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  // Criterios
  const [puntosAsistencia, setPuntosAsistencia] = useState<number>(0);
  const [puntosPresentacion, setPuntosPresentacion] = useState<number>(0);

  // Lista de invitados
  const [invitados, setInvitados] = useState<Invitado[]>([]);

  const [nombreInvitado, setNombreInvitado] = useState<string>("");
  const [edadInvitado, setEdadInvitado] = useState<string>("");

  const [guardado, setGuardado] = useState(false);

  // Fecha y hora automáticas
  const fecha = new Date().toISOString().split("T")[0];
  const hora = new Date().toLocaleTimeString();

  // ======= Funciones =======

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
      lista.sort((a, b) => a.nombreGrupo.localeCompare(b.nombreGrupo));
      setGrupos(lista);
    } catch (e) {
      console.error("Error al cargar grupos:", e);
    }
  };

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

  const puntosPorInvitado = (edad: number | null) => (edad && edad >= 16 && edad <= 29 ? 800 : 0);

  const totalPuntosInvitados = invitados.reduce((acc, inv) => acc + puntosPorInvitado(inv.edad), 0);
  const totalPuntos = puntosAsistencia + puntosPresentacion + totalPuntosInvitados;

  const agregarInvitado = () => {
    if (!nombreInvitado || !edadInvitado) return alert("Completa el nombre y edad del invitado");

    const edad = Number(edadInvitado);
    if (isNaN(edad) || edad <= 0) return alert("Edad inválida");

    setInvitados([...invitados, { nombre: nombreInvitado, edad }]);
    setNombreInvitado("");
    setEdadInvitado("");
  };

  const guardarEvaluacion = async () => {
    if (!calificador || !grupoPertenece || !grupoEvaluado) {
      return alert("Completa todos los campos obligatorios");
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
      alert("Error al guardar la evaluación");
    }
  };

  return (
    <main style={bg}>
      <div style={card}>
        <h1 style={title}>Evaluación Grupo Pequeño</h1>

        {/* Calificador */}
        <input
          type="text"
          placeholder="Nombre del calificador"
          value={calificador}
          onChange={(e) => setCalificador(e.target.value)}
          style={input}
        />

        {/* Grupo al que pertenece */}
        <input
          type="text"
          placeholder="Grupo al que pertenece"
          value={grupoPertenece}
          onChange={(e) => setGrupoPertenece(e.target.value)}
          style={input}
        />

        {/* Grupo evaluado */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ marginBottom: 6, display: "block", fontWeight: 600 }}>Grupo a evaluar:</label>
          <select
            value={grupoEvaluado}
            onChange={(e) => setGrupoEvaluado(e.target.value)}
            style={input}
          >
            <option value="">-- Selecciona un grupo --</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.nombreGrupo}>
                {g.nombreGrupo} - Líder: {g.lider}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha y hora */}
        <div style={fechaHora}>
          📅 Fecha: {fecha} | ⏰ Hora: {hora}
        </div>

        {/* Asistencia puntual */}
        <div style={criterioBox}>
          <strong>Asistencia puntual:</strong>
          <input
            type="number"
            placeholder="Ingrese puntos"
            value={puntosAsistencia}
            onChange={(e) => setPuntosAsistencia(Number(e.target.value))}
            style={input}
          />
        </div>

        {/* Invitados */}
        <div style={criterioBox}>
          <strong>Invitados:</strong>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Nombre del invitado"
              value={nombreInvitado}
              onChange={(e) => setNombreInvitado(e.target.value)}
              style={{ ...input, flex: 2 }}
            />
            <input
              type="number"
              placeholder="Edad"
              value={edadInvitado}
              onChange={(e) => setEdadInvitado(e.target.value)}
              style={{ ...input, flex: 1 }}
            />
            <button onClick={agregarInvitado} style={btnSmall}>
              Agregar
            </button>
          </div>

          <ul>
            {invitados.map((inv, i) => (
              <li key={i}>
                {inv.nombre} - {inv.edad} años → Puntos: {puntosPorInvitado(inv.edad)}
              </li>
            ))}
          </ul>
        </div>

        {/* Presentación del programa */}
        <div style={criterioBox}>
          <strong>Presentación del programa:</strong>
          <input
            type="number"
            placeholder="Ingrese puntos"
            value={puntosPresentacion}
            onChange={(e) => setPuntosPresentacion(Number(e.target.value))}
            style={input}
          />
        </div>

        {/* Total */}
        <h2 style={total}>Total: {totalPuntos} puntos</h2>

        {guardado && <div style={ok}>✅ Evaluación guardada correctamente</div>}

        {/* Botones */}
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button onClick={guardarEvaluacion} style={btnPrimary}>
            Guardar Evaluación
          </button>
          <button onClick={() => router.push("/dashboard/directiva-ja/menu")} style={btnSec}>
            Volver al Menú
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
  fontFamily: "'Inter', sans-serif",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  color: "#222",
};

const card: React.CSSProperties = {
  maxWidth: "48rem", // 768px
  margin: "0 auto",
  background: "#fff",
  padding: "2rem",
  borderRadius: "1.5rem",
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
};

const title: React.CSSProperties = {
  textAlign: "center",
  fontSize: "1.625rem", // 26px
  marginBottom: "1.25rem",
  color: "#111",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.75rem",
  marginBottom: "0.625rem",
  border: "1px solid #aaa",
  fontSize: "1rem",
  color: "#111",
};

const fechaHora: React.CSSProperties = {
  marginBottom: "1rem",
  color: "#222",
  fontSize: "0.875rem",
};

const criterioBox: React.CSSProperties = {
  border: "1px solid #eee",
  padding: "1rem",
  borderRadius: "1rem",
  marginBottom: "0.875rem",
  fontSize: "1rem",
  color: "#111",
};

const total: React.CSSProperties = {
  textAlign: "center",
  margin: "1.25rem 0",
  fontSize: "1.25rem",
  fontWeight: 600,
  color: "#111",
};

const btnPrimary: React.CSSProperties = {
  flex: 1,
  background: "#4f46e5",
  color: "#fff",
  padding: "0.875rem",
  borderRadius: "0.875rem",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
};

const btnSec: React.CSSProperties = {
  flex: 1,
  background: "#e5e7eb",
  color: "#111",
  padding: "0.875rem",
  borderRadius: "0.875rem",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
};

const btnSmall: React.CSSProperties = {
  background: "#4ade80",
  color: "#fff",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.375rem 0.75rem",
  cursor: "pointer",
  fontSize: "0.875rem",
};

const ok: React.CSSProperties = {
  background: "#dcfce7",
  padding: "0.75rem",
  borderRadius: "0.75rem",
  textAlign: "center",
  marginBottom: "1rem",
  fontSize: "1rem",
  color: "#166534",
};
