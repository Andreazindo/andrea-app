import type { Metadata } from "next";
import { ZindoContentPage } from "@/components/zindo/ContentPage";
import { ForgotPasswordForm } from "@/components/zindo/ForgotPasswordForm";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Olvidé mi contraseña" };

export default async function RecuperarContrasenaPage() {
  const { contacto_whatsapp } = await getSiteContent(["contacto_whatsapp"] as const);
  const whatsappDigits = contacto_whatsapp.replace(/\D/g, "");

  return (
    <ZindoContentPage title="Olvidé mi contraseña" backHref="/login" backLabel="Iniciar sesión">
      <div className="max-w-sm mx-auto w-full">
        <ForgotPasswordForm whatsappDigits={whatsappDigits} />
      </div>
    </ZindoContentPage>
  );
}
