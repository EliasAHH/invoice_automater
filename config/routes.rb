Rails.application.routes.draw do
  resources :line_items
  devise_for :users
  resources :create_invoices

  namespace :api do
    resources :line_items, only: [:create, :update, :destroy]
  end 
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
