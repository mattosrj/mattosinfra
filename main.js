(() => {
  "use strict";

  const menuButton = document.querySelector("#nav-toggle");
  const nav = document.querySelector("#menu-principal");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      menuButton.setAttribute("aria-label", expanded ? "Abrir menu" : "Fechar menu");
      nav.classList.toggle("open", !expanded);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
    }));
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const config = window.MATTOS_CONFIG || {};
  const whatsapp = String(config.whatsapp || "").replace(/\D/g, "");
  const email = String(config.email || "").trim();
  const validWhatsApp = whatsapp.length >= 12 && whatsapp.length <= 15;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const directContainer = document.querySelector("#contact-direct");
  const waLink = document.querySelector("#contact-whatsapp");
  const emailLink = document.querySelector("#contact-email");
  if (validWhatsApp && waLink) {
    waLink.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre os serviços da Mattos Infra & Tecnologia.")}`;
    waLink.hidden = false;
  }
  if (validEmail && emailLink) {
    emailLink.href = `mailto:${email}?subject=${encodeURIComponent("Contato pelo site — Mattos Infra & Tecnologia")}`;
    emailLink.hidden = false;
  }
  if ((validWhatsApp || validEmail) && directContainer) directContainer.hidden = false;

  const form = document.querySelector("#contact-form");
  const feedback = document.querySelector("#form-feedback");
  if (!form || !feedback) return;
  const submitButton = form.querySelector(".submit-button");
  const normalButtonContent = submitButton ? submitButton.innerHTML : "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    feedback.classList.remove("success");
    feedback.textContent = "";

    if (!form.checkValidity()) {
      form.reportValidity();
      feedback.textContent = "Preencha os campos obrigatórios corretamente.";
      return;
    }
    if (!validEmail) {
      feedback.textContent = "O envio está temporariamente indisponível. Entre em contato pelo WhatsApp ou e-mail.";
      return;
    }
    // Campo de armadilha para bots, mantido invisível para os visitantes.
    if (form.elements.namedItem("_honey")?.value) return;

    const name = form.elements.namedItem("nome").value.trim();
    const reply = form.elements.namedItem("email").value.trim();
    const subject = form.elements.namedItem("assunto").value;
    const message = form.elements.namedItem("mensagem").value.trim();
    if (!name || !reply || !message) {
      feedback.textContent = "Preencha os campos obrigatórios corretamente.";
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";
    }
    feedback.textContent = "Enviando sua mensagem...";

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          nome: name,
          email: reply,
          assunto: subject,
          mensagem: message,
          _subject: "Mattos Infra - contato pelo site: " + subject,
          _template: "table",
          _url: "https://mattosrj.github.io/mattosinfra/"
        })
      });
      if (!response.ok) throw new Error("Falha no serviço de envio");
      const data = await response.json();
      if (String(data.success).toLowerCase() !== "true") {
        throw new Error("Serviço não confirmou recebimento");
      }

      feedback.textContent = "Mensagem recebida pelo serviço de contato. Obrigado! Entraremos em contato.";
      feedback.classList.add("success");
      form.reset();
    } catch (_) {
      feedback.textContent = "Não foi possível enviar a mensagem agora. Tente novamente ou use o WhatsApp ou e-mail ao lado.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = normalButtonContent;
      }
    }
  });
})();
