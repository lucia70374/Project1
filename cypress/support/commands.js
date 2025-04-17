// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
Cypress.Commands.add('popupMessageSignIn', (name, password) => {
    cy.get('#django-messages').invoke('text').then((text) => {
        expect(text.trim()).to.equal(`Logged in as ${name} with password ${password}`);
    });
});

Cypress.Commands.add('popupMessageLogOut', () => {
    cy.get('#django-messages').invoke('text').then((text) => {
        expect(text.trim()).to.equal('You have logged out.');
    });
});

// -- This is a parent command --
Cypress.Commands.add('signIn', (name, password) => {
    cy.session(['login', name], () => {
        // Sign in
        cy.visit('/login/?next=/');
        cy.get('.mb-5 center p a').last().invoke('text', 'Click here').scrollIntoView().click({force:true});
        cy.url().should('include', '/login/');
        cy.get('#id_username').scrollIntoView().type(name);
        cy.get('#id_password').scrollIntoView().type(password);
        cy.get('button').scrollIntoView().should('have.text', 'Create & Sign In').click({force:true});
        cy.popupMessageSignIn(name, password);

        // Logout so we could login in test
        cy.get('header .container-fluid .navbar-nav .nav-item.dropdown').find('[aria-label="Open user menu"]').click({force:true});
        cy.get('[data-bs-popper="static"] .dropdown-item').contains('a', 'Log Out').should('have.attr', 'href', '/logout/').click({ force: true });
        cy.popupMessageLogOut();
    }); 
});

Cypress.Commands.add('loginForm', (name, password) => {
    cy.get('form #id_username').type(name);
    cy.get('form #id_password').type(password);
    cy.get('[type="submit"]').click({force:true});
});

Cypress.Commands.add('loginPage', () => {
    cy.visit('/');
    cy.get('header [type="button"]').invoke('attr', 'href', '/login/?next=/').click({ force: true });
});

Cypress.Commands.add('popupMessageLogin', (name) => {
    cy.get('#django-messages').invoke('text').then((text) => {
        expect(text.trim()).to.equal(`Logged in as ${name}.`);
    });
});

Cypress.Commands.add('deviceTypeValidate', () => {
    // alias invoked text
    cy.get('#django-messages .toast-body').invoke('text').as('popup');

    // checking validation error
    cy.get('@popup').then((text) => { 
        cy.get('#django-messages .toast-body').should('have.text', text);
    });
});

Cypress.Commands.add('addManufacturer', (x) => {
    cy.visit('/login/?next=/dcim/device-types/add/');
    cy.get('#id_manufacturer-ts-control').type(x).scrollIntoView().click({force:true});// check this click?
    cy.get('#id_manufacturer-ts-dropdown [aria-selected="true"]').contains(x).scrollIntoView().click({force:true});
});

Cypress.Commands.add('createAndAddDeviceType', (x, y, z, n) => {
    // fill required fields
    cy.get('#id_model').clear().type(y).scrollIntoView().invoke('text', y);
    cy.get('#reslug').scrollIntoView().click();
    cy.get('#id_slug').scrollIntoView().invoke('val').then((text) => {
        expect(text).to.equal(z);
    });
    cy.get('#id_u_height').clear().scrollIntoView().type(n).should('have.value', n);

    // create and add button
    cy.get('.btn-float-group-right .btn-group').find('button').last().scrollIntoView().click({force:true});
    
    // if positive or negative number is not divided by 0.5
    if(!(n % 0.5 == 0 || n % -0.5 == -1)) {
        cy.get('.has-errors .col .form-text.text-danger').scrollIntoView().invoke('text').then((text) => {
            expect(text.trim()).to.equal('U height must be in increments of 0.5 rack units.');
        });
    } else {
        cy.deviceTypeValidate();
    }
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })