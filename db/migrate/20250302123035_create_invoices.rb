class CreateInvoices < ActiveRecord::Migration[7.0]
  def change
    create_table :invoices do |t|
      t.references :customer, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :invoice_number, null: false
      t.decimal :amount, precision: 10, scale: 2, default: 0
      t.date :due_date
      t.integer :status, default: 0
      t.datetime :sent_at
      t.datetime :paid_at
      t.text :notes
      t.timestamps
    end
  end
end
