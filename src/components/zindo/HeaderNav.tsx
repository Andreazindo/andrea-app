"use client";

import { useState } from "react";
import Link from "next/link";
import { zindoColors } from "@/components/zindo/theme";

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

type NavItem =
  | { type: "label"; key: string; label: string }
  | { type: "logout"; key: string }
  | { type: "link"; key: string; href: string; label: string };

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

  const items: NavItem[] = [];
  if (userName) {
    if (!isAdmin) {
      items.push({ type: "link", key: "cuenta", href: "/cuenta", label: "Mi cuenta" });
    }
    items.push({ type: "label", key: "user", label: userName });
    items.push({ type: "logout", key: "logout" });
  } else {
    items.push({ type: "link", key: "login", href: "/login", label: "Iniciar sesión" });
    items.push({ type: "link", key: "registro", href: "/registro", label: "Crear cuenta" });
  }
  if (isAdmin) {
    items.push({ type: "link", key: "app", href: "/", label: "App" });
    items.push({ type: "link", key: "dashboard", href: "/admin", label: "Dashboard" });
    items.push({ type: "link", key: "productos", href: "/admin/productos", label: "Productos" });
    items.push({ type: "link", key: "pedidos", href: "/admin/pedidos", label: "Pedidos" });
    items.push({ type: "link", key: "clientes", href: "/admin/clientes", label: "Clientes" });
    items.push({ type: "link", key: "cupones", href: "/admin/cupones", label: "Cupones" });
    items.push({ type: "link", key: "contenido", href: "/admin/contenido", label: "Contenido" });
    items.push({ type: "link", key: "multimedia", href: "/admin/multimedia", label: "Multimedia" });
    items.push({ type: "link", key: "venta", href: "/admin/ventas/nueva", label: "Registrar venta" });
  } else {
    items.push({ type: "link", key: "tienda", href: "/tienda", label: "Tienda" });
    items.push({ type: "link", key: "contacto", href: "/contacto", label: "Contacto" });
  }

  return (
    <div className="relative flex items-center gap-3">
      <nav className="hidden sm:flex items-center gap-4">
        {items.map((item) => {
          if (item.type === "label") {
            return (
              <span key={item.key} className="text-sm whitespace-nowrap" style={{ color: zindoColors.ink, opacity: 0.5 }}>
                {item.label}
              </span>
            );
          }
          if (item.type === "logout") {
            return (
              <form key={item.key} action={logoutAction}>
                <button type="submit" className="text-sm whitespace-nowrap hover:underline" style={{ color: zindoColors.green }}>
                  Cerrar sesión
                </button>
              </form>
            );
          }
          return (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm whitespace-nowrap hover:underline"
              style={{ color: zindoColors.green }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

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
          className="sm:hidden absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg border shadow-lg"
          style={{ borderColor: zindoColors.sage, backgroundColor: zindoColors.ivory }}
        >
          {items.map((item, i) => {
            const notLast = i < items.length - 1;
            const rowClass = `block w-full whitespace-nowrap px-4 py-3 text-left text-sm${notLast ? " border-b" : ""}`;
            const rowStyle = { borderColor: zindoColors.sage };

            if (item.type === "label") {
              return (
                <div key={item.key} className={rowClass} style={{ ...rowStyle, color: zindoColors.ink, opacity: 0.6 }}>
                  {item.label}
                </div>
              );
            }
            if (item.type === "logout") {
              return (
                <form key={item.key} action={logoutAction} className={notLast ? "border-b" : ""} style={rowStyle}>
                  <button
                    type="submit"
                    onClick={close}
                    className="block w-full whitespace-nowrap px-4 py-3 text-left text-sm hover:bg-black/5 transition-colors"
                    style={{ color: zindoColors.green }}
                  >
                    Cerrar sesión
                  </button>
                </form>
              );
            }
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={close}
                className={`${rowClass} hover:bg-black/5 transition-colors`}
                style={{ ...rowStyle, color: zindoColors.green }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
