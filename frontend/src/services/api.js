const BASE_URL = 'http://localhost:3000/api/v1';

export const InvoiceService = {
    async getAllInvoices() {
            const response = await fetch(`${BASE_URL}/invoices`);
            const data = await response.json();
            return data;
    },

    async createInvoice(invoice) {
        const response = await fetch(`${BASE_URL}/invoices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ invoice })
        });
        return response.json();
    },

    async getInvoiceById(id) {
        try {
            const response = await fetch(`${BASE_URL}/invoices/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch invoice details');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching invoice:', error);
            throw error;
        }
    },

    async updateInvoice(invoice) {
        const response = await fetch(`${BASE_URL}/invoices/${invoice.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ invoice })
        });
        return response.json();
    },

    async deleteLineItem(id) {
        const response = await fetch(`${BASE_URL}/line_items/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Failed to delete line item');
        }
        return response.json();
    }
}; 