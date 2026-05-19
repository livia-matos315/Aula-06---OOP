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

    document.querySelectorAll('input').forEach(i=> i.value = "");
});

const obterLocalizacao = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => reject("Acesso à localização negado!")
        );
    });
}