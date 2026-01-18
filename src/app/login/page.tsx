"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (pin.length !== 4) {
      setError("El PIN debe tener 4 dígitos");
      return;
    }

    try {
      // Accedemos al documento correcto y al campo exacto
      const docRef = doc(db, "configuracion", "seguridad");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const storedPin = docSnap.data().pinDirectora;

        if (pin === storedPin) {
          router.push("dashboard/directiva-ja/menu");
        } else {
          setError("PIN incorrecto");
        }
      } else {
        setError("No se encontró la configuración de seguridad");
      }
    } catch (e) {
      console.error(e);
      setError("Error al verificar el PIN");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md relative">

        {/* BOTÓN VOLVER */}
        <Link
          href="/dashboard"
          className="absolute top-4 left-4 text-indigo-600 font-semibold hover:underline"
        >
          ← Volver
        </Link>

        <h1 className="text-2xl font-bold mb-6 text-center">
          Login Directiva JA
        </h1>

        <input
          type="text"
          placeholder="Ingresa tu PIN"
          maxLength={4}
          className="w-full mb-4 p-3 border rounded-xl text-center text-xl tracking-widest"
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
        />

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          Ingresar
        </button>

      </div>
    </main>
  );
}
