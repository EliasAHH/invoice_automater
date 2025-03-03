import { html } from 'lit';
import { TailwindElement } from '../shared/tailwind.element';
import './invoice-list.js';
import './invoice-form.js';

class InvoiceApp extends TailwindElement() {
    static get properties() {
        return {
            view: { type: String },
            invoices: { type: Array }
        }
    }

    constructor() {
        super();
        this.view = 'list';
        this.invoices = [];
    }

    render() {
        return html`
        <div class="min-h-screen bg-gray-100 p-8">
            <div class="max-w-7xl mx-auto">
                <nav class="bg-white shadow-lg rounded-lg mb-8 p-4">
                    <div class="flex justify-between">
                        <button 
                            @click=${() => this.view = 'list'}
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            List Invoices
                        </button>
                        <button 
                            @click=${() => this.view = 'form'}
                            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                            Create Invoice
                        </button>
                    </div>
                </nav>

                ${this.view === 'list' 
                    ? html`<invoice-list></invoice-list>`
                    : html`<invoice-form></invoice-form>`
                }
            </div>
        </div>
        `
    }
}

customElements.define('invoice-app', InvoiceApp);
