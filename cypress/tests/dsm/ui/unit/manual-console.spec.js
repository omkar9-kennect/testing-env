describe('Manual  Dataset Entry', ()=>{
  it('select dataset and do manual entry in it',()=>{
    cy.wait(2000)
    cy.visit('/')
    cy.visit('/dsm')
    cy.wait(2000)
    cy.fixture('dsm/manual-console').then((testData)=>{

       cy.wait(3000);
        cy.contains(testData.displayName).should('exist');
        cy.contains(testData.displayName).click({ force: true });
        cy.get('[data-cy="add-row-btn"]').click();
        testData.fieldValue.forEach((field,idx)=>{
          cy.get(`[cy-data=text-field-data-enter-${idx}]`).click().type(field.field);
        })
        cy.get('[data-cy="save-btn-manual-upload"]').click();
    })
  })
})