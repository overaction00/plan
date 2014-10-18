class ItemsController < ApplicationController
  def create
    begin
      @page = Page.find(params[:page_id])
    rescue ActiveRecord::RecordNotFound
      render nothing: true, status: :not_found
    end
    @item = Item.new(params[:item])
    render nothing: true, status: :internal_server_error unless @item.save
    @page.items << @item
    render json: @item
  end
end