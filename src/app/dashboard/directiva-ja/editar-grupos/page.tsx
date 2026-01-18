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
    <div style={page}>
      <div style={card}>
        {/* VOLVER */}
        <button style={btnBack} onClick={() => router.push("/dashboard/directiva-ja/menu")}>
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
          <option value="">📂 Selecciona un grupo</option>
          {grupos.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombreGrupo} — Líder: {g.lider}
            </option>
          ))}
        </select>

        {/* DATOS */}
        {grupoSeleccionado && (
          <>
            <div style={section}>
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
                placeholder="Nombre del líder"
              />
            </div>

            <div style={section}>
              <strong style={subtitle}>👥 Miembros</strong>

              <ul style={listaMiembros}>
                {grupoSeleccionado.miembros.length === 0 && (
                  <li style={empty}>No hay miembros registrados</li>
                )}

                {grupoSeleccionado.miembros.map((m, i) => (
                  <li key={i} style={itemMiembro}>
                    <span>👤 {m.nombre}</span>
                    <button
                      style={btnDeleteSmall}
                      onClick={() => eliminarMiembro(i)}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>

              <div style={row}>
                <input
                  style={input}
                  placeholder="Nuevo miembro"
                  value={nuevoMiembro}
                  onChange={(e) => setNuevoMiembro(e.target.value)}
                />
                <button style={btnAdd} onClick={agregarMiembro}>
                  Agregar
                </button>
              </div>
            </div>

            <div style={actions}>
              <button style={btnPrimary} onClick={guardarCambios}>
                💾 Guardar cambios
              </button>
              <button style={btnDanger} onClick={eliminarGrupo}>
                🗑 Eliminar grupo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ===== ESTILOS ===== */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
  padding: 20,
};

const card = {
  background: "#ffffff",
  color: "#111827",
  padding: 28,
  borderRadius: 24,
  maxWidth: 760,
  margin: "auto",
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
};

const title = {
  textAlign: "center" as const,
  fontSize: 26,
  fontWeight: 700,
  marginBottom: 20,
};

const subtitle = {
  display: "block",
  marginBottom: 10,
  fontSize: 16,
};

const section = {
  marginBottom: 20,
};

const input = {
  width: "100%",
  padding: 14,
  marginBottom: 10,
  borderRadius: 12,
  border: "1px solid #c7d2fe",
  background: "#ffffff",
  fontSize: 15,
};

const listaMiembros = {
  background: "#f1f5f9",
  padding: 14,
  borderRadius: 14,
  marginBottom: 12,
};

const itemMiembro = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "6px 0",
};

const empty = {
  color: "#64748b",
  fontStyle: "italic",
};

const row = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap" as const,
};

const actions = {
  display: "flex",
  gap: 12,
  marginTop: 20,
  flexWrap: "wrap" as const,
};

const btnPrimary = {
  flex: 1,
  background: "#4f46e5",
  color: "#ffffff",
  padding: 14,
  borderRadius: 14,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const btnDanger = {
  flex: 1,
  background: "#ef4444",
  color: "#ffffff",
  padding: 14,
  borderRadius: 14,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const btnAdd = {
  background: "#22c55e",
  color: "#ffffff",
  padding: "14px 20px",
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
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
