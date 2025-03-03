import { html } from 'lit';
import { TailwindElement } from '../shared/tailwind.element';

class InvoiceDetails extends TailwindElement() {
  static get properties() {
    return {
      invoice: { type: Object },
      isOpen: { type: Boolean },
      loading: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.invoice = null;
    this.isOpen = false;
    this.loading = false;
  }

  updated(changedProperties) {
    console.log('InvoiceDetails updated:', {
      invoice: this.invoice.invoice.descrip,
      isOpen: this.isOpen,
      changedProps: changedProperties
    });
  }

  render() {
    console.log('Rendering InvoiceDetails:', this.invoice);

    if (!this.isOpen) return '';
    
    return html`
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div class="pointer-events-auto w-screen max-w-md">
                <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <!-- Header -->
                  <div class="bg-indigo-700 py-6 px-4 sm:px-6">
                    <div class="flex items-center justify-between">
                      <h2 class="text-lg font-medium text-white">Invoice Details</h2>
                      <button @click=${this.close} class="text-white hover:text-gray-200">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Content -->
                  ${this.loading ? this.renderLoading() : this.renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderLoading() {
    return html`
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    `;
  }

  renderContent() {
    if (!this.invoice) return this.renderError();

    return html`
      <div class="relative flex-1 px-4 py-6 sm:px-6">
        <!-- Invoice Summary -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900">${this.invoice[0].invoice_number}</h3>
          <div class="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Customer</p>
              <p class="mt-1 text-sm text-gray-900">${this.invoice[0].customer_name}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Date</p>
              <p class="mt-1 text-sm text-gray-900">
                ${new Date(this.invoice[0].date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Status</p>
              <span class="mt-1 inline-flex rounded-full px-2 text-xs font-semibold
                ${this.getStatusColor(this.invoice[0].status)}">
                ${this.invoice[0].status}
              </span>
            </div>
          </div>
        </div>

        <!-- Line Items -->
        ${this.invoice.length > 0 ? html`
          <div class="border-t border-gray-200 pt-6">
            <h4 class="font-medium text-gray-900 mb-4">Line Items</h4>
            <div class="space-y-4">
              ${this.invoice.map(item => html`
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                      <p class="text-sm font-medium text-gray-900">Description</p>
                      <p class="mt-1 text-sm text-gray-500">${item.description}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Quantity</p>
                      <p class="mt-1 text-sm text-gray-500">${item.quantity}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Total</p>
                      <p class="mt-1 text-sm text-gray-500">$${item.total}</p>
                    </div>
                  </div>
                </div>
              `)}
            </div>
          </div>
        ` : html`
          <div class="text-center py-4 text-gray-500">
            No line items found
          </div>
        `}
      </div>
    `;
  }

  renderError() {
    return html`
      <div class="flex justify-center items-center h-64">
        <div class="text-center">
          <p class="text-gray-500">Unable to load invoice details</p>
        </div>
      </div>
    `;
  }

  close() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('close'));
  }

  getStatusColor(status) {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.draft;
  }
}

customElements.define('invoice-details', InvoiceDetails); 