(function () {

    const paginasSemHeader = []; 
    const paginaAtual = window.location.pathname.split("/").pop();

    if (paginasSemHeader.includes(paginaAtual)) return;

    const estilo = `
        body {
            padding-top: 70px;
        }

        #header {
            width: 100%;
            background: #1b263b;
            height: 70px;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 999;
        }

        #logo {
            color: white;
            font-size: 22px;
            font-weight: bold;
            text-decoration: none;
        }

        nav {
            display: flex;
            gap: 18px;
        }

        nav a {
            color: #d9d9d9;
            text-decoration: none;
            font-size: 16px;
            white-space: nowrap;
        }

        nav a:hover {
            color: white;
        }

        #menu-btn {
            display: none;
            font-size: 26px;
            color: white;
            cursor: pointer;
            user-select: none;
        }

        #menu-mobile {
            display: none;
            flex-direction: column;
            background: #1b263b;
            width: 100%;
            padding: 10px 0;
            position: fixed;
            top: 70px;
            left: 0;
            z-index: 998;
        }

        #menu-mobile a {
            padding: 12px 20px;
            color: #d9d9d9;
            text-decoration: none;
            font-size: 18px;
        }

        #menu-mobile a:hover {
            background: #415a77;
            color: white;
        }

        nav a, #menu-mobile a {
            overflow: hidden;
            text-overflow: ellipsis;
        }

        @media (max-width: 860px) {
            nav a {
                font-size: 14px;
            }
        }

        @media (max-width: 780px) {
            nav {
                display: none;
            }

            #menu-btn {
                display: block;
            }
        }
    `;

    const styleTag = document.createElement("style");
    styleTag.innerHTML = estilo;
    document.head.appendChild(styleTag);

    const headerHTML = `
        <div id="header">
            <a id="logo" href="index.html">SAEPSaúde</a>

            <div id="menu-btn">☰</div>

            <nav id="menu-desktop">
                <a href="index.html">Início</a>
                <a href="login.html">Login</a>
                <a href="cadastro.html">Cadastro</a>
            </nav>
        </div>

        <div id="menu-mobile">
            <a href="index.html">Início</a>
            <a href="login.html">Login</a>
            <a href="cadastro.html">Cadastro</a>
        </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", headerHTML);

    const botao = document.getElementById("menu-btn");
    const menuMobile = document.getElementById("menu-mobile");

    botao.addEventListener("click", () => {
        const ativo = menuMobile.style.display === "flex";
        menuMobile.style.display = ativo ? "none" : "flex";
    });

})();
