document.addEventListener('DOMContentLoaded', function() {
    // Lógica para alternar entre os Módulos Principais (barra lateral)
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const homeLink = document.querySelector('.top-bar .home-link');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove a classe 'active' de todos os itens e seções
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(content => content.classList.remove('active'));

            // Ativa o item e a seção correspondente
            item.classList.add('active');
            const targetContentId = item.getAttribute('data-content') + '-content';
            document.getElementById(targetContentId).classList.add('active');

            // Atualiza o título da barra superior
            const newTitle = item.getAttribute('data-title');
            homeLink.textContent = `Paclog - ${newTitle}`;
        });
    });

    // Lógica para alternar entre os Sub-Módulos (botões de sub-menu)
    const subMenuButtons = document.querySelectorAll('.sub-menu-btn');
    const subContentSections = document.querySelectorAll('.sub-content-section');

    subMenuButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' dos botões e sub-seções
            subMenuButtons.forEach(btn => btn.classList.remove('active'));
            subContentSections.forEach(content => content.classList.remove('active'));

            // Adiciona a classe 'active' ao botão clicado e ao conteúdo correspondente
            button.classList.add('active');
            const targetSubContentId = button.getAttribute('data-sub-content') + '-content';
            document.getElementById(targetSubContentId).classList.add('active');
        });
    });

    // Lógica para o Módulo de USUÁRIOS
    const addUserBtn = document.getElementById('add-user-btn');
    const cancelAddUserBtn = document.getElementById('cancel-add-btn');
    const userListView = document.getElementById('user-list-view');
    const addUserForm = document.getElementById('add-user-form');
    const formTitle = document.getElementById('form-title');
    const userTableBody = document.querySelector('.user-table tbody');
    const userSearchInput = document.getElementById('user-search-input');
    const searchUserBtn = document.getElementById('search-user-btn');

    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            userListView.style.display = 'none';
            addUserForm.style.display = 'block';
            formTitle.textContent = 'Adicionar Novo Usuário';
            addUserForm.classList.remove('form-edit-mode');
        });
    }

    if (cancelAddUserBtn) {
        cancelAddUserBtn.addEventListener('click', () => {
            userListView.style.display = 'block';
            addUserForm.style.display = 'none';
            document.getElementById('user-form').reset();
            addUserForm.classList.remove('form-edit-mode');
        });
    }

    if (userTableBody) {
        userTableBody.addEventListener('click', function(event) {
            const target = event.target.closest('.action-link');
            if (!target) return;
            event.preventDefault();

            const row = target.closest('tr');
            const userName = row.querySelector('td:first-child').textContent;
            const userCPF = row.querySelector('td:nth-child(2)').textContent;
            const userEmail = row.querySelector('td:nth-child(3)').textContent;

            if (target.classList.contains('edit')) {
                console.log(`Você clicou em EDITAR o usuário: ${userName}`);
                document.getElementById('name').value = userName;
                document.getElementById('cpf').value = userCPF;
                document.getElementById('email').value = userEmail;

                formTitle.textContent = 'Editar Usuário';
                addUserForm.classList.add('form-edit-mode');
                userListView.style.display = 'none';
                addUserForm.style.display = 'block';

            } else if (target.classList.contains('block')) {
                const statusCell = row.querySelector('.status-active, .status-blocked');

                if (statusCell.classList.contains('status-active')) {
                    statusCell.textContent = 'Bloqueado';
                    statusCell.classList.remove('status-active');
                    statusCell.classList.add('status-blocked');
                    alert(`Usuário ${userName} foi BLOQUEADO.`);
                } else {
                    statusCell.textContent = 'Ativo';
                    statusCell.classList.remove('status-blocked');
                    statusCell.classList.add('status-active');
                    alert(`Usuário ${userName} foi ATIVADO.`);
                }
            }
        });
    }

    if (searchUserBtn) {
        searchUserBtn.addEventListener('click', () => {
            const searchTerm = userSearchInput.value.toLowerCase();
            const rows = userTableBody.querySelectorAll('tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Lógica para o Módulo de VEÍCULOS
    const addVehicleBtn = document.getElementById('add-vehicle-btn');
    const cancelVehicleBtn = document.getElementById('cancel-vehicle-btn');
    const vehicleListView = document.getElementById('vehicle-list-view');
    const addVehicleForm = document.getElementById('add-vehicle-form');
    const vehicleFormTitle = document.getElementById('vehicle-form-title');
    const vehicleTableBody = document.querySelector('.vehicle-table tbody');
    const vehicleSearchInput = document.getElementById('vehicle-search-input');
    const searchVehicleBtn = document.getElementById('search-vehicle-btn');

    if (addVehicleBtn) {
        addVehicleBtn.addEventListener('click', () => {
            vehicleListView.style.display = 'none';
            addVehicleForm.style.display = 'block';
            vehicleFormTitle.textContent = 'Adicionar Novo Veículo';
            document.getElementById('vehicle-form').reset();
        });
    }

    if (cancelVehicleBtn) {
        cancelVehicleBtn.addEventListener('click', () => {
            vehicleListView.style.display = 'block';
            addVehicleForm.style.display = 'none';
        });
    }

    if (vehicleTableBody) {
        vehicleTableBody.addEventListener('click', function(event) {
            const target = event.target.closest('.action-link');
            if (!target) return;
            event.preventDefault();

            const row = target.closest('tr');
            const vehiclePlaca = row.querySelector('td:first-child').textContent;
            const vehicleTipo = row.querySelector('td:nth-child(2)').textContent;
            const vehicleModelo = row.querySelector('td:nth-child(3)').textContent;
            const statusCell = row.querySelector('td:nth-child(4)');

            if (target.classList.contains('edit')) {
                console.log(`Você clicou em EDITAR o veículo: ${vehiclePlaca}`);
                document.getElementById('placa').value = vehiclePlaca;
                document.getElementById('tipo').value = vehicleTipo;
                document.getElementById('modelo').value = vehicleModelo;
                vehicleFormTitle.textContent = 'Editar Veículo';
                vehicleListView.style.display = 'none';
                addVehicleForm.style.display = 'block';

            } else if (target.classList.contains('block')) {
                if (statusCell.classList.contains('status-active')) {
                    statusCell.textContent = 'Manutenção';
                    statusCell.classList.remove('status-active');
                    statusCell.classList.add('status-maintenance');
                    alert(`O veículo ${vehiclePlaca} foi movido para Manutenção.`);
                } else if (statusCell.classList.contains('status-maintenance')) {
                    statusCell.textContent = 'Inativo';
                    statusCell.classList.remove('status-maintenance');
                    statusCell.classList.add('status-inactive');
                    alert(`O veículo ${vehiclePlaca} foi INATIVADO.`);
                } else {
                    statusCell.textContent = 'Ativo';
                    statusCell.classList.remove('status-inactive');
                    statusCell.classList.add('status-active');
                    alert(`O veículo ${vehiclePlaca} foi ATIVADO.`);
                }
            }
        });
    }

    if (searchVehicleBtn) {
        searchVehicleBtn.addEventListener('click', () => {
            const searchTerm = vehicleSearchInput.value.toLowerCase();
            const rows = vehicleTableBody.querySelectorAll('tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Lógica para o Módulo de ENTIDADES
    const addEntityBtn = document.getElementById('add-entity-btn');
    const cancelEntityBtn = document.getElementById('cancel-entity-btn');
    const entityListView = document.getElementById('entity-list-view');
    const addEntityForm = document.getElementById('add-entity-form');
    const entityFormTitle = document.getElementById('entity-form-title');
    const entityTableBody = document.querySelector('.entity-table tbody');
    const entitySearchInput = document.getElementById('entity-search-input');
    const searchEntityBtn = document.getElementById('search-entity-btn');

    if (addEntityBtn) {
        addEntityBtn.addEventListener('click', () => {
            entityListView.style.display = 'none';
            addEntityForm.style.display = 'block';
            entityFormTitle.textContent = 'Adicionar Nova Entidade';
            document.getElementById('entity-form').reset();
        });
    }

    if (cancelEntityBtn) {
        cancelEntityBtn.addEventListener('click', () => {
            entityListView.style.display = 'block';
            addEntityForm.style.display = 'none';
        });
    }

    if (entityTableBody) {
        entityTableBody.addEventListener('click', function(event) {
            const target = event.target.closest('.action-link');
            if (!target) return;
            event.preventDefault();

            const row = target.closest('tr');
            const entityName = row.querySelector('td:first-child').textContent;
            const entityCNPJ = row.querySelector('td:nth-child(2)').textContent;
            const entityType = row.querySelector('td:nth-child(3)').textContent;
            const entityStatusCell = row.querySelector('td:nth-child(4)');

            if (target.classList.contains('edit')) {
                console.log(`Você clicou em EDITAR a entidade: ${entityName}`);
                document.getElementById('entity-name').value = entityName;
                document.getElementById('cnpj').value = entityCNPJ;
                document.getElementById('entity-type').value = entityType;
                entityFormTitle.textContent = 'Editar Entidade';
                entityListView.style.display = 'none';
                addEntityForm.style.display = 'block';
            } else if (target.classList.contains('block')) {
                if (entityStatusCell.classList.contains('status-active')) {
                    entityStatusCell.textContent = 'Inativa';
                    entityStatusCell.classList.remove('status-active');
                    entityStatusCell.classList.add('status-blocked');
                    alert(`A entidade ${entityName} foi INATIVADA.`);
                } else {
                    entityStatusCell.textContent = 'Ativa';
                    entityStatusCell.classList.remove('status-blocked');
                    entityStatusCell.classList.add('status-active');
                    alert(`A entidade ${entityName} foi ATIVADA.`);
                }
            }
        });
    }

    if (searchEntityBtn) {
        searchEntityBtn.addEventListener('click', () => {
            const searchTerm = entitySearchInput.value.toLowerCase();
            const rows = entityTableBody.querySelectorAll('tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Código para alternar os módulos (já existe)

    const sidebar = document.getElementById('sidebar');

    sidebar.addEventListener('mouseenter', () => {
        sidebar.classList.remove('collapsed');
    });

    sidebar.addEventListener('mouseleave', () => {
        sidebar.classList.add('collapsed');
    });

    // Inicia a barra lateral recolhida ao carregar a página
    sidebar.classList.add('collapsed');
});