import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

const TerminosUso = () => {
  const terminosRef = useRef<HTMLDivElement>(null);

  const exportToPDF = async () => {
    if (!terminosRef.current) {
      alert("Error: No se encontró el contenedor de los términos.");
      return;
    }

    try {
      const element = terminosRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
      });
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      const contentHeight = pageHeight - 2 * margin;
      const imageWidth = canvas.width;
      const imageHeight = canvas.height;
      const ratio = Math.min(
        contentWidth / imageWidth,
        contentHeight / imageHeight
      );
      const scaledWidth = imageWidth * ratio;
      const scaledHeight = imageHeight * ratio;

      // Set font and size
      pdf.setFont("helvetica");
      pdf.setFontSize(14);

      // Add first page
      pdf.addImage(imageData, "PNG", margin, margin, scaledWidth, scaledHeight);

      // Pagination
      const totalPages = Math.ceil(scaledHeight / contentHeight);
      for (let i = 1; i <= totalPages; i++) {
        if (i > 1) {
          pdf.addPage();
          pdf.addImage(
            imageData,
            "PNG",
            margin,
            margin - (i - 1) * contentHeight,
            scaledWidth,
            scaledHeight
          );
        }
        pdf.setFontSize(10);
        pdf.text(
          `Página ${i} de ${totalPages}`,
          pageWidth - margin - 30,
          pageHeight - 10
        );
        pdf.setFontSize(14);
      }

      pdf.save("terminos_uso_software.pdf");
    } catch (error) {
      console.error("Error generando el PDF:", error);
      alert("Error al generar el PDF. Revisa la consola para más detalles.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-end mb-6">
          <button
            onClick={exportToPDF}
            className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Exportar a PDF
          </button>
        </div>
        <div ref={terminosRef} className="space-y-6 text-justify text-[14px]">
          <h1 className="text-2xl font-bold text-center">
            TÉRMINOS DE USO DEL SOFTWARE
          </h1>

          <section>
            <p className="mt-2">
              Bienvenido/a al software desarrollado y proporcionado por
              Teneduría García. Al acceder, instalar o utilizar el Software,
              usted acepta cumplir con estos Términos de Uso ("Términos"). Si no
              está de acuerdo, no utilice el Software.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">1. LICENCIA Y USO</h2>
            <p className="mt-2">
              <strong>1.1 Licencia Limitada:</strong> Le otorgamos una licencia
              personal, no exclusiva, intransferible y revocable para usar el
              Software según estos Términos.
              <br />
              <strong>1.2 Restricciones:</strong> El usuario no podrá:
              <br />
              - Copiar, modificar, distribuir o revender el Software.
              <br />
              - Realizar ingeniería inversa, descompilar o desensamblar el
              Software.
              <br />- Usarlo para fines ilegales, fraudulentos o que infrinjan
              derechos de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. CUENTAS Y REGISTRO</h2>
            <p className="mt-2">
              <strong>2.1 Creación de Cuenta:</strong> Algunas funciones pueden
              requerir registro. Usted debe proporcionar información precisa y
              mantenerla actualizada.
              <br />
              <strong>2.2 Seguridad:</strong> El usuario es responsable de la
              confidencialidad de su cuenta y contraseña. Notifíquenos cualquier
              uso no autorizado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. PROPIEDAD INTELECTUAL</h2>
            <p className="mt-2">
              <strong>3.1 Derechos Reservados:</strong> El Software, su código,
              diseño y contenido son propiedad del Programador o sus
              licenciantes.
              <br />
              <strong>3.2 Feedback:</strong> Si nos proporciona sugerencias o
              comentarios, nos otorga derechos para usarlos sin compensación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. PRIVACIDAD</h2>
            <p className="mt-2">
              <strong>4.1 Protección de Datos:</strong> El uso del Software está
              sujeto a nuestra Política de Privacidad.
              <br />
              <strong>4.2 Datos del Usuario:</strong> Nos comprometemos a
              proteger sus datos conforme a las leyes aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              5. LIMITACIÓN DE RESPONSABILIDAD
            </h2>
            <p className="mt-2">
              <strong>5.1 Exclusión de Daños:</strong> En ningún caso seremos
              responsables por daños indirectos, incidentales o consecuenciales
              derivados del uso del Software.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              6. MODIFICACIONES Y TERMINACIÓN
            </h2>
            <p className="mt-2">
              <strong>6.1 Cambios en los Términos:</strong> Podemos actualizar
              estos Términos ocasionalmente. Le notificaremos cambios
              significativos, y su uso continuado implica aceptación.
              <br />
              <strong>6.2 Suspensión o Terminación:</strong> Podemos suspender o
              cancelar su acceso si incumple estos Términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              7. LEY APLICABLE Y RESOLUCIÓN DE CONFLICTOS
            </h2>
            <p className="mt-2">
              <strong>7.1 Jurisdicción:</strong> Estos Términos se rigen por las
              leyes de República de Cuba.
              <br />
              <strong>7.2 Mediación:</strong> Cualquier disputa se resolverá
              primero mediante Negociación o mediación. Si no hay acuerdo, se
              someterá a los tribunales de República de Cuba.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              8. DISPOSICIONES GENERALES
            </h2>
            <p className="mt-2">
              <strong>8.1 Cesión:</strong> No puede transferir sus derechos bajo
              estos Términos sin nuestro consentimiento por escrito.
              <br />
              <strong>8.2 Divisibilidad:</strong> Si alguna cláusula es
              inválida, el resto permanecerá vigente.
              <br />
              <strong>8.3 Acuerdo Completo:</strong> Estos Términos constituyen
              el acuerdo completo entre el usuario y el programador.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">CONTACTO</h2>
            <p className="mt-2">
              Para preguntas sobre estos Términos, contáctenos en:{" "}
              teneduriagarciasurl@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TerminosUso;
