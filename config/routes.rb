Plan::Application.routes.draw do
  resources :pages, only: [:index, :show, :create], format: :json do
    match 'items', to: 'pages#items' , format: :json
  end
  resources :items, only: [:create], format: :json
  root to: 'root#index'
end
