const barObject = require("../fixtures/navegationBar.json");
describe("Mobile viewport", () => {
  before("Access home page", () => {
    cy.visit("/", { waitUntil: "domcontentloaded" });
  });

  it("Displays hero banner with correct title and subtitle", () => {
    cy.get(`.hero-section-title`)
      .should("be.visible")
      .and("contain.text", "Manual Tasks’ Worst Nightmare");
    cy.get(`.hero-section-subtitle`)
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        const cleanedText = text.replace(/\s+/g, " ").trim();
        expect(cleanedText).to.contain(
          "Luma's AI-native Patient Success Platform™ makes it easier for patients who need care to get to you, and eliminates manual work for your staff."
        );
      });
  });
  it(`Open the hamburger menu`, () => {
    cy.get(".navbar-trigger").should("be.visible").click();

    cy.fixture("navegationBar.json").then((obj) => {
      for (const { nav } of obj) {
        cy.contains(".mobile-accordion", nav)
          .should("be.visible")
          .click()
          .should("have.class", "active");
        cy.contains(".hide-desktop", nav).click();
        cy.contains(".mobile-accordion", nav).should(
          "not.have.class",
          "active"
        );
      }
    });
  });
});
