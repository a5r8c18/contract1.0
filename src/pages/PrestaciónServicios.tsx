import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

const PrestacionServicios = () => {
  // Referencias para secciones del contrato
  const section1Ref = useRef<HTMLDivElement>(null); // DE UNA PARTE to 12. VIGENCIA
  const section2Ref = useRef<HTMLDivElement>(null); // 13. AVISO to ANEXO I
  const section3Ref = useRef<HTMLDivElement>(null); // ANEXO II

  const [formData, setFormData] = useState({
    prestadorNombre: "",
    prestadorIdentidad: "",
    prestadorDomicilio: "",
    prestadorMunicipio: "",
    prestadorProvincia: "",
    prestadorNIT: "",
    prestadorCuentaBancaria: "",
    prestadorAgenciaBanco: "",
    prestadorUbicacionAgencia: "",
    prestadorLicenciaComercial: "",
    prestadorTelefono: "",
    prestadorMunicipalidadTrabajo: "",
    prestadorCertificadoFecha: "",
    clienteNombre: "",
    clienteConstitucionTipo: "",
    clienteConstitucionNumero: "",
    clienteConstitucionFecha: "",
    clienteDomicilio: "",
    clienteMunicipio: "",
    clienteProvincia: "",
    clienteNacionalidad: "",
    clienteREEUPNIT: "",
    clienteLibro: "",
    clienteTomo: "",
    clienteFolio: "",
    clienteHoja: "",
    clienteCuentaBancaria: "",
    clienteTelefonos: "",
    clienteEmail: "",
    clienteRepresentante: "",
    clienteCondicion: "",
    clienteDocumentoTipo: "",
    clienteDocumentoNumero: "",
    clienteDocumentoFecha: "",
    clienteNotario: "",
    clienteNotarioProvincia: "",
    clienteNotarioSede: "",
    clienteNotarioProvinciaSede: "",
    servicioNombre: "",
    servicioLugar: "",
    servicioFechaInicioDia: "",
    servicioFechaInicioMes: "",
    servicioFechaInicioAnio: "",
    servicioCaracteristicas: "",
    servicioCondicionesDatos: "",
    servicioCondicionesLocal: "",
    servicioCondicionesEquiposOficina: "",
    servicioCondicionesEquiposComputo: "",
    servicioCondicionesAula: "",
    servicioCondicionesTransportacion: "",
    servicioCondicionesOtros: "",
    servicioPlazoEjecucion: "",
    servicioImporte: "",
    servicioMoneda: "",
    servicioInstrumentoPago: "",
    precioServicioMensual: "",
    monedaPago: "",
    metodoPago: "",
    suplementoModificacionDias: "",
    suplementoHorarioInicio: "",
    suplementoHorarioFin: "",
    prestadorContactoNombre: "",
    prestadorContactoDireccion: "",
    prestadorContactoTelefono: "",
    prestadorContactoEmail: "",
    clienteContactoNombre: "",
    clienteContactoDireccion: "",
    clienteContactoTelefono: "",
    clienteContactoEmail: "",
    clienteFichaNombreEntidad: "",
    clienteFichaDireccion: "",
    clienteFichaTelefono: "",
    clienteFichaEmail: "",
    clienteFichaCodigoEntidad: "",
    clienteFichaOrganismo: "",
    clienteFichaNIT: "",
    clienteFichaCuentaCUP: "",
    clienteFichaSucursalCUP: "",
    clienteFichaDireccionSucursalCUP: "",
    clienteAutorizado1Nombre: "",
    clienteAutorizado1Cargo: "",
    clienteAutorizado1Identidad: "",
    clienteAutorizado2Nombre: "",
    clienteAutorizado2Cargo: "",
    clienteAutorizado2Identidad: "",
    clienteConciliacion1Nombre: "",
    clienteConciliacion1Cargo: "",
    clienteConciliacion1Identidad: "",
    clienteConciliacion2Nombre: "",
    clienteConciliacion2Cargo: "",
    clienteConciliacion2Identidad: "",
    clienteRepresentanteContrato: "",
    clienteRepresentanteCargo: "",
    clienteDirectorNombre: "",
    clienteDirectorIdentidad: "",
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
    const refs = [section1Ref, section2Ref, section3Ref];
    if (refs.some((ref) => !ref.current)) {
      alert("Error: No se encontraron todas las secciones del contrato.");
      return;
    }

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;

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
        const ratio = contentWidth / imgWidth;
        const scaledWidth = imgWidth * ratio;
        const scaledHeight = imgHeight * ratio;

        if (i > 0) {
          pdf.addPage();
        }

        pdf.setFont("helvetica");
        pdf.setFontSize(14);
        pdf.addImage(
          imageData,
          "PNG",
          margin,
          margin,
          scaledWidth,
          scaledHeight
        );

        // Agregar número de página
        pdf.setFontSize(10);
        pdf.text(
          `Página ${i + 1} de ${refs.length}`,
          pageWidth - margin - 30,
          pdf.internal.pageSize.getHeight() - 10
        );
      }

      pdf.save("contrato_prestacion_servicios.pdf");
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
            className="p-1 border border-gray-300 rounded w-full"
          >
            <option value="">{placeholder}</option>
            {name === "clienteConstitucionTipo" && (
              <>
                <option value="Escritura de Constitución">
                  Escritura de Constitución
                </option>
                <option value="Resolución">Resolución</option>
                <option value="Acuerdo">Acuerdo</option>
              </>
            )}
            {name === "clienteDocumentoTipo" && (
              <>
                <option value="Decisión">Decisión</option>
                <option value="Acuerdo">Acuerdo</option>
                <option value="Resolución">Resolución</option>
              </>
            )}
            {name === "servicioMoneda" && (
              <>
                <option value="CUP">CUP</option>
                <option value="USD">USD</option>
              </>
            )}
            {name === "metodoPago" && (
              <>
                <option value="Transferencia Bancaria">
                  Transferencia Bancaria
                </option>
                <option value="Cheque Nominativo">Cheque Nominativo</option>
                <option value="Efectivo">Efectivo</option>
              </>
            )}
            {name === "servicioCondicionesDatos" && (
              <>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </>
            )}
            {name === "servicioCondicionesLocal" && (
              <>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </>
            )}
            {name === "servicioCondicionesEquiposOficina" && (
              <>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </>
            )}
            {name === "servicioCondicionesEquiposComputo" && (
              <>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </>
            )}
            {name === "servicioCondicionesAula" && (
              <>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </>
            )}
            {name === "servicioCondicionesTransportacion" && (
              <>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
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
          className="p-1 border border-gray-300 rounded w-full"
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
        <div className="space-y-6 text-justify text-[14px]">
          <div ref={section1Ref} className="pdf-section bg-white p-4">
            <h1 className="text-2xl font-bold text-center">
              Contrato de Prestación de Servicios
            </h1>

            <section>
              <h2 className="text-xl font-semibold">DE UNA PARTE</h2>
              <p className="mt-2">
                La Trabajadora por Cuenta Propia{" "}
                {renderField("prestadorNombre", "Nombre del prestador")},
                ciudadana cubana mayor de edad con carné de Identidad No.{" "}
                {renderField("prestadorIdentidad", "Número de identidad")}, con
                domicilio legal en calle{" "}
                {renderField("prestadorDomicilio", "Domicilio")}, municipio{" "}
                {renderField("prestadorMunicipio", "Municipio")}, provincia{" "}
                {renderField("prestadorProvincia", "Provincia")}, con NIT{" "}
                {renderField("prestadorNIT", "NIT")}, y cuenta bancaria No.{" "}
                {renderField("prestadorCuentaBancaria", "Número de cuenta")}, en
                el Banco Metropolitano, Agencia{" "}
                {renderField("prestadorAgenciaBanco", "Agencia")}, sito en{" "}
                {renderField("prestadorUbicacionAgencia", "Ubicación agencia")},
                con No. de licencia comercial{" "}
                {renderField(
                  "prestadorLicenciaComercial",
                  "Número de licencia"
                )}
                , teléfono {renderField("prestadorTelefono", "Teléfono")} y a
                los efectos de este contrato se denominará{" "}
                <strong>EL PRESTADOR</strong> en su condición de trabajador por
                cuenta propia acreditado mediante Certificado de Validación del
                proyecto de trabajo autorizado a ejercer la actividad de
                Arrendador de espacio emitida por la Dirección Municipal de
                Trabajo de{" "}
                {renderField("prestadorMunicipalidadTrabajo", "Municipalidad")}{" "}
                con fecha {renderField("prestadorCertificadoFecha", "", "date")}
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">DE LA OTRA PARTE</h2>
              <p className="mt-2">
                {renderField("clienteNombre", "Nombre del cliente")},
                constituida mediante{" "}
                {renderField("clienteConstitucionTipo", "Seleccione", "select")}{" "}
                No. {renderField("clienteConstitucionNumero", "Número")} de
                fecha {renderField("clienteConstitucionFecha", "", "date")}, con
                domicilio legal en{" "}
                {renderField("clienteDomicilio", "Domicilio")}, municipio{" "}
                {renderField("clienteMunicipio", "Municipio")}, provincia{" "}
                {renderField("clienteProvincia", "Provincia")}, de nacionalidad{" "}
                {renderField("clienteNacionalidad", "Nacionalidad")}, código
                REEUP y NIT {renderField("clienteREEUPNIT", "REEUP y NIT")},
                Inscripción Registro Mercantil Libro{" "}
                {renderField("clienteLibro", "Libro")}, Tomo{" "}
                {renderField("clienteTomo", "Tomo")}, Folio{" "}
                {renderField("clienteFolio", "Folio")}, Hoja{" "}
                {renderField("clienteHoja", "Hoja")}, cuenta bancaria No.{" "}
                {renderField("clienteCuentaBancaria", "Número de cuenta")},
                teléfonos {renderField("clienteTelefonos", "Teléfonos")},
                dirección electrónica:{" "}
                {renderField("clienteEmail", "Email", "email")}, representada en
                este acto por{" "}
                {renderField("clienteRepresentante", "Representante")} en su
                condición de {renderField("clienteCondicion", "Condición")}, lo
                que acredita mediante{" "}
                {renderField("clienteDocumentoTipo", "Seleccione", "select")}{" "}
                No. {renderField("clienteDocumentoNumero", "Número")} de fecha{" "}
                {renderField("clienteDocumentoFecha", "", "date")}, emitida por{" "}
                {renderField("clienteNotario", "Notario")}, notario con
                competencia provincial en{" "}
                {renderField("clienteNotarioProvincia", "Provincia")} y sede en
                la {renderField("clienteNotarioSede", "Sede")}, provincia{" "}
                {renderField("clienteNotarioProvinciaSede", "Provincia")}, que
                en lo sucesivo y a los efectos de este contrato se denominará{" "}
                <strong>EL CLIENTE</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">AMBAS PARTES</h2>
              <p className="mt-2">
                Ambas partes, reconociéndose mutuamente la capacidad legal y
                representación con que comparecen a este acto jurídico, ACUERDAN
                suscribir el presente Contrato de Prestación de Servicios bajo
                los términos y condiciones que a continuación se definen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">1. OBJETO DEL CONTRATO</h2>
              <p className="mt-2">
                Por el presente Contrato se regularán los términos y condiciones
                bajo los cuales EL PRESTADOR prestará a EL CLIENTE el servicio
                especificado en el ANEXO I del presente bajo los términos,
                requisitos y condiciones establecidos en el mismo debidamente
                firmados los cuales formarán parte integrante del presente
                Contrato.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                2. OBLIGACIONES DE LAS PARTES
              </h2>
              <p className="mt-2">
                <strong>2.1 Son obligaciones de EL PRESTADOR:</strong>
                <br />
                2.1.1 Ofrecer los servicios contratados de acuerdo a los
                requisitos, términos, características y condiciones previstas en
                el Anexo I al presente.
                <br />
                2.1.2 EL PRESTADOR se reservará el derecho a realizar
                modificaciones o mejoras durante la prestación del servicio, las
                cuales serán notificadas y conciliadas previamente a EL CLIENTE.
                <br />
                2.1.3 Atender las quejas o reclamaciones realizadas por EL
                CLIENTE y dar respuestas a estas, según los términos del
                presente contrato.
                <br />
                2.1.4 Ofertar con calidad y garantía los servicios descritos en
                el Anexo I.
                <br />
                2.1.5 Garantizar la discreción acerca de los conocimientos que
                sobre EL CLIENTE sean conocidos durante el cumplimiento del
                presente contrato y no entregar estos a terceros por razón
                alguna, excepto que lo solicite alguna autoridad judicial.
                Cuando para fines concretos se necesite divulgar alguna
                información personal de EL CLIENTE se le informará para que este
                emita su consentimiento y en caso de ser negativo no se hará
                pública dicha información.
                <br />
                2.1.6 Ofrecer el servicio en periodo que se acuerde entre las
                partes.
                <br />
                2.1.7 Será responsabilidad de EL CLIENTE que la información con
                la que se trabaje sea veraz.
                <br />
                <strong>2.2 Son obligaciones de EL CLIENTE:</strong>
                <br />
                2.2.1 Ajustarse a las estipulaciones acordadas. No pudiendo
                entregarle a otra entidad las herramientas que se brindan
                mediante el presente contrato.
                <br />
                2.2.2 Facilitar todo aquello que se le solicite por el personal
                designado por EL PRESTADOR para el comienzo de los trabajos.
                <br />
                2.2.3 Utilizar únicamente para los fines del presente contrato y
                con la máxima diligencia posible, los servicios que le facilite
                EL PRESTADOR; de lo contrario este no garantiza ni asume
                responsabilidad alguna sobre la prestación del servicio
                contratado, siendo EL CLIENTE el único responsable de cualquier
                consecuencia que pudiera derivarse de ello.
                <br />
                2.2.4 Brindar todas las facilidades necesarias a EL PRESTADOR
                para la adecuada ejecución de los servicios objeto de este
                contrato.
                <br />
                2.2.5 EL CLIENTE efectuará el pago de los servicios contratados
                en los términos y condiciones establecidos en el presente
                contrato.
                <br />
                2.2.6 Realizar el reporte de las averías en el domicilio de EL
                PRESTADOR, en casos que se encuentre en el término de la
                garantía o se pretenda contratar otro servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                3. LUGAR DE EJECUCIÓN Y CONDICIONES DE ENTREGA
              </h2>
              <p className="mt-2">
                3.1 El Servicio contratado se ejecutará en el lugar indicado en
                Anexo I que forma parte integrante del presente:{" "}
                {renderField("servicioLugar", "Lugar del servicio")}.
                <br />
                3.2 EL CLIENTE correrá con los gastos de alimentación y
                transporte cuando se tengan que trasladar fuera del municipio
                del domicilio de EL PRESTADOR.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">4. CALIDAD Y GARANTÍA</h2>
              <p className="mt-2">
                4.1 EL PRESTADOR garantizará que los servicios prestados se
                prestarán con la calidad requerida.
                <br />
                4.2 Si EL CLIENTE no comunica la existencia de incidencia a EL
                PRESTADOR durante el periodo referido, se considerará que está
                conforme en todos los aspectos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">5. PROTECCIÓN DE DATOS</h2>
              <p className="mt-2">
                5.1 En cumplimiento de la Ley No.149/2022 EL PRESTADOR se
                compromete al cumplimiento de su obligación de secreto respecto
                de los datos de carácter personal de EL CLIENTE y adoptará las
                medidas necesarias que garanticen la seguridad de los datos de
                carácter personal y eviten su alteración, pérdida, tratamiento o
                acceso no autorizado.
                <br />
                5.2 Cumpliendo lo establecido en la Ley No.149/2022 Ley de
                Protección de Datos Personales los datos de EL CLIENTE
                expresados en las generalidades del presente contrato podrán ser
                utilizados con la finalidad de enviarle comunicaciones
                comerciales y de cortesía relacionadas con nuestra entidad a
                través del teléfono, correo electrónico, o medios de
                comunicación electrónica equivalentes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                6. VALOR, CONDICIONES Y FORMA DE PAGO
              </h2>
              <p className="mt-2">
                6.1 El precio del servicio será de{" "}
                {renderField("precioServicioMensual", "Cantidad")} mensual. La
                moneda de pago será el {renderField("monedaPago", "Moneda")}.
                <br />
                6.2 El pago se efectuará previa entrega de factura. El primer
                mes se pagará de forma anticipada a la firma del contrato.
                <br />
                6.3 EL PRESTADOR presentará las facturas del servicio prestado,
                y EL CLIENTE tendrá 30 días naturales a partir de la fecha de
                recibido para efectuar los pagos de las facturas, especificando
                en cada caso la factura que paga.
                <br />
                6.4 EL CLIENTE efectuará el pago mediante{" "}
                {renderField("metodoPago", "Seleccione", "select")} a la Cuenta
                que se detallará en la Factura. En caso de la utilización del
                cheque nominativo, este deberá entregarse personalmente al
                titular de la Factura presentada, según lo estipulado en la
                Resolución No. 183 del 26 de noviembre de 2020 del BCC “Normas
                Bancarias para los Cobros y Pagos”.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                7. RESPONSABILIDADES Y PENALIDADES
              </h2>
              <p className="mt-2">
                7.1 Las Partes convenían en cumplir de buena fe con las
                condiciones y términos que se establecen en el presente
                contrato.
                <br />
                7.2 La Parte que incumpla total o parcialmente cualquiera de sus
                obligaciones contractuales será responsable del incumplimiento
                cuando éste le sea imputable por intención, imprudencia o
                negligencia, en el sentido y alcance de la indemnización de los
                daños y/o los perjuicios que se ocasionen por ello a LA OTRA
                PARTE.
                <br />
                7.3 Cuando EL PRESTADOR incumpliese o fuera moroso con el plazo
                de ejecución previsto, podrá ser penalizado en la cuantía
                siguiente:
                <br />
                - Durante los primeros 30 días: 2% por cada día.
                <br />
                - Durante los siguientes 30 días: 4% por cada día.
                <br />
                - Más de 60 días: 6% por cada día.
                <br />
                7.4 En igual cuantía será penalizado EL CLIENTE cuando
                incumpliese con la obligación de pago o con cualquier cláusula
                del presente contrato o sus suplementos; paralelamente, EL
                PRESTADOR podrá disponer la suspensión temporal del servicio
                hasta tanto se abonen los adeudos pendientes incluyendo la
                afectación económica por la mora en el pago.
                <br />
                7.5 Independientemente de proceder de la manera descrita en el
                acápite 7.4, cuando el incumplimiento en el pago por parte de EL
                CLIENTE se extienda en el tiempo o sea reiterado, y pese a las
                gestiones realizadas se mantenga la deuda, EL PRESTADOR podrá
                suspender la ejecución del servicio contratado, reiniciándolo
                posteriormente, previa negociación, una vez se haya efectuado el
                pago del principal y de la penalidad mencionada en el acápite
                anterior o de igual manera podrá dar por resuelto el contrato de
                prestación de servicio, sin perjuicio de que pueda exigir el
                cumplimiento de otras obligaciones pendientes.
                <br />
                7.6 La suma total de la penalidad no podrá exceder del 8 % del
                valor total.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">8. RECLAMACIONES</h2>
              <p className="mt-2">
                8.1 LAS PARTES acuerdan cumplir sus obligaciones contractuales
                de buena fe. Cualquier controversia o discrepancia que surja en
                la ejecución, interpretación o de cualquier forma relacionada
                con el presente contrato o de un suplemento, será solucionado de
                forma amigable en primera instancia.
                <br />
                8.2 Ante la posibilidad de incumplimiento del contrato, LAS
                PARTES deben comunicarse de inmediato y conforme con el
                principio de buena fe contractual, adoptarán las medidas
                efectivas que tiendan a disminuir el efecto del incumplimiento.
                Si la causa del incumplimiento obedece a disposiciones de órgano
                u organismo del Estado, de obligatorio cumplimiento, LA PARTE
                afectada deberá presentar los documentos contentivos de las
                mismas.
                <br />
                8.3 LAS PARTES deben dejar evidencias de todas las gestiones que
                se realicen para tratar de resolver amigablemente las
                discrepancias o renegociar los incumplimientos durante la
                ejecución del contrato. Si, agotadas todas las gestiones
                posibles para llegar a un acuerdo, el mismo no se concreta, LAS
                PARTES se reconocen el derecho a reclamarse mutuamente el
                cumplimiento inadecuado o el incumplimiento de las obligaciones
                contraídas por ellos en los instrumentos jurídicos que ambos
                suscriban. Toda reclamación deberá formularse por escrito, y
                deberá ser entregada directamente a LA PARTE incumplidora, en su
                domicilio legal, dentro de los quince (15) días naturales
                posteriores a la fecha en que se haya producido el cumplimiento
                inadecuado o incumplimiento objeto de reclamo, adjuntando
                siempre, la documentación que sirva de soporte y exponiendo la
                pretensión concreta que persigue con la misma.
                <br />
                8.4 Si se utilizaran otras vías distintas a la entrega personal,
                como fecha de presentación de la reclamación comercial se
                considerará la fecha del reporte del correo electrónico, la hoja
                de trámite o de recepción, según el caso.
                <br />
                8.5 LAS PARTES se comprometen, en caso de ser necesario o
                estimarlo pertinente, a discutir o analizar directamente y de
                forma amigable, a instancia de cualquiera de ellas todas las
                reclamaciones. Para ello LA PARTE reclamada está en la
                obligación de propiciar la realización de una conciliación con
                la OTRA PARTE, en un plazo de 10 días hábiles siguientes a la
                fecha del recibo, dejando constancia de ello mediante acta en la
                que se harán constar los acuerdos adoptados o la imposibilidad
                de arribar a ellos.
                <br />
                8.6 En caso de que LA PARTE reclamada se niegue o impida la
                realización de la conciliación o transcurra el plazo mencionado
                anteriormente sin dar muestras de la intención de hacerlo, se
                entenderá que rechaza la reclamación y quedará expedita la vía
                judicial ante la sala de lo Mercantil del Tribunal Municipal que
                resulte competente. Igual proceder se seguirá si realizada la
                conciliación no se llega a acuerdos sobre el contenido de la
                misma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                9. CAUSAS DE TERMINACIÓN DEL CONTRATO
              </h2>
              <p className="mt-2">
                9.1 Las causas de terminación del contrato son:
                <br />
                a. Acuerdo de las partes;
                <br />
                b. Declaración judicial;
                <br />
                c. Cualquier otra de las causas de extinción de las
                obligaciones, reconocidas en las normas jurídicas.
                <br />
                9.2 La parte causante de la terminación del presente contrato
                responde, en su caso, de los daños y perjuicios que se deriven
                de esta para la otra parte, excepto por causa de fuerza mayor o
                caso fortuito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                10. RESOLUCIÓN DEL CONTRATO
              </h2>
              <p className="mt-2">
                10.1 La parte que ha cumplido o esté presta a cumplir su
                obligación puede, salvo que se afecte el interés general, dar
                unilateralmente por terminado el contrato si la falta de la otra
                parte al cumplir una de sus obligaciones contractuales
                constituye un incumplimiento esencial, debiendo comunicarle
                expresamente tal determinación.
                <br />
                10.2 Para determinar si la falta de cumplimiento de una
                obligación constituye un incumplimiento esencial se tiene en
                cuenta, en particular:
                <br />
                a. Si el incumplimiento recae en algunas de las obligaciones
                principales y priva sustancialmente a la parte perjudicada de lo
                que tenía derecho a esperar en virtud del presente contrato;
                <br />
                b. Si el incumplimiento le otorga a la parte perjudicada razones
                objetivas y fundadas para creer que no puede confiar en el
                cumplimiento futuro de la otra.
                <br />
                10.3 La solicitud de modificación al contrato por interés de LAS
                PARTES se hará por escrito con una antelación de{" "}
                {renderField("suplementoModificacionDias", "Días")} días en el
                horario de{" "}
                {renderField("suplementoHorarioInicio", "Hora inicio")} a{" "}
                {renderField("suplementoHorarioFin", "Hora fin")} de lunes a
                viernes, durante la etapa de ejecución del contrato, haciendo
                llegar el documento a EL PRESTADOR o EL CLIENTE según
                corresponda.
                <br />
                10.4 Toda modificación que surja con posterioridad a la firma
                del presente Contrato se concretará mediante Suplemento firmado
                por AMBAS PARTES, formando parte integrante del mismo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                11. CAUSAS EXIMENTES DE LA RESPONSABILIDAD CONTRACTUAL
              </h2>
              <p className="mt-2">
                11.1 Se considerarán Causas Eximentes de la Responsabilidad
                Contractual aquellas que surgidas después de firmado el
                contrato, impidan su cumplimiento total o parcial como
                consecuencia de acontecimientos naturales ajenos a la voluntad
                humana imprevisibles e inevitables (Fuerza Mayor), o que siendo
                previsibles resultan de la misma forma inevitables (Caso
                Fortuito).
                <br />
                11.2 LA PARTE impedida de cumplir su obligación enviará
                inmediatamente a LA OTRA PARTE dentro de los 7 días siguientes a
                la fecha en que se produjo el hecho la información siguiente:
                fecha de inicio del acontecimiento, posible duración, carácter,
                consecuencias, y cualquier otro aspecto considerado de interés
                dentro de las circunstancias de la Eximente de Responsabilidad
                que procediere.
                <br />
                11.3 Durante el período de la Eximente de la Responsabilidad,
                que corresponda, quedará suspendida la ejecución del Contrato,
                de lo cual LAS PARTES dejarán constancia mediante los acuerdos
                que se adopten al respecto, firmándose el documento que a tales
                efectos corresponda.
                <br />
                11.4 Cuando la Eximente de la Responsabilidad impida de forma
                total y definitiva la ejecución del Contrato, este será resuelto
                de común acuerdo y sin penalidad para ninguna de LAS PARTES
                contratantes; no obstante, se liquidarán todas las obligaciones
                pendientes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">12. VIGENCIA</h2>
              <p className="mt-2">
                12.1 El presente Contrato entrará en vigor a partir de la fecha
                de su firma y estará vigente por un (1) año. Pudiendo ser
                prorrogado mediante suplemento.
                <br />
                12.2 Si durante la vigencia de este contrato, EL CLIENTE
                solicita otros servicios no comprendidos en el mencionado anexo,
                se suscribirán los contratos que sean necesarios para describir
                el nuevo alcance.
              </p>
            </section>
          </div>

          <div ref={section2Ref} className="pdf-section bg-white p-4">
            <section>
              <h2 className="text-xl font-semibold">
                13. AVISO ENTRE LAS PARTES
              </h2>
              <p className="mt-2">
                13.1 Todos los avisos entre las partes se realizarán por correo
                electrónico u otros medios telemáticos y carta certificada a las
                siguientes direcciones:
                <br />
                <strong>A EL PRESTADOR:</strong>
                <br />
                Att. {renderField("prestadorContactoNombre", "Nombre contacto")}
                <br />
                Dirección:{" "}
                {renderField(
                  "prestadorContactoDireccion",
                  "Dirección contacto"
                )}
                <br />
                Teléfono:{" "}
                {renderField("prestadorContactoTelefono", "Teléfono contacto")}
                <br />
                E-mail:{" "}
                {renderField(
                  "prestadorContactoEmail",
                  "Email contacto",
                  "email"
                )}
                <br />
                <strong>A EL CLIENTE:</strong>
                <br />
                Att. {renderField("clienteContactoNombre", "Nombre contacto")}
                <br />
                Dirección:{" "}
                {renderField("clienteContactoDireccion", "Dirección contacto")}
                <br />
                Teléfono:{" "}
                {renderField("clienteContactoTelefono", "Teléfono contacto")}
                <br />
                E-mail:{" "}
                {renderField("clienteContactoEmail", "Email contacto", "email")}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">
                14. LEGISLACIÓN APLICABLE
              </h2>
              <p className="mt-2">
                14.1 El presente contrato se regirá por las normas cubanas
                vigentes específicas y aplicables al mismo: Decreto Ley No. 304
                “De la Contratación Económica”; Decreto 310 “De los tipos de
                Contratos”, Resolución No. 183 del 26 de noviembre de 2020 del
                BCC “Normas Bancarias para los Cobros y Pagos”, de manera
                supletoria el Código Civil Cubano.
              </p>
            </section>

            <section>
              <p className="mt-2">
                Y para que así conste, firman el presente documento, en dos
                ejemplares a un solo tenor y un mismo efecto, en La Habana a los{" "}
                {renderField("firmaDia", "Día")} días del mes de{" "}
                {renderField("firmaMes", "Mes")} del{" "}
                {renderField("firmaAnio", "Año")}.
              </p>
              <div className="flex justify-between mt-6">
                <div>
                  ___________________
                  <br />
                  EL PRESTADOR
                </div>
                <div>
                  ___________________
                  <br />
                  EL CLIENTE
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold">ANEXO I</h2>
              <div className="mt-2">
                <h3 className="text-lg font-semibold">
                  Descripción del Servicio
                </h3>
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Nombre del Servicio
                      </td>
                      <td className="p-2">
                        {renderField("servicioNombre", "Nombre del servicio")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Lugar donde se ejecutará el servicio
                      </td>
                      <td className="p-2">
                        {renderField("servicioLugar", "Lugar del servicio")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Fecha de inicio del servicio
                      </td>
                      <td className="p-2">
                        {renderField("servicioFechaInicioDia", "Día")} /{" "}
                        {renderField("servicioFechaInicioMes", "Mes")} /{" "}
                        {renderField("servicioFechaInicioAnio", "Año")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Características del servicio
                      </td>
                      <td className="p-2">
                        {renderField(
                          "servicioCaracteristicas",
                          "Características",
                          "textarea"
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Acceso a datos, documentos y personal
                      </td>
                      <td className="p-2">
                        {renderField(
                          "servicioCondicionesDatos",
                          "Seleccione",
                          "select"
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Local
                      </td>
                      <td className="p-2">
                        {renderField(
                          "servicioCondicionesLocal",
                          "Seleccione",
                          "select"
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Equipos de oficina
                      </td>
                      <td className="p-2">
                        {renderField(
                          "servicioCondicionesEquiposOficina",
                          "Seleccione",
                          "select"
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Equipos de cómputo
                      </td>
                      <td className="p-2">
                        {renderField(
                          "servicioCondicionesEquiposComputo",
                          "Seleccione",
                          "select"
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Aula
                      </td>
                      <td className="p-2">
                        {renderField(
                          "servicioCondicionesAula",
                          "Seleccione",
                          "select"
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Transportación
                      </td>
                      <td className="p-2">
                        {renderField(
                          "servicioCondicionesTransportacion",
                          "Seleccione",
                          "select"
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Otros
                      </td>
                      <td className="p-2">
                        {renderField(
                          "servicioCondicionesOtros",
                          "Especificar",
                          "textarea"
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Plazo de ejecución
                      </td>
                      <td className="p-2">
                        {renderField("servicioPlazoEjecucion", "Plazo")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Importe
                      </td>
                      <td className="p-2">
                        {renderField("servicioImporte", "Importe")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Moneda
                      </td>
                      <td className="p-2">
                        {renderField("servicioMoneda", "Seleccione", "select")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Instrumento de pago
                      </td>
                      <td className="p-2">
                        {renderField("servicioInstrumentoPago", "Instrumento")}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex justify-between mt-4">
                  <div>
                    EL PRESTADOR
                    <br />
                    Autorizado por: {renderField("prestadorNombre", "Nombre")}
                    <br />
                    Firma: ___________________
                  </div>
                  <div>
                    EL CLIENTE
                    <br />
                    Autorizado por:{" "}
                    {renderField("clienteRepresentante", "Nombre")}
                    <br />
                    Firma: ___________________
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div ref={section3Ref} className="pdf-section bg-white p-4">
            <section>
              <h2 className="text-xl font-semibold">ANEXO II</h2>
              <div className="mt-2">
                <h3 className="text-lg font-semibold">Ficha del Cliente</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Nombre de la entidad
                      </td>
                      <td className="p-2">
                        {renderField(
                          "clienteFichaNombreEntidad",
                          "Nombre entidad"
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Dirección
                      </td>
                      <td className="p-2">
                        {renderField("clienteFichaDireccion", "Dirección")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Teléfono
                      </td>
                      <td className="p-2">
                        {renderField("clienteFichaTelefono", "Teléfono")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        E-mail
                      </td>
                      <td className="p-2">
                        {renderField("clienteFichaEmail", "Email", "email")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Código Entidad
                      </td>
                      <td className="p-2">
                        {renderField("clienteFichaCodigoEntidad", "Código")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Organismo o Ministerio
                      </td>
                      <td className="p-2">
                        {renderField("clienteFichaOrganismo", "Organismo")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        NIT
                      </td>
                      <td className="p-2">
                        {renderField("clienteFichaNIT", "NIT")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Cuenta Bancaria CUP
                      </td>
                      <td className="p-2">
                        {renderField("clienteFichaCuentaCUP", "Cuenta CUP")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Sucursal CUP
                      </td>
                      <td className="p-2">
                        {renderField("clienteFichaSucursalCUP", "Sucursal")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Dirección Sucursal CUP
                      </td>
                      <td className="p-2">
                        {renderField(
                          "clienteFichaDireccionSucursalCUP",
                          "Dirección sucursal"
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="text-lg font-semibold mt-4">
                  Personas Autorizadas a solicitar servicios, firma de los
                  entregables y facturas
                </h3>
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        1. Nombre y Apellidos
                      </td>
                      <td className="p-2">
                        {renderField("clienteAutorizado1Nombre", "Nombre")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Cargo
                      </td>
                      <td className="p-2">
                        {renderField("clienteAutorizado1Cargo", "Cargo")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        No. C. Identidad
                      </td>
                      <td className="p-2">
                        {renderField(
                          "clienteAutorizado1Identidad",
                          "Identidad"
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        2. Nombre y Apellidos
                      </td>
                      <td className="p-2">
                        {renderField("clienteAutorizado2Nombre", "Nombre")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Cargo
                      </td>
                      <td className="p-2">
                        {renderField("clienteAutorizado2Cargo", "Cargo")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        No. C. Identidad
                      </td>
                      <td className="p-2">
                        {renderField(
                          "clienteAutorizado2Identidad",
                          "Identidad"
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="text-lg font-semibold mt-4">
                  Personas Autorizadas para firmar conciliaciones
                </h3>
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        1. Nombre y Apellidos
                      </td>
                      <td className="p-2">
                        {renderField("clienteConciliacion1Nombre", "Nombre")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Cargo
                      </td>
                      <td className="p-2">
                        {renderField("clienteConciliacion1Cargo", "Cargo")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        No. C. Identidad
                      </td>
                      <td className="p-2">
                        {renderField(
                          "clienteConciliacion1Identidad",
                          "Identidad"
                        )}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        2. Nombre y Apellidos
                      </td>
                      <td className="p-2">
                        {renderField("clienteConciliacion2Nombre", "Nombre")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Cargo
                      </td>
                      <td className="p-2">
                        {renderField("clienteConciliacion2Cargo", "Cargo")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        No. C. Identidad
                      </td>
                      <td className="p-2">
                        {renderField(
                          "clienteConciliacion2Identidad",
                          "Identidad"
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="text-lg font-semibold mt-4">
                  Representante de la Entidad designado para firmar Contrato
                </h3>
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Nombre
                      </td>
                      <td className="p-2">
                        {renderField("clienteRepresentanteContrato", "Nombre")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Cargo que ocupa
                      </td>
                      <td className="p-2">
                        {renderField("clienteRepresentanteCargo", "Cargo")}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="text-lg font-semibold mt-4">
                  Nombres y apellidos del Director de la Entidad o su
                  equivalente
                </h3>
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        Nombre
                      </td>
                      <td className="p-2">
                        {renderField("clienteDirectorNombre", "Nombre")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium border-r border-gray-300">
                        No. Carné de identidad
                      </td>
                      <td className="p-2">
                        {renderField("clienteDirectorIdentidad", "Identidad")}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p className="mt-4">
                  El Director de la entidad o su equivalente declara, apercibido
                  de la responsabilidad en que incurre, que todos los datos aquí
                  plasmados son ciertos y que cualquier variación en alguno de
                  ellos deberá comunicarse de inmediato a EL PRESTADOR, para
                  evitar cualquier consecuencia que de ello pueda derivarse.
                </p>
                <p className="mt-2">
                  <strong>
                    Documentos que deben acompañar a este modelo para conformar
                    el expediente del cliente:
                  </strong>
                </p>
                <p>
                  1. Resolución de Nombramiento del Director de la entidad.
                  <br />
                  2. Resolución o documento que faculta a la persona designada
                  para firmar el Contrato.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrestacionServicios;
