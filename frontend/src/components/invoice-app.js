import { html } from 'lit';
import { TailwindElement } from '../shared/tailwind.element';
import { InvoiceService } from '../services/api';
import './invoice-list.js';
import './invoice-form.js';

class InvoiceApp extends TailwindElement() {
    static get properties() {
        return {
            view: { type: String },
            invoices: { type: Array },
            loading: { type: Boolean }
        }
    }

    constructor() {
        super();
        this.view = 'list';
        this.invoices = [];
        this.loading = true;
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadInvoices();
    }

    async loadInvoices() {
        try {
            this.loading = true;
            const data = await InvoiceService.getAllInvoices();
            this.invoices = [...(data || [])];
            
        } catch (error) {
            console.error('Failed to load invoices:', error);
            this.invoices = [];
        } finally {
            this.loading = false;
            console.log('Final invoices state:', this.invoices);
        }
    }

    render() {
        return html`
        <div class="min-h-screen bg-gray-100 p-8">
            <div class="max-w-7xl mx-auto">
                <header class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">Invoice Manager</h1>
                </header>

                <nav class="bg-white shadow-lg rounded-lg mb-8 p-4">
                    <div class="flex justify-between">
                        <button 
                            @click=${() => this.view = 'list'}
                            class="px-4 py-2 ${this.view === 'list' ? 'bg-blue-500' : 'bg-gray-200'} text-white rounded hover:bg-blue-600">
                            List Invoices
                        </button>
                        <button 
                            @click=${() => this.view = 'form'}
                            class="px-4 py-2 ${this.view === 'form' ? 'bg-green-500' : 'bg-gray-200'} text-white rounded hover:bg-green-600">
                            Create Invoice
                        </button>
                    </div>
                </nav>

                ${this.renderContent()}
            </div>
        </div>
        `
    }

    renderContent() {
        if (this.loading) {
            return this.renderLoading();
        }

        return html`
            ${this.view === 'list' 
                ? html`<invoice-list 
                    .invoices="${this.invoices || []}"
                    @invoice-updated=${() => this.handleInvoiceUpdate()}
                  ></invoice-list>`
                : html`<invoice-form 
                    @save-invoice=${this.handleSave}
                    @cancel-form=${() => this.view = 'list'}
                  ></invoice-form>`
            }
        `;
    }

    renderLoading() {
        return html`
            <div class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        `;
    }

    async handleSave(e) {
        await this.loadInvoices();
        this.view = 'list';
    }

    handleEdit(e) {
        this.view = 'form';
    }

    async handleInvoiceUpdate() {
        await this.loadInvoices();
    }
}

customElements.define('invoice-app', InvoiceApp);
