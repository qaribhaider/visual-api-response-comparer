import 'cypress-axe';

describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have minimal accessibility violations on the homepage', () => {
    cy.injectAxe();
    cy.checkA11y(undefined, {
      rules: {
        'color-contrast': { 
          enabled: true,
        },
        'landmark-one-main': { enabled: true },
        'page-has-heading-one': { enabled: true },
        'aria-allowed-attr': { enabled: true },
        'landmark-unique': { enabled: true }
      },
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      }
    }, (violations) => {
      // Filter out non-critical violations
      const criticalViolations = violations.filter(v => 
        v.impact === 'critical' || v.impact === 'serious'
      );

      // Log detailed violations
      console.log('Homepage Accessibility Violations:', violations.length);
      
      // Create a detailed report for critical violations
      const violationReport = criticalViolations.map((violation, index) => {
        const nodeDetails = violation.nodes.map((node, nodeIndex) => 
          `  Node ${nodeIndex + 1}:
    HTML: ${node.html}
    Target: ${node.target}
    Impact: ${violation.impact}`
        ).join('\n');

        return `
Violation ${index + 1}:
  Rule: ${violation.id}
  Description: ${violation.description}
  Help: ${violation.help}
  Help URL: ${violation.helpUrl}
${nodeDetails}`;
      }).join('\n\n');

      console.log(violationReport);

      // Fail only if there are critical violations
      expect(criticalViolations.length, `Critical Accessibility Violations:\n${violationReport}`).to.equal(0);
    });
  });

  it('should have minimal accessibility violations in the request form', () => {
    cy.get('form').first().should('be.visible');
    cy.injectAxe();
    cy.checkA11y('form', {
      rules: {
        'color-contrast': { 
          enabled: true,
        },
        'label': { enabled: true },
        'form-field-multiple-labels': { enabled: true }
      },
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      }
    }, (violations) => {
      // Filter out non-critical violations
      const criticalViolations = violations.filter(v => 
        v.impact === 'critical' || v.impact === 'serious'
      );

      // Log detailed violations
      console.log('Request Form Accessibility Violations:', violations.length);
      
      // Create a detailed report for critical violations
      const violationReport = criticalViolations.map((violation, index) => {
        const nodeDetails = violation.nodes.map((node, nodeIndex) => 
          `  Node ${nodeIndex + 1}:
    HTML: ${node.html}
    Target: ${node.target}
    Impact: ${violation.impact}`
        ).join('\n');

        return `
Violation ${index + 1}:
  Rule: ${violation.id}
  Description: ${violation.description}
  Help: ${violation.help}
  Help URL: ${violation.helpUrl}
${nodeDetails}`;
      }).join('\n\n');

      console.log(violationReport);

      // Fail only if there are critical violations
      expect(criticalViolations.length, `Critical Accessibility Violations:\n${violationReport}`).to.equal(0);
    });
  });
});
