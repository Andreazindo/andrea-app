export const adminCardClass = "rounded-xl border border-[#9CBA9D]/50 bg-white p-5 space-y-4 shadow-sm";
export const adminInputClass =
  "w-full rounded-md border border-[#9CBA9D]/60 bg-white px-3 py-2 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:ring-2 focus:ring-[#C9A15B]/50 focus:border-[#C9A15B]";
export const adminLabelClass = "block text-sm font-medium mb-1 text-[#1A1A1A]";
export const adminButtonPrimaryClass =
  "rounded-md bg-[#0D3B36] px-4 py-2 text-sm font-medium text-white hover:bg-[#0D3B36]/90 transition-colors";
export const adminButtonSecondaryClass =
  "rounded-md border border-[#9CBA9D] px-4 py-2 text-sm font-medium text-[#0D3B36] hover:bg-[#EEE7DF] transition-colors";
export const adminDangerLinkClass = "text-xs text-red-600 hover:underline";
export const adminSectionTitleClass = "text-sm font-semibold uppercase tracking-wide text-[#0D3B36]";
export const adminMutedTextClass = "text-sm text-[#1A1A1A]/60";
export const adminBadgeClass =
  "inline-block text-[10px] uppercase tracking-[0.1em] font-semibold px-2.5 py-1 rounded-full bg-[#9CBA9D] text-white";

export function AdminPageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1
        className="text-2xl sm:text-3xl tracking-tight mb-1"
        style={{ color: "#0D3B36", fontFamily: "var(--font-zindo-heading)", fontWeight: 500 }}
      >
        {title}
      </h1>
      {subtitle && <p className={adminMutedTextClass}>{subtitle}</p>}
      <span className="mt-3 inline-block h-px w-12 bg-[#C9A15B]" />
    </div>
  );
}

export function AdminSectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className={`${adminSectionTitleClass} mb-3`}>{children}</h2>;
}

export function AdminFlash({ guardado, error, errorMessages }: { guardado?: string; error?: string; errorMessages?: Record<string, string> }) {
  return (
    <>
      {guardado && (
        <p className="rounded-md bg-[#0D3B36]/10 text-[#0D3B36] text-sm px-3 py-2 font-medium">Cambios guardados.</p>
      )}
      {error && (
        <p className="rounded-md bg-red-500/10 text-red-600 text-sm px-3 py-2">
          {(errorMessages && errorMessages[error]) ?? "Revisa el formulario."}
        </p>
      )}
    </>
  );
}
