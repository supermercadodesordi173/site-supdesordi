// O site não usa service worker. Este arquivo existe para os navegadores que abriram o ERP
// quando ele morava em supdesordi.com.br: o service worker do ERP (public/sw.js no
// repositório do ERP) continua registrado neste endereço e, ao procurar atualização, busca
// /sw.js aqui. Esta versão se desliga sozinha: limpa o cache, sai do registro e recarrega as
// janelas, que passam a abrir o site. Não apaga nenhum dado guardado pelo ERP no navegador,
// e não recarrega janela de fechamento ou de cesta (um rascunho na tela não se perde).
const NAO_RECARREGAR = ['/fechamento', '/cesta'];

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.map((n) => caches.delete(n))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((janelas) => Promise.all(janelas
        .filter((j) => !NAO_RECARREGAR.some((p) => new URL(j.url).pathname.startsWith(p)))
        .map((j) => j.navigate(j.url).catch(() => null))))
  );
});
