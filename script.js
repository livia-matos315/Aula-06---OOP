class Foto {
    constructor(url, legenda, lat, lon) {
        this.url = url;
        this.legenda = legenda;
        this.localizacao = { lat, lon };
        this.dataCriacao = new Date();
    }
    obterCoordenadas() {
        return `Lat: ${this.localizacao.lat.toFixed(2)}, Lon: ${this.localizacao.lon.toFixed(2)}`;
    }
    get resumo() {
        return `${this.legenda} - Capturada em: ${this.dataCriacao.toLocaleDateString('pt-BR')}`;
    }
}

const btn = document.querySelector("#btn-adicionar");
const galeria = document.querySelector("#galeria");

btn.addEventListener("click", () => {
    const url = document.querySelector("#ipt-url").value;
    const legenda = document.querySelector("#ipt-legenda").value;
    const lat = parseFloat(document.querySelector("#ipt-lat").value) || 0;
    const lon = parseFloat(document.querySelector("#ipt-lon").value) || 0;

    if (!url || !legenda) return alert("URL e Legenda são obrigatórios!");

    const novaFoto = new Foto(url, legenda, lat, lon);

    const card = document.createElement("div");
    card.className = "card-foto";

    card.innerHTML = `
        <img src="${novaFoto.url}" alt="${novaFoto.legenda}">
        <div class="card-info"> 
            <h3>${novaFoto.legenda}</h3>
            <p><strong>Resumo:</strong> ${novaFoto.resumo}</p>
            <div class="card-footer">
                📍 ${novaFoto.obterCoordenadas()}
            </div>
        </div>
    `;

    galeria.prepend(card);

    document.querySelectorAll('input').forEach(i => i.value = "");
});

const obterLocalizacao = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => reject("Acesso à localização negado!")
        );
    });
}

class Galeria {
    constructor(containerId) {
        this.fotos = [];
        this.container = document.getElementById(containerId);
    }

    adicionarFoto(novaFoto) {
        this.fotos.push(novaFoto);
        this.renderizar();
    }

    renderizar() {
        this.container.innerHTML = ""; // Limpa para atualizar

        this.fotos.forEach(foto => {
            const card = document.createElement('div');
            card.className = 'foto-card';

            card.innerHTML = `
        <img src="${foto.url}" alt="${foto.legenda}">
        <p><strong>${foto.legenda}</strong></p>
        <small>${foto.obterCoordenadas()}</small>
      `;

            this.container.appendChild(card);
        });
    }
}
// Inicializando o sistema
const minhaGaleria = new Galeria('galeria-container');
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');

// 1. Iniciar Câmera ao carregar
iniciarCamera(video);

// 2. Evento de Captura
document.getElementById('btn-capturar').addEventListener('click', async () => {
    const legenda = document.getElementById('legenda').value;

    // Captura Localização
    const coords = await obterLocalizacao();

    // Captura Imagem do Vídeo (Desenha no Canvas)
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const imagemURL = canvas.toDataURL('image/png');

    // Cria Instância do Objeto Foto (OOP)
    const novaFoto = new Foto(imagemURL, legenda, coords.latitude, coords.longitude);

    // Adiciona na Galeria
    minhaGaleria.adicionarFoto(novaFoto);
});