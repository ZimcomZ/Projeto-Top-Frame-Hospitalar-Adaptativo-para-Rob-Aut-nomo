import { useMemo } from 'react';
import './RobotMap.css';

const LOCATIONS = {
  "Farmácia": { x: 10, y: 10 },
  "Laboratório": { x: 90, y: 10 },
  "Recepção": { x: 50, y: 50 },
  "Quarto 101": { x: 10, y: 90 },
  "Quarto 102": { x: 30, y: 90 },
  "Quarto 103": { x: 50, y: 90 },
  "Estação de Recarga": { x: 90, y: 90 }
};

export default function RobotMap({ activeMission, robotStatus }) {
  const robotPos = useMemo(() => {
    if (!activeMission || robotStatus === "Inativo" || robotStatus === "Em Repouso") {
      return LOCATIONS["Estação de Recarga"];
    }

    const start = LOCATIONS[activeMission.origem] || LOCATIONS["Recepção"];
    const end = LOCATIONS[activeMission.destino] || LOCATIONS["Recepção"];
    
    const progress = (activeMission.originalDistance - activeMission.distancia) / activeMission.originalDistance;
    
    return {
      x: start.x + (end.x - start.x) * progress,
      y: start.y + (end.y - start.y) * progress
    };
  }, [activeMission, robotStatus]);

  return (
    <div className="map-container">
      <p className="panel-title">{">"} MAPA OPERACIONAL</p>
      <hr className="divider" />
      
      <div className="grid-canvas">
        {/* Renderizar Pontos de Interesse */}
        {Object.entries(LOCATIONS).map(([name, pos]) => (
          <div 
            key={name} 
            className="map-node" 
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            title={name}
          >
            <span className="node-label">{name}</span>
          </div>
        ))}

        {/* Renderizar Trajetória se houver missão */}
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

        {/* O Robô */}
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
