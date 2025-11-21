(function validarLogin() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }
})();

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}

let paginaAtual = 1;
let tipoFiltro = "";
const API = "http://localhost:3000";
const FOTO_PADRAO = "assets/images/SAEPSaude.png"; 


async function carregarUsuario() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const resp = await fetch(`${API}/usuarios/perfil`, {
            headers: { "Authorization": "Bearer " + token }
        });

        if (!resp.ok) {
            if(resp.status === 401 || resp.status === 403) logout();
            return;
        }

        const dados = await resp.json();


        document.getElementById("user-name").innerText = dados.nome_usuario || "Usuário";
        
        const avatarImg = document.getElementById("user-avatar");
        

        if (dados.avatar_url && dados.avatar_url.trim() !== "") {
            avatarImg.src = dados.avatar_url;
        } else {
            avatarImg.src = FOTO_PADRAO;
        }
        

        avatarImg.onerror = function() {
            this.onerror = null; 
            this.src = FOTO_PADRAO;
        };

    } catch (e) {
        console.error("Erro ao carregar perfil:", e);
    }
}

async function carregarContadores() {
    const token = localStorage.getItem("token");

    try {
        const resp = await fetch(`${API}/atividades?pagina=1`, {
            headers: token ? { "Authorization": "Bearer " + token } : {}
        });

        const atividades = await resp.json();

        let totalCalorias = 0;
        atividades.forEach(a => totalCalorias += Number(a.calorias));

        document.getElementById("qtd-atividades-empresa").innerText = atividades.length;
        document.getElementById("qtd-calorias-empresa").innerText = totalCalorias;
    } catch (e) {
        console.error("Erro contadores:", e);
    }
}

async function carregarAtividades(pagina = 1) {
    paginaAtual = pagina;
    const token = localStorage.getItem("token");

    const url = new URL(`${API}/atividades`);
    url.searchParams.append("pagina", paginaAtual);
    if (tipoFiltro) url.searchParams.append("tipo", tipoFiltro);

    const resp = await fetch(url, {
        headers: token ? { "Authorization": "Bearer " + token } : {}
    });

    const atividades = await resp.json();
    const lista = document.getElementById("activities-list");
    lista.innerHTML = "";

    atividades.forEach(a => {
        const card = document.createElement("div");
        card.classList.add("activity-card");

  
        const avatarSrc = (a.avatar_url && a.avatar_url.trim() !== "") ? a.avatar_url : FOTO_PADRAO;

      
        const dataFormatada = new Date(a.data_criacao).toLocaleDateString('pt-BR');

        card.innerHTML = `
            <div class="topo-card">
                <img src="${avatarSrc}" class="avatar-card" onerror="this.onerror=null;this.src='${FOTO_PADRAO}'">
                <div>
                    <strong>${a.nome_usuario}</strong>
                    <p class="data">${dataFormatada}</p>
                </div>
            </div>

            <h3 class="titulo-card">${a.titulo}</h3>

            <p class="dados-card">
                Tipo: <strong>${a.tipo || a.tipo_atividade || 'Geral'}</strong><br>
                Distância: ${a.distancia_km} km<br>
                Duração: ${a.duracao_horas} horas<br>
                Calorias: ${a.calorias}
            </p>

            <div class="acoes-card">
                <button class="btn-like" onclick="curtirAtividade(${a.id_atividade}, this)">
                    ❤ Curtir
                </button>

                <button class="btn-comentar" onclick="comentarAtividade(${a.id_atividade})">
                    💬 Comentar
                </button>
            </div>
        `;

        lista.appendChild(card);
    });
}

async function curtirAtividade(id, botao) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Faça login para curtir.");

    const resp = await fetch(`${API}/likes/${id}`, {
        method: "POST",
        headers: { "Authorization": "Bearer " + token }
    });

    if (resp.ok) {
        botao.classList.toggle("liked");
    }
}

function comentarAtividade(id) {
    const comentario = prompt("Digite seu comentário:");
    if (!comentario) return;

    const token = localStorage.getItem("token");

    fetch(`${API}/comentarios/${id}`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ texto: comentario })
    }).then(() => alert("Comentário enviado!"));
}

function filterActivities(tipo) {
    tipoFiltro = tipo;
    carregarAtividades(1);

    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`[data-type="${tipo}"]`).classList.add("active");
}

function goToPage(direction) {
    if (direction === 'next') paginaAtual++;
    else if (direction === 'prev' && paginaAtual > 1) paginaAtual--;
    carregarAtividades(paginaAtual);
}

function openModal(id) {
    document.getElementById(id).style.display = "block";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}


carregarUsuario();
carregarContadores();
carregarAtividades(1);