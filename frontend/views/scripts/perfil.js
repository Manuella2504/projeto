(function validarLogin() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }
})();

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

let paginaAtual = 1;
let tipoFiltro = "";
const API = "http://localhost:3000";

async function carregarUsuario() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const resp = await fetch(`${API}/usuarios`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const dados = await resp.json();

    if (!resp.ok) {
        logout();
        return;
    }

    document.getElementById("user-name").innerText = dados.nome_usuario;
    document.getElementById("user-avatar").src = dados.avatar_url || "assets/images/SAEPSaude.png";
}

async function carregarContadores() {
    const token = localStorage.getItem("token");

    const resp = await fetch(`${API}/atividades?pagina=1`, {
        headers: token ? { "Authorization": "Bearer " + token } : {}
    });

    const atividades = await resp.json();

    let totalCalorias = 0;
    atividades.forEach(a => totalCalorias += Number(a.calorias));

    document.getElementById("qtd-atividades-empresa").innerText = atividades.length;
    document.getElementById("qtd-calorias-empresa").innerText = totalCalorias;
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

        card.innerHTML = `
            <div class="topo-card">
                <img src="${a.avatar_url}" class="avatar-card">
                <div>
                    <strong>${a.nome_usuario}</strong>
                    <p class="data">${a.data_criacao}</p>
                </div>
            </div>

            <h3 class="titulo-card">${a.titulo}</h3>

            <p class="dados-card">
                Tipo: <strong>${a.tipo}</strong><br>
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

function openModal(id) {
    document.getElementById(id).style.display = "block";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

carregarUsuario();
carregarContadores();
carregarAtividades(1);
