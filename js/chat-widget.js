// Configuração do Webhook do Assistente Virtual
window.ChatWidgetConfig = {
  webhook: {
    url: "https://ryanmendi.app.n8n.cloud/webhook/8bb3b449-a422-4aba-9e16-b215a5b121be/chat",
    route: "general",
  },
};

// HTML do widget do chat
const chatWidgetHtml = `
  <button
    id="chat-widget-button"
    aria-label="Abrir assistente"
    aria-expanded="false"
    type="button"
  >
    <svg class="chat-button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2 1.2-4.2A7.5 7.5 0 1 1 20 11.5Z" />
    </svg>
  </button>

  <div id="chat-widget-container" aria-live="polite">
    <header id="chat-widget-header">
      <div class="header-content">
        <div class="assistant-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3C12.5 7.5 14.5 9.5 19 10C14.5 10.5 12.5 12.5 12 17C11.5 12.5 9.5 10.5 5 10C9.5 9.5 11.5 7.5 12 3Z" />
          </svg>
        </div>

        <div class="header-text">
          <div class="header-title">Assistente</div>
          <div class="header-status">
            <span class="status-dot" aria-hidden="true"></span>
            Online
          </div>
        </div>
      </div>

      <button
        id="chat-widget-close"
        aria-label="Fechar chat"
        type="button"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6L18 18"></path>
          <path d="M18 6L6 18"></path>
        </svg>
      </button>
    </header>

    <main id="chat-widget-body">
      <div class="message-row bot">
        <div class="message-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3C12.5 7.5 14.5 9.5 19 10C14.5 10.5 12.5 12.5 12 17C11.5 12.5 9.5 10.5 5 10C9.5 9.5 11.5 7.5 12 3Z" />
          </svg>
        </div>

        <div class="bot-message">
          <strong>Olá!</strong>
          <br /><br />
          Seja bem-vindo. Posso ajudar você com informações, notícias, clima,
          trânsito e outras perguntas.
          <span class="message-time">Agora</span>
        </div>
      </div>
    </main>

    <footer id="chat-widget-footer">
      <input
        type="text"
        id="chat-widget-input"
        placeholder="Digite sua pergunta..."
        autocomplete="off"
        aria-label="Mensagem"
      />

      <button id="chat-widget-send" aria-label="Enviar mensagem" type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 3L10.5 13.5"></path>
          <path d="M21 3L14.5 21L10.5 13.5L3 9.5L21 3Z"></path>
        </svg>
      </button>
    </footer>
  </div>
`;

document.addEventListener("DOMContentLoaded", () => {
  // Injeta o CSS do chat-widget se não estiver presente
  if (!document.querySelector('link[href*="chat-widget.css"]')) {
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "css/chat-widget.css";
    document.head.appendChild(cssLink);
  }

  // Insere o HTML do chat dinamicamente antes do botão de voltar ao topo (#topBtn)
  const topBtn = document.getElementById("topBtn");
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = chatWidgetHtml;

  const chatButton = tempDiv.querySelector("#chat-widget-button");
  const chatContainer = tempDiv.querySelector("#chat-widget-container");

  if (topBtn) {
    topBtn.parentNode.insertBefore(chatContainer, topBtn);
    topBtn.parentNode.insertBefore(chatButton, topBtn);
  } else {
    document.body.appendChild(chatContainer);
    document.body.appendChild(chatButton);
  }

  // Elementos do DOM do chat
  const chatClose = document.getElementById("chat-widget-close");
  const chatBody = document.getElementById("chat-widget-body");
  const chatInput = document.getElementById("chat-widget-input");
  const chatSend = document.getElementById("chat-widget-send");

  function openChatWidget() {
    chatContainer.style.display = "flex";
    chatButton.style.display = "none";
    chatButton.setAttribute("aria-expanded", "true");
    chatInput.focus();
  }

  function closeChatWidget() {
    chatContainer.style.display = "none";
    chatButton.style.display = "flex";
    chatButton.setAttribute("aria-expanded", "false");
  }

  chatButton.addEventListener("click", openChatWidget);
  chatClose.addEventListener("click", closeChatWidget);

  function getChatId() {
    let chatId = sessionStorage.getItem("chatId");
    if (!chatId) {
      chatId = "chat_" + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem("chatId", chatId);
    }
    return chatId;
  }

  function getTime() {
    return new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function assistantIcon() {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3C12.5 7.5 14.5 9.5 19 10C14.5 10.5 12.5 12.5 12 17C11.5 12.5 9.5 10.5 5 10C9.5 9.5 11.5 7.5 12 3Z" />
      </svg>
    `;
  }

  function addMessage(message, type) {
    const row = document.createElement("div");
    row.className = `message-row ${type}`;

    if (type === "bot") {
      const avatar = document.createElement("div");
      avatar.className = "message-avatar";
      avatar.innerHTML = assistantIcon();
      row.appendChild(avatar);

      const bubble = document.createElement("div");
      bubble.className = "bot-message";
      bubble.textContent = message;

      const time = document.createElement("span");
      time.className = "message-time";
      time.textContent = getTime();
      bubble.appendChild(time);

      row.appendChild(bubble);
    } else {
      const bubble = document.createElement("div");
      bubble.className = "user-message";
      bubble.textContent = message;

      const time = document.createElement("span");
      time.className = "message-time";
      time.textContent = getTime();
      bubble.appendChild(time);

      row.appendChild(bubble);
    }

    chatBody.appendChild(row);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTyping() {
    const row = document.createElement("div");
    row.id = "typing-indicator";
    row.className = "typing-row";
    row.innerHTML = `
      <div class="message-avatar">${assistantIcon()}</div>
      <div class="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;

    chatBody.appendChild(row);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById("typing-indicator");
    if (typing) {
      typing.remove();
    }
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, "user");
    chatInput.value = "";
    chatInput.disabled = true;
    chatSend.disabled = true;
    showTyping();

    const chatId = getChatId();

    try {
      const response = await fetch(window.ChatWidgetConfig.webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          message,
          route: window.ChatWidgetConfig.webhook.route,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      removeTyping();

      const answer =
        data.output ||
        data.response ||
        data.text ||
        data.message ||
        "Não consegui encontrar uma resposta.";

      addMessage(answer, "bot");
    } catch (error) {
      console.error("Erro ao conectar ao n8n:", error);
      removeTyping();
      addMessage(
        "Não consegui conectar ao assistente no momento. Verifique se o workflow do n8n está ativo.",
        "bot",
      );
    }

    chatInput.disabled = false;
    chatSend.disabled = false;
    chatInput.focus();
  }

  chatSend.addEventListener("click", sendMessage);

  chatInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });
});
