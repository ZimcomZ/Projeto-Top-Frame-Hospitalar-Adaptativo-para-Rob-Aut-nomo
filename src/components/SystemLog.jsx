

export default function SystemLog({ alerts }) {
  return (
    <div className="alerts-box">
      <p className="panel-title">{">"} LOG DO SISTEMA</p>
      <hr className="divider" />

      {alerts.length === 0 ? (
        <p className="status-pendente dim-text">Aguardando eventos...</p>
      ) : (
        alerts.map((a) => {
          let colorClass = "text-blue";
          if (a.message.includes('FALHOU') || a.message.includes('CRÍTICA') || a.message.includes('alta') || a.message.includes('cancelada') || a.message.includes('EMERGÊNCIA')) {
            colorClass = "text-red";
          }
          if (a.message.includes('CONCLUÍDA') || a.message.includes('Iniciando') || a.message.includes('RETOMADA')) {
            colorClass = "text-green";
          }
          
          return (
            <p key={a.id} className={`log-entry ${colorClass}`}>
              <span className="log-time">[{a.timestamp}]</span> {a.message}
            </p>
          );
        })
      )}
    </div>
  );
}