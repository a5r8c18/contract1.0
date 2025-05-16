import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

const ContratoComodato = () => {
  const section1Ref = useRef<HTMLDivElement>(null); // DE UNA PARTE to 2. OBLIGACIONES
  const section2Ref = useRef<HTMLDivElement>(null); // 3. CESION to 6. SOLUCION DE CONFLICTOS
  const section3Ref = useRef<HTMLDivElement>(null); // 7. AVISO to ANEXO 1
  const [formData, setFormData] = useState({
    comodanteNombre: "",
    comodanteNacionalidad: "",
    comodanteDomicilio: "",
    comodanteMunicipio: "",
    comodanteIdentidad: "",
    comodatarioNombre: "",
    comodatarioConstitucion: "",
    comodatarioDomicilio: "",
    comodatarioMunicipio: "",
    comodatarioProvincia: "",
    comodatarioNacionalidad: "",
    comodatarioREEUPNIT: "",
    comodatarioLibro: "",
    comodatarioTomo: "",
    comodatarioFolio: "",
    comodatarioHoja: "",
    comodatarioCuentaBancaria: "",
    comodatarioTelefonos: "",
    comodatarioEmail: "",
    comodatarioRepresentante: "",
    comodatarioCondicion: "",
    comodatarioDecision: "",
    comodatarioDecisionFecha: "",
    comodatarioEmitidaPor: "",
    bienDescripción: "",
    vigenciaAnios: "",
    avisoComodanteAtt: "",
    avisoComodanteDireccion: "",
    avisoComodanteTelefono: "",
    avisoComodanteEmail: "",
    avisoComodatarioAtt: "",
    avisoComodatarioDireccion: "",
    avisoComodatarioTelefono: "",
    avisoComodatarioEmail: "",
    firmaDia: "",
    firmaMes: "",
    firmaAnio: "2024",
    anexoBienes: [
      { nombre: "", caracteristicas: "", marca: "", modelo: "", chapa: "" },
    ],
  });

  const [isEditing, setIsEditing] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAnexoChange = (index: number, field: string, value: string) => {
    const updatedAnexo = [...formData.anexoBienes];
    updatedAnexo[index] = { ...updatedAnexo[index], [field]: value };
    setFormData({ ...formData, anexoBienes: updatedAnexo });
  };

  const addAnexoRow = () => {
    setFormData({
      ...formData,
      anexoBienes: [
        ...formData.anexoBienes,
        { nombre: "", caracteristicas: "", marca: "", modelo: "", chapa: "" },
      ],
    });
  };

  const removeAnexoRow = (index: number) => {
    if (formData.anexoBienes.length > 1) {
      const updatedAnexo = formData.anexoBienes.filter((_, i) => i !== index);
      setFormData({ ...formData, anexoBienes: updatedAnexo });
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Datos guardados correctamente");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const isFormComplete = () => {
    const requiredFields = Object.entries(formData).every(([key, value]) => {
      if (key === "anexoBienes") {
        return formData.anexoBienes.every(
          (bien) =>
            bien.nombre.trim() !== "" &&
            bien.caracteristicas.trim() !== "" &&
            bien.marca.trim() !== "" &&
            bien.modelo.trim() !== "" &&
            bien.chapa.trim() !== ""
        );
      }
      return typeof value === "string" ? value.trim() !== "" : true;
    });
    return requiredFields;
  };

  const exportToPDF = async () => {
    const refs = [section1Ref, section2Ref, section3Ref];
    if (refs.some((ref) => !ref.current)) {
      alert("Error: No se encontraron todas las secciones del contrato.");
      return;
    }

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm

      for (let i = 0; i < refs.length; i++) {
        const element = refs[i].current!;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: true,
          backgroundColor: "#ffffff",
          width: element.scrollWidth,
          height: element.scrollHeight,
        });

        const imageData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = pageWidth / imgWidth;
        const scaledWidth = imgWidth * ratio;
        const scaledHeight = imgHeight * ratio;

        if (i > 0) {
          pdf.addPage();
        }

        pdf.setFont("helvetica");
        pdf.setFontSize(14);
        pdf.addImage(imageData, "PNG", 0, 0, scaledWidth, scaledHeight);
      }

      pdf.save("contrato_comodato.pdf");
    } catch (error) {
      console.error("Error generando el PDF:", error);
      alert("Error al generar el PDF. Revisa la consola para más detalles.");
    }
  };

  const renderField = (
    name: keyof typeof formData,
    placeholder: string,
    type: string = "text"
  ) => {
    if (isEditing) {
      return (
        <input
          type={type}
          name={name}
          value={formData[name] as string}
          onChange={handleChange}
          placeholder={placeholder}
          className="p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
        />
      );
    }
    return (
      <span className="font-medium text-gray-900 dark:text-gray-200">
        {(formData[name] as string) || placeholder}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-gray-900 dark:text-gray-200">
        <div className="flex justify-between mb-6">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={!isFormComplete()}
              className={`px-4 py-2 rounded-md text-white ${
                isFormComplete()
                  ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                  : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              }`}
            >
              Guardar
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 spokeswoman-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              Editar
            </button>
          )}
          <button
            onClick={exportToPDF}
            disabled={isEditing || !isFormComplete()}
            className={`px-4 py-2 rounded-md text-white ${
              isEditing || !isFormComplete()
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600"
            }`}
          >
            Exportar a PDF
          </button>
        </div>
        <div className="space-y-6 text-justify text-[14px]">
          <div ref={section1Ref} className="pdf-section bg-white p-4">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
              Contrato de Comodato
            </h1>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DE UNA PARTE
              </h2>
              <p className="mt-2">
                {renderField("comodanteNombre", "Nombre del comodante")}, de
                nacionalidad{" "}
                {renderField("comodanteNacionalidad", "Nacionalidad")}, con
                domicilio social en{" "}
                {renderField("comodanteDomicilio", "Domicilio")}, municipio{" "}
                {renderField("comodanteMunicipio", "Municipio")}, provincia La
                Habana, con carnet de identidad permanente{" "}
                {renderField("comodanteIdentidad", "Identidad")}, que en lo
                sucesivo y a los efectos del presente Contrato se denominará{" "}
                <strong>EL COMODANTE</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DE OTRA PARTE
              </h2>
              <p className="mt-2">
                {renderField("comodatarioNombre", "Nombre del comodatario")},
                constituida mediante{" "}
                {renderField("comodatarioConstitucion", "Constitución")}, con
                domicilio legal en{" "}
                {renderField("comodatarioDomicilio", "Domicilio")}, municipio{" "}
                {renderField("comodatarioMunicipio", "Municipio")}, provincia{" "}
                {renderField("comodatarioProvincia", "Provincia")}, de
                nacionalidad{" "}
                {renderField("comodatarioNacionalidad", "Nacionalidad")}, código
                REEUP y NIT: {renderField("comodatarioREEUPNIT", "REEUP y NIT")}
                , Inscripción Registro Mercantil Libro{" "}
                {renderField("comodatarioLibro", "Libro")}, Tomo{" "}
                {renderField("comodatarioTomo", "Tomo")}, Folio{" "}
                {renderField("comodatarioFolio", "Folio")}, Hoja{" "}
                {renderField("comodatarioHoja", "Hoja")}, Cuenta bancaria No.{" "}
                {renderField("comodatarioCuentaBancaria", "Cuenta bancaria")},
                teléfonos {renderField("comodatarioTelefonos", "Teléfonos")},
                dirección electrónica:{" "}
                {renderField("comodatarioEmail", "Email", "email")},
                representada en este acto por{" "}
                {renderField("comodatarioRepresentante", "Representante")} en su
                condición de {renderField("comodatarioCondicion", "Condición")},
                lo que acredita mediante{" "}
                {renderField("comodatarioDecision", "Decisión")} de fecha{" "}
                {renderField("comodatarioDecisionFecha", "", "date")}, emitida
                por {renderField("comodatarioEmitidaPor", "Emitida por")}, que
                en lo sucesivo y a los efectos de este contrato se denominará{" "}
                <strong>EL COMODATARIO</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                AMBAS PARTES
              </h2>
              <p className="mt-2">
                Reconociéndose respectivamente su capacidad y representación con
                que comparecen convienen suscribir el presente Contrato bajo los
                términos y condiciones siguientes:
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                1. OBJETO DEL CONTRATO
              </h2>
              <p className="mt-2">
                1.1 Por el presente contrato <strong>EL COMODANTE</strong> se
                obliga a ceder gratuitamente al <strong>COMODATARIO</strong> el
                uso del {renderField("bienDescripción", "Descripción del bien")}{" "}
                cuyas descripciones aparecen detalladas en el{" "}
                <strong>ANEXO 1</strong> al presente y{" "}
                <strong>EL COMODATARIO</strong> los devolverá una vez finalizado
                el tiempo pactado.
                <br />
                1.2 <strong>EL COMODANTE</strong> declara que es propietario de
                los bienes que cede en comodato los cuales se destinarán al
                cumplimiento del Objeto Social aprobado a la empresa, estándole
                prohibido a <strong>EL COMODATARIO</strong> modificar el destino
                antes mencionado.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                2. OBLIGACIONES DE LAS PARTES
              </h2>
              <p className="mt-2">
                <strong>2.1 Obligaciones de EL COMODANTE:</strong>
                <br />
                2.1.1 Entregar el bien en comodato referido en el{" "}
                <strong>ANEXO 1</strong> del presente contrato a{" "}
                <strong>EL COMODATARIO</strong>.
                <br />
                2.1.2 Garantizar a <strong>EL COMODATARIO</strong> la posesión
                pacífica del bien durante la vigencia del presente.
                <br />
                2.1.3 Pagar los gastos extraordinarios en que haya incurrido{" "}
                <strong>EL COMODATARIO</strong> como consecuencia de la
                conservación del bien siempre que este le haya informado de
                tales pagos debidamente justificados.
                <br />
                2.1.4 Reembolsar a <strong>EL COMODATARIO</strong> los gastos en
                que haya incurrido por daños originados por vicios ocultos del
                bien, siempre que los conociere y no los hubiese advertido
                oportunamente.
                <br />
                <strong>2.2 Obligaciones de EL COMODATARIO:</strong>
                <br />
                2.2.1 Usar el bien de acuerdo al destino señalado en la sub
                cláusula 1.2.
                <br />
                2.2.2 Responder por los daños ocasionados al bien cuando lo use
                de modo contrario a lo pactado o a su naturaleza o destino.
                <br />
                2.2.3 Pagar los gastos ordinarios que se derivan del uso y
                conservación del bien.
                <br />
                2.2.4 Devolver el bien en el plazo previsto en el presente
                contrato.
              </p>
            </section>
          </div>

          <div ref={section2Ref} className="pdf-section bg-white p-4">
            <section>
              <h2 className="text-xl font-semibold text-gray- personally-800 dark:text-gray-200">
                3. CESIÓN
              </h2>
              <p className="mt-2">
                3.1 <strong>EL COMODATARIO</strong> no podrá ceder el bien
                objeto del presente a un tercero a menos que lo autorice{" "}
                <strong>EL COMODANTE</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                4. VIGENCIA, MODIFICACIÓN Y EXTINCIÓN DEL CONTRATO
              </h2>
              <p className="mt-2">
                4.1 La duración del presente Contrato será de{" "}
                {renderField("vigenciaAnios", "Años")} años.
                <br />
                4.1.1 <strong>LAS PARTES</strong> durante el cumplimiento del
                presente Contrato pueden acordar modificaciones a las
                obligaciones, condiciones y términos que se pactaron en el
                Contrato. Toda adición, modificación, especificación o enmienda
                que se pretenda realizar al presente Contrato, solamente podrá
                formalizarse mediante Suplementos que adquirirán plena validez y
                efecto legal a partir de la fecha de su firma por{" "}
                <strong>AMBAS PARTES</strong> contratantes.
                <br />
                4.1.2 El presente Contrato se extinguirá por las siguientes
                causas:
                <br />
                4.1.3 Muerte de <strong>EL COMODANTE</strong> o de{" "}
                <strong>EL COMODATARIO</strong>.
                <br />
                4.1.4 Destinar <strong>EL COMODATARIO</strong> el bien a un uso
                incompatible con su naturaleza o distinto del pactado.
                <br />
                4.1.5 Ceder <strong>EL COMODATARIO</strong>, sin permiso, a un
                tercero, el uso del bien.
                <br />
                4.1.6 Reclamar <strong>EL COMODANTE</strong> el bien antes de
                haber vencido el término del contrato o de haber concluido el
                uso convenido, por tener necesidad urgente de él siempre con al
                menos 15 días de antelación a la fecha en que pretenda que surta
                efectos.
                <br />
                4.1.7 El resto de las causas generales de extinción de los
                contratos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                5. RECLAMACIONES
              </h2>
              <p className="mt-2">
                5.1 <strong>LAS PARTES</strong> podrán reclamarse mutuamente por
                el incumplimiento o cumplimiento inadecuado de sus obligaciones
                contractuales, por escrito, dentro de los quince (15) días
                naturales contados a partir de la fecha de ocurrencia del
                incumplimiento.
                <br />
                5.2 Todas las reclamaciones se efectuarán por escrito en el
                domicilio legal de la otra Parte, debiendo la Parte reclamada
                dar respuesta dentro de los treinta (30) días naturales
                posteriores a la fecha de su notificación.
                <br />
                5.3 Toda comunicación efectuada por medio del correo electrónico
                requerirá de su acuse de recibo como constancia de su recepción.
                De no recibirse el acuse en el término de cuarenta y ocho (48)
                horas, el emisor deberá utilizar otra vía de comunicación que
                permita poner en conocimiento del destinatario del correo
                electrónico que le ha sido enviada la información por la vía del
                correo electrónico.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                6. SOLUCIÓN DE CONFLICTOS
              </h2>
              <p className="mt-2">
                6.1 <strong>LAS PARTES</strong> se comprometen a cumplir el
                presente Contrato de buena fe, y a solucionar mediante
                negociaciones amigables las posibles discrepancias que surgieren
                en la ejecución del presente Contrato y/o en relación con el
                mismo, debiendo dejar evidencia escrita de las conciliaciones
                realizadas.
                <br />
                6.2 De no llegarse a acuerdo someterán sus discrepancias a la
                decisión de la Sala de lo Económico del Tribunal Provincial
                Popular de La Habana, portando en todos los casos las evidencias
                escritas de las conciliaciones realizadas.
              </p>
            </section>
          </div>

          <div ref={section3Ref} className="pdf-section bg-white p-4">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                7. AVISO ENTRE LAS PARTES
              </h2>
              <p className="mt-2">
                7.1 Todos los avisos entre las partes se realizarán por correo
                electrónico u otros medios telemáticos y carta certificada a las
                siguientes direcciones:
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  A EL COMODANTE:
                </h3>
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Att.
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoComodanteAtt", "Atención")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Dirección:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoComodanteDireccion", "Dirección")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Teléfono:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoComodanteTelefono", "Teléfono")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        E-mail:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoComodanteEmail", "Email", "email")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  A EL COMODATARIO:
                </h3>
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Att.
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoComodatarioAtt", "Atención")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Dirección:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoComodatarioDireccion", "Dirección")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Teléfono:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoComodatarioTelefono", "Teléfono")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        E-mail:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoComodatarioEmail", "Email", "email")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                8. OTRAS CONDICIONES
              </h2>
              <p className="mt-2">
                8.1 <strong>EL COMODATARIO</strong> no puede retener el bien
                bajo pretexto de que <strong>EL COMODANTE</strong> es deudor de
                él, aun cuando se trate de gastos extraordinarios o costas.
                <br />
                8.2 El presente Contrato se rige e interpreta de conformidad con
                lo establecido en la Ley No. 141/21 “Código de Procesos”,
                Resolución 183/2020 “Normas Bancarias para los Cobros y Pagos”,
                Decreto Ley No.304/2012 “De la Contratación Económica” y el
                Decreto No.310/2012 “De los Tipos de Contratos”, la Ley No.59/87
                “Código Civil”, y demás disposiciones legales que le sean de
                aplicación.
              </p>
            </section>

            <section>
              <p className="mt-2">
                Y PARA QUE ASÍ CONSTE, se extienden y firman dos ejemplares en
                idioma español, a un mismo tenor e idénticos efectos legales, en
                La Habana, a los {renderField("firmaDia", "Día")} días del mes
                de {renderField("firmaMes", "Mes")} de{" "}
                {renderField("firmaAnio", "Año")}.
              </p>
              <div className="flex justify-between mt-6">
                <div>
                  ___________________
                  <br />
                  EL COMODANTE
                </div>
                <div>
                  ___________________
                  <br />
                  EL COMODATARIO
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                ANEXO 1: DESCRIPCIÓN DE LOS BIENES
              </h2>
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 mt-4">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-gray-700 p-2">
                      Nombres y Apellidos
                    </th>
                    <th className="border border-gray-300 dark:border-gray-700 p-2">
                      Características (No. de circulación y otros)
                    </th>
                    <th className="border border-gray-300 dark:border-gray-700 p-2">
                      Marca
                    </th>
                    <th className="border border-gray-300 dark:border-gray-700 p-2">
                      Modelo
                    </th>
                    <th className="border border-gray-300 dark:border-gray-700 p-2">
                      Chapa
                    </th>
                    {isEditing && (
                      <th className="border border-gray-300 dark:border-gray-700 p-2">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {formData.anexoBienes.map((bien, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={bien.nombre}
                            onChange={(e) =>
                              handleAnexoChange(index, "nombre", e.target.value)
                            }
                            placeholder="Nombres y Apellidos"
                            className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                          />
                        ) : (
                          bien.nombre || "Nombres y Apellidos"
                        )}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={bien.caracteristicas}
                            onChange={(e) =>
                              handleAnexoChange(
                                index,
                                "caracteristicas",
                                e.target.value
                              )
                            }
                            placeholder="Características"
                            className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                          />
                        ) : (
                          bien.caracteristicas || "Características"
                        )}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={bien.marca}
                            onChange={(e) =>
                              handleAnexoChange(index, "marca", e.target.value)
                            }
                            placeholder="Marca"
                            className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                          />
                        ) : (
                          bien.marca || "Marca"
                        )}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={bien.modelo}
                            onChange={(e) =>
                              handleAnexoChange(index, "modelo", e.target.value)
                            }
                            placeholder="Modelo"
                            className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                          />
                        ) : (
                          bien.modelo || "Modelo"
                        )}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={bien.chapa}
                            onChange={(e) =>
                              handleAnexoChange(index, "chapa", e.target.value)
                            }
                            placeholder="Chapa"
                            className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                          />
                        ) : (
                          bien.chapa || "Chapa"
                        )}
                      </td>
                      {isEditing && (
                        <td className="border border-gray-300 dark:border-gray-700 p-2">
                          <button
                            onClick={() => removeAnexoRow(index)}
                            disabled={formData.anexoBienes.length === 1}
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {isEditing && (
                <button
                  onClick={addAnexoRow}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Agregar Fila
                </button>
              )}
              <div className="flex justify-between mt-6">
                <div>
                  ___________________
                  <br />
                  EL COMODANTE
                </div>
                <div>
                  ___________________
                  <br />
                  EL COMODATARIO
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContratoComodato;
