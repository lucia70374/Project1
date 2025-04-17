/// <reference types="cypress" />
'use strict';
const fixtures = require('../../fixtures');

const timeStamp = Date.now();
let username, password;
username = fixtures.profile.newUsername + '_' + timeStamp;
password = fixtures.profile.savedPassword + '_' + timeStamp;

const popupMessageError = () => {
    cy.get('#django-messages .toast-header').invoke('text').then((text) => {
        expect(text.trim()).to.equal('Error');
    });
    cy.get('#django-messages .toast-body').invoke('text').then((text) => {
        expect(text.trim()).to.equal('Please enter a correct username and password. Note that both fields may be case-sensitive.');
    });
};
const errorListMessages = () => {
    cy.get('[role="alert"] .alert-heading').invoke('text').then((text) => {
        expect(text).to.equal('Errors');
    });
    cy.get('ul>li').invoke('text').then((text) => {
        expect(text.trim()).to.equal('Please enter a correct username and password. Note that both fields may be case-sensitive.');
    });
};

describe('Login Functionality', () => {
    beforeEach('Sign in an account user', () => {
        
        cy.signIn(username, password)
    })

    it('Login Functionality/1', () => {
        // Navigate to the login page
        cy.loginPage();

        // Fill the form
        cy.loginForm(username, password);

        // Validate login
        cy.popupMessageLogin(username);
    })

    it('Login Functionality/2', () => {
       // Navigate to the login page
        cy.loginPage();

        // Fill the form
        cy.loginForm(username, fixtures.profile.newPassword);

        // Validate login error
        popupMessageError();

        // Validate list of error messages
        errorListMessages();
    })

    
});
