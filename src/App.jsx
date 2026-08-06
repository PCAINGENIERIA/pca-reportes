import React, { useState } from 'react';

export default function App() {
  const [cliente, setCliente] = useState('');
  const [equipo, setEquipo] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [correos, setCorreos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [reporteListo, setReporteListo] = useState(false);

  const handleFinalizar = (e) => {
    e.preventDefault();
    
    // 1. Simulación/Generación local del reporte
    alert('Reporte generado y guardado exitosamente.');
    setReporteListo(true);
  };

  const enviarWhatsApp = () => {
    const texto = `*REPORTE TÉCNICO DE SERVICIO - PCA INGENIERÍA*%0A%0A` +
      `*Cliente:* ${cliente}%0A` +
      `*Equipo:* ${equipo}%0A` +
      `*Observaciones:* ${observaciones}%0A%0A` +
      `_Adjunto el reporte en PDF desde mis archivos._`;
    
    const numLimpio = telefono.replace(/\D/g, '');
    const url = numLimpio 
      ? `https://api.whatsapp.com/send?phone=${numLimpio}&text=${texto}`
      : `https://api.whatsapp.com/send?text=${texto}`;

    window.open(url, '_blank');
  };

  const enviarCorreo = () => {
    const asunto = encodeURIComponent(`Reporte de Servicio Técnico - ${cliente}`);
    const cuerpo = encodeURIComponent(
      `Estimado cliente,\n\nSe adjunta el reporte técnico de servicio.\n\n` +
      `Cliente: ${cliente}\n` +
      `Equipo: ${equipo}\n` +
      `Observaciones: ${observaciones}\n\n` +
      `PCA Ingeniería y Servicios`
    );
    
    window.location.href = `mailto:${correos}?subject=${asunto}&body=${cuerpo}`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>PCA - Reporte de Servicio Técnico</h2>
      
      <form onSubmit={handleFinalizar}>
        <div style={{ marginBottom: '10px' }}>
          <label><strong>Cliente / Sitio:</strong></label><br/>
          <input 
            type="text" 
            required 
            value={cliente} 
            onChange={(e) => setCliente(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '4px' }} 
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
            style={{ width: '100%', padding: '8px', marginTop: '4px' }} 
            placeholder="Ej. Chiller York / Bomba de Condensados"
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label><strong>Observaciones / Trabajos Realizados:</strong></label><br/>
          <textarea 
            rows="4" 
            value={observaciones} 
            onChange={(e) => setObservaciones(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '4px' }} 
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
            style={{ width: '100%', padding: '8px', marginTop: '4px' }} 
            placeholder="correo1@ejemplo.com, correo2@ejemplo.com"
          />
          <small>Puedes colocar varias direcciones separadas por coma.</small>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label><strong>Teléfono Celular (WhatsApp):</strong></label><br/>
          <input 
            type="tel" 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '4px' }} 
            placeholder="Ej. 9981234567 (Opcional)"
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '12px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Guardar y Finalizar
        </button>
      </form>

      {reporteListo && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>¡Reporte Finalizado! Elige cómo deseas compartirlo:</p>
          
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
