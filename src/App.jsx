import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function App() {
  // Lista de reportes guardados
  const [reportesGuardados, setReportesGuardados] = useState([]);
  
  // Estado del formulario actual
  const [formData, setFormData] = useState({
    folio: '',
    cliente: '',
    tecnico: '',
    diagnostico: '',
    observaciones: ''
  });

  // Indica si la vista actual es de consulta (no editable)
  const [esSoloLectura, setEsSoloLectura] = useState(false);

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    if (esSoloLectura) return; // Protege contra edición si está en modo solo lectura
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
// 1. GENERAR Y DESCARGAR PDF SIN IMPRESIÓN
const generarPDF = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const elemento = document.getElementById('reporte-contenido');
    if (!elemento) return;

    const opciones = {
      margin:       10,
      filename:     `Reporte_PCA_${formData.folio || 'servicio'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, allowTaint: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().from(elemento).set(opciones).save();
    } catch (err) {
      console.error("Error al exportar PDF:", err);
    }
  };
// 2. GUARDAR Y FINALIZAR REPORTE
const guardarYFinalizar = async (e) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (!formData.folio || !formData.cliente) {
    alert("Por favor completa los datos mínimos del reporte.");
    return;
  }

  const nuevoReporte = {
    ...formData,
    id: Date.now(),
    fecha: new Date().toLocaleDateString(),
    bloqueado: true
  };

  setReportesGuardados((prev) => [...prev, nuevoReporte]);
  setEsSoloLectura(true);

  setTimeout(() => {
    generarPDF();
  }, 150);
};
  // Cargar un reporte del historial para revisar
  const verReporteGuardado = (reporte) => {
    setFormData(reporte);
    setEsSoloLectura(true); // Se abre en modo solo lectura
  };

  // Crear un nuevo reporte desde cero
  const nuevoReporte = () => {
    setFormData({ folio: '', cliente: '', tecnico: '', diagnostico: '', observaciones: '' });
    setEsSoloLectura(false);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Barra de estado y acciones */}
      <div className="mb-4 flex justify-between items-center">
        <button onClick={nuevoReporte} className="btn-nuevo">
          + Crear Nuevo Reporte
        </button>
        {esSoloLectura && (
          <span className="badge-lectura">
            🔒 Reporte Guardado (Modo Solo Lectura)
          </span>
        )}
      </div>

      {/* CONTENIDO DEL REPORTE */}
      <div id="reporte-contenido" className="p-6 border rounded shadow">
        <h1 className="text-xl font-bold mb-4">PCA Ingeniería - Reporte de Servicio</h1>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Folio:</label>
            <input
              type="text"
              name="folio"
              value={formData.folio}
              onChange={handleChange}
              disabled={esSoloLectura}
              className={esSoloLectura ? "input-disabled" : "input-active"}
            />
          </div>

          <div>
            <label>Cliente:</label>
            <input
              type="text"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              disabled={esSoloLectura}
              className={esSoloLectura ? "input-disabled" : "input-active"}
            />
          </div>

          <div>
            <label>Técnico a cargo:</label>
            <input
              type="text"
              name="tecnico"
              value={formData.tecnico}
              onChange={handleChange}
              disabled={esSoloLectura}
              className={esSoloLectura ? "input-disabled" : "input-active"}
            />
          </div>

          <div className="col-span-2">
            <label>Diagnóstico / Trabajos realizados:</label>
            <textarea
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleChange}
              disabled={esSoloLectura}
              className={esSoloLectura ? "input-disabled" : "input-active"}
            />
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
<div className="mt-4 flex gap-4">
  {!esSoloLectura ? (
    <button 
      type="button" 
      onClick={guardarYFinalizar} 
      className="btn-guardar"
    >
      Finalizar, Guardar y Generar PDF
    </button>
  ) : (
    <button 
      type="button" 
      onClick={generarPDF} 
      className="btn-descargar"
    >
      Descargar PDF nuevamente
    </button>
  )}
</div>

      {/* HISTORIAL DE REPORTES GUARDADOS */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Historial de Reportes Guardados</h2>
        <ul>
          {reportesGuardados.map((item) => (
            <li key={item.id} className="p-2 border-b flex justify-between items-center">
              <span>Folio: {item.folio} - {item.cliente} ({item.fecha})</span>
              <button onClick={() => verReporteGuardado(item)} className="btn-ver">
                👁️ Ver / Descargar PDF
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
