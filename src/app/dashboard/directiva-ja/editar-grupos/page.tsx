"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

/* ===== TIPOS ===== */
interface Miembro {
  nombre: string;
}

interface Grupo {
  id: string;
  nombreGrupo: string;
  lider: string;
  miembros: Miembro[];
}

export default function EditarGP() {
  const router = useRouter();

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<Grupo | null>(null);
  const [nuevoMiembro, setNuevoMiembro] = useState("");

  /* ===== CARGAR GRUPOS ===== */
  const cargarGrupos = async () => {
    const snapshot = await getDocs(collection(db, "grupos_gp"));
    const lista: Grupo[] = [];

    snapshot.forEach((docu) => {
      const data = docu.data();
      lista.push({
        id: docu.id,
        nombreGrupo: data.nombreGrupo,
        lider: data.lider,
        miembros: data.miembros || [],
      });
    });

    setGrupos(lista);
  };

  useEffect(() => {
    cargarGrupos();
  }, []);

  /* ===== AGREGAR MIEMBRO ===== */
  const agregarMiembro = async () => {
    if (!grupoSeleccionado || !nuevoMiembro.trim()) return;

    const miembrosActualizados = [
      ...grupoSeleccionado.miembros,
      { nombre: nuevoMiembro.trim() },
    ];

    await updateDoc(doc(db, "grupos_gp", grupoSeleccionado.id), {
      miembros: miembrosActualizados,
    });

    setGrupoSeleccionado({
      ...grupoSeleccionado,
      miembros: miembrosActualizados,
    });

    setNuevoMiembro("");
  };

  /* ===== ELIMINAR MIEMBRO ===== */
  const eliminarMiembro = async (index: number) => {
    if (!grupoSeleccionado) return;

    const miembrosActualizados = grupoSeleccionado.miembros.filter(
      (_, i) => i !== index
    );

    await updateDoc(doc(db, "grupos_gp", grupoSeleccionado.id), {
      miembros: miembrosActualizados,
    });

    setGrupoSeleccionado({
      ...grupoSeleccionado,
      miembros: miembrosActualizados,
    });
  };

  /* ===== GUARDAR CAMBIOS ===== */
  const guardarCambios = async () => {
    if (!grupoSeleccionado) return;

    await updateDoc(doc(db, "grupos_gp", grupoSeleccionado.id), {
      nombreGrupo: grupoSeleccionado.nombreGrupo,
      lider: grupoSeleccionado.lider,
    });

    alert("Grupo actualizado correctamente");
    cargarGrupos();
  };

  /* ===== ELIMINAR GRUPO ===== */
  const eliminarGrupo = async () => {
    if (!grupoSeleccionado) return;

    if (!confirm("¿Eliminar este grupo definitivamente?")) return;

    await deleteDoc(doc(db, "grupos_gp", grupoSeleccionado.id));
    setGrupoSeleccionado(null);
    cargarGrupos();
  };

  return (
    <div style={card}>
      {/* VOLVER */}
      <button style={btnBack} onClick={() => router.push("/dashboard")}>
        ← Volver al menú
      </button>

      <h2 style={title}>Editar Grupo Pequeño</h2>

      {/* SELECTOR */}
      <select
        style={input}
        value={grupoSeleccionado?.id || ""}
        onChange={(e) => {
          const grupo = grupos.find((g) => g.id === e.target.value);
          setGrupoSeleccionado(grupo || null);
        }}
      >
        <option value="">-- Selecciona un grupo --</option>
        {grupos.map((g) => (
          <option key={g.id} value={g.id}>
            {g.nombreGrupo} – Líder: {g.lider}
          </option>
        ))}
      </select>

      {/* DATOS */}
      {grupoSeleccionado && (
        <>
          <input
            style={input}
            value={grupoSeleccionado.nombreGrupo}
            onChange={(e) =>
              setGrupoSeleccionado({
                ...grupoSeleccionado,
                nombreGrupo: e.target.value,
              })
            }
            placeholder="Nombre del grupo"
          />

          <input
            style={input}
            value={grupoSeleccionado.lider}
            onChange={(e) =>
              setGrupoSeleccionado({
                ...grupoSeleccionado,
                lider: e.target.value,
              })
            }
            placeholder="Líder"
          />

          <strong style={{ marginBottom: 6, display: "block" }}>
            Miembros:
          </strong>

          <ul style={listaMiembros}>
            {grupoSeleccionado.miembros.length === 0 && (
              <li style={{ color: "#6b7280" }}>
                No hay miembros registrados
              </li>
            )}

            {grupoSeleccionado.miembros.map((m, i) => (
              <li key={i} style={itemMiembro}>
                {m.nombre}
                <button
                  style={btnDeleteSmall}
                  onClick={() => eliminarMiembro(i)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={input}
              placeholder="Nuevo miembro"
              value={nuevoMiembro}
              onChange={(e) => setNuevoMiembro(e.target.value)}
            />
            <button style={btnSmall} onClick={agregarMiembro}>
              Agregar
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={btnPrimary} onClick={guardarCambios}>
              Guardar cambios
            </button>
            <button style={btnDanger} onClick={eliminarGrupo}>
              Eliminar grupo
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ===== ESTILOS (ANTI TEXTO GRIS) ===== */
const card = {
  background: "#ffffff",
  color: "#111827",
  padding: 24,
  borderRadius: 20,
  maxWidth: 720,
  margin: "auto",
};

const title = {
  textAlign: "center" as const,
  marginBottom: 20,
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 10,
  borderRadius: 10,
  border: "1px solid #9ca3af",
  background: "#ffffff",
  color: "#111827",
};

const listaMiembros = {
  background: "#f9fafb",
  padding: 12,
  borderRadius: 12,
  marginBottom: 12,
  color: "#111827",
};

const itemMiembro = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 6,
};

const btnPrimary = {
  background: "#4f46e5",
  color: "#ffffff",
  padding: 12,
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
};

const btnDanger = {
  background: "#ef4444",
  color: "#ffffff",
  padding: 12,
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
};

const btnSmall = {
  background: "#22c55e",
  color: "#ffffff",
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
};

const btnDeleteSmall = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: 16,
};

const btnBack = {
  background: "transparent",
  border: "none",
  color: "#2563eb",
  fontSize: 16,
  cursor: "pointer",
  marginBottom: 10,
};
