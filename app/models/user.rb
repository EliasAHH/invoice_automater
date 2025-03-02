class User < ApplicationRecord

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :invoices, dependent: :destroy
  has_many :customers, through: :invoices
end
