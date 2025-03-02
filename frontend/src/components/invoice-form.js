import { LitElement, html } from 'lit';

class InvoiceForm extends LitElement {
  static get properties() {
    return {
      invoice: { type: Object },
      isEditing: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.invoice = {
      customer_name: '',
      date: new Date().toISOString().split('T')[0],
      line_items: [this.createEmptyLineItem()]
    };
    this.isEditing = false;
  }


  createEmptyLineItem() {
    return {
      description: '',
      quantity: 1,
      unit_price: 0
    };
  }

  render() {
    return html`
      <div class="mt-8 max-w-3xl mx-auto">
        <form @submit=${this.handleSubmit} class="space-y-8 divide-y divide-gray-200">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                ${this.isEditing ? 'Edit Invoice' : 'Create New Invoice'}
              </h3>
            </div>

            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6 sm:col-span-3">
                <label class="block text-sm font-medium text-gray-700">Customer Name</label>
                <input type="text" 
                  .value=${this.invoice.customer_name}
                  @input=${e => this.updateInvoice('customer_name', e.target.value)}
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              </div>

              <div class="col-span-6 sm:col-span-3">
                <label class="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" 
                  .value=${this.invoice.date}
                  @input=${e => this.updateInvoice('date', e.target.value)}
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <h4 class="text-md font-medium text-gray-900">Line Items</h4>
                <button type="button" 
                  @click=${this.addLineItem}
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Add Item
                </button>
              </div>

              ${this.invoice.line_items.map((item, index) => html`
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-6">
                    <input type="text" 
                      placeholder="Description"
                      .value=${item.description}
                      @input=${e => this.updateLineItem(index, 'description', e.target.value)}
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  </div>
                  <div class="col-span-2">
                    <input type="number" 
                      placeholder="Quantity"
                      .value=${item.quantity}
                      @input=${e => this.updateLineItem(index, 'quantity', e.target.value)}
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  </div>
                  <div class="col-span-2">
                    <input type="number" 
                      placeholder="Price"
                      .value=${item.unit_price}
                      @input=${e => this.updateLineItem(index, 'unit_price', e.target.value)}
                      class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  </div>
                  <div class="col-span-2">
                    <button type="button"
                      @click=${() => this.removeLineItem(index)}
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Remove
                    </button>
                  </div>
                </div>
              `)}
            </div>
          </div>

          <div class="pt-5">
            <div class="flex justify-end">
              <button type="submit"
                class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                ${this.isEditing ? 'Update Invoice' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </form>
      </div>
    `;
  }

  updateInvoice(field, value) {
    this.invoice = {
      ...this.invoice,
      [field]: value
    };
  }

  updateLineItem(index, field, value) {
    const lineItems = [...this.invoice.line_items];
    lineItems[index] = {
      ...lineItems[index],
      [field]: value
    };
    this.updateInvoice('line_items', lineItems);
  }

  addLineItem() {
    this.updateInvoice('line_items', [...this.invoice.line_items, this.createEmptyLineItem()]);
  }

  removeLineItem(index) {
    const lineItems = this.invoice.line_items.filter((_, i) => i !== index);
    this.updateInvoice('line_items', lineItems);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const url = 'http://localhost:3000/api/v1/invoices';
    const method = this.isEditing ? 'PATCH' : 'POST';
    const path = this.isEditing ? `${url}/${this.invoice.id}` : url;

    try {
      const response = await fetch(path, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoice: this.invoice })
      });

      if (response.ok) {
        this.dispatchEvent(new CustomEvent('save-invoice', {
          bubbles: true,
          composed: true
        }));
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  }
}

customElements.define('invoice-form', InvoiceForm);
