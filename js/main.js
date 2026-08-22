/* =========================================================
   G.R.U NOTÍCIAS — SCRIPT GLOBAL
   Compartilhado por todas as páginas do site.
   ========================================================= */

// alterna tema claro/escuro e salva a preferência
function toggleDark() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("gru-theme", isDark ? "dark" : "light");
    syncToggleIcon();
}

function syncToggleIcon() {
    const btn = document.getElementById("darkToggle");
    if (btn) {
        btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    }
}

// abre/fecha menu mobile
function toggleMenu() {
    const menu = document.getElementById("menu");
    if (menu) menu.classList.toggle("active");
}

// rolagem suave até o topo
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
    syncToggleIcon();

    // data automática na topbar
    const dataEl = document.getElementById("data");
    if (dataEl) {
        const hoje = new Date();
        const texto = hoje.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
        });
        dataEl.textContent = texto.charAt(0).toUpperCase() + texto.slice(1);
    }

    // header encolhe ao rolar + botão de voltar ao topo
    const header = document.querySelector(".header");
    const topBtn = document.getElementById("topBtn");
    window.addEventListener("scroll", () => {
        if (header) header.classList.toggle("scrolled", window.scrollY > 40);
        if (topBtn) topBtn.classList.toggle("show", window.scrollY > 420);
    });

    // dropdowns do menu funcionam por clique no celular
    document.querySelectorAll(".dropdown > a").forEach((link) => {
        link.addEventListener("click", function (e) {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                this.parentElement.classList.toggle("active");
            }
        });
    });

    // fecha o menu mobile ao clicar fora dele
    document.addEventListener("click", (e) => {
        const menu = document.getElementById("menu");
        const btn = document.querySelector(".menu-btn");
        if (!menu || !btn) return;
        if (menu.classList.contains("active") && !menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.remove("active");
        }
    });

    // ─── FORMULÁRIO DE CONTATO — EmailJS ──────────────────────────────────
    const EMAILJS_SERVICE_ID  = "service_uzbux5m";
    const EMAILJS_TEMPLATE_ID = "template_fuz72oo";
    const EMAILJS_PUBLIC_KEY  = "L8PCvxzMaJMpd_sJp";

    // Inicializa o EmailJS com a chave pública
    if (typeof emailjs !== "undefined") {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    document.querySelectorAll(".footer-form").forEach((form) => {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nome     = form.querySelector("input[type='text']").value.trim();
            const email    = form.querySelector("input[type='email']").value.trim();
            const mensagem = form.querySelector("textarea").value.trim();
            const btn      = form.querySelector("button[type='submit']");

            // Feedback visual de carregamento
            const textoOriginal = btn.textContent;
            btn.textContent = "Enviando…";
            btn.disabled = true;

            // Remove mensagem anterior se houver
            form.querySelector(".form-msg")?.remove();

            const msgEl = document.createElement("p");
            msgEl.className = "form-msg";
            msgEl.style.cssText =
                "margin-top:10px;font-size:13px;border-radius:6px;padding:8px 12px;text-align:center;";

            try {
                if (typeof emailjs === "undefined") {
                    throw new Error("SDK não carregado");
                }

                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                    from_name:  nome,
                    from_email: email,
                    message:    mensagem,
                    reply_to:   email,
                });

                // ✅ Sucesso
                msgEl.textContent = " Mensagem enviada! Responderemos em breve.";
                msgEl.style.background = "#dcfce7";
                msgEl.style.color      = "#166534";
                form.reset();

            } catch (err) {
                console.error("Erro EmailJS:", err);
                msgEl.textContent = " Erro ao enviar. Tente novamente ou escreva para grunoticias01@gmail.com";
                msgEl.style.background = "#fee2e2";
                msgEl.style.color      = "#991b1b";
            } finally {
                btn.textContent = textoOriginal;
                btn.disabled = false;
                form.appendChild(msgEl);
                setTimeout(() => msgEl.remove(), 7000);
            }
        });
    });

    // botões de compartilhar (sem integração real ainda)
    document.querySelectorAll(".share-buttons button").forEach((btn) => {
        btn.addEventListener("click", () => {
            alert("Compartilhamento via " + btn.textContent.trim() + " em breve!");
        });
    });
});

/* ── Slots de upload de imagem com persistência ── */
document.addEventListener('DOMContentLoaded', () => {
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    const allSlots = document.querySelectorAll('.img-slot, .img-slot-perfil, .img-slot-logo');

    allSlots.forEach((slot, index) => {
        const input = slot.querySelector('input[type=file]');
        if (!input) return;

        // Tenta gerar uma chave única inteligente baseada no candidato ou artigo
        let nameKey = '';
        const parentCard = slot.closest('.cand-card, .candidato-perfil');
        const parentLink = slot.closest('a');

        if (parentCard) {
            const h3 = parentCard.querySelector('h3');
            if (h3) {
                nameKey = '_candidate_' + h3.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
            }
        } else if (parentLink && parentLink.getAttribute('href')) {
            const href = parentLink.getAttribute('href');
            nameKey = '_materia_' + href.split('/').pop().replace('.html', '').replace(/[^a-z0-9]/g, '_');
        }

        const slotKey = nameKey ? `gru_img${nameKey}` : `gru_img_${pageName}_slot_${index}`;

        // Carrega a imagem salva se existir no localStorage
        const savedImg = localStorage.getItem(slotKey);
        if (savedImg) {
            let prev = slot.querySelector('img');
            if (prev) prev.remove();
            const img = document.createElement('img');
            img.src = savedImg;
            img.alt = 'Imagem carregada';
            slot.prepend(img);
            slot.classList.add('has-img');
        }

        input.addEventListener('change', () => {
            const file = input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                const imgData = e.target.result;

                // remove img anterior se existir
                let prev = slot.querySelector('img');
                if (prev) prev.remove();

                const img = document.createElement('img');
                img.src = imgData;
                img.alt = 'Imagem carregada';
                slot.prepend(img);
                slot.classList.add('has-img');

                // Salva no localStorage para persistência
                try {
                    localStorage.setItem(slotKey, imgData);
                } catch (err) {
                    console.warn("Limite do localStorage atingido ou erro ao salvar imagem:", err);
                }
            };
            reader.readAsDataURL(file);
        });
    });
});
