import React, { useState, useRef } from 'react';

export default function App() {
  // Datos Generales
  const [cliente, setCliente] = useState('');
  const [sitio, setSitio] = useState('');
  const [tecnico, setTecnico] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().substring(0, 10));
  const [tipoTrabajo, setTipoTrabajo] = useState('Preventivo');

  // Datos del Equipo y Lecturas
  const [equipo, setEquipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [serie, setSerie] = useState('');
  const [voltaje, setVoltaje] = useState('');
  const [amperaje, setAmperaje] = useState('');
  const [presionAlta, setPresionAlta] = useState('');
  const [presionBaja, setPresionBaja] = useState('');

  // Detalle de Servicio y Refacciones
  const [observaciones, setObservaciones] = useState('');
  const [refacciones, setRefacciones] = useState('');

  // Opciones de Envío
  const [correos, setCorreos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nombreFirmaCliente, setNombreFirmaCliente] = useState('');

  // Firma Digital del Cliente
  const canvasClienteRef = useRef(null);
  const [isDrawingCliente, setIsDrawingCliente] = useState(false);
  const [firmaClienteURL, setFirmaClienteURL] = useState('');

  // Firma Digital del Técnico
  const canvasTecnicoRef = useRef(null);
  const [isDrawingTecnico, setIsDrawingTecnico] = useState(false);
  const [firmaTecnicoURL, setFirmaTecnicoURL] = useState('');

  // Lógica de Firma Cliente
  const startDrawingCliente = (e) => {
    const canvas = canvasClienteRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawingCliente(true);
  };

  const drawCliente = (e) => {
    if (!isDrawingCliente) return;
    const canvas = canvasClienteRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawingCliente = () => {
    if (isDrawingCliente) {
      setIsDrawingCliente(false);
      if (canvasClienteRef.current) {
        setFirmaClienteURL(canvasClienteRef.current.toDataURL());
      }
    }
  };

  const limpiarFirmaCliente = () => {
    const canvas = canvasClienteRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setFirmaClienteURL('');
    }
  };

  // Lógica de Firma Técnico
  const startDrawingTecnico = (e) => {
    const canvas = canvasTecnicoRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawingTecnico(true);
  };

  const drawTecnico = (e) => {
    if (!isDrawingTecnico) return;
    const canvas = canvasTecnicoRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawingTecnico = () => {
    if (isDrawingTecnico) {
      setIsDrawingTecnico(false);
      if (canvasTecnicoRef.current) {
        setFirmaTecnicoURL(canvasTecnicoRef.current.toDataURL());
      }
    }
  };

  const limpiarFirmaTecnico = () => {
    const canvas = canvasTecnicoRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setFirmaTecnicoURL('');
    }
  };

  // Generación e Impresión en PDF
  const generarPDF = (e) => {
    e.preventDefault();
    const urlFirmaClienteFinal = firmaClienteURL || (canvasClienteRef.current ? canvasClienteRef.current.toDataURL() : '');
    const urlFirmaTecnicoFinal = firmaTecnicoURL || (canvasTecnicoRef.current ? canvasTecnicoRef.current.toDataURL() : '');

    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Reporte Técnico - ${cliente}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; font-size: 12px; }
            .header-container { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0056b3; padding-bottom: 10px; margin-bottom: 15px; }
            .logo-box { font-size: 24px; font-weight: bold; color: #0056b3; text-transform: uppercase; border: 2px solid #0056b3; padding: 5px 12px; border-radius: 4px; display: inline-block; }
            .header-info { text-align: right; }
            .header-info h2 { margin: 0; color: #0056b3; font-size: 16px; }
            .header-info p { margin: 2px 0 0 0; font-weight: bold; color: #555; font-size: 11px; }
            .seccion { margin-bottom: 12px; }
            .titulo-seccion { background: #0056b3; color: white; padding: 4px 8px; font-weight: bold; font-size: 13px; margin-bottom: 6px; border-radius: 3px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
            th, td { border: 1px solid #ccc; padding: 5px 7px; text-align: left; }
            th { background: #f2f2f2; width: 25%; font-weight: bold; }
            .firmas-grid { display: flex; justify-content: space-between; margin-top: 25px; gap: 20px; }
            .firma-box { width: 48%; text-align: center; }
            .firma-img { max-width: 180px; height: 50px; object-fit: contain; border-bottom: 1px solid #333; margin-bottom: 4px; }
            footer { text-align: center; font-size: 10px; color: #777; margin-top: 25px; border-top: 1px solid #ddd; padding-top: 6px; }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div class="logo-box">PCA</div>
            <div class="header-info">
              <h2>PCA INGENIERÍA Y SERVICIOS</h2>
              <p>REPORTE TÉCNICO DE SERVICIO Y MANTENIMIENTO</p>
            </div>
          </div>

          <div class="seccion">
            <div class="titulo-seccion">DATOS GENERALES</div>
            <table>
              <tr><th>Cliente / Razón Social:</th><td>${cliente}</td><th>Fecha:</th><td>${fecha}</td></tr>
              <tr><th>Sitio / Ubicación:</th><td>${sitio}</td><th>Tipo de Servicio:</th><td>${tipoTrabajo}</td></tr>
              <tr><th>Técnico Responsable:</th><td colspan="3">${tecnico}</td></tr>
            </table>
          </div>

          <div class="seccion">
            <div class="titulo-seccion">DATOS Y LECTURAS DEL EQUIPO</div>
            <table>
              <tr><th>Equipo Atendido:</th><td>${equipo}</td><th>Marca:</th><td>${marca}</td></tr>
              <tr><th>Modelo:</th><td>${modelo}</td><th>No. Serie:</th><td>${serie}</td></tr>
              <tr><th>Voltaje (V):</th><td>${voltaje}</td><th>Amperaje (A):</th><td>${amperaje}</td></tr>
              <tr><th>Presión Alta (PSI):</th><td>${presionAlta}</td><th>Presión Baja (PSI):</th><td>${presionBaja}</td></tr>
            </table>
          </div>

          <div class="seccion">
            <div class="titulo-seccion">TRABAJOS REALIZADOS Y OBSERVACIONES</div>
            <div style="border: 1px solid #ccc; padding: 8px; background: #fafafa; min-height: 50px;">
              ${observaciones.replace(/\n/g, '<br/>')}
            </div>
          </div>

          ${refacciones ? `
          <div class="seccion">
            <div class="titulo-seccion">REFACCIONES Y MATERIALES UTILIZADOS</div>
            <div style="border: 1px solid #ccc; padding: 8px; background: #fafafa;">
              ${refacciones.replace(/\n/g, '<br/>')}
            </div>
          </div>` : ''}

          <div class="firmas-grid">
            <div class="firma-box">
              <p style="margin: 0 0 5px 0;"><strong>FIRMA TÉCNICO RESPONSABLE</strong></p>
              ${urlFirmaTecnicoFinal ? `<img src="${urlFirmaTecnicoFinal}" class="firma-img" /><br/>` : '<div style="height:50px; border-bottom:1px solid #333;"></div>'}
              <span><strong>${tecnico || 'Técnico PCA'}</strong></span>
            </div>

            <div class="firma-box">
              <p style="margin: 0 0 5px 0;"><strong>FIRMA CONFORMIDAD CLIENTE</strong></p>
              ${urlFirmaClienteFinal ? `<img src="${urlFirmaClienteFinal}" class="firma-img" /><br/>` : '<div style="height:50px; border-bottom:1px solid #333;"></div>'}
              <span><strong>${nombreFirmaCliente || cliente}</strong></span>
            </div>
          </div>

          <footer>
            PCA Ingeniería y Servicios S.A. de C.V. - Documento generado el ${new Date().toLocaleDateString('es-MX')}
          </footer>

          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    ventanaImpresion.document.close();
  };

  const enviarWhatsApp = () => {
    const texto = `*REPORTE TÉCNICO DE SERVICIO - PCA INGENIERÍA*%0A%0A` +
      `*Cliente:* ${cliente}%0A` +
      `*Sitio:* ${sitio}%0A` +
      `*Equipo:* ${equipo} (${marca})%0A` +
      `*Técnico:* ${tecnico}%0A` +
      `*Tipo:* ${tipoTrabajo}%0A%0A` +
      `_Adjunto la ficha del servicio técnico realizado._`;
    
    const numLimpio = telefono.replace(/\D/g, '');
    const url = numLimpio 
      ? `https://api.whatsapp.com/send?phone=${numLimpio}&text=${texto}`
      : `https://api.whatsapp.com/send?text=${texto}`;

    window.open(url, '_blank');
  };

  const enviarCorreo = () => {
    const asunto = encodeURIComponent(`Reporte Técnico de Servicio - ${cliente} (${sitio})`);
    const cuerpo = encodeURIComponent(
      `Estimados,\n\nAdjunto el reporte técnico de servicio correspondiente a PCA Ingeniería y Servicios.\n\n` +
      `Cliente: ${cliente}\n` +
      `Sitio: ${sitio}\n` +
      `Equipo: ${equipo} - ${marca} (${modelo})\n` +
      `Técnico Responsable: ${tecnico}\n` +
      `Tipo de Trabajo: ${tipoTrabajo}\n\n` +
      `Observaciones:\n${observaciones}\n\n` +
      `PCA Ingeniería y Servicios S.A. de C.V.`
    );
    
    window.location.href = `mailto:${correos}?subject=${asunto}&body=${cuerpo}`;
  };

  return (
    <div style={{ padding: '15px', maxWidth: '650px', margin: 'auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
      {/* CABECERA CON LOGO PCA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '2px solid #0056b3', paddingBottom: '10px' }}>
        <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#0056b3', border: '2px solid #0056b3', padding: '4px 12px', borderRadius: '4px' }}>
          PCA
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, color: '#0056b3', fontSize: '18px' }}>PCA INGENIERÍA Y SERVICIOS</h2>
          <p style={{ margin: '2px 0 0 0', color: '#666', fontWeight: 'bold', fontSize: '12px' }}>Reporte Técnico de Campo</p>
        </div>
      </div>

      <form onSubmit={generarPDF}>
        {/* DATOS GENERALES */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', padding: '12px', background: '#fff' }}>
          <legend style={{ fontWeight: 'bold', color: '#0056b3' }}>Datos Generales</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label><strong>Cliente:</strong></label>
              <input type="text" required value={cliente} onChange={(e) => setCliente(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} placeholder="Nombre / Empresa" />
            </div>
            <div>
              <label><strong>Sitio / Ubicación:</strong></label>
              <input type="text" required value={sitio} onChange={(e) => setSitio(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} placeholder="Cancún, Playa, etc." />
            </div>
            <div>
              <label><strong>Técnico Responsable:</strong></label>
              <input type="text" required value={tecnico} onChange={(e) => setTecnico(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} placeholder="Nombre del técnico" />
            </div>
            <div>
              <label><strong>Fecha:</strong></label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <label><strong>Tipo de Servicio:</strong></label>
            <select value={tipoTrabajo} onChange={(e) => setTipoTrabajo(e.target.value)} style={{ width: '100%', padding: '6px', marginTop: '4px' }}>
              <option value="Preventivo">Mantenimiento Preventivo</option>
              <option value="Correctivo">Mantenimiento Correctivo</option>
              <option value="Diagnostico">Diagnóstico / Revisión</option>
              <option value="Instalacion">Instalación / Arranque</option>
            </select>
          </div>
        </fieldset>

        {/* DATOS Y LECTURAS DEL EQUIPO */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', padding: '12px', background: '#fff' }}>
          <legend style={{ fontWeight: 'bold', color: '#0056b3' }}>Datos y Lecturas del Equipo</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label><strong>Equipo:</strong></label>
              <input type="text" required value={equipo} onChange={(e) => setEquipo(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} placeholder="Chiller, Bomba, UMA..." />
            </div>
            <div>
              <label><strong>Marca:</strong></label>
              <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} placeholder="York, Trane, Carrier..." />
            </div>
            <div>
              <label><strong>Modelo:</strong></label>
              <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label><strong>No. Serie:</strong></label>
              <input type="text" value={serie} onChange={(e) => setSerie(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label><strong>Voltaje (V):</strong></label>
              <input type="text" value={voltaje} onChange={(e) => setVoltaje(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} placeholder="220V / 440V" />
            </div>
            <div>
              <label><strong>Amperaje (A):</strong></label>
              <input type="text" value={amperaje} onChange={(e) => setAmperaje(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label><strong>Presión Alta (PSI):</strong></label>
              <input type="text" value={presionAlta} onChange={(e) => setPresionAlta(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label><strong>Presión Baja (PSI):</strong></label>
              <input type="text" value={presionBaja} onChange={(e) => setPresionBaja(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} />
            </div>
          </div>
        </fieldset>

        {/* DETALLE Y REFACCIONES */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', padding: '12px', background: '#fff' }}>
          <legend style={{ fontWeight: 'bold', color: '#0056b3' }}>Detalles del Servicio</legend>
          <div style={{ marginBottom: '10px' }}>
            <label><strong>Trabajos Realizados y Observaciones:</strong></label>
            <textarea rows="4" required value={observaciones} onChange={(e) => setObservaciones(e.target.value)} style={{ width: '100%', padding: '6px', marginTop: '4px', boxSizing: 'border-box' }} placeholder="Describe las actividades ejecutadas..." />
          </div>
          <div>
            <label><strong>Refacciones / Materiales Utilizados:</strong></label>
            <textarea rows="2" value={refacciones} onChange={(e) => setRefacciones(e.target.value)} style={{ width: '100%', padding: '6px', marginTop: '4px', boxSizing: 'border-box' }} placeholder="Lista de insumos, filtros, aceite, refacciones..." />
          </div>
        </fieldset>

        {/* FIRMA TÉCNICO DE SERVICIO */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', padding: '12px', background: '#fff' }}>
          <legend style={{ fontWeight: 'bold', color: '#0056b3' }}>Firma del Técnico de Servicio</legend>
          <div style={{ border: '1px dashed #999', borderRadius: '4px', background: '#fff', textAlign: 'center' }}>
            <canvas
              ref={canvasTecnicoRef}
              width={320}
              height={100}
              style={{ touchAction: 'none', cursor: 'crosshair', display: 'block', margin: 'auto' }}
              onMouseDown={startDrawingTecnico}
              onMouseMove={drawTecnico}
              onMouseUp={stopDrawingTecnico}
              onTouchStart={startDrawingTecnico}
              onTouchMove={drawTecnico}
              onTouchEnd={stopDrawingTecnico}
            />
          </div>
          <button type="button" onClick={limpiarFirmaTecnico} style={{ marginTop: '5px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}>
            Borrar / Limpiar Firma Técnico
          </button>
        </fieldset>

        {/* FIRMA DEL CLIENTE */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', padding: '12px', background: '#fff' }}>
          <legend style={{ fontWeight: 'bold', color: '#0056b3' }}>Firma de Conformidad del Cliente</legend>
          <div style={{ marginBottom: '8px' }}>
            <label><strong>Nombre de quien recibe/firma:</strong></label>
            <input type="text" value={nombreFirmaCliente} onChange={(e) => setNombreFirmaCliente(e.target.value)} style={{ width: '100%', padding: '6px', marginTop: '4px', boxSizing: 'border-box' }} placeholder="Nombre y cargo" />
          </div>
          <div style={{ border: '1px dashed #999', borderRadius: '4px', background: '#fff', textAlign: 'center' }}>
            <canvas
              ref={canvasClienteRef}
              width={320}
              height={100}
              style={{ touchAction: 'none', cursor: 'crosshair', display: 'block', margin: 'auto' }}
              onMouseDown={startDrawingCliente}
              onMouseMove={drawCliente}
              onMouseUp={stopDrawingCliente}
              onTouchStart={startDrawingCliente}
              onTouchMove={drawCliente}
              onTouchEnd={stopDrawingCliente}
            />
          </div>
          <button type="button" onClick={limpiarFirmaCliente} style={{ marginTop: '5px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}>
            Borrar / Limpiar Firma Cliente
          </button>
        </fieldset>

        {/* OPCIONES DE ENVÍO Y GENERACIÓN */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px', padding: '12px', background: '#eef5fc' }}>
          <legend style={{ fontWeight: 'bold', color: '#0056b3' }}>Opciones de Envío</legend>
          <div style={{ marginBottom: '10px' }}>
            <label><strong>Correo(s) de Destino:</strong></label>
            <input type="text" value={correos} onChange={(e) => setCorreos(e.target.value)} style={{ width: '100%', padding: '6px', marginTop: '4px', boxSizing: 'border-box' }} placeholder="correo1@ejemplo.com, correo2@ejemplo.com" />
          </div>
          <div>
            <label><strong>Teléfono Celular (WhatsApp):</strong></label>
            <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={{ width: '100%', padding: '6px', marginTop: '4px', boxSizing: 'border-box' }} placeholder="Ej. 9981234567" />
          </div>
        </fieldset>

        <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginBottom: '10px' }}>
          📄 Generar y Guardar Reporte PDF
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
        <button onClick={enviarCorreo} style={{ padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          ✉️ Enviar por Correo
        </button>
        <button onClick={enviarWhatsApp} style={{ padding: '12px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          💬 Compartir por WhatsApp
        </button>
      </div>
    </div>
  );
}
