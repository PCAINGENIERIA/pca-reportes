import React, { useState } from 'react';

export default function App() {
  const [cliente, setCliente] = useState('');
  const [equipo, setEquipo] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [correos, setCorreos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [reporteListo, setReporteListo] = useState(false);

  const generarPDFyGuardar = (e) => {
    e.preventDefault();

    // Crear una ventana temporal formateada para imprimir/guardar PDF
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Reporte Técnico - ${cliente}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 8px; }
            .campo { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .valor { margin-top: 4px; padding: 8px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; }
            footer { margin-top: 40px; font-size: 12px; color: #777; text-align: center; }
          </style>
        </head>
        <body>
          <h1>PCA INGENIERÍA Y SERVICIOS</h1>
          <h3>Reporte Técnico de Servicio</h3>
          
          <div class="campo">
            <div class="label">Cliente / Sitio:</div>
            <div class="valor">${cliente}</div>
          </div>
          
          <div class="campo">
            <div class="label">Equipo Atendido:</div>
            <div class="valor">${equipo}</div>
          </div>

          <div class="campo">
            <div class="label">Observaciones y Mantenimiento Realizado:</div>
            <div class="valor">${observaciones.replace(/\n/g, '<br/>')}</div>
          </div>

          <footer>
            Generado desde PCA Reportes Técnicos - ${new Date().toLocaleDateString('es-MX')}
          </footer>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    ventanaImpresion.document.close();

    setReporteListo(true);
  };

  const enviarWhatsApp = () => {
    const texto = `*REPORTE TÉCNICO DE SERVICIO - PCA INGENIERÍA*%0A%0A` +
      `*Cliente:* ${cliente}%0A` +
      `*Equipo:* ${equipo}%0A` +
      `*Observaciones:* ${observaciones}%0A%0A` +
      `_Te adjunto el documento PDF descargado._`;
    
    const numLimpio = telefono.replace(/\D/g, '');
    const url = numLimpio 
      ? `https://api.whatsapp.com/send?phone=${numLimpio}&text=${texto}`
      : `https://api.whatsapp.com/send?text=${texto}`;

    window.open(url, '_blank');
  };

  const enviarCorreo = () => {
    const asunto = encodeURIComponent(`Reporte de Servicio Técnico - ${cliente}`);
    const cuerpo = encodeURIComponent(
      `Estimado cliente,\n\nSe adjunta el reporte técnico de servicio correspondiente a PCA Ingeniería y Servicios.\n\n` +
      `Cliente: ${cliente}\n` +
      `Equipo: ${equipo}\n` +
      `Observaciones: ${observaciones}\n\n` +
      `PCA Ingeniería y Servicios`
    );
    
    window.location.href = `mailto:${correos}?subject=${asunto}&body=${cuerpo}`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#0056b3' }}>PCA - Reporte de Servicio Técnico</h2>
      
      <form onSubmit={generarPDFyGuardar}>
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Cliente / Sitio:</strong></label><br/>
          <input 
            type="text" 
            required 
            value={cliente} 
            onChange={(e) => setCliente(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }} 
            placeholder="Ej. Hotel Barceló / Liverpool Cancún"
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label><strong>Equipo Atendido:</strong></label><br/>
          <input 
            type="text" 
            required 
            value={equipo} 
            onChange={(e) => setEquipo(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }} 
            placeholder="Ej. Chiller York / Bomba de Condensados"
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label><strong>Observaciones / Trabajos Realizados:</strong></label><br/>
          <textarea 
            rows="4" 
            value={observaciones} 
            onChange={(e) => setObservaciones(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }} 
            placeholder="Detalles del mantenimiento o revisión..."
          />
        </div>

        <hr style={{ margin: '20px 0' }} />
        <h3>Opciones de Envío</h3>

        <div style={{ marginBottom: '10px' }}>
          <label><strong>Correo(s) de Destino:</strong></label><br/>
          <input 
            type="text" 
            value={correos} 
            onChange={(e) => setCorreos(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }} 
            placeholder="correo1@ejemplo.com, correo2@ejemplo.com"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label><strong>Teléfono Celular (WhatsApp):</strong></label><br/>
          <input 
            type="tel" 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }} 
            placeholder="Ej. 9981234567"
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '12px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          📄 Guardar y Generar PDF
        </button>
      </form>

      {reporteListo && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>¡PDF Generado! Elige cómo enviarlo:</p>
          
          <button 
            onClick={enviarCorreo} 
            style={{ width: '100%', padding: '10px', marginBottom: '8px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ✉️ Enviar por Correo Electrónico
          </button>

          <button 
            onClick={enviarWhatsApp} 
            style={{ width: '100%', padding: '10px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            💬 Compartir por WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
