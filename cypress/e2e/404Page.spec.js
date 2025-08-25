describe("Home Page Sections", () => {
  before("Access 404 page", () => {
    cy.visit("/cypress-test-404", { failOnStatusCode: false });
  });

  it("Navigate to platform page when clicking 'See what it does'", () => {
    cy.get(`.entry-title`).should("contain.text", "Page Not Found");
    cy.get(`.intro-text`).should(
      "contain.text",
      "The page you were looking for could not be found. It might have been removed, renamed, or did not exist in the first place."
    );

    cy.get(`.screen-reader-text`).should("contain.text", "Search for:");
    cy.get(`#s`).should("be.visible"); //input search field
    cy.get(`#searchsubmit`).should("be.visible"); //search button
  });
});
