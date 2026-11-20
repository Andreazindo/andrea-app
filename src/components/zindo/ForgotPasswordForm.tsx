"use client";

import { useState } from "react";
import { zindoColors } from "@/components/zindo/theme";

const inputClass = "w-full rounded-md border bg-white px-3 py-2 text-sm";
const inputStyle = { borderColor: zindoColors.sage, color: zindoColors.ink };
const labelClass = "block text-sm font-medium mb-1";

export function ForgotPasswordForm({ whatsappDigits }: { whatsappDigits: string }) {
  const [email, setEmail] = useState("");

  const message = `Hola, olvidé mi contraseña de ZINDO. Mi correo registrado es: ${email || "(escribe aquí tu correo)"}`;
  const href = whatsappDigits ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}` : undefined;

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass} style={{ color: zindoColors.ink }} htmlFor="email">
          Tu correo
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          className={inputClass}
          style={inputStyle}
        />
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center rounded-md px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          style={{ backgroundColor: "#25D366" }}
        >
          Enviar por WhatsApp
        </a>
      ) : (
        <p className="text-sm" style={{ color: zindoColors.ink, opacity: 0.6 }}>
          Escríbenos directamente para recuperar tu acceso.
        </p>
      )}
      <p className="text-xs" style={{ color: zindoColors.ink, opacity: 0.55 }}>
        Te confirmamos tu identidad y te mandamos una contraseña temporal para que puedas entrar de nuevo.
      </p>
    </div>
  );
}
