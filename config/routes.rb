Plan::Application.routes.draw do
  namespace :api do
    resources :pages, only: [:index, :show, :create, :destroy], format: :json do
      match 'items', to: 'pages#items', format: :json
      match 'add_item', to: 'pages#add_item', via: :post, format: :json
      match 'remove_items', to: 'pages#remove_items', via: :delete, format: :json
    end
    resources :items, only: [:create, :update], format: :json
    match 'search_items', to: 'items#search_items', format: :json
  end

  root to: 'root#index'
  match '*path' => 'root#index', via: :get
end
