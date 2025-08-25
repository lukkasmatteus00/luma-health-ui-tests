describe("Home Page Sections", () => {
  before("Access home page", () => {
    cy.visit("/", { waitUntil: "domcontentloaded", failOnStatusCode: false });
    cy.disableAnimations();
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

  it("Navigate to platform page when clicking 'See what it does'", () => {
    cy.contains(`.hero-button`, "See what it does")
      .should("be.visible")
      .click();
    cy.url().should("include", "/patient-success-platform/");
    cy.iframe().contains("The Patient Success Platform").should("be.visible");
  });
});

describe("Footer Links", () => {
  before("Access home page", () => {
    cy.visit("/", { waitUntil: "domcontentloaded" });
    cy.disableAnimations();
  });

  for (const footer of [
    "Spark",
    "Referrals",
    "Scheduling",
    "Waitlist",
    "Feedback Management",
    "Payments",
    "Eligibility & Verification",
    "Intake & Patient Forms",
    "Reminders and Recalls",
    "Navigator (AI Concierge)",
    "Collaboration Hub",
    "Fax Transform (AI)",
    "Novel Workflows (includes Builder)",
    "Safety and Security",
  ])
    it(`Displays footer link under Patient Success Platform: ${footer}`, () => {
      cy.contains(`footer .first li`, footer)
        .scrollIntoView()
        .should("be.visible");
    });

  for (const footer of [
    "Enterprise Health Systems",
    "Specialty Groups",
    "Regional & Rural Care",
    "Primary Care",
  ])
    it(`Displays footer link under Who We Serve: ${footer}`, () => {
      cy.contains(`footer .second li`, footer)
        .scrollIntoView()
        .should("be.visible");
    });

  for (const footer of [
    "Epic",
    "Oracle Health",
    "MEDITECH",
    "eClinicalWorks",
    "athenahealth",
    "NextGen",
    "Greenway",
    "Nextech",
  ])
    it(`Displays footer link under Integrations: ${footer}`, () => {
      cy.contains(`footer .second li`, footer)
        .scrollIntoView()
        .should("be.visible");
    });

  for (const footer of ["Customer stories", "Videos", "Resources", "Blog"])
    it(`Displays footer link under Learn Hub: ${footer}`, () => {
      cy.contains(`footer .third li`, footer)
        .scrollIntoView()
        .should("be.visible");
    });

  for (const footer of ["Newsroom", "Careers"])
    it(`Displays footer link under About Us: ${footer}`, () => {
      cy.contains(`footer .third li`, footer)
        .scrollIntoView()
        .should("be.visible");
    });

  it(`Displays Digital Health: On Air link`, () => {
    cy.contains(`footer .third li`, "Digital Health: On Air")
      .scrollIntoView()
      .should("be.visible");
  });

  it(`Displays newsletter subscription form`, () => {
    cy.get(`[name="email"]`).scrollIntoView().should("be.visible");
    cy.get(`[value="Subscribe"]`).should("be.visible");
  });
});
