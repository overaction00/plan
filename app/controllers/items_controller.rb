class ItemsController < ApplicationController
  def create
    begin
      @page = Page.find(params[:page_id])
    rescue ActiveRecord::RecordNotFound
      render nothing: true, status: :not_found
    end
    @item = Item.new(JSON.parse(params[:item]))
    render nothing: true, status: :internal_server_error unless @item.save
    @page.items << @item
    render json: @item.to_json(include: :pages)
  end

  def update
    begin
      @item = Item.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render nothing: true, status: :not_found
    end

    render json: @item.update_attributes(JSON.parse(params[:item])).to_json(include: :pages)
  end

  def search_items
    render json: Item.where(Item.arel_table[:name].matches("%#{params[:q]}%")).limit(10)
  end
end