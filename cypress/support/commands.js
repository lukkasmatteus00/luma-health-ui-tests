Cypress.Commands.add("disableAnimations", () => {
  cy.document().then((doc) => {
    const style = doc.createElement("style");
    style.innerHTML = `
        *, *::before, *::after {
          transition: none !important;
          animation: none !important;
        }
      `;
    doc.head.appendChild(style);
  });
});

Cypress.Commands.add(
  "iframe",
  (iframeSelector = "iframe.iframe-full-height") => {
    return cy
      .get(iframeSelector)
      .its("0.contentDocument.body")
      .should("not.be.empty")
      .then(cy.wrap);
  }
);

Cypress.Commands.add("Ifield", (name) => {
  return cy.iframe().find(`[name="${name}"]`).scrollIntoView();
});
