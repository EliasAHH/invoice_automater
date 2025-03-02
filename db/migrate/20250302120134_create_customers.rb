class CreateCustomers < ActiveRecord::Migration[7.0]
  def change
    create_table :customers do |t|
      t.string :name, null: false
      t.string :email
      t.string :phone
      t.string :notes
      t.timestamps
    end
  end
end
