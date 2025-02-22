import SettingsPageObject from '../../../../support/pages/module/sw-settings.page-object';

const page = new SettingsPageObject();

describe('Number Range: Test crud number range', () => {
    beforeEach(() => {
        cy.openInitialPage(`${Cypress.env('admin')}#/sw/settings/number/range/index`);
    });

    it('@settings: create and read number range', { tags: ['pa-system-settings'] }, () => {
        cy.intercept({
            url: '/api/search/number-range',
            method: 'POST',
        }).as('saveData');

        cy.intercept({
            url: `${Cypress.env('apiPath')}/search/number-range-type`,
            method: 'POST',
        }).as('searchNumberRangeType');

        cy.intercept({
            url: `${Cypress.env('apiPath')}/search/sales-channel`,
            method: 'POST',
        }).as('searchSalesChannel');

        cy.get('.sw-skeleton').should('not.exist');
        cy.get('.sw-loader').should('not.exist');

        cy.get('a[href="#/sw/settings/number/range/create"]').click();

        // Create number range
        cy.get('input[name=sw-field--numberRange-name]').typeAndCheck('Name e2e');
        cy.get('input[name=sw-field--numberRange-description]').type('Description e2e');

        cy.get('#numberRangeTypes')
            .typeSingleSelectAndCheck(
                'Cancellation',
                '#numberRangeTypes',
            );

        cy.wait('@searchNumberRangeType')
            .its('response.statusCode').should('equal', 200);

        cy.wait('@searchSalesChannel').then(({ response }) => {
            const { attributes } = response.body.data[0];
            cy.get('.sw-multi-select').typeMultiSelectAndCheck(attributes.name);
        });
        cy.get(page.elements.numberRangeSaveAction).click();

        // Verify creation
        cy.wait('@saveData').its('response.statusCode').should('equal', 200);

        cy.get(page.elements.smartBarBack).click();
        cy.get('input.sw-search-bar__input').typeAndCheckSearchField('Name e2e');
        cy.get('.sw-settings-number-range-list-grid').should('be.visible');
        cy.contains(`${page.elements.dataGridRow}--0`, 'Name e2e').should('be.visible');
    });

    it('@settings: update and read number range', { tags: ['pa-system-settings'] }, () => {
        // Request we want to wait for later
        cy.intercept({
            url: '/api/number-range/*',
            method: 'PATCH',
        }).as('saveData');

        cy.get('.sw-skeleton').should('not.exist');
        cy.get('.sw-loader').should('not.exist');

        cy.clickContextMenuItem(
            '.sw-entity-listing__context-menu-edit-action',
            page.elements.contextMenuButton,
            `${page.elements.dataGridRow}--1`,
        );

        cy.get('input[name=sw-field--numberRange-name]').clear();
        cy.get('input[name=sw-field--numberRange-name]').clearTypeAndCheck('Cancellations update');
        cy.get(page.elements.numberRangeSaveAction).click();

        // Verify creation
        cy.wait('@saveData').its('response.statusCode').should('equal', 204);

        cy.get(page.elements.smartBarBack).click();
        cy.get('input.sw-search-bar__input').typeAndCheckSearchField('Cancellations update');
        cy.get('.sw-settings-number-range-list-grid').should('be.visible');
        cy.contains(`${page.elements.dataGridRow}--0`, 'Cancellations update').should('be.visible');
    });

    it('@settings: delete number range', { tags: ['pa-system-settings'] }, () => {
        // Request we want to wait for later
        cy.intercept({
            url: '/api/number-range/*',
            method: 'delete',
        }).as('deleteData');

        cy.get('.sw-skeleton').should('not.exist');
        cy.get('.sw-loader').should('not.exist');

        // Delete number range
        cy.clickContextMenuItem(
            `${page.elements.contextMenu}-item--danger`,
            page.elements.contextMenuButton,
            `${page.elements.dataGridRow}--0`,
        );
        cy.get('.sw-modal__body').should('be.visible');
        cy.get(`${page.elements.dataGridRow}--0 ${page.elements.numberRangeColumnName}`).then(row => {
            cy.contains('.sw-modal__body',
                `Are you sure you want to delete the number range "${row.text().trim()}"?`);
        });
        cy.get(`${page.elements.modal}__footer button${page.elements.dangerButton}`).click();

        // Verify deletion
        cy.wait('@deleteData').its('response.statusCode').should('equal', 204);

        cy.get(page.elements.modal).should('not.exist');
    });
});
