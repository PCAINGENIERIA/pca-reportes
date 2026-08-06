import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import SignatureCanvas from 'react-signature-canvas';
import { 
  FileText, CheckCircle, Clock, AlertTriangle, Send, 
  Camera, Plus, Trash2, User, Building, MapPin, Wrench, Shield
} from 'lucide-react';

// Reemplaza con tus variables de Supabase si aplica
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function App() {
  const [formData, setFormData] = useState({
    folio: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
    fecha: new Date().toISOString().split('T')[0],
    cliente: '',
    ubicacion: '',
    equipo: '',
    modelo: '',
    serie: '',
    tecnico: '',
    tipoServicio: 'Mantenimiento Preventivo',
    descripcionTrabajo: '',
    observaciones: '',
    estado: 'Completado'
  });

  const [refacciones, setRefacciones] = useState([{ cantidad: 1, descripcion: '', codigo: '' }]);
  const [fotos, setFotos] = useState([]);
  const [firmaCliente, setFirmaCliente] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sigCanvas = useRef({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRefaccionChange = (index, field, value) => {
    const updated = [...refacciones];
    updated[index][field] = value;
    setRefacciones(updated);
  };

  const addRefaccion = () => {
    setRefacciones([...refacciones, { cantidad: 1, descripcion: '', codigo: '' }]);
  };

  const removeRefaccion = (index) => {
    setRefacciones(refacciones.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotos(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
    setFirmaCliente(null);
  };

  const saveSignature = () => {
    if (!sigCanvas.current.isEmpty()) {
      setFirmaCliente(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      refacciones,
      fotos,
      firmaCliente,
      creadoEl: new Date().toISOString()
    };

    try {
      if (supabase) {
        await supabase.from('reportes').insert([payload]);
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Error guardando el reporte:', err);
      alert('Error al guardar el reporte. Revisa la consola o conexión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-100">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Reporte Enviado!</h2>
          <p className="text-slate-600 mb-6">El servicio ha sido registrado correctamente con el folio <strong>{formData.folio}</strong>.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Crear nuevo reporte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PCA INGENIERÍA Y SERVICIOS</h1>
            <p className="text-slate-400 text-sm mt-1">Reporte Técnico de Servicio en Campo</p>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 text-right">
            <span className="text-xs text-slate-400 block">Folio</span>
            <span className="font-mono font-bold text-blue-400">{formData.folio}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {/* General Information */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b pb-2">
              <Building className="w-5 h-5 text-blue-600" /> Información General
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Cliente / Empresa</label>
                <input 
                  type="text" 
                  name="cliente" 
                  required 
                  value={formData.cliente} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                  placeholder="Nombre del cliente"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Ubicación / Sitio</label>
                <input 
                  type="text" 
                  name="ubicacion" 
                  required 
                  value={formData.ubicacion} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                  placeholder="Dirección o planta"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Técnico Asignado</label>
                <input 
                  type="text" 
                  name="tecnico" 
                  required 
                  value={formData.tecnico} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                  placeholder="Nombre del técnico"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Fecha</label>
                <input 
                  type="date" 
                  name="fecha" 
                  value={formData.fecha} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                />
              </div>
            </div>
          </section>

          {/* Equipment Data */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b pb-2">
              <Wrench className="w-5 h-5 text-blue-600" /> Datos del Equipo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Equipo / Sistema</label>
                <input 
                  type="text" 
                  name="equipo" 
                  required 
                  value={formData.equipo} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                  placeholder="Ej. Chiller Trane"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Modelo</label>
                <input 
                  type="text" 
                  name="modelo" 
                  value={formData.modelo} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                  placeholder="Mod. / Serie de catálogo"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Número de Serie</label>
                <input 
                  type="text" 
                  name="serie" 
                  value={formData.serie} 
                  onChange={handleInputChange} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                  placeholder="N/S del equipo"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Tipo de Servicio</label>
              <select 
                name="tipoServicio" 
                value={formData.tipoServicio} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 bg-white"
              >
                <option>Mantenimiento Preventivo</option>
                <option>Mantenimiento Correctivo</option>
                <option>Diagnóstico / Revisión</option>
                <option>Instalación / Arranque</option>
              </select>
            </div>
          </section>

          {/* Description */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b pb-2">
              <FileText className="w-5 h-5 text-blue-600" /> Detalle del Trabajo Realizado
            </h2>
            <div>
              <textarea 
                name="descripcionTrabajo" 
                rows="4" 
                required 
                value={formData.descripcionTrabajo} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                placeholder="Describe los trabajos, mediciones y ajustes realizados..."
              ></textarea>
            </div>
          </section>

          {/* Spare Parts */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" /> Refacciones y Materiales
              </h2>
              <button 
                type="button" 
                onClick={addRefaccion}
                className="text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1 rounded-lg flex items-center gap-1 transition"
              >
                <Plus className="w-4 h-4" /> Agregar ítem
              </button>
            </div>
            {refacciones.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="1" 
                  value={item.cantidad} 
                  onChange={(e) => handleRefaccionChange(index, 'cantidad', e.target.value)}
                  className="w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center"
                  placeholder="Cant"
                />
                <input 
                  type="text" 
                  value={item.descripcion} 
                  onChange={(e) => handleRefaccionChange(index, 'descripcion', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Descripción del repuesto"
                />
                <input 
                  type="text" 
                  value={item.codigo} 
                  onChange={(e) => handleRefaccionChange(index, 'codigo', e.target.value)}
                  className="w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Código/Parte"
                />
                {refacciones.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeRefaccion(index)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* Photos */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b pb-2">
              <Camera className="w-5 h-5 text-blue-600" /> Evidencia Fotográfica
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {fotos.map((img, idx) => (
                <div key={idx} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden border">
                  <img src={img} alt="Evidencia" className="w-full h-full object-cover" />
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition text-slate-500">
                <Camera className="w-8 h-8 mb-1 text-slate-400" />
                <span className="text-xs font-medium">Agregar Foto</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </section>

          {/* Signatures */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b pb-2">
              <User className="w-5 h-5 text-blue-600" /> Conformidad del Cliente
            </h2>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Firma Digital del Cliente</label>
              <div className="bg-white border rounded-lg overflow-hidden">
                <SignatureCanvas 
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{ className: 'w-full h-40 signature-canvas' }}
                  onEnd={saveSignature}
                />
              </div>
              <div className="flex justify-end mt-2">
                <button 
                  type="button" 
                  onClick={clearSignature}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Limpiar firma
                </button>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 active:scale-[0.99] transition flex items-center justify-center gap-2 text-lg disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Guardando reporte...' : 'Guardar y Finalizar Reporte'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
