Plan::Application.routes.draw do
  resources :pages, only: [:index, :show, :create], format: :json do
    match 'items', to: 'pages#items', format: :json
    match 'add_item', to: 'pages#add_item', via: :post, format: :json
    match 'remove_items', to: 'pages#remove_items', via: :delete, format: :json
  end
  resources :items, only: [:create], format: :json

  match 'search_items', to: 'items#search_items', format: :json
  root to: 'root#index'
end
