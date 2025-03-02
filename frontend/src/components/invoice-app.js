 import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './invoice-list.js';
import './invoice-form.js';

class InvoiceApp extends LitElement {
    static get properties() {
        return {
            view : { type: String },
            invoices: { type: Array }
        }
    }

    constructor() {
        super();
        this.view = 'list';
        this.invoices = [];
    }

    static get styles() {
        return css`
        :host{
            display: block;
            padding: 1rem;
        }
        `
    }

    render() {
        return html`
        <div class="container">
        </div>
        `
    }
    
    
}
