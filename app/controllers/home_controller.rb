class HomeController < ApplicationController
  def index
    binding.break
    file_path = Rails.root.join('frontend', params[:path])
    send_file file_path if File.exist?(file_path)
  end
end 