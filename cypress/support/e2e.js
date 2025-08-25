import "cypress-mochawesome-reporter/register";
import addContext from "mochawesome/addContext";
import 'cypress-iframe';

import "./commands";

Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

before("Clean session before execution", () => {
  Cypress.session.clearAllSavedSessions();
});

Cypress.on("test:after:run", (test, runnable) => {
  if (test.state === "failed") {
    const screenshotFileName = `${runnable.parent.title} -- ${test.title} (failed).png`;
    addContext(
      { test },
      `../screenshots/${Cypress.spec.name}/${screenshotFileName}`
    );
  }
});
