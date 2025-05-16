import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";

const ContratoTrabajo = () => {
  const section1Ref = useRef<HTMLDivElement>(null); // DE UNA PARTE to PRIMERA
  const section2Ref = useRef<HTMLDivElement>(null); // SEGUNDA to DÉCIMOPRIMERA
  const section3Ref = useRef<HTMLDivElement>(null); // DÉCIMOSEGUNDA to end
  const [formData, setFormData] = useState({
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
    pluriempleo: "",
    pluriempleoDias: "",
    pluriempleoSemanas: "",
    pluriempleoMeses: "",
    pluriempleoTerminacion: "",
    cargo: "",
    anexo: "",
    fechaInicio: "",
    duracionMeses: "",
    lugarTrabajo: "",
    jornadaHoras: "",
    descansoDia1: "",
    descansoDia2: "",
    salario: "",
    pagoDia: "",
    firmaDia: "",
    firmaMes: "",
    firmaAnio: "2025",
  });

  const [isEditing, setIsEditing] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const isFormComplete = Object.entries(formData).every(([key, value]) => {
    if (
      [
        "pluriempleoDias",
        "pluriempleoSemanas",
        "pluriempleoMeses",
        "pluriempleoTerminacion",
      ].includes(key) &&
      formData.pluriempleo !== "Sí"
    ) {
      return true; // Ignorar estos campos si pluriempleo no es "Sí"
    }
    return value.trim() !== "";
  });

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

      pdf.save("contrato_trabajo_determinado.pdf");
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
      if (type === "select") {
        return (
          <select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
          >
            <option value="">{placeholder}</option>
            {name === "pluriempleo" && (
              <>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </>
            )}
            {(name === "descansoDia1" || name === "descansoDia2") && (
              <>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </>
            )}
          </select>
        );
      }
      return (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded"
        />
      );
    }
    return (
      <span className="font-medium text-gray-900 dark:text-gray-200">
        {formData[name] || placeholder}
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
              disabled={!isFormComplete}
              className={`px-4 py-2 rounded-md text-white ${
                isFormComplete
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
            disabled={isEditing || !isFormComplete}
            className={`px-4 py-2 rounded-md text-white ${
              isEditing || !isFormComplete
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
              Contrato de Trabajo por Tiempo Determinado
            </h1>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DE UNA PARTE
              </h2>
              <p className="mt-2">
                {renderField("empleadorNombre", "Nombre de la entidad")},
                constituida mediante Escritura Pública número{" "}
                {renderField("empleadorEscrituraNumero", "Número")} de fecha{" "}
                {renderField("empleadorFecha", "", "date")}, con domicilio legal
                en {renderField("empleadorDireccion", "Dirección")}, municipio{" "}
                {renderField("empleadorMunicipio", "Municipio")}, provincia{" "}
                {renderField("empleadorProvincia", "Provincia")}, de
                nacionalidad{" "}
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
                condición de {renderField("empleadorCondicion", "Condición")},
                lo que acredita mediante Decisión No.{" "}
                {renderField("empleadorDecisionNumero", "Número")} de fecha{" "}
                {renderField("empleadorDecisionFecha", "", "date")}, emitida por{" "}
                {renderField("empleadorNotario", "Notario")}, notario con
                competencia provincial en{" "}
                {renderField("empleadorNotarioProvincia", "Provincia")} y sede
                en {renderField("empleadorNotarioSede", "Sede")}, provincia{" "}
                {renderField("empleadorNotarioProvinciaSede", "Provincia")}, que
                en lo sucesivo y a los efectos de este contrato se denominará{" "}
                <strong>EL EMPLEADOR</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DE OTRA PARTE
              </h2>
              <p className="mt-2">
                {renderField("trabajadorNombre", "Nombre del trabajador")},
                ciudadano(a) cubano(a), de{" "}
                {renderField("trabajadorEdad", "Edad")} años de edad, de estado
                conyugal {renderField("trabajadorEstadoCivil", "Estado civil")},
                de profesión {renderField("trabajadorProfesion", "Profesión")},
                con número de identidad permanente{" "}
                {renderField("trabajadorIdentidad", "Identidad")}, vecino de{" "}
                {renderField("trabajadorDireccion", "Dirección")}, municipio{" "}
                {renderField("trabajadorMunicipio", "Municipio")}, provincia{" "}
                {renderField("trabajadorProvincia", "Provincia")}, a quien en lo
                sucesivo y a los efectos del presente Contrato se denominará{" "}
                <strong>EL TRABAJADOR</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                AMBAS PARTES
              </h2>
              <p className="mt-2">
                Reconociéndose la capacidad legal y representación con que
                concurren a este acto jurídico, en el ejercicio de sus propios
                derechos, CONVIENEN suscribir el presente Contrato de Trabajo
                por tiempo determinado para la ejecución de un trabajo u obra
                conforme a lo que se establece en las cláusulas siguientes:
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                PRIMERA: OBJETO DEL CONTRATO
              </h2>
              <p className="mt-2">
                1.1 Formalizar la relación laboral entre EL EMPLEADOR y EL
                TRABAJADOR y establecer los términos y condiciones bajo los
                cuales se regirá la relación laboral, EL TRABAJADOR deberá
                demostrar que posee la idoneidad necesaria para desempeñarse en
                el cargo que aspira a ocupar de manera permanente y comprobar
                que las condiciones y las características del lugar donde
                ejecutará su trabajo se responde a sus intereses.
                <br />
                <div className="mt-4">
                  <label>Pluriempleo: </label>
                  {renderField("pluriempleo", "Seleccione", "select")}
                </div>
                {formData.pluriempleo === "Sí" && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div>
                      <label>Días: </label>
                      {renderField("pluriempleoDias", "Días")}
                    </div>
                    <div>
                      <label>Semanas: </label>
                      {renderField("pluriempleoSemanas", "Semanas")}
                    </div>
                    <div>
                      <label>Meses: </label>
                      {renderField("pluriempleoMeses", "Meses")}
                    </div>
                    <div>
                      <label>Fecha de terminación: </label>
                      {renderField("pluriempleoTerminacion", "", "date")}
                    </div>
                  </div>
                )}
                {formData.pluriempleo === "Sí" && (
                  <>
                    <br />
                    1.2 El contrato de trabajo que se formaliza será en
                    modalidad pluriempleo, por lo cual se consignará en el mismo
                    de acuerdo a las características de esta modalidad, la
                    cantidad y distribución del tiempo de trabajo pactado,
                    expresado en {renderField(
                      "pluriempleoDias",
                      "Días"
                    )} días, {renderField("pluriempleoSemanas", "Semanas")}{" "}
                    semanas y {renderField("pluriempleoMeses", "Meses")} meses,
                    así como la fecha de terminación{" "}
                    {renderField("pluriempleoTerminacion", "", "date")}.
                  </>
                )}
              </p>
            </section>
          </div>

          <div ref={section2Ref} className="pdf-section bg-white p-4">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                SEGUNDA: CARGO Y CONTENIDO
              </h2>
              <p className="mt-2">
                2.1 EL TRABAJADOR se emplea para desempeñarse como:{" "}
                {renderField("cargo", "Cargo")}.
                <br />
                2.2 El alcance de la(s) actividad(es), funciones y atribuciones
                específicas según el cargo, se describen en el ANEXO NO.1 del
                presente Contrato, el que forma parte integrante del mismo,
                debidamente firmado por EL TRABAJADOR como constancia de su
                conformidad: {renderField("anexo", "Descripción del anexo")}.
                <br />
                2.3 EL EMPLEADOR podrá trasladar a EL TRABAJADOR provisional o
                definitivamente a otra ocupación o área de trabajo distinta a la
                inicialmente pactada, por interés propio o de EL EMPLEADOR,
                siempre que se encuentre apto para el nuevo desempeño. De esta
                modificación deberá quedar constancia en un Suplemento al
                presente contrato.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                TERCERA: FECHA DE INICIO Y DURACIÓN
              </h2>
              <p className="mt-2">
                3.1 El presente Contrato entrará en vigor a partir del{" "}
                {renderField("fechaInicio", "", "date")} y estará vigente por ({" "}
                {renderField("duracionMeses", "Meses")}) meses. Si vencido este
                término, LAS PARTES decidieran prorrogar el tiempo de vigencia
                se deberá realizar el correspondiente suplemento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                CUARTA: LUGAR DE TRABAJO Y FORMA DE EJECUCIÓN
              </h2>
              <p className="mt-2">
                4.1 EL TRABAJADOR realizará las labores para las cuales se
                contrata, alternando su presencia física en la sede donde
                prestará el servicio, en su domicilio, sede de la sociedad u
                otro lugar: {renderField("lugarTrabajo", "Lugar de trabajo")}.
                <br />
                4.2 El intercambio de la información necesaria para que EL
                TRABAJADOR desarrolle su labor dependerá de la comunicación
                directa con EL EMPLEADOR y los compañeros de trabajo, pudiendo
                utilizar los días planificados para laborar fuera de la sede de
                EL EMPLEADOR las tecnologías de la información y las
                comunicaciones específicamente mediante el uso del correo
                electrónico, redes sociales (WhatsApp, Telegram, Messenger),
                mensajería instantánea nacional y la vía telefónica, móvil y/o
                fija o prescindir de las mismas a consideración de EL EMPLEADOR.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                QUINTA: DURACIÓN DE LA JORNADA DE TRABAJO Y HORARIO
              </h2>
              <p className="mt-2">
                5.1 La jornada semanal es de{" "}
                {renderField("jornadaHoras", "Horas")} horas. Laborará en la
                sede de EL EMPLEADOR o donde preste el servicio.
                <br />
                5.2 No obstante, si en el transcurso de la semana/mes se
                requiere por EL EMPLEADOR alguna información que deba brindar EL
                TRABAJADOR, la solicitará a este último mediante el uso de las
                tecnologías de la información y EL TRABAJADOR deberá enviarla en
                el día y horario solicitado y que le fuere notificado
                previamente por las vías establecidas o mediante entrega
                personal, aunque no fuere en los días pactados en los que se
                requiera su presencia física en la sede de EL EMPLEADOR.
                <br />
                5.3 Aquellas informaciones cuyo contenido no sea recomendable su
                trasmisión por las vías establecidas, será copiada en un
                dispositivo portátil y podrá ser recogida directamente por EL
                EMPLEADOR en el lugar de trabajo fijado, en el domicilio de EL
                TRABAJADOR en el horario entre las 08:00 am – 05:00 pm. De lo
                contrario serán entregadas por EL TRABAJADOR directamente en la
                sede de EL EMPLEADOR en las fechas señaladas en el acápite 5.2.
                <br />
                5.4 Para cualesquiera de las variantes establecidas en las dos
                cláusulas precedentes mediará la comunicación entre LAS PARTES
                de cómo se deberá proceder.
                <br />
                5.5 Los dispositivos y medios informáticos a utilizar por EL
                TRABAJADOR, se garantizan por EL TRABAJADOR, hasta tanto EL
                EMPLEADOR esté en condiciones de hacerlo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                SEXTA: RÉGIMEN DE TRABAJO Y DESCANSO
              </h2>
              <p className="mt-2">
                6.1 EL TRABAJADOR tendrá derecho a un descanso semanal, de
                cuarenta y ocho (48) horas consecutivas, el que disfrutará, como
                regla, los {renderField("descansoDia1", "Seleccione", "select")}{" "}
                y {renderField("descansoDia2", "Seleccione", "select")}.
                <br />
                6.2 En aquellos casos en los que no pueda interrumpirse el
                trabajo por los requerimientos técnicos, tecnológicos y
                organizativos de la producción y los servicios o porque existe
                la obligación de prestar un servicio permanente con el propósito
                de no generar incumplimiento en las obligaciones contraídas con
                los clientes de EL EMPLEADOR, el descanso se podrá fijar
                cualquier otro día de la semana, de mutuo acuerdo entre EL
                EMPLEADOR y EL TRABAJADOR, sin necesidad de suscribir un
                suplemento al presente contrato.
                <br />
                6.3 EL TRABAJADOR tiene derecho al disfrute de sus vacaciones
                anuales pagadas, en correspondencia con el tiempo de trabajo
                efectivo acumulado, así como también a la Seguridad Social. El
                cálculo para determinar el acumulado de días de vacaciones
                anuales pagadas y la cuantía de su retribución, se efectúa
                multiplicando por el nueve punto cero nueve por ciento (9.09 %)
                los días realmente trabajados y los salarios percibidos durante
                el período acumulado que da derecho al descanso.
                <br />
                6.4 Las ausencias al trabajo de EL TRABAJADOR, incluidas las
                originadas por enfermedad, accidente y otras en que no se paga
                salario, interrumpen la acumulación del tiempo de las vacaciones
                anuales pagadas y de los salarios percibidos, reanudándose una
                vez que EL TRABAJADOR se reintegra efectivamente a su labor.
                <br />
                6.5 EL EMPLEADOR contrae con EL TRABAJADOR la obligación de
                mantener un control actualizado del tiempo de trabajo y de
                salarios devengados a fin de hacer los trámites de la Seguridad
                Social.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                SÉPTIMA: CUANTÍA DE LA REMUNERACIÓN Y PERIODICIDAD DE LOS PAGOS
              </h2>
              <p className="mt-2">
                7.1 El salario a pagar por EL EMPLEADOR a EL TRABAJADOR será de{" "}
                {renderField("salario", "Salario")} CUP.
                <br />
                7.2 En el caso de que se pacte una nueva actividad u ocupación
                durante el período vigencia de este Contrato, EL TRABAJADOR
                devengará su salario según la ocupación definitiva en la que
                labore, suscribiendo AMBAS PARTES un Suplemento al presente
                donde se reflejen las nuevas condiciones que regirán la relación
                laboral que se formaliza.
                <br />
                7.3 El salario fijado como retribución por la labor de EL
                TRABAJADOR, será liquidado por EL EMPLEADOR, específicamente los
                días {renderField("pagoDia", "Día")} del mes siguiente al mes
                vencido.
                <br />
                7.4 EL TRABAJADOR puede, por razones justificadas y acordadas
                con EL EMPLEADOR, autorizar por escrito a un familiar u otra
                persona a cobrar su salario.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                OCTAVA: OTROS PAGOS
              </h2>
              <p className="mt-2">
                8.1 EL EMPLEADOR está obligado a brindar transportación,
                alimentación y alojamiento o, en su caso, a sufragar los gastos
                por estos conceptos en la cuantía fijada por EL EMPLEADOR o la
                legislación aplicable, cuando EL TRABAJADOR sea enviado eventual
                o temporalmente a realizar labores fuera de la provincia. En
                aquellos casos donde se envíe al trabajador a realizar su labor
                en otro lugar diferente a su lugar habitual de alimentación y
                alojamiento, pero dentro de la provincia, EL EMPLEADOR solo
                asumirá esos gastos si las condiciones económico financiera se
                lo permiten.
                <br />
                8.2 EL EMPLEADOR, al amparo de lo dispuesto en la legislación
                vigente, actuará como RETENTOR del pago del impuesto sobre los
                ingresos personales y la contribución especial a la seguridad
                social, tributos a cuyo pago está obligado EL TRABAJADOR.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                NOVENA: CONDICIONES DE SEGURIDAD Y SALUD EN EL TRABAJO
              </h2>
              <p className="mt-2">
                9.1 Es obligación de EL EMPLEADOR cumplir con la legislación a
                fin a la materia y adoptar las medidas que garanticen las
                condiciones laborales adecuadas para EL TRABAJADOR.
                <br />
                9.2 EL EMPLEADOR deberá identificar y evaluar los riesgos en el
                trabajo y realizar acciones preventivas para disminuirlos o
                evitarlos; dar instrucción a EL TRABAJADOR sobre los riesgos en
                el trabajo y los procedimientos para realizar su labor de forma
                segura y saludable, aun cuando se trate de su domicilio,
                teniendo éste la obligación de cumplirla.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DÉCIMA: CALIDAD DE LAS ACTIVIDADES REALIZADAS
              </h2>
              <p className="mt-2">
                10.1 La calidad de la prestación realizada por EL TRABAJADOR,
                será de conformidad con las normas técnicas establecidas para la
                actividad que desempeña, por lo que responderá ante EL EMPLEADOR
                tanto por la baja calidad como por cualquier daño o perjuicio
                causado con motivo de incurrir en negligencias tecnológicas.
                <br />
                10.2 EL EMPLEADOR tendrá derecho a resarcirse de los daños y
                perjuicios descritos en el apartado anterior con cargo a las
                cantidades pendientes por devengar de EL TRABAJADOR, en
                correspondencia con lo dispuesto en la legislación vigente a
                esos efectos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DÉCIMOPRIMERA: DISCIPLINA DE TRABAJO
              </h2>
              <p className="mt-2">
                11.1 EL TRABAJADOR tiene el deber de realizar su trabajo con la
                eficiencia y calidad requerida, cumplir con los procedimientos
                internos, disciplina y con el orden establecido, así como
                cumplir con el horario establecido para los intercambios de
                información, debiendo informar a EL EMPLEADOR, con antelación,
                cualquier dificultad que se presente con el objetivo de
                solucionarla lo más rápido posible.
                <br />
                11.2 El régimen de disciplina laboral aplicable a EL TRABAJADOR
                será el regulado en la legislación laboral común vigente en el
                país. Las indisciplinas cometidas por EL TRABAJADOR, serán
                sancionadas por EL EMPLEADOR, autoridad facultada dentro de la
                organización para estos fines.
                <br />
                11.3 EL EMPLEADOR, no obstante, podrá dictar un Reglamento
                Disciplinario Interno que será de obligatorio cumplimiento por
                EL TRABAJADOR, siempre y cuando no contradiga lo dispuesto en la
                legislación laboral común vigente. En el mencionado Reglamento
                podrá tipificar como indisciplina otras conductas negativas
                vinculadas directamente a las actividades principales y
                secundarias que ejecuta en virtud del objeto social aprobado. EL
                TRABAJADOR tiene derecho a que se instruya sobre lo regulado en
                el Reglamento disciplinario Interno, en caso de que existiese.
              </p>
            </section>
          </div>

          <div ref={section3Ref} className="pdf-section bg-white p-4">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DÉCIMOSEGUNDA: TERMINACIÓN DEL CONTRATO DE TRABAJO
              </h2>
              <p className="mt-2">
                12.1 El presente contrato de trabajo termina por las causas
                siguientes:
                <br />
                a. Acuerdo de LAS PARTES;
                <br />
                b. Iniciativa de alguna de LAS PARTES,
                <br />
                c. Vencimiento del término fijado para la ejecución del trabajo
                u obra.
                <br />
                d. Por fuerza mayor que imposibilite la realización del trabajo
                para el cual fue contratado;
                <br />
                e. Aplicación de la medida disciplinaria de separación
                definitiva de la entidad por la comisión de una indisciplina
                laboral;
                <br />
                f. Fallecimiento de EL TRABAJADOR;
                <br />
                g. Disolución de EL EMPLEADOR.
                <br />
                12.2 Si EL TRABAJADOR por su voluntad e iniciativa decide dar
                por terminado el contrato de trabajo debe comunicarlo por
                escrito a EL EMPLEADOR, mínimo con quince (15) días hábiles de
                antelación a la fecha en que pretende se haga efectiva su
                voluntad. De Igual plazo al mencionado dispondrá EL EMPLEADOR
                cuando la iniciativa de terminar la relación laboral sea suya.
                <br />
                12.3 El abandono por EL TRABAJADOR de sus labores, sin cumplir
                el término de aviso previo, se considerará ausencia
                injustificada y consecuentemente una indisciplina laboral.
                <br />
                12.4 El término de aviso señalado anteriormente comienza a
                contarse a partir del día hábil siguiente a aquel en que LA
                PARTE interesada comunique a la OTRA PARTE su intención. EL
                EMPLEADOR puede acceder a la solicitud comunicada, antes del
                vencimiento del término señalado.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                DÉCIMOTERCERA: LEGISLACIÓN APLICABLE
              </h2>
              <p className="mt-2">
                13.1 El presente contrato se regirá por lo establecido en la Ley
                No. 116 “Código de Trabajo” de fecha 20 de diciembre del año
                2013; el Decreto No.326 “Reglamento del Código del trabajo,
                Resolución No.71/21 del MTSS “Reglamento sobre el trabajo a
                distancia y el teletrabajo” y cualquier otra norma
                complementaria de la legislación laboral común que en el futuro
                le resulte de aplicación, incluido los Estatutos sociales de EL
                EMPLEADOR, los acuerdos de sus órganos sociales, las normas
                relacionadas con la actividad que constituye el objeto social
                aprobado y cualquier otra que resulte aplicable a la relación
                laboral que por el presente se formaliza entre AMBAS PARTES,
                siempre y cuando no sean estas contrarias a derecho.
              </p>
            </section>

            <section>
              <p className="mt-2">
                Y para que así conste, se suscribe este Contrato, en dos (2)
                ejemplares, ambos considerados originales y con idénticos
                efectos legales, dado en La Habana, a los{" "}
                {renderField("firmaDia", "Día")} días del mes de{" "}
                {renderField("firmaMes", "Mes")} del año{" "}
                {renderField("firmaAnio", "Año")}.
              </p>
              <div className="flex justify-between mt-6">
                <div>
                  ___________________
                  <br />
                  EL EMPLEADOR
                </div>
                <div>
                  ___________________
                  <br />
                  EL TRABAJADOR
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContratoTrabajo;
