import { useState } from 'react';

export default function MissionForm({ onAddMission }) {
  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    tipoCarga: "",
    prioridade: "",
    distancia: ""
  });
  const [formErrors, setFormErrors] = useState({});

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit() {
    const errors = {};
    if (!formData.origem.trim()) errors.origem = "Origem obrigatória";
    if (!formData.destino.trim()) errors.destino = "Destino obrigatório";
    if (!formData.tipoCarga.trim()) errors.tipoCarga = "Carga obrigatória";

    const prio = Number(formData.prioridade);
    if (isNaN(prio) || prio < 1 || prio > 3) errors.prioridade = "Prioridade deve ser 1, 2 ou 3";

    const dist = Number(formData.distancia);
    if (isNaN(dist) || dist <= 0) errors.distancia = "Distância deve ser > 0";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onAddMission({
      origem: formData.origem,
      destino: formData.destino,
      tipoCarga: formData.tipoCarga,
      prioridade: prio,
      distancia: dist
    });

    setFormData({ origem: "", destino: "", tipoCarga: "", prioridade: "", distancia: "" });
    setFormErrors({});
  }

  return (
    <div className="create-box">
      <p className="panel-title">{">"} NOVA MISSÃO</p>
      <hr className="divider" />

      <input name="origem" placeholder="Origem (ex: Quarto 102)" value={formData.origem} onChange={handleInputChange} className={formErrors.origem ? 'input-error' : ''} />
      {formErrors.origem && <p className="error-msg">{formErrors.origem}</p>}

      <input name="destino" placeholder="Destino (ex: Farmácia)" value={formData.destino} onChange={handleInputChange} className={formErrors.destino ? 'input-error' : ''} />
      {formErrors.destino && <p className="error-msg">{formErrors.destino}</p>}

      <input name="tipoCarga" placeholder="Tipo de Carga (ex: Soro)" value={formData.tipoCarga} onChange={handleInputChange} className={formErrors.tipoCarga ? 'input-error' : ''} />
      {formErrors.tipoCarga && <p className="error-msg">{formErrors.tipoCarga}</p>}

      <input name="prioridade" placeholder="Prioridade (1 = Urgente, 3 = Normal)" value={formData.prioridade} onChange={handleInputChange} className={formErrors.prioridade ? 'input-error' : ''} />
      {formErrors.prioridade && <p className="error-msg">{formErrors.prioridade}</p>}

      <input name="distancia" placeholder="Distância/Tempo (segundos)" value={formData.distancia} onChange={handleInputChange} className={formErrors.distancia ? 'input-error' : ''} />
      {formErrors.distancia && <p className="error-msg">{formErrors.distancia}</p>}

      <button className="btn-primary" onClick={handleSubmit}>INJETAR MISSÃO</button>
    </div>
  );
}