module Api
  module V1
    class InvoicesController < ApplicationController
        def index
            @invoices = Invoice.all
            render json: {invoices: @invoices, line_items: @invoices.line_items}
        end 

        def create
            ActiveRecord::Base.transaction do
                @customer = Customer.find_or_create_by!(name: params[:invoice][:customer_name])
                

                @invoice = @customer.invoices.build(
                    date: params[:invoice][:date],
                    line_items_attributes: process_line_items
                )
                
                if @invoice.save
                    render json: @invoice, status: :created
                else 
                    render json: @invoice.errors, status: :unprocessable_entity
                end
            end
        rescue ActiveRecord::RecordInvalid => e
            render json: { error: e.message }, status: :unprocessable_entity
        end 

        private 

        def invoice_params
            params.require(:invoice).permit(
                :date,
                line_items_attributes: [:description, :quantity, :unit_price]
            )
        end 

        def process_line_items
           params[:invoice][:line_items].map do |item|
                {
                        description: item[:description],
                        quantity: item[:quantity].to_s.to_i,
                        unit_price: item[:unit_price].to_s.to_f
                }
            end
        end
    end
  end
end
