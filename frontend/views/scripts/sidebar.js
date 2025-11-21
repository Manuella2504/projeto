(function () {

    const paginasSemSidebar = ["login.html", "cadastro.html"];

    const paginaAtual = window.location.pathname.split("/").pop();

    if (paginasSemSidebar.includes(paginaAtual)) return;

    const estilo = `
        #sidebar {
            position: fixed;
            left: 0;
            top: 0;
            width: 230px;
            height: 100%;
            background: #1b263b;
            padding-top: 30px;
            box-shadow: 2px 0 10px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            z-index: 999;
        }
        #sidebar h2 {
            color: white;
            text-align: center;
            margin-bottom: 30px;
            font-size: 20px;
        }
        #sidebar a {
            padding: 14px 20px;
            text-decoration: none;
            color: #d9d9d9;
            display: block;
            font-size: 16px;
            transition: 0.2s;
        }
        #sidebar a:hover {
            background: #415a77;
            color: white;
        }
        #logout {
            padding: 14px 26px;
            border-radius: 10px;
            font-size: 1em;
            background: linear-gradient(135deg, #0d47a1 0%, #01579b 100%);
            color: #FFFFFF;
            border: 2px solid #0d47a1;
            align-items: center;
   
        }
        .conteudo {
            margin-left: 260px;
            padding: 20px;
        }
        @media (max-width: 768px) {
            #sidebar {
                width: 180px;
            }
            .conteudo {
                margin-left: 190px;
            }
        }
    `;

    const styleTag = document.createElement("style");
    styleTag.innerHTML = estilo;
    document.head.appendChild(styleTag);

    const sidebar = `
        <div id="sidebar">
            <h2>SAEPSaúde</h2>

            <a href="perfil.html">Meu Perfil</a>
            <a href="atividades.html">Atividades</a>
            <a href="criar_atividade.html">Criar Atividade</a>

            <a id="logout" href="#">Sair</a>
        </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", sidebar);

    const logout = document.getElementById("logout");
    if (logout) {
        logout.onclick = function () {
            localStorage.removeItem("token");
            window.location.href = "login.html";
        };
    }

    const conteudoExiste = document.querySelector(".conteudo");
    if (!conteudoExiste) {
        const wrapper = document.createElement("div");
        wrapper.className = "conteudo";

        while (document.body.children.length > 1) {
            wrapper.appendChild(document.body.children[1]);
        }

        document.body.appendChild(wrapper);
    }

})();
