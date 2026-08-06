import React, { useState, useRef } from 'react';

export default function App() {
  // Carga de la imagen original en base64 para cero deformación
  // (Usa la URL o Base64 de la imagen 'Fondo blanco horizontal_3.png')
  const LOGO_OFFICIAL_URL = "./Fondo blanco horizontal_3.png"; 

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

  // Lógica Firma Cliente
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

  // Lógica Firma Técnico
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
            .header-container { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #8EC63F; padding-bottom: 12px; margin-bottom: 18px; }
            .logo-box { flex: 2; text-align: left; }
            .logo-img { width: 280px; height: auto; object-fit: contain; }
            .header-info { text-align: right; flex: 1; }
            .header-info h2 { margin: 0; color: #0B1B3D; font-size: 18px; font-weight: bold; }
            .header-info p { margin: 4px 0 0 0; font-weight: bold; color: #8EC63F; font-size: 13px; }
            .seccion { margin-bottom: 12px; }
            .titulo-seccion { background: #0B1B3D; color: white; padding: 5px 8px; font-weight: bold; font-size: 12px; margin-bottom: 6px; border-radius: 3px; border-left: 4px solid #8EC63F; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
            th, td { border: 1px solid #ccc; padding: 5px 7px; text-align: left; }
            th { background: #f2f2f2; width: 25%; font-weight: bold; color: #0B1B3D; }
            .firmas-grid { display: flex; justify-content: space-between; margin-top: 25px; gap: 20px; }
            .firma-box { width: 48%; text-align: center; }
            .firma-img { max-width: 180px; height: 50px; object-fit: contain; border-bottom: 1px solid #333; margin-bottom: 4px; }
            footer { text-align: center; font-size: 10px; color: #777; margin-top: 25px; border-top: 1px solid #ddd; padding-top: 6px; }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div class="logo-box">
              <img src="${LOGO_OFFICIAL_URL}" class="logo-img" alt="PCA Ingeniería &amp; Automatización" />
            </div>
            <div class="header-info">
              <h2>REPORTE TÉCNICO</h2>
              <p>Servicios &amp; Mantenimiento</p>
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
            PCA Ingeniería &amp; Automatización - Documento generado el ${new Date().toLocaleDateString('es-MX')}
          </footer>

          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    ventanaImpresion.document.close();
  };

  return (
    <div style={{ padding: '15px', maxWidth: '650px', margin: 'auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
      {/* ENCABEZADO CON EL LOGO EXACTO SIN DEFORMACIÓN */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '2px solid #8EC63F', paddingBottom: '10px' }}>
        <div style={{ flex: 2 }}>
          <img src={LOGO_OFFICIAL_URL} alt="PCA Ingeniería & Automatización" style={{ width: '250px', height: 'auto', display: 'block', objectFit: 'contain' }} />
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <h2 style={{ margin: 0, color: '#0B1B3D', fontSize: '18px' }}>REPORTE TÉCNICO</h2>
          <p style={{ margin: '2px 0 0 0', color: '#8EC63F', fontWeight: 'bold', fontSize: '13px' }}>Servicios &amp; Mantenimiento</p>
        </div>
      </div>

      <form onSubmit={generarPDF}>
        {/* CAMPOS DEL FORMULARIO */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', padding: '12px', background: '#fff' }}>
          <legend style={{ fontWeight: 'bold', color: '#0B1B3D' }}>Datos Generales</legend>
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
        </fieldset>

        {/* OTROS CAMPOS Y BOTONES */}
        <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#0B1B3D', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          📄 Generar Reporte PDF
        </button>
      </form>
    </div>
  );
}
