"use client";

import { useState } from "react";
import Link from "next/link";
import { zindoColors } from "@/components/zindo/theme";

const linkStyle = { color: zindoColors.green };
const linkClass = "text-sm whitespace-nowrap hover:underline";

function CartIcon() {
  return (
    <Link
      href="/carrito"
      aria-label="Carrito"
      className="flex items-center justify-center rounded-full border p-2 hover:bg-white/60 flex-none"
      style={{ borderColor: zindoColors.sage }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke={zindoColors.green}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6 5 3H2" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
    </Link>
  );
}

export function HeaderNav({
  userName,
  isAdmin,
  logoutAction,
}: {
  userName: string | null;
  isAdmin: boolean;
  logoutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const links = (
    <>
      {userName ? (
        <>
          <span className="text-sm whitespace-nowrap" style={{ color: zindoColors.ink, opacity: 0.5 }}>
            {userName}
          </span>
          <form action={logoutAction}>
            <button type="submit" onClick={close} className={linkClass} style={linkStyle}>
              Cerrar sesión
            </button>
          </form>
        </>
      ) : (
        <>
          <Link href="/login" onClick={close} className={linkClass} style={linkStyle}>
            Iniciar sesión
          </Link>
          <Link href="/registro" onClick={close} className={linkClass} style={linkStyle}>
            Crear cuenta
          </Link>
        </>
      )}
      <Link href="/tienda" onClick={close} className={linkClass} style={linkStyle}>
        Tienda
      </Link>
      {isAdmin && (
        <Link href="/admin/ventas/nueva" onClick={close} className={linkClass} style={linkStyle}>
          Registrar venta
        </Link>
      )}
      <Link href="/contacto" onClick={close} className={linkClass} style={linkStyle}>
        Contacto
      </Link>
    </>
  );

  return (
    <div className="relative flex items-center gap-3">
      <nav className="hidden sm:flex items-center gap-4">{links}</nav>
      <CartIcon />
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((v) => !v)}
        className="sm:hidden flex items-center justify-center rounded-full border p-2 flex-none"
        style={{ borderColor: zindoColors.sage }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={zindoColors.green} strokeWidth={1.75} strokeLinecap="round" className="h-5 w-5">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div
          className="sm:hidden absolute right-0 top-full mt-2 flex w-48 flex-col items-start gap-3 rounded-lg border p-4 shadow-lg"
          style={{ borderColor: zindoColors.sage, backgroundColor: zindoColors.ivory }}
        >
          {links}
        </div>
      )}
    </div>
  );
}
