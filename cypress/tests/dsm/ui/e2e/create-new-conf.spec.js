
describe('Create Dataset Conf', () => {
    it('Open Create Conf Dialog And Register Dataset', () => {
      cy.wait(6000);
     
      cy.visit('/');
      cy.wait(3000)
      cy.visit('/dsm');
      cy.wait(3000)
      cy.get('[data-cy=create-new-config]').click();
      cy.fixture('dsm/create-new-conf').then((testData) => {
      cy.get('[cy-data=dataset-display-name]').type(testData.displayName);
    
        cy.get('[data-cy=dataset-nature]').click();
  
        cy.contains(new RegExp(`^${testData.natureItem}$`)).click();

  
        cy.get('[data-cy=dataset-channel]').click();
  
        cy.contains(testData.channel).click();
        cy.get('[data-cy=bu-switch]').click();
        cy.get('[cy-data=dataset-attributes-save]').click();
  
        // cy.wait(2000);
  
        testData.fieldMapping.forEach((field, idx) => {
          cy.get('[data-cy=add-new-field]').click();
          cy.get(`[cy-data=channel-text-field-${idx}]`).type(field.field);
  
          cy.get(`[cy-data=key-text-field-${idx}]`).type(field.key);
        });
  
        cy.get('[data-cy="save-and-next"]').click();
  
        testData.fieldAttribute.forEach((field, idx) => {
          cy.get(`[data-cy=field-type-${idx}]`).click();
  
          cy.contains(field.type).click();
  
          cy.get(`[data-cy=field-label-${idx}]`).click();
  
          cy.contains(new RegExp(`^${field.label}$`)).click();
  
          if (testData.fieldAttribute.length !== idx + 1) {
            cy.get(`[data-cy=field-attributes-panel-${idx + 1}]`).click({
              force: true,
            });
          }
        });
  
        cy.get('[data-cy="save-and-next"]').click();
         cy.get('[data-cy="bu-mapping"]').click();
         cy.wait(2000);
        cy.get('[data-cy="select-from-list"]').contains(new RegExp(`^${testData.buField}$`)).click({force:true});
        cy.get('[data-cy="save and proceed"]').click();
         
        cy.get('[data-cy=dataset-mode]').click();
  
        cy.contains(testData.datasetMode).click();
  
        cy.get('[data-cy=save-mode]').click({ force: true });
  
        cy.wait(1000);
        cy.contains(testData.displayName).should('exist');
      });
    });
  });
  