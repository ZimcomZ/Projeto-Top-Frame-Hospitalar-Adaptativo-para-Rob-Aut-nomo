export function sortMissions(missions) {
  return [...missions].sort((a, b) => {
    // 1. O que está em execução fica no topo
    if (a.status === "em_execucao") return -1;
    if (b.status === "em_execucao") return 1;

    // 2. O que não é pendente nem cancelada_por_emergencia vai pro final
    const isActive = (s) => s === "pendente" || s === "cancelada_por_emergencia";
    if (!isActive(a.status) && isActive(b.status)) return 1;
    if (isActive(a.status) && !isActive(b.status)) return -1;

    // 3. Ordena por prioridade (1 é mais urgente que 3)
    if (a.prioridade !== b.prioridade) {
      return a.prioridade - b.prioridade;
    }

    // 4. Desempate: Menor distância primeiro
    return a.distancia - b.distancia;
  });
}