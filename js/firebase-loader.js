// Carregador dinâmico de matérias do Firestore em Tempo Real
document.addEventListener('DOMContentLoaded', () => {
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    const materiasGrid = document.querySelector('.materias-grid');
    const gridNews = document.querySelector('.news .grid-news');

    if (typeof db === 'undefined') return;

    // Carregamento para páginas de editorias (ia, inovacao, startups, risco, tecnologia)
    if (materiasGrid) {
        db.collection('materias')
            .orderBy('timestamp', 'asc') // Busca em ordem crescente (mais antiga primeiro) para que a inserção com prepending posicione a mais recente no topo
            .onSnapshot(snapshot => {
                // Remove as matérias dinâmicas anteriores para atualizar em tempo real sem duplicar
                materiasGrid.querySelectorAll('.materia-card-dynamic').forEach(el => el.remove());

                snapshot.forEach(doc => {
                    const data = doc.data();
                    let shouldShow = false;
                    const cat = data.category ? data.category.toLowerCase() : '';

                    if (pageName === 'tecnologia.html') {
                        if (['ia', 'inovacao', 'startups', 'risco'].includes(cat)) {
                            shouldShow = true;
                        }
                    } else if (pageName === 'ia.html' && cat === 'ia') {
                        shouldShow = true;
                    } else if (pageName === 'inovacao.html' && cat === 'inovacao') {
                        shouldShow = true;
                    } else if (pageName === 'startups.html' && cat === 'startups') {
                        shouldShow = true;
                    } else if (pageName === 'risco.html' && cat === 'risco') {
                        shouldShow = true;
                    }

                    if (shouldShow) {
                        const card = document.createElement('a');
                        card.href = `materia-dinamica.html?id=${doc.id}`;
                        card.className = 'materia-card materia-card-dynamic';
                        
                        const badgeText = data.badge || 'Tecnologia';
                        
                        let imgHtml = '';
                        if (data.imageUrl && data.imageUrl.trim() !== '') {
                            imgHtml = `<img src="${data.imageUrl}" alt="${data.title}" class="materia-img">`;
                        } else {
                            imgHtml = `<div class="materia-img-placeholder">${data.placeholderEmoji || '📰'}</div>`;
                        }

                        let dateStr = '';
                        if (data.date) {
                            dateStr = data.date;
                        } else if (data.timestamp) {
                            const tDate = data.timestamp.toDate();
                            dateStr = tDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '');
                        } else {
                            dateStr = new Date().toLocaleDateString('pt-BR');
                        }

                        card.innerHTML = `
                            ${imgHtml}
                            <div class="materia-body">
                                <span class="badge">${badgeText}</span>
                                <h3>${data.title}</h3>
                                <p>${data.description || ''}</p>
                                <div class="materia-meta">
                                    <i class="fa-regular fa-calendar"></i> ${dateStr}
                                    ${data.location ? `&nbsp;•&nbsp; <i class="fa-solid fa-location-dot"></i> ${data.location}` : ''}
                                </div>
                            </div>
                        `;
                        materiasGrid.insertBefore(card, materiasGrid.firstChild);
                    }
                });
            }, err => {
                console.error("Erro no escutador em tempo real do Firestore (editorias):", err);
            });
    }

    // Carregamento para a página inicial (index.html)
    if (pageName === 'index.html' && gridNews) {
        db.collection('materias')
            .where('destaque', '==', true)
            .orderBy('timestamp', 'asc')
            .onSnapshot(snapshot => {
                // Remove as matérias de destaque dinâmicas anteriores
                gridNews.querySelectorAll('.news-card-dynamic').forEach(el => el.remove());

                snapshot.forEach(doc => {
                    const data = doc.data();
                    const card = document.createElement('a');
                    card.href = `materia-dinamica.html?id=${doc.id}`;
                    card.className = 'news-card news-card-dynamic';

                    let imgHtml = '';
                    if (data.imageUrl && data.imageUrl.trim() !== '') {
                        imgHtml = `<img src="${data.imageUrl}" alt="${data.title}">`;
                    } else {
                        imgHtml = `
                            <div class="materia-img-placeholder" style="height:120px; font-size:42px; display:flex; align-items:center; justify-content:center; background:var(--line); border-radius:var(--radius-sm);">
                                ${data.placeholderEmoji || '📰'}
                            </div>
                        `;
                    }

                    card.innerHTML = `
                        ${imgHtml}
                        <h3>${data.title}</h3>
                    `;
                    gridNews.insertBefore(card, gridNews.firstChild);
                });
            }, err => {
                console.error("Erro no escutador em tempo real do Firestore (Home):", err);
            });
    }
});
