(function () {

    const paginasSemSidebar = ["login.html", "cadastro.html", "index.html"];
    const paginaAtual = window.location.pathname.split("/").pop();
    if (paginasSemSidebar.includes(paginaAtual)) return;


    const sidebarAntiga = document.getElementById("profile-column");
    if (sidebarAntiga) sidebarAntiga.remove();

    const API = "http://localhost:3000";
    const token = localStorage.getItem("token");

    const estilo = `
        :root {
            --sidebar-bg: #333333;
            --text-color: #FFFFFF;
            --accent-color: #483DAD; /* Cor roxa da referência */
        }

        body {
            margin: 0;
            padding-left: 260px; /* Espaço para a sidebar */
            font-family: 'Inter', sans-serif;
            background-color: #f4f4f4;
        }

        /* Sidebar Container */
        #sidebar-container {
            position: fixed;
            left: 0;
            top: 0;
            width: 250px;
            height: 100vh;
            background-color: var(--sidebar-bg);
            color: var(--text-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 30px 15px;
            box-shadow: 4px 0 10px rgba(0,0,0,0.1);
            z-index: 1000;
        }

        /* Perfil */
        .sidebar-profile {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            width: 100%;
            margin-bottom: 20px;
        }

        .sidebar-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--text-color);
            margin-bottom: 10px;
            background-color: #ccc;
        }

        .sidebar-name {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 5px;
        }

        /* Estatísticas */
        .sidebar-stats {
            display: flex;
            justify-content: space-around;
            width: 100%;
            margin: 20px 0;
            padding: 15px 0;
            border-top: 1px solid #555;
            border-bottom: 1px solid #555;
        }

        .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .stat-number {
            font-size: 1.4rem;
            font-weight: bold;
            color: #fff;
        }

        .stat-label {
            font-size: 0.8rem;
            color: #ccc;
            text-transform: uppercase;
        }

        /* Botão Criar */
        .btn-criar {
            width: 100%;
            padding: 12px;
            background-color: transparent;
            border: 2px solid #FFFFFF;
            color: #FFFFFF;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.3s;
            text-decoration: none;
            text-align: center;
            display: block;
            margin-top: 10px;
        }

        .btn-criar:hover {
            background-color: #FFFFFF;
            color: var(--sidebar-bg);
        }

        .btn-criar.disabled {
            opacity: 0.5;
            pointer-events: none;
            cursor: not-allowed;
        }

        /* Rodapé */
        .sidebar-footer {
            margin-top: auto; /* Empurra para o final */
            text-align: center;
            font-size: 0.8rem;
            color: #ccc;
            width: 100%;
        }

        .social-icons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 10px 0;
        }

        .social-icons img {
            width: 20px;
            height: 20px;
            filter: invert(1); /* Deixa ícones brancos */
            cursor: pointer;
        }

        /* Responsividade */
        @media (max-width: 768px) {
            #sidebar-container {
                width: 80px;
                padding: 20px 5px;
            }
            body { padding-left: 80px; }
            .sidebar-name, .stat-label, .btn-criar span, .sidebar-footer p {
                display: none;
            }
            .sidebar-avatar { width: 50px; height: 50px; }
            .sidebar-stats { flex-direction: column; gap: 10px; }
            .btn-criar { border: none; font-size: 24px; }
            .btn-criar::before { content: '+'; }
        }
    `;

    const styleTag = document.createElement("style");
    styleTag.innerHTML = estilo;
    document.head.appendChild(styleTag);

    // 3. HTML da Sidebar
    const sidebarHTML = `
        <aside id="sidebar-container">
            <!-- Perfil -->
            <div class="sidebar-profile">
                <img id="sb-avatar" src="assets/images/SAEPSaude.png" class="sidebar-avatar" alt="Avatar">
                <p id="sb-nome" class="sidebar-name">Visitante</p>
            </div>

            <!-- Estatísticas -->
            <div class="sidebar-stats">
                <div class="stat-item">
                    <span id="sb-total-atividades" class="stat-number">0</span>
                    <span class="stat-label">Atividades</span>
                </div>
                <div class="stat-item">
                    <span id="sb-total-calorias" class="stat-number">0</span>
                    <span class="stat-label">Calorias</span>
                </div>
            </div>

            <!-- Botão -->
            <a id="sb-btn-criar" href="criar_atividade.html" class="btn-criar disabled">
                <span>Criar Atividade</span>
            </a>
            
            <!-- Botão Home -->
             <a href="atividades.html" class="btn-criar" style="margin-top: 10px; border: none; color: #aaa; font-size: 0.9em;">
                <span> Home</span>
            </a>

            <!-- Rodapé -->
            <div class="sidebar-footer">
                <p>SAEPSaúde</p>
                <div class="social-icons">
                    <img src="assets/icons/Instagram.svg" alt="IG" onerror="this.style.display='none'">
                    <img src="assets/icons/Twitter.svg" alt="TW" onerror="this.style.display='none'">
                    <img src="assets/icons/TikTok.svg" alt="TK" onerror="this.style.display='none'">
                </div>
                <p>Copyright-2025</p>
                
                <a href="#" id="sb-logout" style="color: #ff6b6b; font-size: 0.8em; margin-top: 15px; display:block;">Sair</a>
            </div>
        </aside>
    `;

    document.body.insertAdjacentHTML("afterbegin", sidebarHTML);

    // 4. Lógica: Buscar dados e preencher
    async function carregarDadosSidebar() {
        const avatarImg = document.getElementById("sb-avatar");
        const nomeTxt = document.getElementById("sb-nome");
        const btnCriar = document.getElementById("sb-btn-criar");
        const logoutBtn = document.getElementById("sb-logout");

        if (!token) {
            logoutBtn.style.display = "none";
o
        }

        try {

            btnCriar.classList.remove("disabled");
            
            // Busca dados do perfil
            const resp = await fetch(`${API}/usuarios/perfil`, {
                headers: { "Authorization": "Bearer " + token }
            });

            if (resp.ok) {
                const dados = await resp.json();

                // Preenche Nome
                nomeTxt.innerText = dados.nome_usuario || "Usuário";

                // Preenche Avatar com fallback seguro
                const fotoPadrao = "assets/images/SAEPSaude.png";
                const fotoWeb = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                
                if (dados.avatar_url && dados.avatar_url.length > 5) {
                    avatarImg.src = dados.avatar_url;
                } else {
                    avatarImg.src = fotoPadrao;
                }

                avatarImg.onerror = function() {
                    if(this.src.includes(fotoPadrao)) this.src = fotoWeb;
                    else this.src = fotoPadrao;
                    this.onerror = null;
                };


                document.getElementById("sb-total-atividades").innerText = dados.total_atividades || 0;
                document.getElementById("sb-total-calorias").innerText = dados.total_calorias || 0;
            }
        } catch (e) {
            console.error("Erro sidebar:", e);
        }


        logoutBtn.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            window.location.href = "login.html";
        };
    }


    carregarDadosSidebar();

})();