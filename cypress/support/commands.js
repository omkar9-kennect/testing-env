Cypress.Commands.add('setKXAuthToken', (username, password) => {
  const log = Cypress.log({
    displayName: 'AUTH LOGIN',
    message: [`🔐 Authenticating | API`],
    // @ts-ignore
    autoEnd: false,
  });
  log.snapshot('before');
  cy.request({
    method: 'POST',
    url: Cypress.env('AUTH_URL'),
    body: {
      username: username ? username : Cypress.env('MORTAL_AUTH_USERNAME'),
      password: password ? password : Cypress.env('MORTAL_AUTH_PASSWORD'),
    },
    headers: {
      'Content-Type': `application/json`,
    },
  })
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
      expect(res.body.ok).to.equal(true);
    })
    .as('body');

  cy.get('@body').then((as) => {
    let responseBody  = as.body
    if (responseBody) {
      cy.window().then((win) => {
        console.log(responseBody)
        win.sessionStorage.setItem('auth', responseBody.token);
        win.sessionStorage.setItem('userType', responseBody.mortal.pType);
        win.sessionStorage.setItem('mortal', JSON.stringify(responseBody.mortal));
      });
      cy.window().then((win) => {
        
        const storedToken = win.sessionStorage.getItem('auth');
        // console.log(storedToken)
        expect(storedToken).to.equal(responseBody.token);
        cy.log('Cypress Session Auth Token 🔒 Set');
      });
    }
  });
  log.snapshot('after');
  log.end();
});

Cypress.Commands.add('setLocalAuthToken', (fixtureFileName) => {
  const log = Cypress.log({
    displayName: 'AUTH LOGIN',
    message: [`🔐 Authenticating | LOCAL`],
    // @ts-ignore
    autoEnd: false,
  });
  log.snapshot('before');
  cy.fixture(
    fixtureFileName ? fixtureFileName : Cypress.env('AUTH_LOCAL_FILE')
  ).then((authData) => {
    const token = authData.token;
    cy.window().then((win) => {
      win.sessionStorage.setItem('auth', token);
    });
  });
  log.snapshot('after');
  log.end();
});
