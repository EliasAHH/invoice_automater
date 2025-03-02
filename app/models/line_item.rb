class LineItem < ApplicationRecord
    belongs_to :invoice

    validates :description,  presence: true
    validates :quantity,  presence: true, numericality: { greater_than: 0 }
    validates :unit_price,  presence: true, numericality: { greater_than_or_equal_to: 0 }

    before_save :set_total

    def set_total
        total = quantity * unit_price
    end 
    
end
