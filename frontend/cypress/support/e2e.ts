import 'cypress-axe'

// Suppress specific console warnings or errors if needed
Cypress.on('uncaught:exception', () => {
  // Returning false here prevents Cypress from failing the test
  return false
})
