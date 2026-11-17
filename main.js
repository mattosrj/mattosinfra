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
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback.classList.remove("success");
    if (!form.checkValidity()) {
      form.reportValidity();
      feedback.textContent = "Preencha os campos obrigatórios corretamente.";
      return;
    }
    if (!validEmail) {
      feedback.textContent = "O envio por e-mail está temporariamente indisponível. Use o WhatsApp para entrar em contato.";
      return;
    }

    const name = form.elements.namedItem("nome").value.trim();
    const reply = form.elements.namedItem("email").value.trim();
    const subject = form.elements.namedItem("assunto").value;
    const message = form.elements.namedItem("mensagem").value.trim();
    const body = `Olá! Vim pelo site Mattos Infra & Tecnologia.\n\nNome: ${name}\nE-mail: ${reply}\nAssunto: ${subject}\n\nNecessidade:\n${message}`;
    const url = `mailto:${email}?subject=${encodeURIComponent("Solicitação pelo site — " + subject)}&body=${encodeURIComponent(body)}`;

    feedback.textContent = "Abrindo seu aplicativo de e-mail com a mensagem preenchida. Revise e clique em Enviar.";
    feedback.classList.add("success");
    // O visitante confirma o envio no próprio aplicativo de e-mail.
    // Não coletamos nem armazenamos dados no site.
    window.location.href = url;
  });
})();
