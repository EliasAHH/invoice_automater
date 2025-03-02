import { LitElement, html } from 'lit';
import './invoice-list'
import './invoice-form'

class Invoice extends LitElement {
    static properties = {
        view: { type: String }
    };

    constructor() {
        super();
        this.view = 'list';
    }

    render() {
        return html `
        <div class="invoice-app">
            <nav>
                <button @click=${() => this.view = 'list'}> List Invoices </button> 
                <button @click=${() => this.view = 'form'}> Create Invoice </button>
            </nav>

            ${this.view === 'list' ?
                html`<invoice-list @edit-invoice=${this.handleEdit}></invoice-list>`:
                html`<invoice-form @save-invoice=${this.handleSave}></invoice-form>` }
        </div>
        `
    }

    handleEdit(e) {
        this.view = 'edit';
        const invoice = e.detail
        // TODO: Implement function in invoice-form to handle patch request. 
    }

    handleSave() {
        this.view = 'list';
        // TODO: Implement function in invoice-form to handle post request. 
    }
    // TODO: Maybe add a delete feature here but we'll see. 
}

customElements.define('invoice-automater', Invoice);
