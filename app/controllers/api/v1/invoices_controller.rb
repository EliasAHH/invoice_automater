module Api
  module V1
    class InvoicesController < ApplicationController
        def index
            @invoices = Invoice.all
            render json: @invoices
        end 

        def create
            @invoice = Invoice.new(invoice_params)
            if @invoice.save
                render json: @invoice, status: :created
            else 
                render json: @invoice.errors, status: :unprocessable_entity
            end 
        end 

        private 

        def invoice_params
            params.require(:invoice).permit(:date, :customer_name,:total, line_items_attributes: [:id, :description, :quantity, :unit_price])
        end 
    end
  end
end
