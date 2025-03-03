import { html } from 'lit';
import { TailwindElement } from '../shared/tailwind.element';
import { InvoiceService } from '../services/api';
import './invoice-details';

class InvoiceList extends TailwindElement() {
  static get properties() {
    return {
      invoices: { type: Array },
      selectedInvoice: { type: Object },
      isDetailsOpen: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.invoices = [];
    this.selectedInvoice = null;
    this.isDetailsOpen = false;
    
    // Bind the method to this instance
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('status-updated', this.handleStatusUpdate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('status-updated', this.handleStatusUpdate);
  }

  handleStatusUpdate(e) {
    const { invoiceId, newStatus } = e.detail;
    // Update the status in the list
    this.invoices = this.invoices.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, status: newStatus }
        : invoice
    );
    
    // Dispatch event to parent for global refresh
    this.dispatchEvent(new CustomEvent('invoice-updated', {
      bubbles: true,
      composed: true
    }));
  }

  async showInvoiceDetails(invoice) {
    try {
      this.isDetailsOpen = true;
      console.log('Fetching invoice details for:', invoice.id);
      const fullInvoiceDetails = await InvoiceService.getInvoiceById(invoice.id);
      console.log('Received invoice details:', fullInvoiceDetails);
      this.selectedInvoice = fullInvoiceDetails;
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    }
  }

  closeDetails() {
    this.isDetailsOpen = false;
    this.selectedInvoice = null;
  }

  render() {
    // added this because I was having an issue where list was undefined even though it was defined in the constructor and was getting back a 200 response.
    if (!this.invoices || this.invoices.length === 0) {
      return this.renderEmptyState();
    }

    return html`
      <div class="space-y-4">
        ${this.invoices.map(invoice => html`
          <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
            <div 
              @click=${() => this.showInvoiceDetails(invoice)}
              class="p-4 cursor-pointer hover:bg-gray-50"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span class="text-indigo-600 font-semibold text-sm">INV</span>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">${invoice.invoice_number}</h3>
                    <p class="text-sm text-gray-500">${invoice.customer_name}</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-4">
                  <div class="text-right">
                    <p class="text-sm text-gray-500">${new Date(invoice.date).toLocaleDateString()}</p>
                    <span class="mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${this.getStatusColor(invoice.status)}">
                      ${invoice.status}
                    </span>
                  </div>
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        `)}
      </div>

      <invoice-details 
        .invoice=${this.selectedInvoice}
        .isOpen=${this.isDetailsOpen}
        @close=${this.closeDetails}>
      </invoice-details>
    `;
  }

  renderEmptyState() {
    return html`
      <div class="mt-8 text-center">
        <div class="bg-white p-8 rounded-lg shadow">
          <div class="h-12 w-12 mx-auto rounded-full bg-indigo-100 flex items-center justify-center">
            <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No Invoices Yet</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating your first invoice.</p>
        </div>
      </div>
    `;
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

customElements.define('invoice-list', InvoiceList);
