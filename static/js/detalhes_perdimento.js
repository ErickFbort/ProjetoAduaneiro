// Módulo de Detalhes do Perdimento - Web Clientes
// Funcionalidades para visualização e edição de detalhes do perdimento

class DetalhesPerdimentoManager {
    constructor() {
        this.perdimentoId = null;
        this.perdimentoData = null;
        this.volumes = [];
        this.anexos = [];
        this.historico = [];
        
        this.init();
    }

    init() {
        this.loadPerdimentoData();
        this.bindEvents();
        this.loadVolumes();
        this.loadAnexos();
        this.loadHistorico();
    }

    bindEvents() {
        // Eventos dos botões
        document.getElementById('editarInfoModal').addEventListener('show.bs.modal', () => {
            this.preencherFormularioEdicao();
        });

        // Eventos dos inputs de volume para cálculo automático
        document.addEventListener('input', (e) => {
            if (e.target.closest('.add-volume-row')) {
                this.calcularValorTotal(e.target);
            }
        });
    }

    loadPerdimentoData() {
        // Obter ID do perdimento da URL ou localStorage
        const urlParams = new URLSearchParams(window.location.search);
        this.perdimentoId = urlParams.get('id') || localStorage.getItem('perdimentoId') || '160';
        
        // Dados simulados baseados na imagem
        this.perdimentoData = {
            id: this.perdimentoId,
            codigo: '160',
            dmcaProcesso: 'TAGF RP 159 0917900/0054/2024',
            consignatario: '',
            cnpjConsignatario: '',
            awbDsic: '99922001862',
            hawb: '',
            motivo: 'Abandono',
            observacao: 'CARGA COM AUTORIZAÇÃO DE TROCA PELA RFB, CARGA ORIGINAL ENTREGUE AO IMPORTADOR, RETORNOU AO ARMAZEM POIS FOI TROCADA NA ORIGEM E NÃO PERTENCIA A EMPRESA TRANE',
            peso: '150,000',
            volume: '2',
            entregaDireta: '',
            percentualEntrega: 0
        };

        this.preencherInformacoesGerais();
    }

    preencherInformacoesGerais() {
        document.getElementById('perdimentoCodigo').textContent = this.perdimentoData.codigo;
        document.getElementById('dmcaProcesso').textContent = this.perdimentoData.dmcaProcesso || '-';
        document.getElementById('consignatario').textContent = this.perdimentoData.consignatario || '-';
        document.getElementById('cnpjConsignatario').textContent = this.perdimentoData.cnpjConsignatario || '-';
        document.getElementById('awbDsic').textContent = this.perdimentoData.awbDsic;
        document.getElementById('hawb').textContent = this.perdimentoData.hawb || '-';
        document.getElementById('motivo').textContent = this.perdimentoData.motivo;
        document.getElementById('observacao').textContent = this.perdimentoData.observacao;
        document.getElementById('peso').textContent = this.perdimentoData.peso;
        document.getElementById('volume').textContent = this.perdimentoData.volume;
        document.getElementById('entregaDireta').textContent = this.perdimentoData.entregaDireta || '-';
    }

    preencherFormularioEdicao() {
        document.getElementById('editDmcaProcesso').value = this.perdimentoData.dmcaProcesso || '';
        document.getElementById('editConsignatario').value = this.perdimentoData.consignatario || '';
        document.getElementById('editCnpjConsignatario').value = this.perdimentoData.cnpjConsignatario || '';
        document.getElementById('editAwbDsic').value = this.perdimentoData.awbDsic || '';
        document.getElementById('editHawb').value = this.perdimentoData.hawb || '';
        document.getElementById('editMotivo').value = this.perdimentoData.motivo || '';
        document.getElementById('editObservacao').value = this.perdimentoData.observacao || '';
        document.getElementById('editPeso').value = this.perdimentoData.peso || '';
        document.getElementById('editVolume').value = this.perdimentoData.volume || '';
        document.getElementById('editEntregaDireta').value = this.perdimentoData.entregaDireta || '';
    }

    salvarInformacoes() {
        // Atualizar dados
        this.perdimentoData.dmcaProcesso = document.getElementById('editDmcaProcesso').value;
        this.perdimentoData.consignatario = document.getElementById('editConsignatario').value;
        this.perdimentoData.cnpjConsignatario = document.getElementById('editCnpjConsignatario').value;
        this.perdimentoData.awbDsic = document.getElementById('editAwbDsic').value;
        this.perdimentoData.hawb = document.getElementById('editHawb').value;
        this.perdimentoData.motivo = document.getElementById('editMotivo').value;
        this.perdimentoData.observacao = document.getElementById('editObservacao').value;
        this.perdimentoData.peso = document.getElementById('editPeso').value;
        this.perdimentoData.volume = document.getElementById('editVolume').value;
        this.perdimentoData.entregaDireta = document.getElementById('editEntregaDireta').value;

        // Atualizar interface
        this.preencherInformacoesGerais();

        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarInfoModal'));
        modal.hide();

        // Adicionar ao histórico
        this.adicionarHistorico('Informações Gerais', 'Informações gerais do perdimento foram alteradas');

        this.showNotification('Informações salvas com sucesso!', 'success');
    }

