import { faker } from "@faker-js/faker";
describe("Demo Request Form", () => {
  beforeEach("Access home page", () => {
    cy.visit("/", { waitUntil: "domcontentloaded", failOnStatusCode: false });
    cy.disableAnimations();
    cy.contains(`.actions`, "Get a demo").click();
  });

  it("Displays required field errors when submitting an empty form", () => {
    cy.iframe()
      .contains(`.hs-submit input[class*="hs-button"]`, "Submit")
      .scrollIntoView()
      .click();
    cy.iframe()
      .find(".hs_error_rollup label")
      .scrollIntoView()
      .should("contain.text", "Please complete all required fields.");

    cy.fixture("bookDemoFieldNames.json").then((fields) => {
      for (const field_name of fields)
        cy.iframe()
          .contains("form label", field_name)
          .parents('div[class*="field"]')
          .find(".hs-error-msgs")
          .scrollIntoView()
          .should("contain.text", "Please complete this required field.");
    });
  });
  it("Fails submission due to captcha", () => {
    cy.Ifield(`firstname`).type(faker.person.firstName());
    cy.Ifield(`lastname`).type(faker.person.lastName());
    cy.Ifield(`email`).type(faker.internet.email());
    cy.Ifield(`phone`).type(faker.phone.number());
    cy.Ifield(`organization_name`).type(faker.company.name());
    cy.Ifield(`provider_range`).select("0-14");
    cy.Ifield(`organization_type`).select("Other");
    cy.Ifield(`ehr`).select("Other");
    cy.Ifield(`other_ehr`).type(faker.lorem.words());
    cy.Ifield(`what_are_you_interested_in_`).type(faker.lorem.paragraph());
    cy.Ifield(`how_d_you_hear_about_us_`).type(faker.lorem.paragraph());

    cy.iframe()
      .contains(`.hs-submit input[class*="hs-button"]`, "Submit")
      .scrollIntoView()
      .click();
    cy.iframe()
      .find(".hs_error_rollup label")
      .scrollIntoView()
      .should("contain.text", "Failed to validate Captcha. Please try again.");
  });
});
