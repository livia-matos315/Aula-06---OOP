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

// Inicializa a Galeria apontando para o ID correto do grid
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
        if (!this.container) return;
        this.container.innerHTML = ""; // Limpa para atualizar

        this.fotos.forEach(foto => {
            const card = document.createElement('div');
            card.className = 'card-foto'; // Corrigido para bater com o CSS

            card.innerHTML = `
                <img src="${foto.url}" alt="${foto.legenda}">
                <div class="card-info">
                    <h3>${foto.legenda}</h3>
                    <p>Adicionado em: ${foto.dataCriacao.toLocaleDateString('pt-BR')}</p>
                    <div class="card-footer">
                        📍 ${foto.obterCoordenadas()}
                    </div>
                </div>
            `;
            this.container.appendChild(card);
        });
    }
}

const minhaGaleria = new Galeria('galeria');

// Função de localização (Promise)
const obterLocalizacao = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject("Geolocalização não suportada.");
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => reject("Acesso à localização negado!")
        );
    });
}

// Ação do Botão "Usar Localização Atual" no formulário manual
document.querySelector("#loc-atual").addEventListener("click", async () => {
    try {
        const coords = await obterLocalizacao();
        document.querySelector("#ipt-lat").value = coords.latitude.toFixed(6);
        document.querySelector("#ipt-lon").value = coords.longitude.toFixed(6);
    } catch (err) {
        alert(err);
    }
});

// Ação do Botão "Adicionar ao Mural" (Formulário Manual)
const btnAdicionar = document.querySelector("#btn-adicionar");
btnAdicionar.addEventListener("click", () => {
    const url = document.querySelector("#ipt-url").value;
    const legenda = document.querySelector("#ipt-legenda").value;
    const lat = parseFloat(document.querySelector("#ipt-lat").value) || 0;
    const lon = parseFloat(document.querySelector("#ipt-lon").value) || 0;

    if (!url || !legenda) return alert("URL e Legenda são obrigatórios!");

    const novaFoto = new Foto(url, legenda, lat, lon);
    minhaGaleria.adicionarFoto(novaFoto);

    document.querySelectorAll('.form-card input').forEach(i => i.value = "");
});

const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');

function iniciarCamera(videoEl) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('API de câmera não suportada neste navegador.');
        return;
    }
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => { videoEl.srcObject = stream; })
        .catch(err => { alert('Não foi possível acessar a câmera: ' + err.message); });
}

iniciarCamera(video);

document.getElementById('btn-capturar').addEventListener('click', async () => {
    const legendaWebcam = document.getElementById('legenda').value;
    
    if (!legendaWebcam.trim()) {
        return alert("Por favor, digite uma legenda antes de tirar a foto!");
    }

    let latitude = 0;
    let longitude = 0;
    try {
        const c = await obterLocalizacao();
        latitude = c.latitude;
        longitude = c.longitude;
    } catch (e) {
        console.warn('Não foi possível obter a localização:', e);
    }

    if (video.readyState < 2) {
        alert("A câmera ainda está iniciando. Aguarde um instante e tente novamente.");
        return;
    }

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return alert('Erro ao processar o frame da imagem.');
    }
    ctx.drawImage(video, 0, 0, width, height);
    
    const imagemURL = canvas.toDataURL('image/png');

    const novaFotoWebcam = new Foto(imagemURL, legendaWebcam, latitude, longitude);
    minhaGaleria.adicionarFoto(novaFotoWebcam);

    document.getElementById('legenda').value = "";
});