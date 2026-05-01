import { describe, it, expect } from 'vitest';
import { sortMissions } from './missionLogic';

describe('Logica de Ordenacao de Missoes (Fila de Prioridade) - Testes Rigorosos / Edge Cases', () => {

  // Testes Básicos já existentes
  it('Deve colocar a missao "em_execucao" sempre no topo', () => {
    const missions = [
      { id: 1, status: 'pendente', prioridade: 1, distancia: 10 },
      { id: 2, status: 'em_execucao', prioridade: 3, distancia: 50 },
    ];
    const sorted = sortMissions(missions);
    expect(sorted[0].id).toBe(2);
  });

  it('Deve ordenar corretamente por Prioridade (1 > 2 > 3)', () => {
    const missions = [
      { id: 1, status: 'pendente', prioridade: 3, distancia: 10 },
      { id: 2, status: 'pendente', prioridade: 1, distancia: 10 },
      { id: 3, status: 'pendente', prioridade: 2, distancia: 10 },
    ];
    const sorted = sortMissions(missions);
    expect(sorted[0].id).toBe(2);
    expect(sorted[1].id).toBe(3);
    expect(sorted[2].id).toBe(1);
  });

  it('Deve desempatar pela menor distancia se a prioridade for igual', () => {
    const missions = [
      { id: 1, status: 'pendente', prioridade: 1, distancia: 50 },
      { id: 2, status: 'pendente', prioridade: 1, distancia: 20 },
    ];
    const sorted = sortMissions(missions);
    expect(sorted[0].id).toBe(2);
  });

  // Novos Testes: Cenários Complexos e Potenciais Quebras
  describe('Cenários de Interceptação (Preemption) e Emergência', () => {
    
    it('Deve tratar "cancelada_por_emergencia" com a MESMA urgência de "pendente" para re-execução', () => {
      // Uma P2 cancelada por emergência deve voltar ANTES de uma P3 pendente normal
      const missions = [
        { id: 1, status: 'pendente', prioridade: 3, distancia: 10 },
        { id: 2, status: 'cancelada_por_emergencia', prioridade: 2, distancia: 50 },
      ];
      const sorted = sortMissions(missions);
      expect(sorted[0].id).toBe(2); // A P2 cancelada ganha da P3
    });

    it('Deve garantir que status inativos afundem, mas P1 ativa ganhe de TUDO', () => {
      // Teste rigoroso para garantir que o sistema NUNCA confunda uma P1 real com um zumbi
      const missions = [
        { id: 1, status: 'falha', prioridade: 1, distancia: 10 },       // Zumbi (P1 falha)
        { id: 2, status: 'concluida', prioridade: 1, distancia: 10 },   // Zumbi (P1 concluida)
        { id: 3, status: 'pendente', prioridade: 3, distancia: 50 },    // P3 normal
        { id: 4, status: 'pendente', prioridade: 1, distancia: 9999 },  // P1 REAL (longe)
        { id: 5, status: 'cancelada', prioridade: 1, distancia: 10 },   // Zumbi (P1 cancelada)
      ];
      
      const sorted = sortMissions(missions);
      
      // O sistema DEVE identificar a ID 4 como a única P1 válida, ignorando a distância ruim
      expect(sorted[0].id).toBe(4); 
      // O ID 3 (P3 válida) vem logo depois
      expect(sorted[1].id).toBe(3);
      // Os zumbis P1 devem ficar todos no final
      expect(['falha', 'concluida', 'cancelada']).toContain(sorted[2].status);
      expect(['falha', 'concluida', 'cancelada']).toContain(sorted[3].status);
      expect(['falha', 'concluida', 'cancelada']).toContain(sorted[4].status);
    });

  });

  describe('Cenários Caóticos de Empate Múltiplo', () => {
    
    it('Tudo empatado (Mesmo Status, Mesma Prioridade, Mesma Distância)', () => {
      // Deve manter a estabilidade do Array original se não houver critério de desempate
      const missions = [
        { id: 1, status: 'pendente', prioridade: 2, distancia: 30 },
        { id: 2, status: 'pendente', prioridade: 2, distancia: 30 },
        { id: 3, status: 'pendente', prioridade: 2, distancia: 30 },
      ];
      const sorted = sortMissions(missions);
      expect(sorted.length).toBe(3);
      // Se a ordenação é estável, a ordem original é preservada
      expect(sorted[0].id).toBe(1);
      expect(sorted[1].id).toBe(2);
      expect(sorted[2].id).toBe(3);
    });

    it('Inversão Total: Pior caso vs Melhor caso (Garantindo que P1 ativa sempre ganhe)', () => {
      const missions = [
        { id: 1, status: 'concluida', prioridade: 1, distancia: 1 }, // P1 inativa (zumbi)
        { id: 2, status: 'pendente', prioridade: 1, distancia: 9999 }, // P1 ATIVA (longe)
        { id: 3, status: 'em_execucao', prioridade: 3, distancia: 5000 } // P3 executando
      ];
      
      const sorted = sortMissions(missions);
      expect(sorted[0].id).toBe(3); // Executando SEMPRE no topo absoluto
      expect(sorted[1].id).toBe(2); // P1 ativa vem logo atrás, ignorando a distância
      expect(sorted[2].id).toBe(1); // P1 inativa fica no fundo
    });

  });
});