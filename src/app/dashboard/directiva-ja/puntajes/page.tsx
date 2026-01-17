"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

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

  // Traer grupos desde Firebase
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
      // Orden alfabético por nombreGrupo
      lista.sort((a, b) => a.nombreGrupo.localeCompare(b.nombreGrupo));
      setGrupos(lista);
    } catch (e) {
      console.error("Error al cargar grupos:", e);
    }
  };

  useEffect(() => {
    cargarGrupos();
  }, []);

  // Calcular puntos por invitado
  const puntosPorInvitado = (edad: number | null) => {
    if (edad && edad >= 16 && edad <= 29) return 800;
    return 0;
  };

  const totalPuntosInvitados = invitados.reduce(
    (acc, inv) => acc + puntosPorInvitado(inv.edad),
    0
  );

  const totalPuntos = puntosAsistencia + puntosPresentacion + totalPuntosInvitados;

  // Agregar invitado a la lista
  const agregarInvitado = () => {
    if (!nombreInvitado || !edadInvitado) {
      alert("Completa el nombre y edad del invitado");
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

  // Guardar evaluación en Firestore
  const guardarEvaluacion = async () => {
    if (!calificador || !grupoPertenece || !grupoEvaluado) {
      alert("Completa los campos de calificador, grupo al que pertenece y grupo evaluado.");
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

      // Reset opcional
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
          <label style={{ marginBottom: 6, display: "block" }}>Grupo a evaluar:</label>
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
        <div style={{ marginBottom: 16, color: "#555", fontSize: 14 }}>
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
          <button
            onClick={() => router.push("/dashboard/directiva-ja/menu")}
            style={btnSec}
          >
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
  padding: 24,
  background: "linear-gradient(135deg,#e0e7ff,#f5e8ff)",
};

const card: React.CSSProperties = {
  maxWidth: 800,
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

const criterioBox: React.CSSProperties = {
  border: "1px solid #eee",
  padding: 16,
  borderRadius: 16,
  marginBottom: 14,
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
  cursor: "pointer",
};

const btnSec: React.CSSProperties = {
  flex: 1,
  background: "#e5e7eb",
  color: "#000",
  padding: 14,
  borderRadius: 14,
  border: "none",
  cursor: "pointer",
};

const btnSmall: React.CSSProperties = {
  background: "#4ade80",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "6px 12px",
  cursor: "pointer",
};

const ok: React.CSSProperties = {
  background: "#dcfce7",
  padding: 12,
  borderRadius: 12,
  textAlign: "center",
  marginBottom: 16,
};
