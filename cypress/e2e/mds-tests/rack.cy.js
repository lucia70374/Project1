/// <reference types="cypress" />
'use strict';
const fixtures = require('../../fixtures');
const timeStamp = Date.now();
const manufacturer = 'Arista';
const deviceName = 'Tokio';
const deviceRole = 'Application Server';
const site = 'DM-Akron';
let username, password, model, slug, rackName;
username = fixtures.profile.newUsername + '_' + timeStamp;
password = fixtures.profile.savedPassword + '_' + timeStamp;
rackName = deviceName + '-' + timeStamp;
//const maxVal = 42;
//let rackList = [];

const lowestPosition22 = () => {
    cy.get('#id_position').select('/\bU1\b/');
}

const toFullPosition20 = () => {
    cy.get('#id_position').select('/\bU23\b/');
}

const basicDeviceFields = (rn, dr, si, dn, y) => {
    // navigate to the add device page
    cy.visit('/dcim/devices/add/');

    // device name
    cy.get('#id_name').type(dn).scrollIntoView().click({force:true});

    // device role
    cy.get('#id_role-ts-control').type(dr).scrollIntoView().click({force:true});
    cy.get('#id_role-ts-dropdown [aria-selected="true"]').contains(dr).scrollIntoView().click({force:true});

    // find created device type
    cy.get('#id_device_type-ts-control').type(y).scrollIntoView().click({force:true});
    cy.get('#id_device_type-ts-dropdown div').contains(y).scrollIntoView().click({force:true});
    
    // site name
    cy.get('#id_site-ts-control').type(si).scrollIntoView().click({force:true}); 
    cy.get('#id_site-ts-dropdown [aria-selected="true"]').contains(si).scrollIntoView().click({force:true});

    // find created rack name
    cy.get('#id_rack-ts-control').type(rn).scrollIntoView().click({force:true});
    cy.get('#id_rack-ts-dropdown [aria-selected="true"]').invoke('text', rn).scrollIntoView().click({force:true});

}

const rackFaceFront = () => {
    cy.get('#id_face-ts-control').type('Front')
    cy.get('#id_face-ts-dropdown [aria-selected="true"]').contains('Front').scrollIntoView().click({force:true});
};

const rackFaceRear = () => {
    cy.get('#id_face-ts-control').type('Rear')
    cy.get('#id_face-ts-dropdown [aria-selected="true"]').contains('Rear').scrollIntoView().click({force:true});
};

const createDevice1 = (rn, dr, si, dn, y) => {
    // device requirements
    basicDeviceFields(rn, dr, si, dn, y)

    // choose rack face
    rackFaceFront();

    //choose position
    lowestPosition22();

    // create and add button
    cy.get('.btn-float-group-right .btn-group').find('button').last().scrollIntoView().click({force:true});

    cy.deviceTypeValidate();
};

const createDevice2 = (rn, dr, si, dn, y) => {
    // device requirements
    basicDeviceFields(rn, dr, si, dn, y)

    // choose rack face
    rackFaceFront();

    //choose position
    toFullPosition20();

    // create and add button
    cy.get('.btn-float-group-right .btn-group').find('button').last().scrollIntoView().click({force:true});

    cy.deviceTypeValidate();
};

const addRack = (si, rn) => {
    cy.visit('/dcim/racks/add/');
    cy.get('#id_site-ts-control').type(si).click({force:true});
    cy.get('#id_site-ts-dropdown [aria-selected="true"]').invoke('text', si).scrollIntoView().click({force:true});
    cy.wait(2000);
    cy.get('#id_name').type(rn);

    // create button
    cy.get('.btn-float-group-right .btn-group').find('button').first().scrollIntoView().click({force:true});

    // verify creation
    cy.deviceTypeValidate()
};

const alertList = () => {
    cy.get('#form_fields .alert .alert-danger li').invoke('text').as('alert');
    cy.get('@alert').then((text) => { 
        cy.get('#form_fields .alert .alert-danger li').should('have.text', text);
    });
};

const addDevices1 = (rn, dr, si, dn, x, y, z, n) => {
    const timeRandom = Date.now();
    y = x + ' ' + timeRandom;
    z = x.toLowerCase() + '-' + timeRandom;
    dn = dn + '-' + timeRandom;
    // Navigate to the device type page
    cy.addManufacturer(x);
    cy.createAndAddDeviceType(x, y, z, n);
    createDevice1(rn, dr, si, dn, y);
};

const addDevices2 = (rn, dr, si, dn, x, y, z, n) => {
    const timeRandom = Date.now();
    y = x + ' ' + timeRandom;
    z = x.toLowerCase() + '-' + timeRandom;
    dn = dn + '-' + timeRandom;
    // Navigate to the device type page
    cy.addManufacturer(x);
    cy.createAndAddDeviceType(x, y, z, n);
    createDevice2(rn, dr, si, dn, y);
};

describe('Rack', () => {
    beforeEach('Sign in an account user', () => {
        cy.signIn(username, password)

        // Navigate to the login page
        cy.loginPage();

        // Fill the form
        cy.loginForm(username, password);

        // Validate login
        cy.popupMessageLogin(username);

        // Add Rack
        addRack(site, rackName);
    })
    
    it('Rack/1', () => {
        // Validate adding device types
        addDevices1(rackName, deviceRole, site, deviceName, manufacturer, model, slug, 22);
        addDevices2(rackName, deviceRole, site, deviceName, manufacturer, model, slug, 20);
    })
})
