module Api
  module V1
    class LineItemsController < ApplicationController
      def index
        @line_items = LineItem.all
        render json: @line_items
      end

      def create
        @line_item = LineItem.new(line_item_params)
        if @line_item.save
          render json: @line_item, status: :created
        else
          render json: @line_item.errors, status: :unprocessable_entity
        end
      end

      def destroy
          @line_item = LineItem.find(params[:id])
          @line_item.destroy
          render json: { message: 'Line item deleted successfully' }, status: :ok
      end 

      private

      def line_item_params
        params.require(:line_item).permit(:id,:invoice_id, :description, :quantity, :unit_price)
      end
    end
  end
end 