describe('csv file will able to upload sucessfully', ()=> {
  it('extract file and upload it',()=>{
    cy.wait(2000)
    cy.visit('/')
    cy.visit('/dsm')
    cy.wait(2000)
    cy.fixture('dsm/upload-csv').then((testData)=>{
        cy.contains(testData.displayName).should('exist');
        cy.contains(testData.displayName).click({ force: true });
        cy.get('[data-cy="upload-csv-btn"]').click();
        // cy.get('[data-cy="choose-file-btn"]').selectFile('cypress/fixtures/dsm/addresses.csv',{ action: 'drag-drop' })
    })
    const filepath = 'dsm/addresses.csv'
    cy.get('data-cy="choose-file-btn').click()
    cy.get('[data-cy="choose-file-btn"]').attachFile(filepath)
    
    cy.get('#uploaded-files').contains('addresses.csv')
      
    
  })
})