    loadVolumes() {
        // Dados simulados de volumes
        this.volumes = [
            {
                id: 1,
                sequencial: 1,
                ncm: '12345678',
                descricao: 'Produto de exemplo',
                paisOrigem: 'Brasil',
                paisProcedencia: 'Brasil',
                unidadeMedida: 'UN',
                quantidade: 10,
                valorUnitario: 100.00,
                valorTotal: 1000.00,
                quantidadeEntregue: 0,
                moedaNegociada: 'BRL'
            }
        ];

        this.renderVolumes();
    }

    renderVolumes() {
        const tbody = document.getElementById('volumesTableBody');
        
        // Limpar volumes existentes (exceto a linha de adição)
        const addRow = tbody.querySelector('.add-volume-row');
        tbody.innerHTML = '';
        
        // Renderizar volumes existentes
        this.volumes.forEach(volume => {
            const row = this.criarLinhaVolume(volume);
            tbody.appendChild(row);
        });
        
        // Adicionar linha de adição
        tbody.appendChild(addRow);
    }

    criarLinhaVolume(volume) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${volume.sequencial}</td>
            <td>${volume.ncm}</td>
            <td>${volume.descricao}</td>
            <td>${volume.paisOrigem}</td>
            <td>${volume.paisProcedencia}</td>
            <td>${volume.unidadeMedida}</td>
            <td>${volume.quantidade}</td>
            <td>R$ ${volume.valorUnitario.toFixed(2).replace('.', ',')}</td>
            <td>R$ ${volume.valorTotal.toFixed(2).replace('.', ',')}</td>
            <td>${volume.quantidadeEntregue}</td>
            <td>${volume.moedaNegociada}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="detalhesPerdimentoManager.removerVolume(${volume.id})" title="Remover">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        return row;
    }

    adicionarVolume() {
        const inputs = document.querySelectorAll('.add-volume-row input, .add-volume-row select');
        const dados = {};
        
        inputs.forEach(input => {
            const coluna = input.closest('td').previousElementSibling ? 
                Array.from(input.closest('tr').cells).indexOf(input.closest('td')) : 0;
            
            switch(coluna) {
                case 1: dados.ncm = input.value; break;
                case 2: dados.descricao = input.value; break;
                case 3: dados.paisOrigem = input.value; break;
                case 4: dados.paisProcedencia = input.value; break;
                case 5: dados.unidadeMedida = input.value; break;
                case 6: dados.quantidade = parseFloat(input.value) || 0; break;
                case 7: dados.valorUnitario = parseFloat(input.value) || 0; break;
                case 8: dados.valorTotal = parseFloat(input.value) || 0; break;
                case 9: dados.quantidadeEntregue = parseFloat(input.value) || 0; break;
                case 10: dados.moedaNegociada = input.value; break;
            }
        });

        // Validar campos obrigatórios
        if (!dados.ncm || !dados.descricao || !dados.quantidade || !dados.valorUnitario) {
            this.showNotification('Preencha todos os campos obrigatórios', 'error');
            return;
        }

        // Criar novo volume
        const novoVolume = {
            id: Date.now(),
            sequencial: this.volumes.length + 1,
            ncm: dados.ncm,
            descricao: dados.descricao,
            paisOrigem: dados.paisOrigem || '',
            paisProcedencia: dados.paisProcedencia || '',
            unidadeMedida: dados.unidadeMedida || '',
            quantidade: dados.quantidade,
            valorUnitario: dados.valorUnitario,
            valorTotal: dados.valorTotal || (dados.quantidade * dados.valorUnitario),
            quantidadeEntregue: dados.quantidadeEntregue || 0,
            moedaNegociada: dados.moedaNegociada || 'BRL'
        };

        this.volumes.push(novoVolume);
        this.renderVolumes();
        this.limparLinhaAdicao();
        this.atualizarPercentualEntrega();

        this.showNotification('Volume adicionado com sucesso!', 'success');
    }

    removerVolume(volumeId) {
        if (confirm('Tem certeza que deseja remover este volume?')) {
            this.volumes = this.volumes.filter(v => v.id !== volumeId);
            this.renderVolumes();
            this.atualizarPercentualEntrega();
            this.showNotification('Volume removido com sucesso!', 'success');
        }
    }

    calcularValorTotal(input) {
        const row = input.closest('tr');
        const quantidade = parseFloat(row.querySelector('input[placeholder="0"]').value) || 0;
        const valorUnitario = parseFloat(row.querySelector('input[placeholder="0,00"]').value) || 0;
        const valorTotalInput = row.querySelector('input[value="0,00"]');
        
        if (valorTotalInput) {
            valorTotalInput.value = (quantidade * valorUnitario).toFixed(2).replace('.', ',');
        }
    }

    limparLinhaAdicao() {
        const inputs = document.querySelectorAll('.add-volume-row input, .add-volume-row select');
        inputs.forEach(input => {
            if (input.type === 'number') {
                input.value = input.placeholder === '0' ? '' : '0,00';
            } else if (input.type === 'text') {
                input.value = '';
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            }
        });
    }

    atualizarPercentualEntrega() {
        if (this.volumes.length === 0) {
            document.querySelector('.badge.bg-success').textContent = 'Percentual de Entrega 0%';
            return;
        }

        const totalQuantidade = this.volumes.reduce((sum, v) => sum + v.quantidade, 0);
        const totalEntregue = this.volumes.reduce((sum, v) => sum + v.quantidadeEntregue, 0);
        const percentual = totalQuantidade > 0 ? Math.round((totalEntregue / totalQuantidade) * 100) : 0;

        document.querySelector('.badge.bg-success').textContent = `Percentual de Entrega ${percentual}%`;
    }

    loadAnexos() {
        // Dados simulados de anexos
        this.anexos = [];
        this.renderAnexos();
    }

    renderAnexos() {
        const container = document.getElementById('anexosContainer');
        
        if (this.anexos.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="text-center text-muted py-5">
                        <i class="fas fa-paperclip fa-3x mb-3"></i>
                        <p>Nenhum anexo encontrado</p>
                    </div>
                </div>
            `;
        } else {
            // Renderizar anexos existentes
            container.innerHTML = this.anexos.map(anexo => `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <i class="fas fa-file-pdf fa-2x text-danger me-3"></i>
                                <div class="flex-grow-1">
                                    <h6 class="card-title mb-1">${anexo.nome}</h6>
                                    <small class="text-muted">${anexo.tamanho}</small>
                                </div>
                                <button class="btn btn-sm btn-outline-danger" onclick="detalhesPerdimentoManager.removerAnexo(${anexo.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    adicionarAnexo() {
        // Simular upload de arquivo
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx,.jpg,.png';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const novoAnexo = {
                    id: Date.now(),
                    nome: file.name,
                    tamanho: this.formatarTamanho(file.size),
                    tipo: file.type
                };
                
                this.anexos.push(novoAnexo);
                this.renderAnexos();
                this.showNotification('Anexo adicionado com sucesso!', 'success');
            }
        };
        input.click();
    }

    removerAnexo(anexoId) {
        if (confirm('Tem certeza que deseja remover este anexo?')) {
            this.anexos = this.anexos.filter(a => a.id !== anexoId);
            this.renderAnexos();
            this.showNotification('Anexo removido com sucesso!', 'success');
        }
    }

    loadHistorico() {
        // Dados simulados de histórico
        this.historico = [
            {
                id: 1,
                acao: 'Perdimento Criado',
                descricao: 'Registro de perdimento criado pelo sistema',
                data: '15/01/2024 14:30',
                usuario: 'Sistema'
            },
            {
                id: 2,
                acao: 'Status Alterado',
                descricao: 'Status alterado para "Abandono"',
                data: '15/01/2024 15:45',
                usuario: 'João Silva'
            }
        ];

        this.renderHistorico();
    }

    renderHistorico() {
        const container = document.getElementById('historicoContainer');
        
        container.innerHTML = this.historico.map(item => `
            <div class="timeline-item">
                <div class="timeline-marker bg-primary"></div>
                <div class="timeline-content">
                    <h6 class="timeline-title">${item.acao}</h6>
                    <p class="timeline-text">${item.descricao}</p>
                    <small class="text-muted">${item.data} - ${item.usuario}</small>
                </div>
            </div>
        `).join('');
    }

    adicionarHistorico(acao, descricao) {
        const novoItem = {
            id: Date.now(),
            acao: acao,
            descricao: descricao,
            data: new Date().toLocaleString('pt-BR'),
            usuario: 'Usuário Atual'
        };

        this.historico.unshift(novoItem);
        this.renderHistorico();
    }

    formatarTamanho(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showNotification(message, type = 'info') {
        // Implementar sistema de notificações se necessário
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Funções globais
function voltarParaLista() {
    window.location.href = '/web-clientes/perdimento';
}

function editarInformacoesGerais() {
    const modal = new bootstrap.Modal(document.getElementById('editarInfoModal'));
    modal.show();
}

function salvarInformacoes() {
    if (window.detalhesPerdimentoManager) {
        window.detalhesPerdimentoManager.salvarInformacoes();
    }
}

function adicionarVolume() {
    if (window.detalhesPerdimentoManager) {
        window.detalhesPerdimentoManager.adicionarVolume();
    }
}

function adicionarAnexo() {
    if (window.detalhesPerdimentoManager) {
        window.detalhesPerdimentoManager.adicionarAnexo();
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.detalhesPerdimentoManager = new DetalhesPerdimentoManager();
});
