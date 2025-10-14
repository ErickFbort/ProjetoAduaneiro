import { Terminal } from '../types/terminal';

// Dados dos terminais aéreos
export const TERMINALS_DATA: Terminal[] = [
  {
    id: 'CWB',
    name: 'CWB - Curitiba',
    status: 'Ativo',
    phone: '+55 47 3515.0802',
    operations: 'Import/Export',
    description: 'Terminal de Curitiba'
  },
  {
    id: 'GYN',
    name: 'GYN - Goiânia',
    status: 'Ativo',
    phone: '+55 62 3521.1234',
    operations: 'Import/Export',
    description: 'Terminal de Goiânia'
  },
  {
    id: 'REC',
    name: 'REC - Recife',
    status: 'Ativo',
    phone: '+55 81 3462.5678',
    operations: 'Import/Export',
    description: 'Terminal de Recife'
  },
  {
    id: 'VIX',
    name: 'VIX - Vitória',
    status: 'Ativo',
    phone: '+55 27 3333.9999',
    operations: 'Import/Export',
    description: 'Terminal de Vitória'
  },
  {
    id: 'NVT',
    name: 'NVT - Navegantes',
    status: 'Ativo',
    phone: '+55 47 3341.7777',
    operations: 'Import/Export',
    description: 'Terminal de Navegantes'
  }
];

// Configurações de status
export const TERMINAL_STATUS = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  MANUTENCAO: 'Manutenção'
} as const;

// Cores dos status
export const STATUS_COLORS = {
  [TERMINAL_STATUS.ATIVO]: {
    background: 'rgba(76, 175, 80, 0.2)',
    color: '#4caf50',
    border: 'rgba(76, 175, 80, 0.3)'
  },
  [TERMINAL_STATUS.INATIVO]: {
    background: 'rgba(244, 67, 54, 0.2)',
    color: '#f44336',
    border: 'rgba(244, 67, 54, 0.3)'
  },
  [TERMINAL_STATUS.MANUTENCAO]: {
    background: 'rgba(255, 152, 0, 0.2)',
    color: '#ff9800',
    border: 'rgba(255, 152, 0, 0.3)'
  }
} as const;
