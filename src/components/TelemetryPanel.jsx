

export default function TelemetryPanel({ battery, latency, robotStatus, currentMission, lastUpdate, isEmergency, onCancelMission, onEmergencyStop }) {
  let statusColor = 'text-blue';
  if (robotStatus.includes('Erro') || robotStatus.includes('Esgotada') || robotStatus === 'PARADA DE EMERGÊNCIA') {
    statusColor = 'text-red font-bold blink';
  } else if (robotStatus === 'Em Movimento') {
    statusColor = 'text-green font-bold';
  }

  return (
    <div className="telemetry-box">
      <p className="panel-title">{">"} TELEMETRIA</p>
      <hr className="divider" />

      <p className={`telemetry-row ${battery <= 20 ? "text-red font-bold" : "text-green"}`}>
        <span>Bateria:</span> <span>{battery}%</span>
      </p>
      <p className={`telemetry-row ${latency > 100 ? "text-red" : "text-green"}`}>
        <span>Latência:</span> <span>{latency}ms</span>
      </p>
      <p className="telemetry-row">
        <span>Status:</span>
        <span className={statusColor}>
          {robotStatus}
        </span>
      </p>
      <p className="telemetry-row">
        <span>ID Missão:</span> <span>{currentMission}</span>
      </p>
      <p className="telemetry-row dim-text" style={{marginTop: '20px'}}>
        <span>Att:</span> <span>{lastUpdate}</span>
      </p>

      <button className="btn-danger" onClick={onCancelMission} style={{ marginTop: "40px" }} disabled={isEmergency}>
        [!] ABORTAR MISSÃO ATUAL
      </button>

      <button 
        className={isEmergency ? "btn-emergency-active" : "btn-emergency"} 
        onClick={onEmergencyStop} 
        style={{ marginTop: "15px" }}
      >
        {isEmergency ? "RETOMAR OPERAÇÃO" : "PARADA DE EMERGÊNCIA"}
      </button>
    </div>
  );
}