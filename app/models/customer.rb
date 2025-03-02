class Customer < ApplicationRecord
    has_many :invoices, dependent: :destroy

    validates :name, presence: true

    def total_outstanding
        invoices.unpaid.sum(:amount)
    end 

    def total_paid
        invoices.paid.sum(:amount)
    end 

    def outstanding_balance
        invoices.where(paid: false).sum(:total)
    end
    
    def payment_history
        invoices.where(paid: true).sum(:total)
    end 
end 