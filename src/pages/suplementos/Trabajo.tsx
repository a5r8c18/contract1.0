import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

const SuplementoContrato = () => {
  const contratoRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    contratoTipo: "",
    contratoNumero: "",
    empleadorNombre: "",
    empleadorEscrituraNumero: "",
    empleadorFecha: "",
    empleadorDireccion: "",
    empleadorMunicipio: "",
    empleadorProvincia: "",
    empleadorNacionalidad: "",
    empleadorCodigoONEI: "",
    empleadorNIT: "",
    empleadorLibro: "",
    empleadorTomo: "",
    empleadorFolio: "",
    empleadorHoja: "",
    empleadorTelefonos: "",
    empleadorEmail: "",
    empleadorRepresentante: "",
    empleadorCondicion: "",
    empleadorDecisionNumero: "",
    empleadorDecisionFecha: "",
    empleadorNotario: "",
    empleadorNotarioProvincia: "",
    empleadorNotarioSede: "",
    empleadorNotarioProvinciaSede: "",
    trabajadorNombre: "",
    trabajadorEdad: "",
    trabajadorEstadoCivil: "",
    trabajadorProfesion: "",
    trabajadorIdentidad: "",
    trabajadorDireccion: "",
    trabajadorMunicipio: "",
    trabajadorProvincia: "",
    suplementoObjeto: "",
    suplementoClausulaModificada: "",
    suplementoPaginas: "",
    firmaLugar: "",
    firmaDia: "",
    firmaMes: "",
    firmaAnio: "2025",
  });

  const [isEditing, setIsEditing] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Datos guardados correctamente");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const exportToPDF = async () => {
    if (!contratoRef.current) {
      alert("Error: No se encontró el contenedor del contrato.");
      return;
    }

    try {
      const element = contratoRef.current;
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

      pdf.save("suplemento_contrato_trabajo.pdf");
    } catch (error) {
      console.error("Error generando el PDF:", error);
      alert("Error al generar el PDF. Revisa la consola para más detalles.");
    }
  };

  const isFormComplete = Object.values(formData).every(
    (value) => value.trim() !== ""
  );

  const renderField = (
    name: keyof typeof formData,
    placeholder: string,
    type: string = "text"
  ) => {
    if (isEditing) {
      if (type === "select") {
        return (
          <select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="p-1 border border-gray-300 rounded"
          >
            <option value="">{placeholder}</option>
            {name === "contratoTipo" && (
              <>
                <option value="Determinado">Determinado</option>
                <option value="Indeterminado">Indeterminado</option>
              </>
            )}
          </select>
        );
      }
      if (type === "textarea") {
        return (
          <textarea
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className="p-1 border border-gray-300 rounded w-full"
            rows={4}
          />
        );
      }
      return (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="p-1 border border-gray-300 rounded"
        />
      );
    }
    return <span className="font-medium">{formData[name] || placeholder}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between mb-6">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={!isFormComplete}
              className={`px-4 py-2 rounded-md text-white ${
                isFormComplete
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Guardar
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Editar
            </button>
          )}
          <button
            onClick={exportToPDF}
            disabled={isEditing || !isFormComplete}
            className={`px-4 py-2 rounded-md text-white ${
              isEditing || !isFormComplete
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Exportar a PDF
          </button>
        </div>
        <div ref={contratoRef} className="space-y-6 text-justify text-[14px]">
          <h1 className="text-2xl font-bold text-center">
            Suplemento al Contrato de Trabajo por Tiempo{" "}
            {renderField("contratoTipo", "Seleccione", "select")}
          </h1>
          <p className="text-center">
            Suplemento al Contrato de Trabajo por Tiempo{" "}
            {renderField("contratoTipo", "Seleccione", "select")} No.{" "}
            {renderField("contratoNumero", "Número")}
          </p>

          <section>
            <h2 className="text-xl font-semibold">DE UNA PARTE</h2>
            <p className="mt-2">
              {renderField("empleadorNombre", "Nombre de la entidad")},
              constituida mediante Escritura Pública número{" "}
              {renderField("empleadorEscrituraNumero", "Número")} de fecha{" "}
              {renderField("empleadorFecha", "", "date")}, con domicilio legal
              en {renderField("empleadorDireccion", "Dirección")}, municipio{" "}
              {renderField("empleadorMunicipio", "Municipio")}, provincia{" "}
              {renderField("empleadorProvincia", "Provincia")}, de nacionalidad{" "}
              {renderField("empleadorNacionalidad", "Nacionalidad")}, código
              ONEI {renderField("empleadorCodigoONEI", "Código ONEI")} y NIT{" "}
              {renderField("empleadorNIT", "NIT")}, Inscripción Registro
              Mercantil Libro {renderField("empleadorLibro", "Libro")}, Tomo{" "}
              {renderField("empleadorTomo", "Tomo")}, Folio{" "}
              {renderField("empleadorFolio", "Folio")}, Hoja{" "}
              {renderField("empleadorHoja", "Hoja")}, teléfonos{" "}
              {renderField("empleadorTelefonos", "Teléfonos")}, dirección
              electrónica: {renderField("empleadorEmail", "Email", "email")},
              representada en este acto por{" "}
              {renderField("empleadorRepresentante", "Representante")} en su
              condición de {renderField("empleadorCondicion", "Condición")}, lo
              que acredita mediante Decisión No.{" "}
              {renderField("empleadorDecisionNumero", "Número")} de fecha{" "}
              {renderField("empleadorDecisionFecha", "", "date")}, emitida por{" "}
              {renderField("empleadorNotario", "Notario")}, notario con
              competencia provincial en{" "}
              {renderField("empleadorNotarioProvincia", "Provincia")} y sede en{" "}
              {renderField("empleadorNotarioSede", "Sede")}, provincia{" "}
              {renderField("empleadorNotarioProvinciaSede", "Provincia")}, que
              en lo sucesivo y a los efectos de este contrato se denominará{" "}
              <strong>EL EMPLEADOR</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">DE OTRA PARTE</h2>
            <p className="mt-2">
              {renderField("trabajadorNombre", "Nombre del trabajador")},
              ciudadano(a) cubano(a), de {renderField("trabajadorEdad", "Edad")}{" "}
              años de edad, de estado conyugal{" "}
              {renderField("trabajadorEstadoCivil", "Estado civil")}, de
              profesión {renderField("trabajadorProfesion", "Profesión")}, con
              número de identidad permanente{" "}
              {renderField("trabajadorIdentidad", "Identidad")}, vecino de{" "}
              {renderField("trabajadorDireccion", "Dirección")}, municipio{" "}
              {renderField("trabajadorMunicipio", "Municipio")}, provincia{" "}
              {renderField("trabajadorProvincia", "Provincia")}, a quien en lo
              sucesivo y a los efectos del presente Contrato se denominará{" "}
              <strong>EL TRABAJADOR</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">LAS PARTES</h2>
            <p className="mt-2">
              Reconociéndose la personalidad y representación con que comparecen
              a este acto jurídico, a todos los efectos legales declaran y
              convienen suscribir el presente Suplemento, en los términos y
              condiciones que a continuación se detallan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              PRIMERO: OBJETO DEL SUPLEMENTO
            </h2>
            <p className="mt-2">
              El objeto de este Suplemento es{" "}
              {renderField("suplementoObjeto", "Objeto", "textarea")} lo
              establecido en el Contrato de Trabajo por Tiempo{" "}
              {renderField("contratoTipo", "Seleccione", "select")} No.{" "}
              {renderField("contratoNumero", "Número")}, específicamente a{" "}
              {renderField(
                "suplementoClausulaModificada",
                "Cláusula modificada",
                "textarea"
              )}
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">SEGUNDO: VIGENCIA</h2>
            <p className="mt-2">
              Todo aquello que no haya sido expresamente modificado por el
              presente mantiene su vigencia y efectos legales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">TERCERO: EXTENSIÓN</h2>
            <p className="mt-2">
              El presente suplemento consta de{" "}
              {renderField("suplementoPaginas", "Número de páginas")} páginas.
            </p>
          </section>

          <section>
            <p className="mt-2">
              Y para que así conste se extienden y firman por los contratantes,
              dos ejemplares del presente contrato, a un mismo tenor e igual
              fuerza legal, en {renderField("firmaLugar", "Lugar")}, a los{" "}
              {renderField("firmaDia", "Día")} del mes de{" "}
              {renderField("firmaMes", "Mes")} del{" "}
              {renderField("firmaAnio", "Año")}.
            </p>
            <div className="flex justify-between mt-6">
              <div>
                ___________________
                <br />
                EL TRABAJADOR
              </div>
              <div>
                ___________________
                <br />
                EL EMPLEADOR
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SuplementoContrato;
