class ApplicationController < ActionController::API
    rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
    rescue_from ActionController::ParameterMissing, with: :parameter_missing


    private 

    def not_found
        render json: {error: 'Not Found'}, status: :not_found
    end 

    def parameter_missing
        render json: {error: 'Missing Parameter'}, status: :missing_parameter
    end 
end
