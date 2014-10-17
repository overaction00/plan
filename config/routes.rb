Plan::Application.routes.draw do
  resources :pages, only: [:index, :show], format: :json do
    match 'elements', to: 'pages#elements' , format: :json
  end
  root to: 'root#index'
end