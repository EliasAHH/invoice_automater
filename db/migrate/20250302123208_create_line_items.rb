class CreateLineItems < ActiveRecord::Migration[7.0]
  def change
    create_table :line_items do |t|
      t.references :invoice, null: false, foreign_key: true
      t.string :description, null: false
      t.decimal :quantity, null: false, precision: 10, scale: 2
      t.decimal :unit_price, null: false, precision: 10, scale: 2
      t.decimal :total, null: false, precision: 10, scale: 2

      t.timestamps
    end
  end
end
