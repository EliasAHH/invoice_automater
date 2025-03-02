class Invoice < ApplicationRecord
    belongs_to :customer
    belongs_to :user

    enum status: {
        draft: 0,
        sent: 1,
        paid: 2,
        overdue: 3
    }
end
