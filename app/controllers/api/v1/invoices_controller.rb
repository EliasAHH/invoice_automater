module Api
  module V1
    class InvoicesController < ApplicationController
        def index
            @invoices = Invoice.all
            render json: @invoices
        end 

        def create
            ActiveRecord::Base.transaction do
                @customer = Customer.find_or_create_by!(name: params[:invoice][:customer_name])
                
                processed_params = process_line_items(invoice_params)
                @invoice = @customer.invoices.build(processed_params)
                
                if @invoice.save
                    render json: @invoice, status: :created
                else 
                    binding.break
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

        def process_line_items(params)
            return params unless params[:line_items_attributes]

            params[:line_items_attributes].each do |item|
                item[:quantity] = item[:quantity].to_i
                item[:unit_price] = item[:unit_price].to_d
            end
            params
        end
    end
  end
end
