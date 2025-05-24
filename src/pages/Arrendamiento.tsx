/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import api from "../lib/axios";

const Arrendamiento = () => {
  const section1Ref = useRef<HTMLDivElement>(null); // Cláusulas I-V
  const section2Ref = useRef<HTMLDivElement>(null); // Cláusulas VI-XIII
  const section3Ref = useRef<HTMLDivElement>(null); // Anexo II
  const [formData, setFormData] = useState({
    arrendadorNombre: "",
    arrendadorCarne: "",
    arrendadorDireccion: "",
    arrendadorMunicipio: "",
    arrendadorProvincia: "",
    arrendadorNIT: "",
    arrendadorCuenta: "",
    arrendadorAgencia: "",
    arrendadorAgenciaDireccion: "",
    arrendadorLicencia: "",
    arrendadorTelefono: "",
    arrendatarioNombre: "",
    arrendatarioConstitucion: "",
    arrendatarioNumero: "",
    arrendatarioFecha: "",
    arrendatarioDireccion: "",
    arrendatarioMunicipio: "",
    arrendatarioProvincia: "",
    arrendatarioNacionalidad: "",
    arrendatarioNIT: "",
    arrendatarioLibro: "",
    arrendatarioTomo: "",
    arrendatarioFolio: "",
    arrendatarioHoja: "",
    arrendatarioCuenta: "",
    arrendatarioTelefonos: "",
    arrendatarioEmail: "",
    arrendatarioRepresentante: "",
    arrendatarioCondicion: "",
    arrendatarioAcreditacion: "",
    arrendatarioAcreditacionNumero: "",
    arrendatarioAcreditacionFecha: "",
    arrendatarioNotario: "",
    arrendatarioNotarioProvincia: "",
    arrendatarioNotarioSede: "",
    arrendatarioNotarioProvinciaSede: "",
    objetoTipo: "",
    objetoUbicacion: "",
    objetoMunicipio: "",
    objetoProvincia: "",
    notificacionDiasArrendador: "",
    notificacionDiasArrendatario: "",
    reciboTipo: "",
    pagoMonto: "",
    pagoInstrumento: "",
    pagoFrecuencia: "",
    pagoComprobante: "",
    vigenciaTermino: "",
    vigenciaConservacion: "",
    firmaDia: "",
    firmaMes: "",
    firmaAnio: "2024",
    anexoEntidadNombre: "",
    anexoEntidadDireccion: "",
    anexoEntidadTelefono: "",
    anexoEntidadEmail: "",
    anexoEntidadCodigo: "",
    anexoEntidadOrganismo: "",
    anexoEntidadNIT: "",
    anexoEntidadCuentaCUP: "",
    anexoEntidadSucursalCUP: "",
    anexoEntidadSucursalDireccionCUP: "",
    anexoPersonasServicios: [
      { nombre: "", cargo: "", firma: "", identidad: "" },
    ],
    anexoPersonasConciliaciones: [
      { nombre: "", cargo: "", firma: "", identidad: "" },
    ],
    anexoRepresentanteContrato: "",
    anexoRepresentanteCargo: "",
    anexoDirectorNombre: "",
    anexoDirectorCarne: "",
    anexoNotificadoNombre: "",
    anexoNotificadoCondicion: "",
  });

  const [isEditing, setIsEditing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Validate form completion (excluding optional anexo fields)
  const isFormComplete = Object.entries(formData).every(([key, value]) => {
    if (key.startsWith('anexo') || key === 'anexoPersonasServicios' || key === 'anexoPersonasConciliaciones') {
      return true;
    }
    if (Array.isArray(value)) {
      return value.every((item) =>
        Object.values(item).every((field) => field.trim() !== "")
      );
    }
    return value.trim() !== "";
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (
    section: "anexoPersonasServicios" | "anexoPersonasConciliaciones",
    index: number,
    field: string,
    value: string
  ) => {
    const updatedArray = [...formData[section]];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    setFormData({ ...formData, [section]: updatedArray });
  };

  const addPerson = (
    section: "anexoPersonasServicios" | "anexoPersonasConciliaciones"
  ) => {
    setFormData({
      ...formData,
      [section]: [
        ...formData[section],
        { nombre: "", cargo: "", firma: "", identidad: "" },
      ],
    });
  };

  const removePerson = (
    section: "anexoPersonasServicios" | "anexoPersonasConciliaciones",
    index: number
  ) => {
    if (formData[section].length > 1) {
      setFormData({
        ...formData,
        [section]: formData[section].filter((_, i) => i !== index),
      });
    }
  };

  const handleSave = async () => {
    if (!isFormComplete) {
      setErrorMessage("Por favor, completa todos los campos del formulario.");
      return;
    }

    try {
      await api.post('/contrato', formData);
      setIsEditing(false);
      setErrorMessage(null);
      alert("Datos guardados correctamente en el servidor.");
    } catch (error: any) {
      setErrorMessage(error.message || "Error al guardar los datos en el servidor.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrorMessage(null);
  };

  const exportToPDF = async () => {
    if (!isFormComplete) {
      setErrorMessage("Por favor, completa todos los campos del formulario.");
      return;
    }

    setIsGeneratingPDF(true);

    try {
      const response = await api.post('/pdf/generate', { formData }, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contrato_arrendamiento.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setErrorMessage(null);
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      setErrorMessage('Error al generar el PDF. Por favor, intenta de nuevo.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderField = (
    name: keyof typeof formData,
    placeholder: string,
    type: string = "text"
  ) => {
    if (isEditing && !isGeneratingPDF) {
      if (type === "select") {
        return (
          <select
            name={name}
            value={typeof formData[name] === "string" ? formData[name] : ""}
            onChange={handleChange}
            className="p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
          >
            <option value="">{placeholder}</option>
            {name === "arrendatarioConstitucion" && (
              <>
                <option value="Escritura de Constitución">Escritura de Constitución</option>
                <option value="Resolución">Resolución</option>
                <option value="Acuerdo">Acuerdo</option>
              </>
            )}
            {name === "arrendatarioAcreditacion" && (
              <>
                <option value="Decisión">Decisión</option>
                <option value="Acuerdo">Acuerdo</option>
                <option value="Resolución">Resolución</option>
              </>
            )}
            {name === "objetoTipo" && (
              <>
                <option value="ESPACIO">ESPACIO</option>
                <option value="LOCAL">LOCAL</option>
              </>
            )}
            {name === "notificacionDiasArrendador" && (
              <>
                <option value="90">90</option>
                <option value="180">180</option>
              </>
            )}
            {name === "notificacionDiasArrendatario" && (
              <>
                <option value="90">90</option>
                <option value="180">180</option>
              </>
            )}
            {name === "reciboTipo" && (
              <>
                <option value="Vale de comprobante">Vale de comprobante</option>
                <option value="FACTURA">FACTURA</option>
              </>
            )}
            {name === "pagoInstrumento" && (
              <>
                <option value="Transferencia bancaria">Transferencia bancaria</option>
                <option value="Cheque">Cheque</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Otro">Otro</option>
              </>
            )}
            {name === "pagoFrecuencia" && (
              <>
                <option value="Diaria">Diaria</option>
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </>
            )}
            {name === "pagoComprobante" && (
              <>
                <option value="Factura">Factura</option>
                <option value="Vale de compra">Vale de compra</option>
              </>
            )}
            {name === "vigenciaTermino" && (
              <>
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
              </>
            )}
            {name === "vigenciaConservacion" && (
              <>
                <option value="5">5</option>
                <option value="10">10</option>
              </>
            )}
          </select>
        );
      }
      return (
        <input
          type={type}
          name={name}
          value={typeof formData[name] === "string" ? formData[name] : ""}
          onChange={handleChange}
          placeholder={placeholder}
          className="p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
        />
      );
    }
    return (
      <span className="font-medium text-gray-900">
        {Array.isArray(formData[name])
          ? JSON.stringify(formData[name])
          : formData[name] || placeholder}
      </span>
    );
  };

  // Effect to clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 transition-colors duration-300">
      <style>
        {`
          .pdf-section {
            width: 190mm;
            padding: 10mm;
            box-sizing: border-box;
            background-color: #ffffff;
            color: #000000;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
          }
          @media print {
            .pdf-section {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .pdf-section section {
              break-inside: avoid;
              page-break-inside: avoid;
              margin-bottom: 10mm;
            }
            .pdf-section h2, .pdf-section h3 {
              break-after: avoid;
              page-break-after: avoid;
            }
            .pdf-section p, .pdf-section table, .pdf-section ol {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}
      </style>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-gray-900 dark:text-gray-200">
        <div className="flex justify-between mb-6">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={!isFormComplete || isGeneratingPDF}
              className={`px-4 py-2 rounded-md text-white ${
                isFormComplete && !isGeneratingPDF
                  ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                  : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              }`}
            >
              Guardar
            </button>
          ) : (
            <button
              onClick={handleEdit}
              disabled={isGeneratingPDF}
              className={`px-4 py-2 rounded-md text-white ${
                isGeneratingPDF
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
              }`}
            >
              Editar
            </button>
          )}
          <button
            onClick={exportToPDF}
            disabled={isEditing || !isFormComplete || isGeneratingPDF}
            className={`px-4 py-2 rounded-md text-white ${
              isEditing || !isFormComplete || isGeneratingPDF
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600"
              }`}
          >
            Exportar a PDF
          </button>
        </div>
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
            {errorMessage}
          </div>
        )}
        <div className="space-y-6 text-justify text-[14px]">
          <div ref={section1Ref} className="pdf-section bg-white p-4">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
              Contrato de Arrendamiento
            </h1>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DE UNA PARTE
              </h2>
              <p className="mt-2">
                El(La) Trabajador(a) por Cuenta Propia{" "}
                {renderField("arrendadorNombre", "Nombre de la trabajadora")},
                ciudadano(a) cubano(a) mayor de edad con carne de Identidad No.{" "}
                {renderField("arrendadorCarne", "Carné de identidad")} con
                domicilio Legal en calle{" "}
                {renderField("arrendadorDireccion", "Dirección")} Municipio{" "}
                {renderField("arrendadorMunicipio", "Municipio")}, Provincia{" "}
                {renderField("arrendadorProvincia", "Provincia")}, con NIT{" "}
                {renderField("arrendadorNIT", "NIT")}, y cuenta bancaria No.{" "}
                {renderField("arrendadorCuenta", "Cuenta bancaria")} en el banco
                Metropolitano, Agencia{" "}
                {renderField("arrendadorAgencia", "Agencia bancaria")}, cito en{" "}
                {renderField(
                  "arrendadorAgenciaDireccion",
                  "Dirección de la agencia"
                )},
                con No. De licencia comercial{" "}
                {renderField("arrendadorLicencia", "Licencia comercial")},
                Teléfono {renderField("arrendadorTelefono", "Teléfono")} y a los
                efectos de este contrato se denominará{" "}
                <strong>EL ARRENDADOR</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DE LA OTRA PARTE
              </h2>
              <p className="mt-2">
                {renderField("arrendatarioNombre", "Nombre de la entidad")},
                constituida mediante{" "}
                {renderField(
                  "arrendatarioConstitucion",
                  "Seleccione",
                  "select"
                )}{" "}
                No. {renderField("arrendatarioNumero", "Número")} de fecha{" "}
                {renderField("arrendatarioFecha", "", "date")} con domicilio
                legal en{" "}
                {renderField("arrendatarioDireccion", "Dirección legal")},
                municipio {renderField("arrendatarioMunicipio", "Municipio")},
                provincia {renderField("arrendatarioProvincia", "Provincia")},
                de nacionalidad{" "}
                {renderField("arrendatarioNacionalidad", "Nacionalidad")},
                código REEUP y NIT: {renderField("arrendatarioNIT", "NIT")},
                Inscripción Registro Mercantil Libro{" "}
                {renderField("arrendatarioLibro", "Libro")}, Tomo{" "}
                {renderField("arrendatarioTomo", "Tomo")}, Folio{" "}
                {renderField("arrendatarioFolio", "Folio")}, Hoja{" "}
                {renderField("arrendatarioHoja", "Hoja")}, Cuenta bancaria No.{" "}
                {renderField("arrendatarioCuenta", "Cuenta bancaria")},
                teléfonos {renderField("arrendatarioTelefonos", "Teléfonos")},
                dirección electrónica:{" "}
                {renderField("arrendatarioEmail", "Email", "email")},
                representada en este acto por{" "}
                {renderField("arrendatarioRepresentante", "Representante")} en
                su condición de{" "}
                {renderField("arrendatarioCondicion", "Condición")}. Lo que
                acredita mediante{" "}
                {renderField(
                  "arrendatarioAcreditacion",
                  "Seleccione",
                  "select"
                )}{" "}
                No. {renderField("arrendatarioAcreditacionNumero", "Número")} de
                fecha {renderField("arrendatarioAcreditacionFecha", "", "date")},
                emitida por {renderField("arrendatarioNotario", "Notario")},
                notario con competencia provincial en{" "}
                {renderField("arrendatarioNotarioProvincia", "Provincia")} y
                sede en la {renderField("arrendatarioNotarioSede", "Sede")},
                provincia{" "}
                {renderField("arrendatarioNotarioProvinciaSede", "Provincia")},
                que en lo sucesivo y a los efectos de este contrato se
                denominará <strong>EL ARRENDATARIO</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                AMBAS PARTES
              </h2>
              <p className="mt-2">
                Convienen en suscribir el presente contrato en los términos y
                condiciones siguientes:
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CLÁUSULA No. I.- OBJETO DEL CONTRATO
              </h2>
              <p className="mt-2">
                1.1. Por el presente contrato EL ARRENDADOR conviene en arrendar
                un {renderField("objetoTipo", "Seleccione", "select")} para su
                uso, ubicado en {renderField("objetoUbicacion", "Ubicación")},
                Municipio {renderField("objetoMunicipio", "Municipio")},
                Provincia {renderField("objetoProvincia", "Provincia")}, cuya
                titularidad pertenece a EL ARRENDADOR, y EL ARRENDATARIO pagará
                por su uso, de conformidad con los términos, condiciones que
                sean acordados por ambas partes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CLÁUSULA No. II.- OBLIGACIONES DE EL ARRENDADOR
              </h2>
              <p className="mt-2">
                2.1. EL ARRENDADOR se Obliga a:
                <br />
                2.1.2 Entregar el{" "}
                {renderField("objetoTipo", "Seleccione", "select")} objeto del
                Contrato en los términos convenidos.
                <br />
                2.1.3 Permitir el uso pacífico del{" "}
                {renderField("objetoTipo", "Seleccione", "select")} alquilado,
                durante el término de vigencia del presente contrato.
                <br />
                2.1.4 Comunicar a El Arrendatario llegado el momento de
                terminación de la vigencia del presente contrato la decisión de
                terminar el presente con no menos de{" "}
                {renderField(
                  "notificacionDiasArrendador",
                  "Seleccione",
                  "select"
                )}{" "}
                días de antelación devolviendo el valor del arrendamiento si así
                fuera necesario.
                <br />
                2.1.5 Emitir {renderField(
                  "reciboTipo",
                  "Seleccione",
                  "select"
                )}{" "}
                recibo de efectivo por el espacio arrendado, de conformidad al
                precio acordado por ambas partes.
                <br />
                2.1.6 Pagar los gastos extraordinarios en que haya incurrido EL
                ARRENDATARIO como consecuencia de la conservación del inmueble
                siempre que este le haya informado de tales pagos debidamente
                justificados, dichos pagos se llevarán a cabo mediante
                descuentos del valor del arrendamiento previamente conciliados y
                aceptados entre las partes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CLÁUSULA No. III.- OBLIGACIONES DEL ARRENDATARIO
              </h2>
              <p className="mt-2">
                3.1 EL ARRENDATARIO se Obliga a:
                <br />
                3.1.1 Recibir el local objeto del Contrato en los términos
                convenidos.
                <br />
                3.1.2 Comunicar a EL ARRENDADOR llegado el momento de
                terminación de la vigencia del presente contrato la decisión de
                terminar el presente con no menos de{" "}
                {renderField(
                  "notificacionDiasArrendatario",
                  "Seleccione",
                  "select"
                )}{" "}
                días de antelación devolviendo el valor del arrendamiento si así
                fuera necesario.
                <br />
                3.1.3 Pagar, el importe por el{" "}
                {renderField("objetoTipo", "Seleccione", "select")} alquilado en
                la forma y la cuantía establecida en el presente.
                <br />
                3.1.4 Utilizar el{" "}
                {renderField("objetoTipo", "Seleccione", "select")} objeto del
                presente contrato con la diligencia debida y para la realización
                de la actividad para la cual está autorizado, según lo aprobado
                por el organismo competente.
                <br />
                3.1.5 No modificar ni alterar la estructura de la instalación,
                objeto del presente contrato sin que antes hubiese acuerdo entre
                las partes.
                <br />
                3.1.6 No ceder el arriendo, ni subarrendar a terceras personas.
                <br />
                3.1.7 Devolver a El Arrendador el espacio en condiciones
                adecuadas, una vez concluido el término de vigencia del presente
                contrato y de no resultar así, asumirá la indemnización por los
                trabajos que se requieran realizar para restituir su estado
                inicial.
                <br />
                3.1.8 Mantener la limpieza e higiene adecuada, así como dar
                seguridad y protección a sus bienes y de no observar ésta y
                ocasionarse daños a los mismos El Arrendador, estará exento de
                responsabilidad.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CLÁUSULA No. IV.- OTRAS CONDICIONES
              </h2>
              <p className="mt-2">
                4.1 Realizar la entrega-recepción del{" "}
                {renderField("objetoTipo", "Seleccione", "select")}, tanto al
                iniciar como al terminar la relación contractual, dejando
                evidencia escrita, firmada de mutuo acuerdo entre las partes.
                <br />
                4.2 Revisar en cualquier momento el presente contrato, ajustando
                aquellas cláusulas que así correspondan, mediante suplemento
                firmado de mutuo acuerdo entre las partes o atendiendo a
                indicaciones o disposiciones emitidas por autoridad competente.
                <br />
                4.3 Permitir el acceso del El Arrendador e inspectores con
                competencia para ello al interior de la instalación, cuando así
                se considere pertinente y previo aviso con tres (3) días de
                antelación.
                <br />
                4.4 Las partes no permitirán que se lleve a cabo por personal a
                su cargo acciones o actos que puedan causar daños,
                interrupciones o mal funcionamiento de los sistemas instalados,
                local, y otras facilidades de la otra parte que no hayan sido
                colegiadas y aprobadas por ambas, asumiendo los gastos de
                restitución, reparación o indemnización según proceda en el caso
                que se provoquen éstos.
                <br />
                4.5 Ante la ocurrencia de desastres naturales que puedan afectar
                la integridad del{" "}
                {renderField("objetoTipo", "Seleccione", "select")}, El
                Arrendatario, cumplirá las indicaciones emitidas por la Defensa
                Civil y hasta tanto se mantenga la misma, retirará del lugar sus
                bienes si es necesario. De no observar lo anterior, El
                Arrendador no será responsable por los daños y perjuicios que
                puedan sufrir los mismos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CLÁUSULA No. V.- VALOR Y FORMA DE PAGO
              </h2>
              <p className="mt-2">
                5.1 EL pago del arrendamiento será de{" "}
                {renderField("pagoMonto", "Monto")} CUP.
                <br />
                El instrumento de pago será{" "}
                {renderField("pagoInstrumento", "Seleccione", "select")} y se
                efectuará con una frecuencia{" "}
                {renderField("pagoFrecuencia", "Seleccione", "select")}, previa
                entrega de la correspondiente{" "}
                {renderField("pagoComprobante", "Seleccione", "select")}.
              </p>
            </section>
          </div>

          <div ref={section2Ref} className="pdf-section bg-white p-4">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CLÁUSULA No. VI.- PENALIDADES
              </h2>
              <p className="mt-2">
                6.1 Cuando EL ARRENDATARIO incumpliese con la obligación de pago
                expresado en el presente Contrato, EL ARRENDADOR podrá ejercitar
                las acciones siguientes:
                <br />
                a) Se cobrarán intereses moratorios consistentes en
                <br />
                - Durante los primeros 30 días: 4% del valor total facturado.
                <br />
                - Durante los siguientes 30 días: 6% del valor total facturado.
                <br />
                - Más de 60 días: 8% del valor total facturado.
                <br />
                b) Suspender los servicios pactados hasta tanto se salde la
                deuda.
                <br />
                6.2 En igual cuantía será penalizado EL ARRENDADOR cuando
                incumpliese con cualquier obligación distinta a las obligaciones
                de pago y con cualquier término expresado en el presente.
                <br />
                6.3 Ambas partes son responsables civilmente, por los daños y
                perjuicios causados por el incumplimiento total o parcial de sus
                respectivas obligaciones, cuando estas no sean cubiertas por la
                penalización prevista en el párrafo anterior.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CLÁUSULA VII.- CONFIDENCIALIDAD
              </h2>
              <p className="mt-2">
                7.1 Las partes acuerdan mantener la confidencialidad necesaria
                sobre la información general que se generen en virtud del
                servicio prestado, comprometiéndose a guardar la documentación
                por un término de 5 años a partir de la firma del presente.
                <br />
                Ningún acto de intercambio será interpretado como cesión de los
                derechos de la Propiedad Intelectual que sobre dichas
                modalidades EL ARRENDADOR posea.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CLÁUSULA VIII.- MODIFICACIÓN Y TERMINACIÓN
              </h2>
              <p className="mt-2">
                8.1 Toda adición o modificación al Contrato se realizará
                mediante Suplemento fechado y firmado por ambas partes, debiendo
                la otra parte dar respuesta en un término de quince (15) días.
                En caso de no dar respuesta se entenderá como aceptado, toda
                modificación se realizará suscribiéndose el correspondiente
                suplemento.
                <br />
                8.2 La modificación o rescisión del Contrato no exime a las
                partes contrayentes de las obligaciones en ejecución, del pago
                pendiente, de la responsabilidad material derivada de ellos, ni
                del derecho de reclamarlas directamente o jurídicamente.
                <br />
                8.3 Será causal de terminación del presente contrato además de
                las establecidas en la legislación vigente en la materia las
                siguientes:
                <br />- El cierre del proyecto de trabajo aprobado tanto para el
                Arrendador como para el Arrendatario.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CLÁUSULA No. IX.- EXIMENTES DE RESPONSABILIDAD
              </h2>
              <p className="mt-2">
                9.1 Se considerarán EXIMENTES DE RESPONSABILIDAD aquellas que
                surjan después de firmado el contrato e impidan su cumplimiento,
                siempre que sean extraordinarias, imprevisibles e inevitables o
                siendo previsibles igualmente inevitables y ajenas a la voluntad
                de las partes.
                <br />
                9.2 El período de tiempo señalado para el cumplimiento de las
                obligaciones contractuales, se entenderá en dichos casos
                prorrogados por un período igual al de la vigencia de dichas
                contingencias. Si estas contingencias duraran más de tres meses,
                cada una de las partes contratantes podrá dar por terminado el
                contrato, notificando por escrito a la otra parte, no teniendo
                ningún derecho a ser indemnizada de cualquier pérdida. La
                alegación de una causal de eximente de responsabilidad no exime
                del cumplimiento de las obligaciones no afectadas por esta,
                quedando a decisión, por mutuo acuerdo de las partes, que la
                misma constituya una causal de extinción del contrato.
                <br />
                9.3 La parte imposibilitada de cumplir por las razones antes
                expuestas, notificará inmediatamente por escrito a la otra, la
                existencia y duración de la causal que corresponda, la cual
                deberá acreditar mediante certificación expedida por institución
                competente, la Cámara de Comercio de la República de Cuba, sin
                perjuicio de su obligación en efectuar cuantos actos y
                desembolsos fueran necesarios para minimizar o eliminar las
                consecuencias negativas para la otra parte y para la relación
                objeto del contrato.
                <br />
                9.4 No serán consideradas causas eximentes de responsabilidad,
                ni circunstancias modificativas de las obligaciones emergentes
                del presente contrato, cualesquiera regulaciones, disposiciones,
                órdenes u acciones, incluida la de negación de licencias de
                gobiernos extranjeros a las partes, o de entidades que de
                cualquier forma posean, dirijan o controlen al ARRENDATARIO, que
                impidan o intenten impedir, total o parcialmente, el oportuno y
                cabal cumplimiento de este contrato.
                <br />
                9.5 Cuando concurran circunstancias de EXIMENTES DE
                RESPONSABILIDAD y después de realizar todas las gestiones para
                asegurar la protección de las mercancías, EL ARRENDADOR quedará
                liberado de toda responsabilidad respecto a la óptima
                conservación de las mercancías almacenadas. EL ARRENDATARIO, si
                así lo desea, deberá asegurar el valor de las mercancías
                almacenadas con una empresa especializada.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CLÁUSULA No. X.- CALIDAD Y GARANTÍA
              </h2>
              <p className="mt-2">
                10.1 EL ARRENDADOR garantiza el goce pacífico del bien arrendado a EL
                ARRENDATARIO por el período de vigencia pactado en el presente contrato.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CLÁUSULA No. XI.- RECLAMACIONES Y SOLUCIÓN DE CONFLICTOS
              </h2>
              <p className="mt-2">
                11.1 Ambas partes reconocen el derecho recíproco de formularse
                reclamación ante el incumplimiento total o parcial de las
                obligaciones contraídas en el presente contrato.
                <br />
                11.2 Las partes convienen en cumplir el presente contrato de buena
                fe y agotar la vía conciliatoria, con el ánimo de solucionar
                cualquier discrepancia mediante negociaciones amigables.
                <br />
                11.3 Las reclamaciones deberán hacerse por escrito en el término de
                15 días a partir de la fecha en que la obligación debió ser
                cumplida.
                <br />
                11.4 La parte contra la que se presente la reclamación deberá
                examinarla y dar respuesta de su contenido dentro del término de
                diez días hábiles siguientes a la fecha en que hubiere recibido la
                misma, decursado este, se entenderá rechazada y el asunto podrá
                someterse a la consideración del órgano juzgador del domicilio del
                demandado y la decisión del mismo será de obligatorio cumplimiento
                para ambas partes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CLÁUSULA No. XII.- LEY APLICABLE
              </h2>
              <p className="mt-2">
                12.1 El presente contrato se rige según lo dispuesto en el Decreto
                Ley 304/12, De la Contratación Económica, Decreto 310/12, De los
                Tipos de Contratos y en lo dispuesto en el Decreto Ley 88/24 Sobre
                las micro, pequeñas y medianas empresas, Decreto Ley 90/24 Sobre el
                Ejercicio del Trabajo por cuenta propia, Decreto Ley 91/24 De las
                contravenciones en el Ejercicio del Trabajo Por Cuenta Propia, las
                Micro, Pequeñas y Medianas empresas privadas y los Titulares de los
                Proyectos de Desarrollo Local y demás que sean de adecuación
                emitidos por los organismos competentes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CLÁUSULA No. XIII.- VIGENCIA
              </h2>
              <p className="mt-2">
                13.1 El presente contrato tendrá vigencia por el término de{" "}
                {renderField("vigenciaTermino", "Seleccione", "select")} años a
                partir de la fecha de su firma, al término del cual podrá ser
                prorrogado por acuerdo expreso de las partes lo que se hará
                constar mediante suplemento al mismo.
                <br />
                13.2 Ambas partes conservarán el presente contrato, por un término
                de {renderField("vigenciaConservacion", "Seleccione", "select")}{" "}
                años.
              </p>
            </section>

            <section>
              <p className="mt-2">
                Y como constancia de su conformidad, se extiende el mismo en dos
                ejemplares a un solo tenor y efecto legal en La Habana, a los{" "}
                {renderField("firmaDia", "Día")} días del mes de{" "}
                {renderField("firmaMes", "Mes")} de{" "}
                {renderField("firmaAnio", "Año")} .
              </p>
              <div className="flex justify-between mt-8">
                <div>
                  ___________________<br />
                  EL ARRENDADOR
                </div>
                <div>
                  ___________________<br />
                  EL ARRENDATARIO
                </div>
              </div>
            </section>
          </div>

          <div ref={section3Ref} className="pdf-section bg-white p-4">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                ANEXO II: FICHA DEL CLIENTE
              </h2>
              <div>
                <p>
                  <strong>Nombre de la entidad:</strong>{" "}
                  {renderField("anexoEntidadNombre", "Nombre de la entidad")}
                </p>
                <p>
                  <strong>Dirección:</strong>{" "}
                  {renderField("anexoEntidadDireccion", "Dirección")}
                </p>
                <p>
                  <strong>Teléfono:</strong>{" "}
                  {renderField("anexoEntidadTelefono", "Teléfono")}{" "}
                  <span className="ml-4">
                    <strong>E-mail:</strong>{" "}
                    {renderField("anexoEntidadEmail", "E-mail", "email")}
                  </span>
                </p>
                <p>
                  <strong>Código Entidad:</strong>{" "}
                  {renderField("anexoEntidadCodigo", "Código")}{" "}
                  <span className="ml-4">
                    <strong>Organismo o Ministerio:</strong>{" "}
                    {renderField("anexoEntidadOrganismo", "Organismo")}
                  </span>{" "}
                  <span className="ml-4">
                    <strong>NIT:</strong>{" "}
                    {renderField("anexoEntidadNIT", "NIT")}
                  </span>
                </p>
                <p>
                  <strong>Cuenta Bancaria CUP:</strong>{" "}
                  {renderField("anexoEntidadCuentaCUP", "Cuenta")}{" "}
                  <span className="ml-4">
                    <strong>Sucursal CUP:</strong>{" "}
                    {renderField("anexoEntidadSucursalCUP", "Sucursal")}
                  </span>
                </p>
                <p>
                  <strong>Dirección Sucursal CUP:</strong>{" "}
                  {renderField(
                    "anexoEntidadSucursalDireccionCUP",
                    "Dirección de la sucursal"
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">
                  Personas Autorizadas a solicitar servicios, firma de los
                  entregables y facturas
                </h3>
                <table>
                  <thead>
                    <tr>
                      <th>Nombre y Apellidos</th>
                      <th>Cargo</th>
                      <th>Firma</th>
                      <th>No. C. Identidad</th>
                      {isEditing && <th>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {formData.anexoPersonasServicios.map((persona, index) => (
                      <tr key={index}>
                        <td>
                          {isEditing && !isGeneratingPDF ? (
                            <input
                              type="text"
                              value={persona.nombre}
                              onChange={(e) =>
                                handleArrayChange(
                                  "anexoPersonasServicios",
                                  index,
                                  "nombre",
                                  e.target.value
                                )
                              }
                              placeholder="Nombre"
                              className="p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded w-full"
                            />
                          ) : (
                            persona.nombre || "Nombre"
                          )}
                        </td>
                        <td>
                          {isEditing && !isGeneratingPDF ? (
                            <input
                              type="text"
                              value={persona.cargo}
                              onChange={(e) =>
                                handleArrayChange(
                                  "anexoPersonasServicios",
                                  index,
                                  "cargo",
                                  e.target.value
                                )
                              }
                              placeholder="Cargo"
                              className="p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded w-full"
                            />
                          ) : (
                            persona.cargo || "Cargo"
                          )}
                        </td>
                        <td>
                          {isEditing && !isGeneratingPDF ? (
                            <input
                              type="text"
                              value={persona.firma}
                              onChange={(e) =>
                                handleArrayChange(
                                  "anexoPersonasServicios",
                                  index,
                                  "firma",
                                  e.target.value
                                )
                              }
                              placeholder="Firma"
                              className="p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded w-full"
                            />
                          ) : (
                            persona.firma || "Firma"
                          )}
                        </td>
                        <td>
                          {isEditing && !isGeneratingPDF ? (
                            <input
                              type="text"
                              value={persona.identidad}
                              onChange={(e) =>
                                handleArrayChange(
                                  "anexoPersonasServicios",
                                  index,
                                  "identidad",
                                  e.target.value
                                )
                              }
                              placeholder="Identidad"
                              className="p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded w-full"
                            />
                          ) : (
                            persona.identidad || "Identidad"
                          )}
                        </td>
                        {isEditing && (
                          <td>
                            <button
                              onClick={() =>
                                removePerson("anexoPersonasServicios", index)
                              }
                              disabled={formData.anexoPersonasServicios.length === 1}
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
                    onClick={() => addPerson("anexoPersonasServicios")}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Agregar Persona
                  </button>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">
                  Personas Autorizadas para firmar conciliaciones
                </h3>
                <table>
                  <thead>
                    <tr>
                      <th>Nombre y Apellidos</th>
                      <th>Cargo</th>
                      <th>Firma</th>
                      <th>No. C. Identidad</th>
                      {isEditing && <th>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {formData.anexoPersonasConciliaciones.map((persona, index) => (
                      <tr key={index}>
                        <td>
                          {isEditing && !isGeneratingPDF ? (
                            <input
                              type="text"
                              value={persona.nombre}
                              onChange={(e) =>
                                handleArrayChange(
                                  "anexoPersonasConciliaciones",
                                  index,
                                  "nombre",
                                  e.target.value
                                )
                              }
                              placeholder="Nombre"
                              className="p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded w-full"
                            />
                          ) : (
                            persona.nombre || "Nombre"
                          )}
                        </td>
                        <td>
                          {isEditing && !isGeneratingPDF ? (
                            <input
                              type="text"
                              value={persona.cargo}
                              onChange={(e) =>
                                handleArrayChange(
                                  "anexoPersonasConciliaciones",
                                  index,
                                  "cargo",
                                  e.target.value
                                )
                              }
                              placeholder="Cargo"
                              className="p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded w-full"
                            />
                          ) : (
                            persona.cargo || "Cargo"
                          )}
                        </td>
                        <td>
                          {isEditing && !isGeneratingPDF ? (
                            <input
                              type="text"
                              value={persona.firma}
                              onChange={(e) =>
                                handleArrayChange(
                                  "anexoPersonasConciliaciones",
                                  index,
                                  "firma",
                                  e.target.value
                                )
                              }
                              placeholder="Firma"
                              className="p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded w-full"
                            />
                          ) : (
                            persona.firma || "Firma"
                          )}
                        </td>
                        <td>
                          {isEditing && !isGeneratingPDF ? (
                            <input
                              type="text"
                              value={persona.identidad}
                              onChange={(e) =>
                                handleArrayChange(
                                  "anexoPersonasConciliaciones",
                                  index,
                                  "identidad",
                                  e.target.value
                                )
                              }
                              placeholder="Identidad"
                              className="p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded w-full"
                            />
                          ) : (
                            persona.identidad || "Identidad"
                          )}
                        </td>
                        {isEditing && (
                          <td>
                            <button
                              onClick={() =>
                                removePerson("anexoPersonasConciliaciones", index)
                              }
                              disabled={
                                formData.anexoPersonasConciliaciones.length === 1
                              }
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
                    onClick={() => addPerson("anexoPersonasConciliaciones")}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Agregar Persona
                  </button>
                )}
              </div>

              <div>
                <p className="mt-2">
                  <strong>
                    Representante de la Entidad designado para firmar Contrato:
                  </strong>{" "}
                  {renderField(
                    "anexoRepresentanteContrato",
                    "Representante"
                  )}{" "}
                  <span className="ml-4">
                    <strong>Cargo que ocupa:</strong>{" "}
                    {renderField("anexoRepresentanteCargo", "Cargo")}
                  </span>
                </p>
              </div>

              <div>
                <p className="mt-2">
                  El Director de la entidad o su equivalente declara, apercibido
                  de la responsabilidad en que incurre, que todos los datos aquí
                  plasmados son ciertos y que cualquier variación en alguno de
                  ellos deberá comunicarse de inmediato a{" "}
                  {renderField("anexoNotificadoNombre", "Nombre del notificado")}{" "}
                  en su condición de{" "}
                  {renderField("anexoNotificadoCondicion", "Condición")},
                  para evitar cualquier consecuencia que de ello pueda derivarse.
                </p>
                <p>
                  <strong>
                    Nombres y apellidos del Director de la Entidad o su
                    equivalente:
                  </strong>{" "}
                  {renderField("anexoDirectorNombre", "Nombre")}{" "}
                  <span className="ml-4">
                    <strong>Cuño:</strong> ____________
                  </span>
                </p>
                <p>
                  <strong>No. Carné de identidad:</strong>{" "}
                  {renderField("anexoDirectorCarne", "Carné")}
                </p>
                <p>
                  <strong>Firma:</strong> ____________
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4">
                  Documentos que deben acompañar a este modelo para conformar el
                  expediente del cliente:
                </h3>
                <ol className="list-decimal ml-6">
                  <li>Resolución de Nombramiento del Director de la entidad.</li>
                  <li>
                    Resolución o documento que faculta a la persona designada para
                    firmar el Contrato.
                  </li>
                </ol>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arrendamiento;