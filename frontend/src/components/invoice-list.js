import { LitElement, html } from 'lit';

class InvoiceList extends LitElement {
  static get properties() {
    return {
      invoices: { type: Array }
    };
  }

  constructor() {
    super();
    this.invoices = [];
  }

  
  render() {
    return html`
      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">Invoices</h2>
        <div class="bg-white shadow overflow-hidden rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${this.invoices.map(invoice => html`
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${invoice.invoice_number}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${invoice.date}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${invoice.customer_name}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${invoice.total}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${this.getStatusColor(invoice.status)}">
                      ${invoice.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      @click=${() => this.editInvoice(invoice)}
                      class="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </button>
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
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

  editInvoice(invoice) {
    this.dispatchEvent(new CustomEvent('edit-invoice', {
      detail: invoice,
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('invoice-list', InvoiceList);
