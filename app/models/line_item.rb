class LineItem < ApplicationRecord
    belongs_to :invoice
    
    validates :quantity,  presence: true, numericality: { only_integer: true, greater_than: 0 }
    validates :unit_price,  presence: true, numericality: { greater_than_or_equal_to: 0 }

    before_save :set_total

    def set_total
        self.total = quantity.to_i * unit_price.to_f
    end 
end
