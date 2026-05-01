import { useMemo } from 'react';
import './RobotMap.css';
import { LOCATIONS } from '../utils/locations';

export default function RobotMap({ activeMission, robotStatus, onSelectLocation }) {
  const robotPos = useMemo(() => {
    if (!activeMission || robotStatus === "Inativo" || robotStatus === "Em Repouso") {
      return LOCATIONS["Estacao de Recarga"];
    }

    const start = LOCATIONS[activeMission.origem] || LOCATIONS["Recepcao"];
    const end = LOCATIONS[activeMission.destino] || LOCATIONS["Recepcao"];
    
    const progress = (activeMission.originalDistance - activeMission.distancia) / activeMission.originalDistance;
    
    return {
      x: start.x + (end.x - start.x) * progress,
      y: start.y + (end.y - start.y) * progress
    };
  }, [activeMission, robotStatus]);

  return (
    <div className="map-container">
      <p className="panel-title">{">"} MAPA OPERACIONAL (CLIQUE PARA SELECIONAR)</p>
      <hr className="divider" />
      
      <div className="grid-canvas">
        {Object.entries(LOCATIONS).map(([name, pos]) => (
          <div 
            key={name} 
            className="map-node interactable" 
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => onSelectLocation(name)}
          >
            <span className="node-label">{name}</span>
          </div>
        ))}

        {activeMission && (robotStatus === "Em Movimento" || robotStatus === "Re-roteando...") && (
          <svg className="path-line">
            <line 
              x1={`${LOCATIONS[activeMission.origem]?.x || 50}%`} 
              y1={`${LOCATIONS[activeMission.origem]?.y || 50}%`}
              x2={`${LOCATIONS[activeMission.destino]?.x || 50}%`} 
              y2={`${LOCATIONS[activeMission.destino]?.y || 50}%`}
            />
          </svg>
        )}

        <div 
          className={`robot-marker ${robotStatus === "PARADA DE EMERGÊNCIA" ? 'emergency' : ''}`}
          style={{ left: `${robotPos.x}%`, top: `${robotPos.y}%` }}
        >
          <div className="robot-icon">R</div>
          <div className="robot-pulse"></div>
        </div>
      </div>
    </div>
  );
}
