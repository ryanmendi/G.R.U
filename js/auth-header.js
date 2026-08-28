// auth-header.js — Gerencia o botão de Login/Usuário no cabeçalho
// Incluir em todas as páginas que tenham o header com .actions

(function () {
    const ADMIN_EMAIL = 'grunoticias01@gmail.com';

    function injectHeaderButton() {
        const actions = document.querySelector('.actions');
        if (!actions) return;

        if (document.getElementById('auth-header-container')) return;

        // Cria o container do botão de autenticação
        const authContainer = document.createElement('div');
        authContainer.id = 'auth-header-container';
        authContainer.style.display = 'flex';
        authContainer.style.alignItems = 'center';

        // Botão padrão: Login (mostrado antes de verificar estado)
        authContainer.innerHTML = `
            <a href="login.html" class="btn-header-login" id="btn-header-login" title="Área do Editor">
                <i class="fa-solid fa-user"></i>
                <span>Entrar</span>
            </a>
        `;

        // Insere antes do toggle de tema
        const toggleBtn = actions.querySelector('#darkToggle');
        if (toggleBtn) {
            actions.insertBefore(authContainer, toggleBtn);
        } else {
            actions.prepend(authContainer);
        }

        // Verifica se Firebase Auth está disponível
        if (typeof firebase === 'undefined' || typeof firebase.auth !== 'function') {
            return; // Sem Firebase, mantém botão de login simples
        }

        firebase.auth().onAuthStateChanged(function (user) {
            if (!user) {
                // Deslogado → Botão de Login
                authContainer.innerHTML = `
                    <a href="login.html" class="btn-header-login" title="Área do Editor">
                        <i class="fa-solid fa-user"></i>
                        <span>Entrar</span>
                    </a>
                `;
            } else if (user.email === ADMIN_EMAIL) {
                // Logado como editor → Dropdown com opções
                const initials = user.email.substring(0, 2).toUpperCase();
                authContainer.innerHTML = `
                    <div class="user-header-dropdown">
                        <button class="btn-header-user" aria-label="Menu do editor">
                            <span class="avatar-circle"><i class="fa-solid fa-pen-nib"></i></span>
                            <span>Editor</span>
                            <i class="fa-solid fa-chevron-down" style="font-size:10px; opacity:0.7;"></i>
                        </button>
                        <div class="user-header-dropdown-menu">
                            <div class="menu-user-info">
                                <span>Conectado como</span>
                                <strong title="${user.email}">${user.email}</strong>
                            </div>
                            <a href="admin.html">
                                <i class="fa-solid fa-cubes" style="color:var(--sky-500);"></i>
                                Painel da Redação
                            </a>
                            <div class="menu-sep"></div>
                            <button class="logout-btn" id="logout-header-btn">
                                <i class="fa-solid fa-right-from-bracket"></i>
                                Sair da conta
                            </button>
                        </div>
                    </div>
                `;

                document.getElementById('logout-header-btn').addEventListener('click', function () {
                    firebase.auth().signOut().then(function () {
                        window.location.reload();
                    });
                });

                const toggle = authContainer.querySelector('.btn-header-user');
                const dropdown = authContainer.querySelector('.user-header-dropdown-menu');
                if (toggle && dropdown) {
                    toggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dropdown.classList.toggle('open');
                    });
                }
            } else {
                // Usuário logado, mas não é o editor → Botão de usuário simples
                authContainer.innerHTML = `
                    <div class="user-header-dropdown">
                        <button class="btn-header-user" aria-label="Menu do usuário">
                            <span class="avatar-circle"><i class="fa-solid fa-user"></i></span>
                            <span>Usuário</span>
                            <i class="fa-solid fa-chevron-down" style="font-size:10px; opacity:0.7;"></i>
                        </button>
                        <div class="user-header-dropdown-menu">
                            <div class="menu-user-info">
                                <span>Conectado como</span>
                                <strong title="${user.email}">${user.email}</strong>
                            </div>
                            <div class="menu-sep"></div>
                            <button class="logout-btn" id="logout-header-btn">
                                <i class="fa-solid fa-right-from-bracket"></i>
                                Sair
                            </button>
                        </div>
                    </div>
                `;

                document.getElementById('logout-header-btn').addEventListener('click', function () {
                    firebase.auth().signOut().then(function () {
                        window.location.reload();
                    });
                });

                const toggle = authContainer.querySelector('.btn-header-user');
                const dropdown = authContainer.querySelector('.user-header-dropdown-menu');
                if (toggle && dropdown) {
                    toggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dropdown.classList.toggle('open');
                    });
                }
            }
        });

        document.addEventListener('click', (e) => {
            const openMenu = document.querySelector('.user-header-dropdown-menu.open');
            if (!openMenu) return;
            const container = openMenu.closest('.user-header-dropdown');
            if (container && !container.contains(e.target)) {
                openMenu.classList.remove('open');
            }
        });
    }

    // Espera o DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeaderButton);
    } else {
        injectHeaderButton();
    }
})();
