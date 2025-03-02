Rails.application.routes.draw do
  resources :line_items
  devise_for :users
  resources :create_invoices

  namespace :api do
    namespace :v1 do
      resources :invoices do
        resources :line_items, shallow: true
      end
      devise_for :users
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

end
