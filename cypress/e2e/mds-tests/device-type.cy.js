/// <reference types="cypress" />
'use strict';
const fixtures = require('../../fixtures');
const timeStamp = Date.now();
const manufacturer = 'Arista';
let username, password, model, slug;
username = fixtures.profile.newUsername + '_' + timeStamp;
password = fixtures.profile.savedPassword + '_' + timeStamp;


const createDeviceType = (x, y, z, n) => {
    // fill required fields
    cy.get('#id_model').clear().type(y).scrollIntoView().invoke('val').then((text) => {
        expect(text).to.equal(y);
    });
    cy.get('#reslug').scrollIntoView().click();
    cy.get('#id_slug').scrollIntoView().invoke('val').then((text) => {
        expect(text).to.equal(z.toLowerCase());
    });
    cy.get('#id_u_height').clear().scrollIntoView().type(n).should('have.value', n);

    // create and add another button
    cy.get('.btn-float-group-right .btn-group').find('button').first().scrollIntoView().click({force:true});
    
    // if positive or negative number is not divided by 0.5
    if(!(n % 0.5 == 0 || n % -0.5 == -1)) {
        cy.get('.has-errors .col .form-text.text-danger').scrollIntoView().invoke('text').then((text) => {
            expect(text.trim()).to.equal('U height must be in increments of 0.5 rack units.');
        });
    } else {
        cy.deviceTypeValidate();
    }

    // validate table
    cy.get('#page-content h1.page-title').should('have.text', `${x} ${y}`);
    cy.get('#page-content .page-body small.text-muted').parent().invoke('text').then((text)=>{
        expect(text.trim().substr(0, 21)).to.include(y);
    });
    cy.get('#page-content .page-body small.text-muted').should('have.text', `${z.toLowerCase()}`);
    cy.get('#page-content .page-body i.text-danger').parent().parent().prev().children('td').should('have.text', n);
};

const addSameDeviceType = (x, y, z, n) => {
    y = x + ' ' + timeStamp;
    z = x.toLowerCase() + '-' + timeStamp;

    // add device type
    cy.createAndAddDeviceType(x, y, z, n);

    // add the same device type again
    cy.createAndAddDeviceType(x, y, z, n);
};

const addDeviceTypeToTable = (x, y, z, n) => {
    const timeRandom = Date.now();
    y = x + ' ' + timeRandom;
    z = x + '-' + timeRandom;

    // add device type
    createDeviceType(x, y, z, n);
};

const addDeviceType = (x, y, z, n) => {
    const timeRandom = Date.now();
    y = x + ' ' + timeRandom;
    z = x.toLowerCase() + '-' + timeRandom;

    // add device type
    cy.createAndAddDeviceType(x, y, z, n);
};

describe('Device Type', () => {
    beforeEach('Sign in an account user', () => {
        cy.signIn(username, password)

        // Navigate to the login page
        cy.loginPage();

        // Fill the form
        cy.loginForm(username, password);

        // Validate login
        cy.popupMessageLogin(username);
    })

    it('Device Type/1', () => {
        // Navigate to the device type page
        cy.addManufacturer(manufacturer);
    
        // Validate adding device types
        addDeviceType(manufacturer, model, slug, 21);
        addDeviceType(manufacturer, model, slug, 34);
        addDeviceType(manufacturer, model, slug, 15);
        addDeviceType(manufacturer, model, slug, 19);
        addDeviceType(manufacturer, model, slug, 21);
        /*addDeviceType(manufacturer, model, slug, 34);
        addDeviceType(manufacturer, model, slug, 1.5);
        addDeviceType(manufacturer, model, slug, 19);
        addDeviceType(manufacturer, model, slug, 21);
        addDeviceType(manufacturer, model, slug, 34);
        addDeviceType(manufacturer, model, slug, 15);
        addDeviceType(manufacturer, model, slug, 19);
        addDeviceType(manufacturer, model, slug, 2.1);
        addDeviceType(manufacturer, model, slug, 34);
        addDeviceType(manufacturer, model, slug, 15);
        addDeviceType(manufacturer, model, slug, 19);
        addDeviceType(manufacturer, model, slug, 21);
        addDeviceType(manufacturer, model, slug, 34.3);
        addDeviceType(manufacturer, model, slug, 15);
        addDeviceType(manufacturer, model, slug, 1.9);
        addDeviceType(manufacturer, model, slug, 21);
        addDeviceType(manufacturer, model, slug, 3.4);
        addDeviceType(manufacturer, model, slug, -1.5);
        addDeviceType(manufacturer, model, slug, 0.2);
        addDeviceType(manufacturer, model, slug, 1.1);
        addDeviceType(manufacturer, model, slug, 2.3);
        addDeviceType(manufacturer, model, slug, 0.4);
        addDeviceType(manufacturer, model, slug, 1.5);
        addDeviceType(manufacturer, model, slug, 0);
        addDeviceType(manufacturer, model, slug, -1);
        addDeviceType(manufacturer, model, slug, -0.1);
        addDeviceType(manufacturer, model, slug, -1.5);
        addDeviceType(manufacturer, model, slug, -2.5);*/
    })

    it('Device Type/2', () => {
        // Navigate to the device type page
        cy.addManufacturer(manufacturer);
    
        // Add same device tipe twice and check for errors
        addSameDeviceType(manufacturer, model, slug, 12);
    })

    it('Device Type/3', () => {
        // Navigate to the device type page
        cy.addManufacturer(manufacturer);
    
        // Add device and check table
        addDeviceTypeToTable(manufacturer, model, slug, 15)
    })
})
