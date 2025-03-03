class CreateInvoices < ActiveRecord::Migration[7.0]
  def change
    create_table :invoices do |t|
      t.references :customer, null: false, foreign_key: true
      t.string :invoice_number, null: false
      t.float :subtotal, precision: 10, scale: 2, default: 0
      t.float :tax, precision: 10, scale: 2, default: 0
      t.float :total, precision: 10, scale: 2, default: 0
      t.boolean :paid, default: false
      t.date :date, null: false
      t.date :due_date
      t.integer :status, default: 0
      t.text :notes
      t.timestamps
    end
  end
end
