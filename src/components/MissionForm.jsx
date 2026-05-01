import { useState } from 'react';
import { LOCATIONS, findLocationKey } from '../utils/locations';

export default function MissionForm({ onAddMission, externalOrigem, externalDestino }) {
  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    tipoCarga: "",
    prioridade: "",
    distancia: ""
  });
  const [formErrors, setFormErrors] = useState({});

  // Derivando estado para evitar useEffect síncrono (Best Practice React)
  const displayOrigem = externalOrigem || formData.origem;
  const displayDestino = externalDestino || formData.destino;

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit() {
    const errors = {};
    
    // Validação estrita usando os valores visíveis (mapa ou input)
    const validatedOrigem = findLocationKey(displayOrigem);
    const validatedDestino = findLocationKey(displayDestino);

    if (!validatedOrigem) errors.origem = "Local de origem inválido ou inexistente";
    if (!validatedDestino) errors.destino = "Local de destino inválido ou inexistente";
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
      origem: validatedOrigem,
      destino: validatedDestino,
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

      <label className="input-label">Origem (Digite ou clique no mapa)</label>
      <input 
        name="origem" 
        list="location-options"
        placeholder="Ex: Farmacia, Quarto 101" 
        value={displayOrigem} 
        onChange={handleInputChange} 
        className={formErrors.origem ? 'input-error' : ''} 
      />
      {formErrors.origem && <p className="error-msg">{formErrors.origem}</p>}

      <label className="input-label">Destino (Digite ou clique no mapa)</label>
      <input 
        name="destino" 
        list="location-options"
        placeholder="Ex: Laboratorio, Recepcao" 
        value={displayDestino} 
        onChange={handleInputChange} 
        className={formErrors.destino ? 'input-error' : ''} 
      />
      {formErrors.destino && <p className="error-msg">{formErrors.destino}</p>}

      <datalist id="location-options">
        {Object.keys(LOCATIONS).map(loc => <option key={loc} value={loc} />)}
      </datalist>

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
