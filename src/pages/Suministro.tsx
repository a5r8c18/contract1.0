import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

const ContratoSuministro = () => {
  const section1Ref = useRef<HTMLDivElement>(null); // DE UNA PARTE to 3. OBLIGACIONES DEL CLIENTE
  const section2Ref = useRef<HTMLDivElement>(null); // 4. LUGAR to 9. PENALIZACIONES
  const section3Ref = useRef<HTMLDivElement>(null); // 10. LIMITACION to ANEXO 1
  const [formData, setFormData] = useState({
    contratoNumero: "",
    clienteNombre: "",
    clienteNacionalidad: "",
    clienteDomicilio: "",
    clienteMunicipio: "",
    clienteProvincia: "",
    clienteInscripcionFecha: "",
    clienteTomo: "",
    clienteFolio: "",
    clienteHoja: "",
    clienteRegistro: "",
    clienteNIT: "",
    clienteCuentaBancaria: "",
    clienteAgencia: "",
    clienteRepresentante: "",
    clienteCargo: "",
    clienteEscrituraNumero: "",
    clienteEscrituraFecha: "",
    clienteNotaria: "",
    clienteNotariaProvincia: "",
    suministradorNombre: "",
    suministradorNacionalidad: "",
    suministradorDomicilio: "",
    suministradorMunicipio: "",
    suministradorProvincia: "",
    suministradorInscripcionFecha: "",
    suministradorTomo: "",
    suministradorFolio: "",
    suministradorHoja: "",
    suministradorRegistro: "",
    suministradorNIT: "",
    suministradorCuentaBancaria: "",
    suministradorBanco: "",
    suministradorAgencia: "",
    suministradorRepresentante: "",
    suministradorCargo: "",
    suministradorEscrituraNumero: "",
    suministradorEscrituraFecha: "",
    suministradorNotaria: "",
    suministradorNotariaProvincia: "",
    solicitudHorarioInicio: "",
    solicitudHorarioFin: "",
    vigenciaAnios: "1",
    avisoSuministradorNombre: "",
    avisoSuministradorDireccion: "",
    avisoSuministradorTelefono: "",
    avisoClienteNombre: "",
    avisoClienteDireccion: "",
    avisoClienteTelefono: "",
    firmaLugar: "",
    firmaDia: "",
    firmaMes: "",
    firmaAnio: "2024",
    anexoProductos: [{ nombre: "", cantidad: "", calidad: "", precio: "" }],
  });

  const [isEditing, setIsEditing] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAnexoChange = (index: number, field: string, value: string) => {
    const updatedAnexo = [...formData.anexoProductos];
    updatedAnexo[index] = { ...updatedAnexo[index], [field]: value };
    setFormData({ ...formData, anexoProductos: updatedAnexo });
  };

  const addAnexoRow = () => {
    setFormData({
      ...formData,
      anexoProductos: [
        ...formData.anexoProductos,
        { nombre: "", cantidad: "", calidad: "", precio: "" },
      ],
    });
  };

  const removeAnexoRow = (index: number) => {
    if (formData.anexoProductos.length > 1) {
      const updatedAnexo = formData.anexoProductos.filter(
        (_, i) => i !== index
      );
      setFormData({ ...formData, anexoProductos: updatedAnexo });
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
      if (key === "anexoProductos") {
        return formData.anexoProductos.every((producto) =>
          Object.values(producto).every((val) => val.trim() !== "")
        );
      }
      return typeof value === "string" ? value.trim() !== "" : true;
    });
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

      pdf.save("contrato_suministro.pdf");
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
              Contrato de Suministro
            </h1>
            <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">
              CONTRATO No. {renderField("contratoNumero", "___")}/2025
            </h2>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DE UNA PARTE
              </h2>
              <p className="mt-2">
                La entidad denominada{" "}
                {renderField("clienteNombre", "Nombre del cliente")} de
                nacionalidad{" "}
                {renderField("clienteNacionalidad", "Nacionalidad")}, con
                domicilio legal en{" "}
                {renderField("clienteDomicilio", "Domicilio")}, Municipio{" "}
                {renderField("clienteMunicipio", "Municipio")}, Provincia{" "}
                {renderField("clienteProvincia", "Provincia")}, inscripta el{" "}
                {renderField("clienteInscripcionFecha", "", "date")} al Tomo{" "}
                {renderField("clienteTomo", "Tomo")}, Folio{" "}
                {renderField("clienteFolio", "Folio")}, hoja{" "}
                {renderField("clienteHoja", "Hoja")} en el Registro Mercantil
                Territorial de {renderField("clienteRegistro", "Registro")}, con
                código NIT {renderField("clienteNIT", "NIT")}, cuenta bancaria
                en CUP {renderField("clienteCuentaBancaria", "Cuenta bancaria")}
                , agencia bancaria {renderField("clienteAgencia", "Agencia")},
                representado en este acto por{" "}
                {renderField("clienteRepresentante", "Representante")} en su
                carácter de {renderField("clienteCargo", "Cargo")} de la
                sociedad, según Escritura Pública de Constitución No.{" "}
                {renderField("clienteEscrituraNumero", "Número")} de fecha{" "}
                {renderField("clienteEscrituraFecha", "", "date")}, otorgada por
                la Licenciada {renderField("clienteNotaria", "Notaria")} Notaria
                con competencia provincial{" "}
                {renderField("clienteNotariaProvincia", "Provincia")}, que en lo
                sucesivo se denominará <strong>EL CLIENTE</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DE OTRA PARTE
              </h2>
              <p className="mt-2">
                La entidad denominada{" "}
                {renderField("suministradorNombre", "Nombre del suministrador")}{" "}
                de nacionalidad{" "}
                {renderField("suministradorNacionalidad", "Nacionalidad")}, con
                domicilio legal en{" "}
                {renderField("suministradorDomicilio", "Domicilio")}, Municipio{" "}
                {renderField("suministradorMunicipio", "Municipio")}, Provincia{" "}
                {renderField("suministradorProvincia", "Provincia")}, inscripta
                el {renderField("suministradorInscripcionFecha", "", "date")} al
                Tomo {renderField("suministradorTomo", "Tomo")}, Folio{" "}
                {renderField("suministradorFolio", "Folio")}, hoja{" "}
                {renderField("suministradorHoja", "Hoja")} en el Registro
                Mercantil Territorial de{" "}
                {renderField("suministradorRegistro", "Registro")}, con código
                NIT {renderField("suministradorNIT", "NIT")}, cuenta bancaria en
                CUP{" "}
                {renderField("suministradorCuentaBancaria", "Cuenta bancaria")}{" "}
                en el banco {renderField("suministradorBanco", "Banco")},
                agencia bancaria{" "}
                {renderField("suministradorAgencia", "Agencia")}, representado
                en este acto por{" "}
                {renderField("suministradorRepresentante", "Representante")} en
                su carácter de {renderField("suministradorCargo", "Cargo")} de
                la sociedad, según Escritura Pública de Constitución No.{" "}
                {renderField("suministradorEscrituraNumero", "Número")} de fecha{" "}
                {renderField("suministradorEscrituraFecha", "", "date")},
                otorgada por la Licenciada{" "}
                {renderField("suministradorNotaria", "Notaria")} Notaria con
                competencia provincial{" "}
                {renderField("suministradorNotariaProvincia", "Provincia")}, que
                en lo sucesivo se denominará <strong>EL SUMINISTRADOR</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                AMBAS PARTES
              </h2>
              <p className="mt-2">
                Reconociéndose la personalidad jurídica y representación con que
                concurren a este acto, convienen en concertar el presente
                Contrato de Suministro y a todos los efectos legales
                procedentes, declaran y convienen lo siguiente:
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                1. OBJETO DEL CONTRATO
              </h2>
              <p className="mt-2">
                1.1 Es objeto del presente contrato establecer una relación
                jurídica, donde rijan las bases de las relaciones comerciales
                entre las partes, mediante el cual{" "}
                <strong>EL SUMINISTRADOR</strong> se obliga a la entrega de un
                modo periódico o continuo, determinadas mercancías y{" "}
                <strong>EL CLIENTE</strong> a pagar su precio en los plazos
                acordados en los posteriores Suplementos que se suscriban los
                cuales formarán parte integrante del presente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                2. OBLIGACIONES ENTRE LAS PARTES
              </h2>
              <p className="mt-2">
                <strong>2.1 Obligaciones del SUMINISTRADOR:</strong>
                <br />
                2.1.1 Entregar los productos objeto del contrato en el plazo,
                condiciones y cantidades acordados en correspondencia con lo
                dispuesto en el <strong>ANEXO 1</strong> del presente contrato.
                <br />
                2.1.2 Velar porque el producto a suministrar reúna los
                requisitos de calidad y cantidad amparados en las facturas.
                <br />
                2.1.3 Garantizar la entrega de los productos en los lugares y
                horarios descritos en el presente Contrato y Suplementos.
                <br />
                2.1.4 Realizar las conciliaciones con{" "}
                <strong>EL CLIENTE</strong> entre los días acordados para la
                conformidad del Estado de Cuentas y la entrega de productos.
                <br />
                2.1.5 Entregar a <strong>EL CLIENTE</strong> las facturas
                correspondientes a los suministros de las mercancías.
                <br />
                2.1.6 Entregar a <strong>EL CLIENTE</strong> los certificados de
                concordancia por cada producto suministrado.
                <br />
                <strong>3. Obligaciones del CLIENTE:</strong>
                <br />
                3.1 Pagar el importe de las facturas correspondientes al
                producto adquirido en el plazo acordado y utilizando los
                instrumentos de pagos convenidos a partir del momento del recibo
                de la factura, de no efectuarse el pago{" "}
                <strong>EL SUMINISTRADOR</strong>, suspenderá las entregas a
                este hasta tanto sean pagadas las facturas anteriormente
                recibidas, sin perjuicio de las reclamaciones que procedan.
                <br />
                3.2 Recibir todos los productos contratados en el plazo,
                términos, condiciones, documentación y los requisitos de calidad
                pactados, sin efectuar dejación de los mismos. En el supuesto de
                proceder a la realización de esta última acción, deberá ser
                informada por escrito.
                <br />
                3.3 Realizar las conciliaciones entre los días acordados de cada
                mes, para la conformidad del Estado de Cuentas y la entrega de
                productos con <strong>EL SUMINISTRADOR</strong>.
              </p>
            </section>
          </div>

          <div ref={section2Ref} className="pdf-section bg-white p-4">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                4. LUGAR, CONDICIONES DE ENTREGA Y PLAZOS DE ENTREGA
              </h2>
              <p className="mt-2">
                4.1 El lugar de entrega será en el Almacén del Suministrador de
                mutuo acuerdo entre las partes, en dicho lugar se efectuará la
                inspección de la carga. <strong>EL SUMINISTRADOR</strong> está
                obligado a efectuar su entrega según previa coordinación entre
                las partes.
                <br />
                4.2 Las partes se comunicarán con tiempo las variaciones que por
                cualquier causa puedan afectar el programa previsto para la
                entrega a fin de que se realicen los ajustes necesarios al
                respecto, dicha comunicación deberá realizarse como mínimo antes
                de las 72 horas.
                <br />
                4.3 <strong>EL SUMINISTRADOR</strong> presentará en el momento
                de cada entrega la factura correspondiente y el resto de los
                documentos exigidos.
                <br />
                4.4 <strong>EL SUMINISTRADOR</strong> no aceptará devolución
                alguna de mercancías vendidas en ejecución del presente contrato
                de suministro, salvo en los casos de afectación en el proceso de
                transportación no advertidos por <strong>EL CLIENTE</strong>.
                <br />
                4.5 Los plazos de entrega se establecerán en cada suplemento
                previa coordinación entre ambas partes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                5. SOLICITUD DE LAS MERCANCÍAS
              </h2>
              <p className="mt-2">
                5.1 <strong>EL CLIENTE</strong> solicitará las mercancías por
                vía WhatsApp, correo electrónico o presencial en las oficinas
                del <strong>SUMINISTRADOR</strong> en caso de ser esta última
                será en el horario de{" "}
                {renderField("solicitudHorarioInicio", "____")} a{" "}
                {renderField("solicitudHorarioFin", "____")} con una semana de
                antelación a la que se pretenda que se realice la entrega.
                <br />
                5.2 <strong>EL SUMINISTRADOR</strong> dará respuesta de la
                oferta realizada a las 72 horas de recibida por la misma vía que
                fue recibida.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                6. TRANSPORTACIÓN
              </h2>
              <p className="mt-2">
                6.1 <strong>EL CLIENTE</strong> asumirá la transportación de los
                productos contratados, así como los gastos generados por este
                concepto.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                7. PRECIO, TÉRMINO Y FORMA DE PAGO
              </h2>
              <p className="mt-2">
                7.1 El precio será convenido de mutuo acuerdo y quedará
                especificado en los correspondientes Suplementos.
                <br />
                7.2 Los pagos se efectuarán mediante los medios de pago
                establecido en la Resolución No.183 del 2021 “Normas Bancarias
                para los Cobros y Pagos”, del Banco Central de Cuba, dirigidos
                a:
                <br />
                7.3 Las Partes acuerdan efectuar conciliaciones cuando así se
                requiera en el domicilio de <strong>EL SUMINISTRADOR</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                8. CALIDAD
              </h2>
              <p className="mt-2">
                8.1 <strong>EL SUMINISTRADOR</strong> garantizará la calidad de
                la mercancía. De existir problemas en la calidad será resuelta
                de forma amigable.
                <br />
                8.2 <strong>EL SUMINISTRADOR</strong> brindará las facilidades
                necesarias al <strong>CLIENTE</strong> para que realice
                muestreos al momento de la entrega de la mercancía, para
                detectar cualquier diferencia que exista en cuanto a la calidad.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                9. PENALIZACIONES
              </h2>
              <p className="mt-2">
                9.1 Las partes convienen que, en caso de incumplimiento de la
                entrega, por causas imputables a{" "}
                <strong>EL SUMINISTRADOR</strong>, este abonará a{" "}
                <strong>EL CLIENTE</strong> una penalidad por demora en la
                entrega, calculada a partir de la fecha o plazo incumplido,
                equivalente al cero punto cero once por ciento (0.011%) del
                importe de los productos demorados, en CUP por cada día natural
                de demora, cuyo importe no podrá exceder el cuatro por ciento
                (4%) del importe de los productos dejados de entregar. Estas
                penalidades constituirán la total compensación de los daños que
                podrían ser exigidos como consecuencia del retraso por parte de{" "}
                <strong>EL SUMINISTRADOR</strong>.
                <br />
                9.2 Igual penalidad abonará <strong>EL CLIENTE</strong> por
                demora en la recogida de los productos u otro incumplimiento de
                las cláusulas del presente Contrato y sus suplementos.
              </p>
            </section>
          </div>

          <div ref={section3Ref} className="pdf-section bg-white p-4">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                10. LIMITACIÓN O EXENCIÓN DE LA RESPONSABILIDAD
              </h2>
              <p className="mt-2">
                10.1 Las <strong>PARTES</strong> no serán responsables del
                incumplimiento o cumplimiento inadecuado de sus respectivas
                obligaciones contractuales, cuando las mismas sean imposibles de
                satisfacer por razones de causas eximentes de responsabilidad,
                entendiéndose por tales los acontecimientos imprevisibles o si
                previsibles pero inevitables, que ajenos a la voluntad y
                actuación de las <strong>PARTES</strong> ocurran con
                posterioridad a la fecha de firma del contrato. Se entiende por
                eximentes de responsabilidad la Fuerza Mayor y Caso Fortuito, y
                sin limitarnos a ellos, pueden ser inundaciones, sequías,
                incendios, granizadas, terremotos, ciclones o huracanes, plagas,
                desastres, guerras, operaciones militares de cualquier clase, o
                cualquier otra eventualidad o contingencia que imposibilitaren
                total o parcialmente su realización.
                <br />
                10.2 La parte afectada por un evento de esta naturaleza
                notificará y probará a la otra su comienzo, naturaleza eventual
                y duración, así como oportunamente su terminación, certificada
                por autoridad competente para tales efectos.
                <br />
                10.3 El plazo de cumplimiento de las obligaciones contractuales
                se entenderá prorrogado por un período igual al de vigencia de
                dichas contingencias. Si estas contingencias duraran más de 90
                (noventa) días, cada una de las <strong>PARTES</strong>{" "}
                contratantes podrá dar por terminado el contrato,
                notificándoselo por escrito a la otra parte, no teniendo ningún
                derecho a ser compensado de cualquier pérdida.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                11. SOLUCIÓN DE DISCREPANCIAS
              </h2>
              <p className="mt-2">
                11.1 Para dirimir las discrepancias que pudieran originarse
                sobre el cumplimiento de las obligaciones contratadas, las
                partes se reclamarán, por escrito, en el término de los 15 días
                hábiles siguientes al conocimiento de la causa que le dio
                origen. La parte reclamada responderá en igual término posterior
                al día en que se reciba la inconformidad; utilizando la
                notificación personal en el domicilio del reclamado o por vía de
                correo, a través de la Carta Certificada, teniéndose como fecha
                de notificación para esta última, la del día de imposición de la
                misiva; en caso de no llegar a acuerdo se someterán expresamente
                a que lo resuelva la Sala de lo Mercantil de Tribunal
                Competente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                12. NOTIFICACIONES Y AVISOS
              </h2>
              <p className="mt-2">
                12.1 Las <strong>PARTES</strong> deberán comunicarse, con no
                menos de 30 días hábiles de antelación, la eventual posibilidad
                de incumplir con alguna de sus obligaciones o cualquier otra
                circunstancia que atente contra el cumplimiento de las mismas, a
                las direcciones que se mencionan a continuación:
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  POR EL SUMINISTRADOR:
                </h3>
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Nombre y apellido:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoSuministradorNombre", "Nombre")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Dirección:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField(
                          "avisoSuministradorDireccion",
                          "Dirección"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Teléfono:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoSuministradorTelefono", "Teléfono")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  POR EL CLIENTE:
                </h3>
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Nombre y apellido:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoClienteNombre", "Nombre")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Dirección:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoClienteDireccion", "Dirección")}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        Teléfono:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {renderField("avisoClienteTelefono", "Teléfono")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                13. CONFIDENCIALIDAD
              </h2>
              <p className="mt-2">
                13.1 Las <strong>PARTES</strong> se obligan a preservar la
                confidencialidad de la información que recíprocamente se
                suministre, durante la etapa de negociación o ejecución
                posterior del contrato, salvo las excepciones previstas en la
                ley.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                14. LEGISLACIÓN APLICABLE
              </h2>
              <p className="mt-2">
                14.1 Ley No. 59 Código Civil de fecha 17 de Julio de 1987 de la
                Asamblea Nacional del Poder Popular, Decreto Ley No. 304 de
                fecha 1 de noviembre de 2012 del Consejo de Estado “De la
                Contratación Económica”, Decreto No. 310 de fecha 17 de
                diciembre de 2012 del Consejo de Ministros “De los Tipos de
                Contratos” en relación con el contrato de Suministro y cuantas
                disposiciones legales, tanto sustantivas como adjetivas sean de
                aplicación al contrato.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                15. VIGENCIA
              </h2>
              <p className="mt-2">
                15.1 El término de vigencia del presente Contrato será de{" "}
                {renderField("vigenciaAnios", "1")} año a partir de la fecha de
                su firma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                16. MODIFICACIONES
              </h2>
              <p className="mt-2">
                16.1 Este contrato, por acuerdo entre las partes, podrá ser
                modificado a solicitud de cualquiera de las mismas, siempre que
                la parte solicitante le comunique por escrito a la otra su
                intención de hacerlo con treinta (30) días de antelación a la
                fecha de la entrada en vigor de la propuesta.
                <br />
                16.2 Las modificaciones se incorporarán mediante suplementos,
                debidamente firmados por las partes, y formarán parte integrante
                del presente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                17. CESIÓN DE DERECHOS
              </h2>
              <p className="mt-2">
                17.1 Las partes no podrán ceder a terceros sus derechos, ni el
                cumplimiento de las obligaciones establecidas en el presente
                contrato, sin el previo consentimiento de la otra; de lo cual se
                dejará constancia escrita.
                <br />
                17.2 En caso de aceptarse la cesión de derechos y demás
                requisitos que en el apartado anterior se establecen, ambas
                partes y el tercero que se compromete al cumplimiento de la
                obligación en cuestión, firmarán el documento correspondiente
                que acredite tal acuerdo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                18. CONSERVACIÓN
              </h2>
              <p className="mt-2">
                18.1 Ambas partes están obligadas a conservar el presente
                Contrato, sus Anexos y Suplementos por el término de cinco (5)
                años a partir de la fecha del cumplimiento de su vigencia.
              </p>
            </section>

            <section>
              <p className="mt-2">
                Ambas partes se comprometen al más estricto cumplimiento de las
                estipulaciones de este contrato.
                <br />Y para que conste se firma el presente contrato en dos (2)
                ejemplares a un solo y único tenor y con el mismo efecto y valor
                legal en {renderField("firmaLugar", "Lugar")} los{" "}
                {renderField("firmaDia", "Día")} días del mes de{" "}
                {renderField("firmaMes", "Mes")} de{" "}
                {renderField("firmaAnio", "Año")}. Año 66 de la Revolución.
              </p>
              <div className="flex justify-between mt-6">
                <div>
                  ___________________
                  <br />
                  EL SUMINISTRADOR
                </div>
                <div>
                  ___________________
                  <br />
                  EL CLIENTE
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6">
                ANEXO 1: DESCRIPCIÓN DE LOS PRODUCTOS
              </h2>
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 mt-4">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-gray-700 p-2">
                      Nombre del Producto
                    </th>
                    <th className="border border-gray-300 dark:border-gray-700 p-2">
                      Cantidad
                    </th>
                    <th className="border border-gray-300 dark:border-gray-700 p-2">
                      Calidad
                    </th>
                    <th className="border border-gray-300 dark:border-gray-700 p-2">
                      Precio (CUP)
                    </th>
                    {isEditing && (
                      <th className="border border-gray-300 dark:border-gray-700 p-2">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {formData.anexoProductos.map((producto, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={producto.nombre}
                            onChange={(e) =>
                              handleAnexoChange(index, "nombre", e.target.value)
                            }
                            placeholder="Nombre del Producto"
                            className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                          />
                        ) : (
                          producto.nombre || "Nombre del Producto"
                        )}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={producto.cantidad}
                            onChange={(e) =>
                              handleAnexoChange(
                                index,
                                "cantidad",
                                e.target.value
                              )
                            }
                            placeholder="Cantidad"
                            className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                          />
                        ) : (
                          producto.cantidad || "Cantidad"
                        )}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={producto.calidad}
                            onChange={(e) =>
                              handleAnexoChange(
                                index,
                                "calidad",
                                e.target.value
                              )
                            }
                            placeholder="Calidad"
                            className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                          />
                        ) : (
                          producto.calidad || "Calidad"
                        )}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={producto.precio}
                            onChange={(e) =>
                              handleAnexoChange(index, "precio", e.target.value)
                            }
                            placeholder="Precio"
                            className="w-full p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
                          />
                        ) : (
                          producto.precio || "Precio"
                        )}
                      </td>
                      {isEditing && (
                        <td className="border border-gray-300 dark:border-gray-700 p-2">
                          <button
                            onClick={() => removeAnexoRow(index)}
                            disabled={formData.anexoProductos.length === 1}
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
                  EL SUMINISTRADOR
                </div>
                <div>
                  ___________________
                  <br />
                  EL CLIENTE
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContratoSuministro;
