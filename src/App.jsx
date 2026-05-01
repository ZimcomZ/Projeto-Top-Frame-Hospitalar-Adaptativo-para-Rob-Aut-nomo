import "./App.css";
import { useState, useEffect, useCallback, useMemo } from "react";
import MissionForm from "./components/MissionForm";
import MissionList from "./components/MissionList";
import TelemetryPanel from "./components/TelemetryPanel";
import SystemLog from "./components/SystemLog";
import RobotMap from "./components/RobotMap";
import { sortMissions } from "./utils/missionLogic";

function App() {
  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem("missions");
    return saved ? JSON.parse(saved) : [];
  });

  // Telemetria Global
  const [battery, setBattery] = useState(() => {
    const saved = localStorage.getItem("battery");
    return saved ? Number(saved) : 100;
  });
  const [latency, setLatency] = useState(50);
  const [robotStatus, setRobotStatus] = useState("Inativo");
  const [currentMission, setCurrentMission] = useState("Nenhuma");
  const [lastUpdate, setLastUpdate] = useState("--:--:--");
  const [isEmergency, setIsEmergency] = useState(() => {
    return localStorage.getItem("isEmergency") === "true";
  });

  // Alertas
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem("alerts");
    return saved ? JSON.parse(saved) : [];
  });
  const [batteryAlertSent, setBatteryAlertSent] = useState(false);

  //---------------------------------------------------
  // ALERTAS E API
  //---------------------------------------------------
  const addAlert = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setAlerts((prev) => [
      { id: Date.now() + Math.random(), message, timestamp },
      ...prev
    ].slice(0, 50));
  }, []);

  const sendHospitalStatus = useCallback((mission, status) => {
    const payload = {
      missionId: mission.id,
      origem: mission.origem,
      destino: mission.destino,
      tipoCarga: mission.tipoCarga,
      prioridade: mission.prioridade,
      status: status,
      timestamp: new Date().toLocaleString()
    };
    console.log("=== API HOSPITALAR ===", payload);
    addAlert(`API Hospitalar: Missão ${mission.id} -> ${status}`);
  }, [addAlert]);

  //---------------------------------------------------
  // LÓGICA DE NEGÓCIO
  //---------------------------------------------------
  const sortedMissions = useMemo(() => sortMissions(missions), [missions]);
  const executingMission = useMemo(() => missions.find(m => m.status === "em_execucao"), [missions]);

  // Persistência em LocalStorage
  useEffect(() => {
    localStorage.setItem("missions", JSON.stringify(missions));
    localStorage.setItem("battery", battery.toString());
    localStorage.setItem("alerts", JSON.stringify(alerts));
    localStorage.setItem("isEmergency", isEmergency.toString());
  }, [missions, battery, alerts, isEmergency]);

  function handleAddMission(missionData) {
    const newMission = {
      id: Date.now(),
      ...missionData,
      originalDistance: missionData.distancia,
      status: "pendente"
    };
    setMissions(prev => [...prev, newMission]);
  }

  function handleCancelMission() {
    const executingMission = missions.find(m => m.status === "em_execucao");
    if (!executingMission) {
      addAlert("Nenhuma missão em execução para cancelar");
      return;
    }
    sendHospitalStatus(executingMission, "cancelada");
    setMissions(prev => prev.map(m => m.id === executingMission.id ? { ...m, status: "cancelada" } : m));
    addAlert(`Missão ${executingMission.id} foi cancelada manualmente`);
    setRobotStatus("Inativo");
    setCurrentMission("Nenhuma");

    // Auto-remover da fila após 60 segundos (1 minuto)
    setTimeout(() => {
      setMissions(prev => prev.filter(m => m.id !== executingMission.id));
    }, 60000);
  }

  function handleEmergencyStop() {
    if (isEmergency) {
      setIsEmergency(false);
      addAlert("OPERAÇÃO RETOMADA");
    } else {
      setIsEmergency(true);
      addAlert("PARADA DE EMERGÊNCIA ATIVADA");
      // Aborta missão atual e joga pra fila
      const executingMission = missions.find(m => m.status === "em_execucao");
      if (executingMission) {
        sendHospitalStatus(executingMission, "pendente");
        setMissions(prev => prev.map(m => m.id === executingMission.id ? { ...m, status: "pendente" } : m));
      }
      setRobotStatus("PARADA DE EMERGÊNCIA");
      setCurrentMission("Nenhuma");
    }
  }

  //---------------------------------------------------
  // EFFECTS (Ciclo de vida e Sensores)
  //---------------------------------------------------
  // Latência
  useEffect(() => {
    const interval = setInterval(() => {
      const chance = Math.random();
      let newLatency = chance < 0.99 ? Math.floor(Math.random() * 90) : Math.floor(Math.random() * 50) + 100;
      setLatency(newLatency);
      if (newLatency > 100) addAlert("Latência alta detectada");
      setLastUpdate(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, [addAlert]);

  // Retry de falhas
  useEffect(() => {
    const failed = missions.find(m => m.status === "falha");
    if (!failed) return;

    const timer = setTimeout(() => {
      sendHospitalStatus(failed, "pendente");
      setMissions(prev => prev.map(m => m.id === failed.id ? { ...m, status: "pendente", distancia: m.originalDistance } : m));
      addAlert(`Missão ${failed.id} retornou para fila`);
    }, 5000); // Reduzido de 10000 para 5000 (5 segundos)

    return () => clearTimeout(timer);
  }, [missions, sendHospitalStatus, addAlert]);

  // Motor Principal do Robô
  useEffect(() => {
    const interval = setInterval(() => {
      if (isEmergency) return;

      const executing = sortedMissions.find(m => m.status === "em_execucao");
      const nextPending = sortedMissions.find(m => m.status === "pendente" || m.status === "cancelada_por_emergencia");

      // --- LÓGICA DE INTERRUPÇÃO (Preemption) ---
      if (executing && nextPending) {
        let shouldInterrupt = false;
        
        // Regra 1: P1 interrompe P2 ou P3 imediatamente
        if (nextPending.prioridade === 1 && executing.prioridade > 1) {
          shouldInterrupt = true;
          addAlert(`INTERRUPÇÃO CRÍTICA: Missão ${nextPending.id} (P1) interceptou Missão ${executing.id}`);
        } 
        // Regra 2: P2 interrompe P3 se estiver no início (< 50% concluído)
        else if (nextPending.prioridade === 2 && executing.prioridade === 3) {
          const progress = ((executing.originalDistance - executing.distancia) / executing.originalDistance);
          if (progress < 0.5) {
            shouldInterrupt = true;
            addAlert(`AVISO DE RE-ROTEAMENTO: Missão ${nextPending.id} (P2) prioritária. Missão ${executing.id} abortada.`);
          }
        }

        if (shouldInterrupt) {
          const reason = nextPending.prioridade === 1 
            ? `Interceptada por P1 (Urgência Máxima)` 
            : `Interceptada por P2 (Prioridade Superior)`;
          
          const timestamp = new Date().toLocaleString();

          setMissions(prev => prev.map(m => 
            m.id === executing.id 
              ? { 
                  ...m, 
                  status: "cancelada_por_emergencia", 
                  distancia: m.originalDistance, // Reseta progresso
                  interceptionInfo: { reason, timestamp } 
                } 
              : m
          ));
          
          sendHospitalStatus(executing, "cancelada_por_emergencia");
          
          // Retorna para pendente após 5 segundos
          setTimeout(() => {
            setMissions(prev => prev.map(m => m.id === executing.id ? { ...m, status: "pendente" } : m));
            addAlert(`ℹ Missão ${executing.id} retornou para a fila após interrupção.`);
          }, 5000);
          
          setRobotStatus("Re-roteando...");
          return;
        }
      }

      if (executing) {
        setRobotStatus("Em Movimento");
        setCurrentMission(executing.id);

        if (battery <= 0) {
          setMissions(prev => prev.map(m => m.id === executing.id ? { ...m, status: "falha" } : m));
          setRobotStatus("Bateria Esgotada");
          sendHospitalStatus(executing, "falha");
          addAlert(`Missão ${executing.id} FALHOU (Sem bateria)`);
          return;
        }

        const chanceFalha = Math.random();
        if (chanceFalha < 0.01) {
          setMissions(prev => prev.map(m => m.id === executing.id ? { ...m, status: "falha" } : m));
          setRobotStatus("Erro de Hardware");
          sendHospitalStatus(executing, "falha");
          addAlert(`Missão ${executing.id} FALHOU (Erro motor/sensor)`);
          return;
        }

        setMissions(prev => prev.map(m => {
          if (m.id === executing.id) {
            const newDist = m.distancia - 1;
            if (newDist <= 0) {
              sendHospitalStatus(m, "concluida");
              addAlert(`Missão ${m.id} CONCLUÍDA`);

              setTimeout(() => {
                setMissions(prev => prev.filter(mission => mission.id !== m.id));
              }, 60000);

              return { ...m, distancia: 0, status: "concluida" };
            }
            return { ...m, distancia: newDist };
          }
          return m;
        }));

        setBattery(prev => {
          if (new Date().getSeconds() % 5 === 0) {
            const newBat = prev - 1;
            if (newBat <= 20 && !batteryAlertSent) {
              addAlert("BATERIA CRÍTICA! < 20%");
              setBatteryAlertSent(true);
            }
            return newBat < 0 ? 0 : newBat;
          }
          return prev;
        });
        return;
      }

      // Se ocioso, busca da fila
      const next = sortedMissions.find(m => m.status === "pendente");
      
      // --- LÓGICA DE BLOQUEIO POR FALHA (Strategic Blocking) ---
      // Se houver uma missão em FALHA com prioridade MAIOR ou IGUAL à próxima pendente, o robô espera.
      // Exceto se a próxima pendente for P1 (Urgência máxima ignora o bloqueio de falhas P2/P3).
      const highestPriorityFailure = missions
        .filter(m => m.status === "falha")
        .sort((a, b) => a.prioridade - b.prioridade)[0];

      if (highestPriorityFailure && next) {
        const isNextHigherPriority = next.prioridade < highestPriorityFailure.prioridade;
        
        if (!isNextHigherPriority && next.prioridade !== 1) {
          setRobotStatus(`Aguardando Recuperação P${highestPriorityFailure.prioridade}`);
          return; // Bloqueia execução de missões de menor prioridade
        }
      }

      if (next && battery > 0) {
        setMissions(prev => prev.map(m => m.id === next.id ? { ...m, status: "em_execucao" } : m));
        sendHospitalStatus(next, "em_execucao");
        addAlert(`Iniciando missão ${next.id} para ${next.destino}`);
        return;
      }

      setRobotStatus("Em Repouso");
      setCurrentMission("Nenhuma");

      // Recarrega
      setBattery(prev => {
        if (prev >= 20) setBatteryAlertSent(false);
        // Recarrega a cada 2 segundos em vez de 5 (Mais rápido)
        if (prev < 100 && new Date().getSeconds() % 2 === 0) return prev + 1;
        return prev;
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [sortedMissions, missions, battery, batteryAlertSent, sendHospitalStatus, addAlert, isEmergency]);

  return (
    <div className={`dashboard ${isEmergency ? 'emergency-mode' : ''}`}>
      <div className="left-panel">
        <RobotMap activeMission={executingMission} robotStatus={robotStatus} />
        <MissionList sortedMissions={sortedMissions} />
        <MissionForm onAddMission={handleAddMission} />
      </div>

      <TelemetryPanel 
        battery={battery}
        latency={latency}
        robotStatus={robotStatus}
        currentMission={currentMission}
        lastUpdate={lastUpdate}
        isEmergency={isEmergency}
        onCancelMission={handleCancelMission}
        onEmergencyStop={handleEmergencyStop}
      />

      <SystemLog alerts={alerts} />
    </div>
  );
}

export default App;