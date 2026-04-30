import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [missions, setMissions] = useState([]);

  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [tipoCarga, setTipoCarga] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [distancia, setDistancia] = useState("");

  // Telemetria
  const [battery, setBattery] = useState(100);
  const [latency, setLatency] = useState(50);
  const [robotStatus, setRobotStatus] = useState("Inativo");
  const [currentMission, setCurrentMission] = useState("Nenhuma");
  const [lastUpdate, setLastUpdate] = useState("--:--:--");

  // Alertas
  const [alerts, setAlerts] = useState([]);
  const [batteryAlertSent, setBatteryAlertSent] = useState(false);

  //---------------------------------------------------
  // ALERTAS
  //---------------------------------------------------
  function addAlert(message) {
    const timestamp = new Date().toLocaleString();

    setAlerts((prev) => [
      {
        id: Date.now() + Math.random(),
        message,
        timestamp
      },
      ...prev
    ]);
  }

  //---------------------------------------------------
  // SIMULA API HOSPITALAR
  //---------------------------------------------------
  function sendHospitalStatus(mission, status) {
    const payload = {
      missionId: mission.id,
      origem: mission.origem,
      destino: mission.destino,
      tipoCarga: mission.tipoCarga,
      prioridade: mission.prioridade,
      status: status,
      timestamp: new Date().toLocaleString()
    };

    console.log("=== API HOSPITALAR ===");
    console.log(payload);

    addAlert(
      `API Hospitalar: Missão ${mission.id} -> ${status}`
    );
  }

  //---------------------------------------------------
  // CANCELAR MISSÃO
  //---------------------------------------------------
  function cancelCurrentMission() {
    const executingMission = missions.find(
      (m) => m.status === "em_execucao"
    );

    if (!executingMission) {
      addAlert("Nenhuma missão em execução para cancelar");
      return;
    }

    sendHospitalStatus(executingMission, "cancelada");

    setMissions((prev) =>
      prev.map((m) =>
        m.id === executingMission.id
          ? { ...m, status: "cancelada" }
          : m
      )
    );

    addAlert(
      `Missão ${executingMission.id} foi cancelada manualmente`
    );

    setRobotStatus("Inativo");
    setCurrentMission("Nenhuma");
  }

  //---------------------------------------------------
  // CRIAR MISSÃO
  //---------------------------------------------------
  function addMission() {
    let hasError = false;

    if (!origem.trim()) {
      addAlert("Origem não pode estar vazia");
      hasError = true;
    }

    if (!destino.trim()) {
      addAlert("Destino não pode estar vazio");
      hasError = true;
    }

    if (!tipoCarga.trim()) {
      addAlert("Tipo de carga não pode estar vazio");
      hasError = true;
    }

    if (isNaN(prioridade)) {
      addAlert("Prioridade deve ser um número");
      hasError = true;
    }

    if (
      !isNaN(prioridade) &&
      (Number(prioridade) < 1 || Number(prioridade) > 3)
    ) {
      addAlert("Prioridade deve estar entre 1 e 3");
      hasError = true;
    }

    if (isNaN(distancia)) {
      addAlert("Distância deve ser um número");
      hasError = true;
    }

    if (
      !isNaN(distancia) &&
      Number(distancia) <= 0
    ) {
      addAlert("Distância deve ser maior que zero");
      hasError = true;
    }

    if (hasError) return;

    const newMission = {
      id: Date.now(),
      origem,
      destino,
      tipoCarga,
      prioridade: Number(prioridade),
      distancia: Number(distancia),
      originalDistance: Number(distancia),
      status: "pendente"
    };

    const updated = [...missions, newMission];

    updated.sort((a, b) => {
      if (a.status === "em_execucao") return -1;
      if (b.status === "em_execucao") return 1;

      if (a.status !== "pendente") return 1;
      if (b.status !== "pendente") return -1;

      if (a.prioridade !== b.prioridade) {
        return a.prioridade - b.prioridade;
      }

      return a.distancia - b.distancia;
    });

    setMissions(updated);

    setOrigem("");
    setDestino("");
    setTipoCarga("");
    setPrioridade("");
    setDistancia("");
  }

  //---------------------------------------------------
  // TELEMETRIA
  //---------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      const chance = Math.random();
      let newLatency;

      if (chance < 0.99) {
        newLatency = Math.floor(Math.random() * 90);
      } else {
        newLatency = Math.floor(Math.random() * 50) + 100;
      }

      setLatency(newLatency);

      if (newLatency > 100) {
        addAlert("Latência alta detectada");
      }

      setLastUpdate(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //---------------------------------------------------
  // FALHA → VOLTA PARA PENDENTE
  //---------------------------------------------------
  useEffect(() => {
    const failed = missions.find(
      (m) => m.status === "falha"
    );

    if (!failed) return;

    const timer = setTimeout(() => {
      sendHospitalStatus(failed, "pendente");

      setMissions((prev) =>
        prev.map((m) =>
          m.id === failed.id
            ? {
                ...m,
                status: "pendente",
                distancia: m.originalDistance
              }
            : m
        )
      );

      addAlert(
        `Missão ${failed.id} retornou para pendente`
      );
    }, 10000);

    return () => clearTimeout(timer);
  }, [missions]);

  //---------------------------------------------------
  // CONTROLE DO ROBÔ
  //---------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      const executing = missions.find(
        (m) => m.status === "em_execucao"
      );

      if (executing) {
        setRobotStatus("Executando");
        setCurrentMission(executing.id);

        if (battery <= 0) {
          sendHospitalStatus(executing, "falha");

          setMissions((prev) =>
            prev.map((m) =>
              m.id === executing.id
                ? { ...m, status: "falha" }
                : m
            )
          );

          addAlert("Bateria esgotada");
          return;
        }

        setBattery((prev) => {
          if (executing.distancia % 20 === 0) {
            return Math.max(prev - 1, 0);
          }
          return prev;
        });

        if (battery < 20 && !batteryAlertSent) {
          addAlert("Bateria abaixo de 20%");
          setBatteryAlertSent(true);
        }

        const fail = Math.random();
        if (fail < 0.002) {
          sendHospitalStatus(executing, "falha");

          setMissions((prev) =>
            prev.map((m) =>
              m.id === executing.id
                ? { ...m, status: "falha" }
                : m
            )
          );

          return;
        }

        setMissions((prev) =>
          prev.map((m) => {
            if (m.id === executing.id) {
              const newDist = m.distancia - 1;

              if (newDist <= 0) {
                sendHospitalStatus(m, "concluida");

                return {
                  ...m,
                  distancia: 0,
                  status: "concluida"
                };
              }

              return { ...m, distancia: newDist };
            }
            return m;
          })
        );

        return;
      }

      const pending = missions
        .filter((m) => m.status === "pendente")
        .sort((a, b) => {
          if (a.prioridade !== b.prioridade) {
            return a.prioridade - b.prioridade;
          }
          return a.distancia - b.distancia;
        });

      const next = pending[0];

      if (next) {
        sendHospitalStatus(next, "em_execucao");

        setMissions((prev) =>
          prev.map((m) =>
            m.id === next.id
              ? { ...m, status: "em_execucao" }
              : m
          )
        );

        return;
      }

      setRobotStatus("Inativo");
      setCurrentMission("Nenhuma");

      setBattery((prev) => {
        if (prev >= 20) setBatteryAlertSent(false);

        if (
          prev < 100 &&
          new Date().getSeconds() % 20 === 0
        ) {
          return prev + 1;
        }

        return prev;
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [missions, battery, batteryAlertSent]);

  return (
    <div className="dashboard">

      <div className="left-panel">
        <div className="missions-box">
          <p>{">"} MISSÕES</p>
          <p>-------------</p>

          {missions.length === 0 ? (
            <p>Nenhuma missão</p>
          ) : (
            missions.map((m) => (
              <p key={m.id}>
                ID: {m.id}<br />
                {m.origem} → {m.destino}<br />
                Carga: {m.tipoCarga}<br />
                Prioridade: {m.prioridade}<br />
                Tempo restante: {m.distancia}s<br />
                Status: {m.status}
                <br />---------
              </p>
            ))
          )}
        </div>

        <div className="create-box">
          <p>{">"} CRIAR MISSÃO</p>
          <p>----------</p>

          <input placeholder="Origem" value={origem} onChange={e => setOrigem(e.target.value)} />
          <input placeholder="Destino" value={destino} onChange={e => setDestino(e.target.value)} />
          <input placeholder="Tipo de carga" value={tipoCarga} onChange={e => setTipoCarga(e.target.value)} />
          <input placeholder="Prioridade (1-3)" value={prioridade} onChange={e => setPrioridade(e.target.value)} />
          <input placeholder="Distância (segundos)" value={distancia} onChange={e => setDistancia(e.target.value)} />

          <button onClick={addMission}>ADICIONAR</button>
        </div>
      </div>

      <div className="telemetry-box">
        <p>{">"} TELEMETRIA</p>
        <p>-------------</p>

        <p>Bateria: {battery}%</p>
        <p>Latência: {latency}ms</p>
        <p>Status: {robotStatus}</p>
        <p>Missão atual: {currentMission}</p>
        <p>Atualização: {lastUpdate}</p>

        <button onClick={cancelCurrentMission}>
          CANCELAR MISSÃO
        </button>
      </div>

      <div className="alerts-box">
        <p>{">"} ALERTAS</p>
        <p>----------</p>

        {alerts.length === 0 ? (
          <p>Nenhum alerta</p>
        ) : (
          alerts.map((a) => (
            <p key={a.id}>
              [{a.timestamp}]<br />
              {a.message}
              <br />---------
            </p>
          ))
        )}
      </div>

    </div>
  );
}

export default App;