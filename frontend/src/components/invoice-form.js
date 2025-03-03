import { html } from 'lit';
import { TailwindElement } from '../shared/tailwind.element';
import { InvoiceService } from '../services/api';

class InvoiceForm extends TailwindElement() {
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
      notes: '',
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
      <div class="bg-white shadow-lg rounded-lg p-6">
        <form @submit=${this.handleSubmit} class="space-y-8">
          <!-- Customer Info Section -->
          <div class="space-y-6 border-b border-gray-200 pb-6">
            <h3 class="text-lg font-medium text-gray-900">Customer Information</h3>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Customer Name</label>
                <input type="text" 
                  .value=${this.invoice.customer_name}
                  @input=${e => this.updateInvoice('customer_name', e.target.value)}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Invoice Date</label>
                <input type="date" 
                  .value=${this.invoice.date}
                  @input=${e => this.updateInvoice('date', e.target.value)}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  .value=${this.invoice.notes || ''}
                  @input=${e => this.updateInvoice('notes', e.target.value)}
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Add any additional notes here..."></textarea>
              </div>
            </div>
          </div>

          <!-- Line Items Section -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">Line Items</h3>
              <button type="button" 
                @click=${this.addLineItem}
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Add Item
              </button>
            </div>

            ${this.invoice.line_items.map((item, index) => html`
              <div class="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg">
                <div class="col-span-6">
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <input type="text" 
                    .value=${item.description}
                    @input=${e => this.updateLineItem(index, 'description', e.target.value)}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                </div>
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Quantity</label>
                  <input type="number" 
                    .value=${item.quantity}
                    @input=${e => this.updateLineItem(index, 'quantity', e.target.value)}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                </div>
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Unit Price</label>
                  <input type="number" 
                    .value=${item.unit_price}
                    @input=${e => this.updateLineItem(index, 'unit_price', e.target.value)}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                </div>
                <div class="col-span-2 flex items-end">
                  <button type="button"
                    @click=${() => this.removeLineItem(index)}
                    class="w-full px-3 py-2 border border-transparent text-sm rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                    Remove
                  </button>
                </div>
              </div>
            `)}
          </div>

          <!-- Submit Section -->
          <div class="pt-5 border-t border-gray-200">
            <div class="flex justify-end space-x-3">
              <button type="button"
                @click=${this.cancel}
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
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

  cancel() {
    this.invoice = {
      customer_name: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      line_items: [this.createEmptyLineItem()]
    };

    this.dispatchEvent(new CustomEvent('cancel-form', {
      bubbles: true,
      composed: true
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const response = this.editing ?  await InvoiceService.updateInvoice(this.invoice) : await InvoiceService.createInvoice(this.invoice)

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

customElements.define('invoice-form', InvoiceForm);
