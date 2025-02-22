// / <reference types="Cypress" />

import ProductPageObject from '../../../../support/pages/module/sw-product.page-object';

describe('Product: Tagging product', () => {
    beforeEach(() => {
        cy.createProductFixture().then(() => {
            return cy.createDefaultFixture('tag');
        })
            .then(() => {
                cy.openInitialPage(`${Cypress.env('admin')}#/sw/product/index`);
                cy.get('.sw-skeleton').should('not.exist');
                cy.get('.sw-loader').should('not.exist');
            });
    });

    it('@catalogue: edit a product\'s tags', { tags: ['pa-inventory'] }, () => {
        const page = new ProductPageObject();

        // Request we want to wait for later
        cy.intercept({
            url: `${Cypress.env('apiPath')}/_action/sync`,
            method: 'POST',
        }).as('saveData');

        cy.clickContextMenuItem(
            '.sw-entity-listing__context-menu-edit-action',
            page.elements.contextMenuButton,
            `${page.elements.dataGridRow}--0`,
        );

        // Use existing ones
        cy.get('.sw-product-category-form__tag-field').click();
        cy.get('.sw-product-category-form__tag-field input').type('Schöner');
        cy.contains('Schöner Tag').click();
        cy.contains('.sw-product-category-form__tag-field .sw-label', 'Schöner Tag');

        // Add existing tag
        cy.get(`.product-basic-form ${page.elements.loader}`).should('not.exist');
        cy.contains(page.elements.smartBarHeader, 'Product name');
        cy.get('.sw-product-category-form__tag-field').should('be.visible');

        // Create new tag
        cy.get('.sw-product-category-form__tag-field input').clear();
        page.createTag('What does it means[TM]???');

        // Save product with tag
        cy.get(page.elements.productSaveAction).click();

        // Verify updated product
        cy.wait('@saveData').its('response.statusCode').should('equal', 200);
        cy.get(page.elements.successIcon).should('be.visible');
    });
});
