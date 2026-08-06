import React, { useState, useRef, useEffect } from 'react';
import logoPCA from './Fondo blanco horizontal.png';

const LOGO_OFFICIAL_URL = logoPCA;

const TECNICOS_PCA = [
  { nombre: 'Sebastián Zumárraga', codigo: 'SZ' },
  { nombre: 'Alfredo Zumárraga', codigo: 'ALZ' },
  { nombre: 'Alberto Zumárraga', codigo: 'ABZ' },
  { nombre: 'Arturo Aviléz', codigo: 'AA' },
  { nombre: 'Óscar Flores', codigo: 'OF' },
  { nombre: 'Nicolás Martínez', codigo: 'NM' },
  { nombre: 'Román Palma', codigo: 'RP' },
  { nombre: 'César Centeno', codigo: 'CC' },
  { nombre: 'Alejandro Zumárraga', codigo: 'AZ' }
];

export default function App() {
  // Datos Generales
  const [cliente, setCliente] = useState('');
  const [sitio, setSitio] = useState('');
  const [tecnico, setTecnico] = useState(TECNICOS_PCA[0].nombre);
  const [fecha, setFecha] = useState(new Date().toISOString().substring(0, 10));
  const [tipoTrabajo, setTipoTrabajo] = useState('Preventivo');
  
  // Consecutivo por Técnico (Persistente)
  const [numeroCorrelativo, setNumeroCorrelativo] = useState(1);
  const [folioCalculado, setFolioCalculado] = useState('');

  // Cargar consecutivo del localStorage según el técnico seleccionado
  useEffect(() => {
    const tecObj = TECNICOS_PCA.find(t => t.nombre === tecnico) || { codigo: 'TEC' };
    const keyStorage = `consecutivo_pca_${tecObj.codigo}`;
    const guardado = localStorage.getItem(keyStorage);
    
    const consecutivoActual = guardado ? parseInt(guardado, 10) : 1;
    setNumeroCorrelativo(consecutivoActual);

    const anio = new Date(fecha || Date.now()).getFullYear();
    const numFormateado = String(consecutivoActual).padStart(3, '0');
    setFolioCalculado(`${tecObj.codigo}-${anio}-${numFormateado}`);
  }, [tecnico, fecha]);

  // Actualizar el folio calculado cuando se modifica manualmente el correlativo
  const handleCorrelativoChange = (val) => {
    const valNum = parseInt(val, 10) || 1;
    setNumeroCorrelativo(valNum);
    const tecObj = TECNICOS_PCA.find(t => t.nombre === tecnico) || { codigo: 'TEC' };
    const anio = new Date(fecha || Date.now()).getFullYear();
    const numFormateado = String(valNum).padStart(3, '0');
    setFolioCalculado(`${tecObj.codigo}-${anio}-${numFormateado}`);
  };

  // Evidencia Fotográfica
  const [fotos, setFotos] = useState([]);

  const handleFotosChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotos(prevFotos => [...prevFotos, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const eliminarFoto = (index) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  // Lecturas de Equipo
  const [equipo, setEquipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [serie, setSerie] = useState('');
  const [voltaje, setVoltaje] = useState('');
  const [amperaje, setAmperaje] = useState('');
  const [presionAlta, setPresionAlta] = useState('');
  const [presionBaja, setPresionBaja] = useState('');
  const [tempEntrada, setTempEntrada] = useState('');
  const [tempSalida, setTempSalida] = useState('');

  // Detalles
  const [observaciones, setObservaciones] = useState('');
  const [refacciones, setRefacciones] = useState('');
  const [nombreFirmaCliente, setNombreFirmaCliente] = useState('');

  // Canvas Firmas
  const canvasClienteRef = useRef(null);
  const [isDrawingCliente, setIsDrawingCliente] = useState(false);
  const [firmaClienteURL, setFirmaClienteURL] = useState('');

  const canvasTecnicoRef = useRef(null);
  const [isDrawingTecnico, setIsDrawingTecnico] = useState(false);
  const [firmaTecnicoURL, setFirmaTecnicoURL] = useState('');

  // Handlers Firma Cliente
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

  // Handlers Firma Técnico
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

  // Función para reiniciar el formulario y avanzar el folio
  const nuevoReporte = () => {
    if (window.confirm('¿Deseas iniciar un nuevo reporte? Se limpiarán los datos del formulario actual.')) {
      setCliente('');
      setSitio('');
      setEquipo('');
      setMarca('');
      setModelo('');
      setSerie('');
      setVoltaje('');
      setAmperaje('');
      setPresionAlta('');
      setPresionBaja('');
      setTempEntrada('');
      setTempSalida('');
      setObservaciones('');
      setRefacciones('');
      setNombreFirmaCliente('');
      setFotos([]);
      limpiarFirmaCliente();
      limpiarFirmaTecnico();

      // Incrementar el consecutivo del técnico en localStorage
      const tecObj = TECNICOS_PCA.find(t => t.nombre === tecnico) || { codigo: 'TEC' };
      const keyStorage = `consecutivo_pca_${tecObj.codigo}`;
      const siguienteNum = numeroCorrelativo + 1;
      localStorage.setItem(keyStorage, siguienteNum.toString());
      setNumeroCorrelativo(siguienteNum);
      
      const anio = new Date(fecha || Date.now()).getFullYear();
      const numFormateado = String(siguienteNum).padStart(3, '0');
      setFolioCalculado(`${tecObj.codigo}-${anio}-${numFormateado}`);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generar e Imprimir PDF
  const generarPDF = (e) => {
    e.preventDefault();

    // Guardar el consecutivo actual en localStorage
    const tecObj = TECNICOS_PCA.find(t => t.nombre === tecnico) || { codigo: 'TEC' };
    const keyStorage = `consecutivo_pca_${tecObj.codigo}`;
    localStorage.setItem(keyStorage, numeroCorrelativo.toString());

    const urlFirmaClienteFinal = firmaClienteURL || (canvasClienteRef.current ? canvasClienteRef.current.toDataURL() : '');
    const urlFirmaTecnicoFinal = firmaTecnicoURL || (canvasTecnicoRef.current ? canvasTecnicoRef.current.toDataURL() : '');

    const fotosHTML = fotos.map(foto => `
      <div style="width: 48%; margin-bottom: 10px; border: 1px solid #ddd; padding: 4px; border-radius: 4px; box-sizing: border-box; text-align: center;">
        <img src="${foto}" style="max-width: 100%; max-height: 180px; object-fit: contain; border-radius: 2px;" />
      </div>
    `).join('');

    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Reporte Técnico ${folioCalculado} - ${cliente}</title>
          <style>
            @page {
              size: A4;
              margin: 15mm 10mm 15mm 10mm;
            }
            body { 
              font-family: Arial, sans-serif; 
              padding: 0; 
              margin: 0;
              color: #333; 
              font-size: 12px; 
            }
            table.print-container { width: 100%; border-collapse: collapse; border: none; }
            thead.print-header { display: table-header-group; }
            tbody.print-body { display: table-row-group; }
            .header-container { 
              display: flex; 
              align-items: center; 
              justify-content: space-between; 
              border-bottom: 2px solid #8EC63F; 
              padding-bottom: 10px; 
              margin-bottom: 15px; 
              background: #fff;
            }
            .logo-box { flex: 2; }
            .header-info { text-align: right; flex: 1.5; }
            .header-info h2 { margin: 0; color: #0B1B3D; font-size: 18px; font-weight: bold; }
            .header-info p { margin: 4px 0 0 0; font-weight: bold; color: #8EC63F; font-size: 13px; }
            .folio-badge { background: #0B1B3D; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; margin-top: 6px; }
            
            .seccion { margin-bottom: 12px; page-break-inside: avoid; }
            .titulo-seccion { background: #0B1B3D; color: white; padding: 5px 8px; font-weight: bold; font-size: 12px; margin-bottom: 6px; border-radius: 3px; border-left: 4px solid #8EC63F; }
            table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
            table.data-table th, table.data-table td { border: 1px solid #ccc; padding: 5px 7px; text-align: left; }
            table.data-table th { background: #f2f2f2; width: 25%; font-weight: bold; color: #0B1B3D; }
            .fotos-grid { display: flex; flex-wrap: wrap; gap: 4%; justify-content: flex-start; }
            .firmas-grid { display: flex; justify-content: space-between; margin-top: 25px; gap: 20px; page-break-inside: avoid; }
            .firma-box { width: 48%; text-align: center; }
            .firma-img { max-width: 180px; height: 50px; object-fit: contain; border-bottom: 1px solid #333; margin-bottom: 4px; }
            footer { text-align: center; font-size: 10px; color: #777; margin-top: 25px; border-top: 1px solid #ddd; padding-top: 6px; page-break-inside: avoid; }
          </style>
        </head>
        <body>
          <table class="print-container">
            <!-- ENCABEZADO REPETIBLE EN CADA PÁGINA IMPRESA -->
            <thead class="print-header">
              <tr>
                <td>
                  <div class="header-container">
                    <div class="logo-box">
                      <img src="${LOGO_OFFICIAL_URL}" style="width: 270px; height: auto; display: block;" alt="PCA Ingeniería &amp; Servicios" />
                    </div>
                    <div class="header-info">
                      <h2>REPORTE TÉCNICO</h2>
                      <p>Servicios &amp; Mantenimiento</p>
                      <div class="folio-badge">FOLIO: ${folioCalculado}</div>
                    </div>
                  </div>
                </td>
              </tr>
            </thead>

            <!-- CONTENIDO DEL REPORTE -->
            <tbody class="print-body">
              <tr>
                <td>
                  <div class="seccion">
                    <div class="titulo-seccion">DATOS GENERALES</div>
                    <table class="data-table">
                      <tr><th>FOLIO DE SERVICIO:</th><td style="font-weight:bold; color:#0B1B3D;">${folioCalculado}</td><th>Fecha:</th><td>${fecha}</td></tr>
                      <tr><th>Cliente / Razón Social:</th><td>${cliente}</td><th>Tipo de Servicio:</th><td>${tipoTrabajo}</td></tr>
                      <tr><th>Sitio / Ubicación:</th><td>${sitio}</td><th>Técnico Responsable:</th><td>${tecnico}</td></tr>
                    </table>
                  </div>

                  <div class="seccion">
                    <div class="titulo-seccion">DATOS Y LECTURAS DEL EQUIPO</div>
                    <table class="data-table">
                      <tr><th>Equipo Atendido:</th><td>${equipo}</td><th>Marca:</th><td>${marca}</td></tr>
                      <tr><th>Modelo:</th><td>${modelo}</td><th>No. Serie:</th><td>${serie}</td></tr>
                      <tr><th>Voltaje (V):</th><td>${voltaje}</td><th>Amperaje (A):</th><td>${amperaje}</td></tr>
                      <tr><th>Presión Alta (PSI):</th><td>${presionAlta}</td><th>Presión Baja (PSI):</th><td>${presionBaja}</td></tr>
                      <tr><th>Temp. Entrada (°C/°F):</th><td>${tempEntrada}</td><th>Temp. Salida (°C/°F):</th><td>${tempSalida}</td></tr>
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

                  ${fotos.length > 0 ? `
                  <div class="seccion">
                    <div class="titulo-seccion">EVIDENCIA FOTOGRÁFICA</div>
                    <div class="fotos-grid">
                      ${fotosHTML}
                    </div>
                  </div>` : ''}

                  <div class="firmas-grid">
                    <div class="firma-box">
                      <p style="margin: 0 0 5px 0;"><strong>FIRMA TÉCNICO RESPONSABLE</strong></p>
                      ${urlFirmaTecnicoFinal ? `<img src="${urlFirmaTecnicoFinal}" class="firma-img" /><br/>` : '<div style="height:50px; border-bottom:1px solid #333;"></div>'}
                      <span><strong>${tecnico}</strong></span>
                    </div>

                    <div class="firma-box">
                      <p style="margin: 0 0 5px 0;"><strong>FIRMA CONFORMIDAD CLIENTE</strong></p>
                      ${urlFirmaClienteFinal ? `<img src="${urlFirmaClienteFinal}" class="firma-img" /><br/>` : '<div style="height:50px; border-bottom:1px solid #333;"></div>'}
                      <span><strong>${nombreFirmaCliente || cliente}</strong></span>
                    </div>
                  </div>

                  <footer>
                    PCA Ingeniería &amp; Servicios - Reporte ${folioCalculado} generado el ${new Date().toLocaleDateString('es-MX')}
                  </footer>
                </td>
              </tr>
            </tbody>
          </table>

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
      
      {/* BARRA SUPERIOR CON BOTÓN DE NUEVO REPORTE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <button 
          type="button" 
          onClick={nuevoReporte} 
          style={{ backgroundColor: '#8EC63F', color: '#0B1B3D', border: 'none', padding: '8px 14px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
        >
          ➕ Iniciar Nuevo Reporte
        </button>
      </div>

      {/* ENCABEZADO DE EN PANTALLA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '2px solid #8EC63F', paddingBottom: '10px' }}>
        <div style={{ flex: 2 }}>
          <img 
            src={LOGO_OFFICIAL_URL} 
            alt="PCA Ingeniería &amp; Servicios" 
            style={{ width: '270px', height: 'auto', display: 'block', objectFit: 'contain' }} 
          />
        </div>
        <div style={{ flex: 1.5, textAlign: 'right' }}>
          <h2 style={{ margin: 0, color: '#0B1B3D', fontSize: '18px' }}>REPORTE TÉCNICO</h2>
          <p style={{ margin: '2px 0 0 0', color: '#8EC63F', fontWeight: 'bold', fontSize: '13px' }}>Servicios &amp; Mantenimiento</p>
          <div style={{ background: '#0B1B3D', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginTop: '6px', display: 'inline-block' }}>
            FOLIO: {folioCalculado}
          </div>
        </div>
      </div>

      <form onSubmit={generarPDF}>
        {/* DATOS GENERALES Y SELECCIÓN DE TÉCNICO */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', padding: '12px', background: '#fff' }}>
          <legend style={{ fontWeight: 'bold', color: '#0B1B3D' }}>Datos Generales y Folio</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label><strong>Técnico Responsable:</strong></label>
              <select 
                value={tecnico} 
                onChange={(e) => setTecnico(e.target.value)} 
                style={{ width: '100%', padding: '6px', marginTop: '4px', boxSizing: 'border-box' }}
              >
                {TECNICOS_PCA.map((t) => (
                  <option key={t.nombre} value={t.nombre}>
                    {t.nombre} ({t.codigo})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label><strong>No. Correlativo:</strong></label>
              <input 
                type="number" 
                required 
                value={numeroCorrelativo} 
                onChange={(e) => handleCorrelativoChange(e.target.value)} 
                style={{ width: '100%', padding: '6px', marginTop: '4px', boxSizing: 'border-box' }} 
                min="1" 
              />
            </div>
            <div>
              <label><strong>Cliente:</strong></label>
              <input type="text" required value={cliente} onChange={(e) => setCliente(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} placeholder="Nombre / Empresa" />
            </div>
            <div>
              <label><strong>Sitio / Ubicación:</strong></label>
              <input type="text" required value={sitio} onChange={(e) => setSitio(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} placeholder="Ubicación / Proyecto" />
            </div>
            <div>
              <label><strong>Fecha:</strong></label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label><strong>Tipo de Servicio:</strong></label>
              <select value={tipoTrabajo} onChange={(e) => setTipoTrabajo(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}>
                <option value="Preventivo">Mantenimiento Preventivo</option>
                <option value="Correctivo">Mantenimiento Correctivo</option>
                <option value="Diagnostico">Diagnóstico / Revisión</option>
                <option value="Instalacion">Instalación / Arranque</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* DATOS Y LECTURAS DEL EQUIPO */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', padding: '12px', background: '#fff' }}>
          <legend style={{ fontWeight: 'bold', color: '#0B1B3D' }}>Datos y Lecturas del Equipo</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label><strong>Equipo:</strong></label>
              <input type="text" required value={equipo} onChange={(e) => setEquipo(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} placeholder="Chiller, Bomba, UMA..." />
            </div>
            <div>
              <label><strong>Marca:</strong></label>
              <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} placeholder="Marca del equipo" />
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
            <div>
              <label><strong>Temp. Entrada (°C / °F):</strong></label>
              <input type="text" value={tempEntrada} onChange={(e) => setTempEntrada(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} placeholder="Ej. 12 °C" />
            </div>
            <div>
              <label><strong>Temp. Salida (°C / °F):</strong></label>
              <input type="text" value={tempSalida} onChange={(e) => setTempSalida(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} placeholder="Ej. 7 °C" />
            </div>
          </div>
        </fieldset>

        {/* DETALLE Y REFACCIONES */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', padding: '12px', background: '#fff' }}>
          <legend style={{ fontWeight: 'bold', color: '#0B1B3D' }}>Detalles del Servicio</legend>
          <div style={{ marginBottom: '10px' }}>
            <label><strong>Trabajos Realizados y Observaciones:</strong></label>
            <textarea rows="4" required value={observaciones} onChange={(e) => setObservaciones(e.target.value)} style={{ width: '100%', padding: '6px', marginTop: '4px', boxSizing: 'border-box' }} placeholder="Describe las actividades ejecutadas..." />
          </div>
          <div>
            <label><strong>Refacciones / Materiales Utilizados:</strong></label>
            <textarea rows="2" value={refacciones} onChange={(e) => setRefacciones(e.target.value)} style={{ width: '100%', padding: '6px', marginTop: '4px', boxSizing: 'border-box' }} placeholder="Lista de insumos, filtros, aceite, refacciones..." />
          </div>
        </fieldset>

        {/* EVIDENCIA FOTOGRÁFICA DESDE EL CELULAR */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', padding: '12px', background: '#fff' }}>
          <legend style={{ fontWeight: 'bold', color: '#0B1B3D' }}>Evidencia Fotográfica</legend>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            <strong>Tomar o adjuntar fotos desde el celular:</strong>
          </label>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleFotosChange} 
            style={{ marginBottom: '10px' }} 
          />
          {fotos.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', marginTop: '10px' }}>
              {fotos.map((foto, index) => (
                <div key={index} style={{ position: 'relative', border: '1px solid #ddd', borderRadius: '4px', padding: '2px' }}>
                  <img src={foto} alt={`Evidencia ${index + 1}`} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '2px' }} />
                  <button 
                    type="button" 
                    onClick={() => eliminarFoto(index)} 
                    style={{ position: 'absolute', top: '2px', right: '2px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </fieldset>

        {/* FIRMA TÉCNICO DE SERVICIO */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px', padding: '12px', background: '#fff' }}>
          <legend style={{ fontWeight: 'bold', color: '#0B1B3D' }}>Firma del Técnico de Servicio</legend>
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
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px', padding: '12px', background: '#fff' }}>
          <legend style={{ fontWeight: 'bold', color: '#0B1B3D' }}>Firma de Conformidad del Cliente</legend>
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

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 2, padding: '14px', backgroundColor: '#0B1B3D', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            📄 Generar y Guardar Reporte PDF
          </button>
          <button type="button" onClick={nuevoReporte} style={{ flex: 1, padding: '14px', backgroundColor: '#8EC63F', color: '#0B1B3D', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
            ➕ Nuevo Reporte
          </button>
        </div>
      </form>
    </div>
  );
}
