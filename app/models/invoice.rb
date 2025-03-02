class Invoice < ApplicationRecord
    belongs_to :customer
    belongs_to :user
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
        subtotal = line_items.sum { |item| item.quantity * item.unit_price }
        tax = subtotal * 0.08 
        total = subtotal + tax
    end 

    private 

    def set_invoice_number
        last_number = Invoice.maximum(:invoice_number) || "INV-000000"
        invoice_number =  "INV-#{(last_number.split('-).to_last_i + 1').to_s.rjust(6,0))}"
    end 


end
