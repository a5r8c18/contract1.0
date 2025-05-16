/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

const ContratoCompraventa = () => {
  const section1Ref = useRef<HTMLDivElement>(null); // DE UNA PARTE to 2. OBLIGACIONES
  const section2Ref = useRef<HTMLDivElement>(null); // 3. PRECIOS to 6. PENALIDADES
  const section3Ref = useRef<HTMLDivElement>(null); // 7. CAUSAS to 10. MODIFICACION
  const section4Ref = useRef<HTMLDivElement>(null); // 11. AVISO to ANEXO I
  const [formData, setFormData] = useState({
    vendedorNombre: "",
    vendedorIdentidad: "",
    vendedorDomicilio: "",
    vendedorMunicipio: "",
    vendedorProvincia: "",
    vendedorNIT: "",
    vendedorCuentaBancaria: "",
    vendedorAgencia: "",
    vendedorLicencia: "",
    vendedorTelefono: "",
    vendedorCertificadoFecha: "",
    vendedorCertificadoMunicipio: "",
    compradorNombre: "",
    compradorNacionalidad: "",
    compradorDomicilio: "",
    compradorMunicipio: "",
    compradorProvincia: "",
    compradorInscripcionFecha: "",
    compradorTomo: "",
    compradorFolio: "",
    compradorHoja: "",
    compradorRegistro: "",
    compradorNIT: "",
    compradorCuentaBancaria: "",
    compradorAgencia: "",
    compradorRepresentante: "",
    compradorCargo: "",
    compradorEscrituraNumero: "",
    compradorEscrituraFecha: "",
    compradorNotaria: "",
    compradorNotariaProvincia: "",
    vigenciaAnios: "1",
    avisoVendedorAtt: "",
    avisoVendedorDireccion: "",
    avisoVendedorTelefono: "",
    avisoVendedorEmail: "",
    avisoCompradorAtt: "",
    avisoCompradorDireccion: "",
    avisoCompradorTelefono: "",
    avisoCompradorEmail: "",
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
    anexoEntidadCuentaBancaria: "",
    anexoEntidadSucursal: "",
    anexoEntidadSucursalDireccion: "",
    anexoAutorizadosServicios: [
      { nombre: "", cargo: "", firma: "", identidad: "" },
    ],
    anexoAutorizadosConciliaciones: [
      { nombre: "", cargo: "", firma: "", identidad: "" },
    ],
    anexoRepresentanteNombre: "",
    anexoRepresentanteCargo: "",
    anexoDirectorNombre: "",
    anexoDirectorIdentidad: "",
  });

  const [isEditing, setIsEditing] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAnexoChange = (
    section: "servicios" | "conciliaciones",
    index: number,
    field: string,
    value: string
  ) => {
    const key =
      section === "servicios"
        ? "anexoAutorizadosServicios"
        : "anexoAutorizadosConciliaciones";
    const updatedAnexo = [...formData[key]];
    updatedAnexo[index] = { ...updatedAnexo[index], [field]: value };
    setFormData({ ...formData, [key]: updatedAnexo });
  };

  const addAnexoRow = (section: "servicios" | "conciliaciones") => {
    const key =
      section === "servicios"
        ? "anexoAutorizadosServicios"
        : "anexoAutorizadosConciliaciones";
    setFormData({
      ...formData,
      [key]: [
        ...formData[key],
        { nombre: "", cargo: "", firma: "", identidad: "" },
      ],
    });
  };

  const removeAnexoRow = (
    section: "servicios" | "conciliaciones",
    index: number
  ) => {
    const key =
      section === "servicios"
        ? "anexoAutorizadosServicios"
        : "anexoAutorizadosConciliaciones";
    if (formData[key].length > 1) {
      const updatedAnexo = formData[key].filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: updatedAnexo });
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
    return Object.entries(formData).every(([key, value]) => {
      if (
        key === "anexoAutorizadosServicios" ||
        key === "anexoAutorizadosConciliaciones"
      ) {
        return (formData[key] as any[]).every((item) =>
          Object.values(item).every(
            (val) => typeof val === "string" && val.trim() !== ""
          )
        );
      }
      return typeof value === "string" ? value.trim() !== "" : true;
    });
  };

  const exportToPDF = async () => {
    const refs = [section1Ref, section2Ref, section3Ref, section4Ref];
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

      pdf.save("contrato_compraventa.pdf");
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
              className="px-4 py-2 rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
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
              Contrato de Compraventa
            </h1>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DE UNA PARTE
              </h2>
              <p className="mt-2">
                Trabajador por Cuenta Propia{" "}
                {renderField("vendedorNombre", "Nombre del vendedor")},
                ciudadano cubano mayor de edad con carné de Identidad No.{" "}
                {renderField("vendedorIdentidad", "Identidad")} con domicilio
                Legal en calle {renderField("vendedorDomicilio", "Domicilio")},
                Municipio {renderField("vendedorMunicipio", "Municipio")},
                Provincia {renderField("vendedorProvincia", "Provincia")}, con
                NIT {renderField("vendedorNIT", "NIT")}, y cuenta bancaria No.{" "}
                {renderField("vendedorCuentaBancaria", "Cuenta bancaria")} en el
                banco Metropolitano, Agencia{" "}
                {renderField("vendedorAgencia", "Agencia")}, cito en{" "}
                {renderField("vendedorDomicilio", "Domicilio")}, con No. de
                licencia comercial {renderField("vendedorLicencia", "Licencia")}
                , Teléfono {renderField("vendedorTelefono", "Teléfono")} y a los
                efectos de este contrato se denominará{" "}
                <strong>EL VENDEDOR</strong> en su condición de trabajador por
                cuenta propia acreditado mediante Certificado de Validación del
                proyecto de trabajo autorizado a ejercer la actividad de
                Arrendador de espacio emitida por la Dirección Municipal de
                Trabajo de{" "}
                {renderField("vendedorCertificadoMunicipio", "Municipio")} con
                fecha {renderField("vendedorCertificadoFecha", "", "date")}.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DE LA OTRA PARTE
              </h2>
              <p className="mt-2">
                La entidad denominada{" "}
                {renderField("compradorNombre", "Nombre del comprador")} de
                nacionalidad{" "}
                {renderField("compradorNacionalidad", "Nacionalidad")}, con
                domicilio legal en{" "}
                {renderField("compradorDomicilio", "Domicilio")}, Municipio{" "}
                {renderField("compradorMunicipio", "Municipio")}, Provincia{" "}
                {renderField("compradorProvincia", "Provincia")}, inscripta el{" "}
                {renderField("compradorInscripcionFecha", "", "date")} al Tomo{" "}
                {renderField("compradorTomo", "Tomo")}, Folio{" "}
                {renderField("compradorFolio", "Folio")}, hoja{" "}
                {renderField("compradorHoja", "Hoja")} en el Registro Mercantil
                Territorial de {renderField("compradorRegistro", "Registro")},
                con código NIT {renderField("compradorNIT", "NIT")}, cuenta
                bancaria en CUP{" "}
                {renderField("compradorCuentaBancaria", "Cuenta bancaria")},
                agencia bancaria {renderField("compradorAgencia", "Agencia")},
                representado en este acto por{" "}
                {renderField("compradorRepresentante", "Representante")} en su
                carácter de {renderField("compradorCargo", "Cargo")} de la
                sociedad, según Escritura Pública de Constitución No.{" "}
                {renderField("compradorEscrituraNumero", "Número")} de fecha{" "}
                {renderField("compradorEscrituraFecha", "", "date")}, otorgada
                por la Licenciada {renderField("compradorNotaria", "Notaria")}{" "}
                Notaria con competencia provincial{" "}
                {renderField("compradorNotariaProvincia", "Provincia")}, que en
                lo sucesivo se denominará <strong>EL COMPRADOR</strong>.
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
                1.1 Por el presente contrato <strong>EL VENDEDOR</strong>{" "}
                conviene en entregar y trasmitir en propiedad a{" "}
                <strong>EL COMPRADOR</strong>, las mercancías solicitadas, cuyas
                descripciones, cantidades, precios y demás características
                técnicas aparecen detallados en el <strong>ANEXO I</strong> al
                presente, la que formará parte integrante del mismo a todos los
                efectos legales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                2. OBLIGACIONES DE LAS PARTES
              </h2>
              <p className="mt-2">
                <strong>2.1 Obligaciones de EL VENDEDOR:</strong>
                <br />
                2.1.1 Entregar LAS MERCANCÍAS, cuya descripción, cantidad,
                precio, importe y demás especificaciones técnicas se establecen
                en las Ofertas.
                <br />
                2.1.2 Entregar si corresponde, conjuntamente con LAS MERCANCÍAS,
                la documentación técnica necesaria, de acuerdo a las
                especificaciones de los mismos y que se describe en la Oferta.
                <br />
                2.1.3 Elaborar y entregar las facturas comerciales que
                demuestren el cumplimiento de la entrega de cada pedido de LAS
                MERCANCÍAS, y los precios según se establecen en la cláusula 3.1
                del presente contrato.
                <br />
                2.1.4 Mantener la custodia y conservación de LAS MERCANCÍAS
                objeto del presente Contrato, hasta el momento de la entrega.
                <br />
                2.1.5 Responder ante <strong>EL COMPRADOR</strong> por el
                saneamiento por evicción y por los vicios o defectos ocultos de
                LAS MERCANCÍAS.
                <br />
                2.1.6 Si <strong>EL VENDEDOR</strong> en el término de treinta
                (30) días hábiles, antes de la fecha de cumplimiento de los
                plazos de entrega de LAS MERCANCÍAS pactados, valora que puede
                existir un incumplimiento del plazo acordado por causas ajenas a
                su gestión comercial, lo informará a{" "}
                <strong>EL COMPRADOR</strong>, el cual aceptará definir un nuevo
                plazo de entrega de LAS MERCANCÍAS convenidos, sin que conlleve
                reclamación alguna a <strong>EL VENDEDOR</strong>,
                materializándose mediante la firma por las partes del suplemento
                al presente contrato, definiéndose en éste instrumento el nuevo
                plazo de entrega de los productos convenido.
                <br />
                <strong>2.2 Obligaciones de EL COMPRADOR:</strong>
                <br />
                2.2.1 Recibir LAS MERCANCÍAS, cuya descripción, cantidad, y
                demás especificaciones técnicas se establecen en las Ofertas y
                en el
                <strong>ANEXO I</strong> al presente.
                <br />
                2.2.2 Correr con los riesgos por daños o pérdidas una vez
                recibidos LAS MERCANCÍAS.
                <br />
                2.2.3 Realizar el pago del precio de LAS MERCANCÍAS en
                correspondencia con los valores indicados en la factura
                comercial, y en la forma lugar y términos acordados en la
                Cláusula de Precio, Importe y Condiciones de Pagos.
                <br />
                2.2.4 Revisar LAS MERCANCÍAS en el momento en que se reciben, no
                correspondiendo con posterioridad reclamaciones por faltante o
                por daños físicos exteriores de la mercancía, las reclamaciones
                deben realizarse en el momento de recibida y{" "}
                <strong>EL VENDEDOR</strong> estará en la obligación de
                resolverlas de ser posible en el propio acto de entrega o en un
                plazo que se fije por acuerdo escrito de{" "}
                <strong>LAS PARTES</strong>, que se incluirá como suplemento del
                contrato.
                <br />
                2.2.5 Realizar la recogida de LAS MERCANCÍAS en término de hasta
                (7) días naturales, contados a partir de la notificación de la
                existencia de éstos en la oficina de{" "}
                <strong>EL VENDEDOR</strong>. Esta notificación se realizará a
                los compradores y al contacto de <strong>EL COMPRADOR</strong>{" "}
                expresado en la Cláusula 11. AVISO. De no retirarse LAS
                MERCANCÍAS por parte de <strong>EL COMPRADOR</strong> en el
                término señalado en esta sub cláusula, y no haber hecho el
                correspondiente pago de las facturas{" "}
                <strong>EL VENDEDOR</strong> liberará LAS MERCANCÍAS reservados
                para la comercialización, sin derecho a reclamación por parte de{" "}
                <strong>EL COMPRADOR</strong>, devolviéndose el anticipo
                realizado.
                <br />
                2.2.6 Asumir la transportación y los gastos asociados para
                recibir LAS MERCANCÍAS.
              </p>
            </section>
          </div>

          <div ref={section2Ref} className="pdf-section bg-white p-4">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                3. PRECIOS, IMPORTE Y FORMAS DE PAGO
              </h2>
              <p className="mt-2">
                3.1 El importe del presente contrato ascenderá a la sumatoria de
                los productos ofertados y aceptados por{" "}
                <strong>EL COMPRADOR</strong>. <strong>EL VENDEDOR</strong>{" "}
                determinará los precios de LAS MERCANCÍAS según la oferta y
                demanda. La moneda de pago será en CUP o MLC según
                disponibilidad de <strong>EL COMPRADOR</strong>.
                <br />
                3.2 <strong>EL COMPRADOR</strong> efectuará un pago anticipado
                correspondiente al 50% del valor total de los productos
                ofertados y aceptados a la firma del presente contrato y el otro
                50% contra la entrega de las mercancías, a partir de este
                momento <strong>EL VENDEDOR</strong> trasmitirá la propiedad de
                LAS MERCANCÍAS contratados a <strong>EL COMPRADOR</strong>. El
                pago se podrá realizar utilizando como instrumento de pago el
                cheque nominativo, la Transferencia bancaria o Efectivo.
                <br />
                3.3 Si por cualquier causa <strong>EL COMPRADOR</strong>{" "}
                incumple con sus obligaciones de pago,{" "}
                <strong>EL VENDEDOR</strong> se reserva el derecho de suspender
                la entrega de LAS MERCANCÍAS pactados, hasta tanto el débito sea
                acreditado en su cuenta bancaria, sin perjuicio de ejercer su
                derecho a establecer la correspondiente reclamación por los
                daños y perjuicios causados.
                <br />
                3.4 <strong>EL COMPRADOR</strong> garantizará contar con los
                fondos suficientes en su cuenta bancaria, respondiendo por los
                daños y perjuicios que pudiera ocasionar en el caso que emitiera
                cheques sin fondo u otra anormalidad en el pago de las facturas,
                con independencia de la responsabilidad penal que corresponda.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                4. PLAZOS Y CONDICIONES DE ENTREGA
              </h2>
              <p className="mt-2">
                4.1 LAS MERCANCÍAS objeto del presente contrato serán entregados
                por <strong>EL VENDEDOR</strong> a <strong>EL COMPRADOR</strong>
                , según las características previamente pactadas y recogidas en
                la OFERTA hasta (7) días hábiles posteriores al recibo del pago
                del anticipo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                5. PROTECCIÓN DE DATOS
              </h2>
              <p className="mt-2">
                5.1 En cumplimiento de la Ley No.149/2022{" "}
                <strong>EL VENDEDOR</strong> se compromete al cumplimiento de su
                obligación de secreto respecto de los datos de carácter personal
                de <strong>EL COMPRADOR</strong> y adoptará las medidas
                necesarias que garanticen la seguridad de los datos de carácter
                personal y eviten su alteración, pérdida, tratamiento o acceso
                no autorizado.
                <br />
                5.2 Cumpliendo lo establecido en la Ley No.149/2022 Ley de
                Protección de Datos Personales los datos de{" "}
                <strong>EL COMPRADOR</strong> expresados en las generalidades
                del presente contrato podrán ser utilizados con la finalidad de
                enviarle comunicaciones comerciales y de cortesía relacionadas
                con nuestra entidad a través del teléfono, correo electrónico, o
                medios de comunicación electrónica equivalentes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                6. CALIDAD Y GARANTÍA
              </h2>
              <p className="mt-2">
                6.1 <strong>EL VENDEDOR</strong> entregará LAS MERCANCÍAS
                conforme a las normas de calidad, las especificaciones técnicas,
                las muestras o modelos que se describan en la Oferta (en caso
                que se requiera), revisados y conformes por{" "}
                <strong>EL COMPRADOR</strong>.
                <br />
                6.2 LAS MERCANCÍAS objetos del presente Contrato tendrán un (1)
                mes de garantía, contados a partir de la entrega de LAS
                MERCANCÍAS.
                <br />
                6.3 <strong>EL VENDEDOR</strong> responde por los defectos que
                se produzcan en LAS MERCANCÍAS dentro del periodo de garantía
                pactado en la sub cláusula 6.1, y se obliga a la reparación o
                sustitución de LAS MERCANCÍAS en un término que no exceda de los
                noventa (90) días, a partir de la recepción y entrega de LAS
                MERCANCÍAS defectuosos.
                <br />
                6.4 En los casos en que se decida que la opción sea la de
                sustitución de LAS MERCANCÍAS, la garantía será de igual término
                que LAS MERCANCÍAS inicialmente entregados.
                <br />
                6.4.1 Para el caso de LAS MERCANCÍAS, la garantía establecida en
                la subcláusula 6.1 precedente no cubre los desperfectos y fallas
                de funcionamiento provocadas por alguna de las causas a
                continuación relacionadas:
                <br />
                6.4.2 Maltrato, abuso, negligencia en la transportación o
                manipulación, fallas en el suministro de electricidad, aire
                acondicionado, control de humedad u otras causas de uso
                ordinario, que constituyan violaciones de las especificaciones
                de garantía tanto en su manipulación como en su instalación.
                <br />
                6.4.3 Incumplimiento por parte de <strong>
                  EL COMPRADOR
                </strong>{" "}
                del mantenimiento durante el período de garantía o
                modificaciones que este realice en LAS MERCANCÍAS sin el
                consentimiento por escrito de <strong>EL VENDEDOR</strong>.
                <br />
                6.4.4 Casos habitualmente reconocidos como fuerza mayor.
              </p>
            </section>
          </div>

          <div ref={section3Ref} className="pdf-section bg-white p-4">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                7. PENALIDADES Y OTROS PAGOS
              </h2>
              <p className="mt-2">
                7.1 Las partes convienen que, en caso de incumplimiento de la
                entrega, por causas imputables a <strong>EL VENDEDOR</strong>,
                este abonará a <strong>EL COMPRADOR</strong> una penalidad por
                demora en la entrega, calculada a partir de la fecha o plazo
                incumplido, equivalente al cero punto cero once por ciento
                (0.011%) del importe de LAS MERCANCÍAS demorados, en CUP por
                cada día natural de demora, cuyo importe no podrá exceder el
                cuatro por ciento (4%) del importe de LAS MERCANCÍAS dejados de
                entregar. Estas penalidades constituirán la total compensación
                de los daños que podrían ser exigidos como consecuencia del
                retraso por parte de <strong>EL VENDEDOR</strong>.
                <br />
                7.2 Igual penalidad abonará <strong>EL COMPRADOR</strong> por
                demora en el pago u otro incumplimiento de las cláusulas del
                presente Contrato.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                8. CAUSAS EXIMIENTES DE LA RESPONSABILIDAD
              </h2>
              <p className="mt-2">
                8.1 <strong>LAS PARTES</strong> no serán responsables por el
                incumplimiento total o parcial o cumplimiento inadecuado de sus
                obligaciones contractuales cuando las mismas resulten imposibles
                de satisfacer debido a circunstancias o hechos de carácter
                extraordinario, imprevisibles o si previsibles inevitables que,
                ajenos a la voluntad y actuación de <strong>LAS PARTES</strong>,
                surjan con posterioridad a la entrada en vigor del Contrato.
                <br />
                8.2 <strong>LA PARTE</strong> que invoque la causa eximente de
                responsabilidad, notificará a la otra Parte por escrito su
                naturaleza, comienzo, eventualmente su terminación y las
                posibles consecuencias surgidas en el cumplimiento del Contrato,
                acompañando las certificaciones que fueren necesarias, expedidas
                al efecto por autoridad competente y sin vinculación con
                cualquiera de las Partes, en el término de sesenta días (60)
                días naturales contados a partir de la fecha que el mismo se
                produjo.
                <br />
                8.3 Si la situación subsistiera por más de sesenta días (60)
                días naturales ininterrumpidos, cualquiera de las Partes podrá
                dar por terminada la transacción afectada mediante una simple
                comunicación escrita, sin necesidad de pedirla ante órgano
                judicial alguno, ni reclamar indemnización o gasto que pueda
                haberse producido por tal motivo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                9. RECLAMACIONES
              </h2>
              <p className="mt-2">
                9.1 Las Partes podrán reclamarse mutuamente por el
                incumplimiento o cumplimiento inadecuado de sus obligaciones
                contractuales, por escrito, dentro de los quince (15) días
                naturales contados a partir de la fecha de ocurrencia del
                incumplimiento.
                <br />
                9.2 Todas las reclamaciones se efectuarán por escrito en el
                domicilio legal de la otra Parte, debiendo la Parte reclamada
                dar respuesta dentro de los treinta (30) días naturales
                posteriores a la fecha de su notificación.
                <br />
                9.3 Toda comunicación efectuada por medio del correo electrónico
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
                10. SOLUCIÓN DE CONFLICTOS
              </h2>
              <p className="mt-2">
                10.1 <strong>LA PARTE</strong> que incumpla sus obligaciones,
                será responsable del incumplimiento en el alcance de la
                indemnización de los daños y/o los perjuicios que se ocasionen
                por ello a la otra.
                <br />
                10.2 El hecho que una de <strong>LAS PARTES</strong> no exija a
                la otra el cumplimiento de alguna de sus obligaciones, no supone
                la renuncia de aquella cláusula cuyo cumplimiento quedó sin
                exigencia, el cual puede ser exigido en todo momento siempre y
                cuando no se plantee lo contrario de forma expresa y por
                escrito, y con carácter definitivo.
                <br />
                10.3 <strong>LAS PARTES</strong> convienen cumplir de buena fe
                con el presente contrato. Cualquier discrepancia se resuelve por
                medio de negociaciones entre ambas o si resultare posible la
                utilización de otros medios alternativos de solución del
                conflicto adoptados de común acuerdo.
                <br />
                10.4 De mantenerse el conflicto, éste será sometido a la Sala de
                lo Mercantil del Tribunal Municipal. Los gastos y costos que ese
                proceso generase son asumidos por la Parte que resulte vencida
                en juicio y la Resolución Judicial que se dicte es de
                obligatorio cumplimiento para <strong>LAS PARTES</strong>.
              </p>
            </section>
          </div>

          <div ref={section4Ref} className="pdf-section bg-white p-4">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                11. MODIFICACIÓN Y TERMINACIÓN DEL CONTRATO
              </h2>
              <p className="mt-2">
                11.1 <strong>LAS PARTES</strong> durante el cumplimiento del
                presente Contrato pueden acordar modificaciones a las
                obligaciones, condiciones y términos que se pactaron en el
                Contrato. Toda adición, modificación, especificación o enmienda
                que se pretenda realizar al presente Contrato, solamente podrá
                formalizarse mediante Suplementos que adquirirán plena validez y
                efecto legal a partir de la fecha de su firma por{" "}
                <strong>AMBAS PARTES</strong> contratantes.
                <br />
                11.2 Este Contrato podrá ser resuelto en cualquier momento por
                cualquiera de <strong>LAS PARTES</strong>. La Resolución de
                Contrato implica una notificación escrita por quien lo solicite
                dirigida a la <strong>OTRA PARTE</strong>, en caso de que
                concurra alguna de las circunstancias siguientes:
                <br />
                11.2.1 Formalización de cualquier petición voluntaria o
                involuntaria de quiebra o por una reorganización corporativa o
                por cualquier relevo similar.
                <br />
                11.2.2 Imposibilidad admitida por escrito de cumplir sus
                obligaciones pendientes o deudas vencidas de término para su
                pago.
                <br />
                11.2.3 Cese de los negocios entre <strong>LAS PARTES</strong> o
                cambio de las circunstancias bajo las cuáles este Contrato fue
                suscrito entre <strong>LAS PARTES</strong>.
                <br />
                11.2.4 Concurrencia de los motivos de Resolución enunciados en
                otras cláusulas del presente Contrato y motivados por su
                incumplimiento reiterado.
                <br />
                11.2.5 La Resolución de este Contrato tendrá efectos al
                cumplirse el término de treinta días (30) días naturales
                siguientes a la fecha de su notificación a la{" "}
                <strong>OTRA PARTE</strong>.
                <br />
                11.2.6 La Rescisión del presente Contrato se solicitará
                judicialmente por las causas previstas en la legislación.{" "}
                <strong>LA PARTE</strong> que provocare la Rescisión de este
                Contrato se obliga a indemnizar a la <strong>OTRA PARTE</strong>{" "}
                por concepto de los daños y perjuicios que, como
                responsabilidad, por su proceder le fuere imputable, los que
                deben ser debidamente probados, en el entendido de que en tal
                concepto se comprende los materiales adquiridos para cumplir el
                objeto de este Contrato. En cualquier caso, todos los gastos en
                que se incurran por motivo de Rescisión y/o Resolución correrán
                por cuenta de <strong>LA PARTE</strong> que la hubiere
                interesado. La Resolución y/o Rescisión del Contrato no exonera
                a <strong>LAS PARTES</strong> del cumplimiento de las
                obligaciones pendientes de pago que pudiera tener.
                <br />
                11.2.7 En el supuesto que sea aceptada la Resolución del
                presente Contrato, <strong>LAS PARTES</strong> deberán acordar
                todo lo relacionado con la forma, tiempo y modo en que
                efectuarán el cese de sus obligaciones contractuales, de manera
                tal que luego de resolver el Contrato, no quede ninguna cuestión
                pendiente de liquidación.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                12. AVISO ENTRE LAS PARTES
              </h2>
              <p className="mt-2">
                12.1 Todos los avisos entre las partes se realizarán por correo
                electrónico u otros medios telemáticos y carta certificada a las
                siguientes direcciones:
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  A EL VENDEDOR:
                </h3>
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Att.
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoVendedorAtt", "Atención")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Dirección:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoVendedorDireccion", "Dirección")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Teléfono:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoVendedorTelefono", "Teléfono")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        E-mail:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoVendedorEmail", "Email", "email")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  A EL COMPRADOR:
                </h3>
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Att.
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoCompradorAtt", "Atención")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Dirección:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoCompradorDireccion", "Dirección")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Teléfono:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoCompradorTelefono", "Teléfono")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        E-mail:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoCompradorEmail", "Email", "email")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                13. VIGENCIA
              </h2>
              <p className="mt-2">
                13.1 El presente contrato entrará en vigor a partir de la fecha
                de su firma y mantendrán su vigencia por un periodo de{" "}
                {renderField("vigenciaAnios", "1")} año(s), pudiendo prorrogarse
                por igual o mayor término a través de un suplemento, si{" "}
                <strong>LAS PARTES</strong> así lo deciden antes de su
                vencimiento.
                <br />
                13.2 Cualquiera de <strong>LAS PARTES</strong> puede solicitar
                se realice su revisión y/o modificación, siempre que{" "}
                <strong>LA PARTE</strong> que lo interese lo haga saber por
                escrito a la <strong>OTRA PARTE</strong> en un plazo de 10 días
                hábiles a partir de que conozca de las causas que motivan la
                revisión y/o modificación. <strong>LA PARTE</strong> que reciba
                la proposición deberá responder en el término de los 5 días
                hábiles siguientes, decursado este término sin que manifieste
                oposición alguna a ello, se entenderá que acepta la proposición.
                En consecuencia, el suplemento correspondiente se otorgará
                dentro de los 10 días hábiles siguientes a la aceptación expresa
                o tácita de la proposición, y ambos quedan obligados a su
                suscripción.
                <br />
                Si la solicitud de revisión y/o modificación obedece a
                disposiciones de órganos del estado y el gobierno, obligatorias
                para <strong>LAS PARTES</strong> o solo para una de ellas,{" "}
                <strong>LA PARTE</strong> proponente presentará el documento
                contentivo de la misma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                14. OTROS PACTOS
              </h2>
              <p className="mt-2">
                14.1 <strong>LAS PARTES</strong> no podrán traspasar los
                derechos y obligaciones que dimanen del presente Contrato ni
                hacer intervenir a terceros para el cumplimiento de sus
                obligaciones, a menos que así haya sido acordado por escrito
                entre las mismas.
                <br />
                14.2 <strong>LA PARTE</strong> que haga intervenir o participar
                a un tercero en la ejecución de este Contrato responderá ante la
                otra por el incumplimiento o cumplimiento inadecuado de dicho
                tercero como si se tratare de sus propios actos.
                <br />
                14.3 El presente Contrato se rige e interpreta de conformidad
                con lo establecido en la Ley No. 141/21 “Código de Procesos”,
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
                La Habana, a los {renderField("firmaDia", "Día")} del mes de{" "}
                {renderField("firmaMes", "Mes")} de{" "}
                {renderField("firmaAnio", "Año")}.
              </p>
              <div className="flex justify-between mt-6">
                <div>
                  ___________________
                  <br />
                  EL VENDEDOR
                </div>
                <div>
                  ___________________
                  <br />
                  EL COMPRADOR
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                ANEXO I: FICHA DEL CLIENTE
              </h2>
              <div className="mt-4">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Nombre de la entidad:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField(
                          "anexoEntidadNombre",
                          "Nombre de la entidad"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Dirección:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("anexoEntidadDireccion", "Dirección")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Teléfono:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("anexoEntidadTelefono", "Teléfono")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        E-mail:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("anexoEntidadEmail", "Email", "email")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Código Entidad:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("anexoEntidadCodigo", "Código")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Organismo o Ministerio:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("anexoEntidadOrganismo", "Organismo")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        NIT:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("anexoEntidadNIT", "NIT")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Cuenta Bancaria CUP:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("anexoEntidadCuentaBancaria", "Cuenta")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Sucursal CUP:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("anexoEntidadSucursal", "Sucursal")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Dirección Sucursal CUP:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField(
                          "anexoEntidadSucursalDireccion",
                          "Dirección"
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Personas Autorizadas a Solicitar Servicios, Firma de los
                  Entregables y Facturas
                </h3>
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 mt-2">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      <th className="border border-gray-300 dark:border-gray-700 p-2">
                        Nombre y Apellidos
                      </th>
                      <th className="border border-gray-300 dark:border-gray-700 p-2">
                        Cargo
                      </th>
                      <th className="border border-gray-300 dark:border-gray-700 p-2">
                        Firma
                      </th>
                      <th className="border border-gray-300 dark:border-gray-700 p-2">
                        No. C. Identidad
                      </th>
                      {isEditing && (
                        <th className="border border-gray-300 dark:border-gray-700 p-2">
                          Acciones
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {formData.anexoAutorizadosServicios.map(
                      (persona, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 dark:border-gray-700 p-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={persona.nombre}
                                onChange={(e) =>
                                  handleAnexoChange(
                                    "servicios",
                                    index,
                                    "nombre",
                                    e.target.value
                                  )
                                }
                                placeholder="Nombre y Apellidos"
                                className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                              />
                            ) : (
                              persona.nombre || "Nombre y Apellidos"
                            )}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 p-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={persona.cargo}
                                onChange={(e) =>
                                  handleAnexoChange(
                                    "servicios",
                                    index,
                                    "cargo",
                                    e.target.value
                                  )
                                }
                                placeholder="Cargo"
                                className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                              />
                            ) : (
                              persona.cargo || "Cargo"
                            )}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 p-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={persona.firma}
                                onChange={(e) =>
                                  handleAnexoChange(
                                    "servicios",
                                    index,
                                    "firma",
                                    e.target.value
                                  )
                                }
                                placeholder="Firma"
                                className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                              />
                            ) : (
                              persona.firma || "Firma"
                            )}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 p-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={persona.identidad}
                                onChange={(e) =>
                                  handleAnexoChange(
                                    "servicios",
                                    index,
                                    "identidad",
                                    e.target.value
                                  )
                                }
                                placeholder="No. C. Identidad"
                                className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                              />
                            ) : (
                              persona.identidad || "No. C. Identidad"
                            )}
                          </td>
                          {isEditing && (
                            <td className="border border-gray-300 dark:border-gray-700 p-2">
                              <button
                                onClick={() =>
                                  removeAnexoRow("servicios", index)
                                }
                                disabled={
                                  formData.anexoAutorizadosServicios.length ===
                                  1
                                }
                                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                              >
                                Eliminar
                              </button>
                            </td>
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                {isEditing && (
                  <button
                    onClick={() => addAnexoRow("servicios")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Agregar Fila
                  </button>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Personas Autorizadas para Firmar Conciliaciones
                </h3>
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 mt-2">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      <th className="border border-gray-300 dark:border-gray-700 p-2">
                        Nombre y Apellidos
                      </th>
                      <th className="border border-gray-300 dark:border-gray-700 p-2">
                        Cargo
                      </th>
                      <th className="border border-gray-300 dark:border-gray-700 p-2">
                        Firma
                      </th>
                      <th className="border border-gray-300 dark:border-gray-700 p-2">
                        No. C. Identidad
                      </th>
                      {isEditing && (
                        <th className="border border-gray-300 dark:border-gray-700 p-2">
                          Acciones
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {formData.anexoAutorizadosConciliaciones.map(
                      (persona, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 dark:border-gray-700 p-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={persona.nombre}
                                onChange={(e) =>
                                  handleAnexoChange(
                                    "conciliaciones",
                                    index,
                                    "nombre",
                                    e.target.value
                                  )
                                }
                                placeholder="Nombre y Apellidos"
                                className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                              />
                            ) : (
                              persona.nombre || "Nombre y Apellidos"
                            )}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 p-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={persona.cargo}
                                onChange={(e) =>
                                  handleAnexoChange(
                                    "conciliaciones",
                                    index,
                                    "cargo",
                                    e.target.value
                                  )
                                }
                                placeholder="Cargo"
                                className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                              />
                            ) : (
                              persona.cargo || "Cargo"
                            )}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 p-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={persona.firma}
                                onChange={(e) =>
                                  handleAnexoChange(
                                    "conciliaciones",
                                    index,
                                    "firma",
                                    e.target.value
                                  )
                                }
                                placeholder="Firma"
                                className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                              />
                            ) : (
                              persona.firma || "Firma"
                            )}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 p-2">
                            {isEditing ? (
                              <input
                                type="text"
                                value={persona.identidad}
                                onChange={(e) =>
                                  handleAnexoChange(
                                    "conciliaciones",
                                    index,
                                    "identidad",
                                    e.target.value
                                  )
                                }
                                placeholder="No. C. Identidad"
                                className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                              />
                            ) : (
                              persona.identidad || "No. C. Identidad"
                            )}
                          </td>
                          {isEditing && (
                            <td className="border border-gray-300 dark:border-gray-700 p-2">
                              <button
                                onClick={() =>
                                  removeAnexoRow("conciliaciones", index)
                                }
                                disabled={
                                  formData.anexoAutorizadosConciliaciones
                                    .length === 1
                                }
                                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                              >
                                Eliminar
                              </button>
                            </td>
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                {isEditing && (
                  <button
                    onClick={() => addAnexoRow("conciliaciones")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Agregar Fila
                  </button>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Representante de la Entidad Designado para Firmar Contrato
                </h3>
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 mt-2">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Nombre y Apellidos:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("anexoRepresentanteNombre", "Nombre")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Cargo que ocupa:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("anexoRepresentanteCargo", "Cargo")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <p>
                  El Director de la entidad o su equivalente declara, apercibido
                  de la responsabilidad en que incurre, que todos los datos aquí
                  plasmados son ciertos y que cualquier variación en alguno de
                  ellos deberá comunicarse de inmediato a Yunier Pérez Torres en
                  su condición de Socio Administrador, para evitar cualquier
                  consecuencia que de ello pueda derivarse.
                </p>
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 mt-2">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Nombres y apellidos del Director de la Entidad o su
                        equivalente:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("anexoDirectorNombre", "Nombre")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        No. Carné de identidad:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("anexoDirectorIdentidad", "Identidad")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Firma:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        ___________________
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Cuño:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        ___________________
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <p>
                  <strong>
                    Documentos que deben acompañar a este modelo para conformar
                    el expediente del cliente:
                  </strong>
                  <br />
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

export default ContratoCompraventa;
