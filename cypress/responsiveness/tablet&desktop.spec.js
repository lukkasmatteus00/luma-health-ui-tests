const barObject = require("../fixtures/navegationBar.json");

describe("Navigation Bar", () => {
  beforeEach("Access home page", () => {
    cy.visit("/", { waitUntil: "domcontentloaded", failOnStatusCode: false });
  });

  it("Displays login and demo buttons", () => {
    cy.contains(`.actions`, "Log in").should("be.visible");
    cy.contains(`.actions`, "Get a demo").should("be.visible");
  });

  for (const { nav, url, title, isIframe } of barObject)
    it(`Navigate to "${nav}" page`, () => {
      cy.contains(`.mobile-accordion`, nav).should("be.visible").click();
      cy.url().should("include", url);
      if (isIframe) cy.iframe().contains(title).should("be.visible");
      else cy.contains(title).scrollIntoView().should("be.visible");
    });
});
