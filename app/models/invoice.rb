class Invoice < ApplicationRecord
    belongs_to :customer
    has_many :line_items, dependent: :destroy
    accepts_nested_attributes_for :line_items, allow_destroy: true

    enum status: {
        draft: 0,
        sent: 1,
        paid: 2,
        overdue: 3
    }

    validates :date, presence: true 
    validates :invoice_number, presence: true, uniqueness: true

    before_validation :set_invoice_number, on: :create
    before_save :calculate_total


    def calculate_total
        self.subtotal = line_items.sum { |item| item.quantity * item.unit_price }
        self.total = (self.tax == 0.0 ? 1.08 : self.tax) * subtotal
    end 


    private 

    def set_invoice_number
        last_number = Invoice.maximum(:invoice_number) || "INV-000000"
        last_sequence = last_number.split('-').last.to_i
        next_sequence = (last_sequence + 1).to_s.rjust(6, '0')
        self.invoice_number = "INV-#{next_sequence}"
    end 


end
