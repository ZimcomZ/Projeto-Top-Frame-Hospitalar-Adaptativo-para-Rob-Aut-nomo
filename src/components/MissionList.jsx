

export default function MissionList({ sortedMissions }) {
  const renderProgressBar = (current, total) => {
    if (!total || total === 0) return "[██████████] 100%";
    const percent = Math.max(0, Math.min(100, ((total - current) / total) * 100));
    const filledBars = Math.round(percent / 10);
    const emptyBars = 10 - filledBars;
    return `[${'█'.repeat(filledBars)}${'░'.repeat(emptyBars)}] ${Math.round(percent)}%`;
  };

  return (
    <div className="missions-box">
      <p className="panel-title">{">"} FILA DE MISSÕES</p>
      <hr className="divider" />

      {sortedMissions.length === 0 ? (
        <p className="status-pendente dim-text">Nenhuma missão no sistema.</p>
      ) : (
        sortedMissions.map((m) => (
          <div key={m.id} className={`mission-item border-color-${m.status}`}>
            <p>
              <strong>ID:</strong> {m.id} | <span className={`status-${m.status} font-bold`}>{m.status.toUpperCase().replace('_', ' ')}</span>
            </p>
            <p><strong>Rota:</strong> {m.origem} → {m.destino}</p>
            <p><strong>Carga:</strong> {m.tipoCarga} | <strong>Prioridade:</strong> P{m.prioridade}</p>
            <p className="progress-bar">{renderProgressBar(m.distancia, m.originalDistance)}</p>
            {m.interceptionInfo && (
              <div className="interception-box">
                <p className="text-red font-bold" style={{ fontSize: '0.8em' }}>AVISO: INTERCEPTADA</p>
                <p className="dim-text" style={{ fontSize: '0.75em' }}>{m.interceptionInfo.reason}</p>
                <p className="dim-text" style={{ fontSize: '0.7em' }}>{m.interceptionInfo.timestamp}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}