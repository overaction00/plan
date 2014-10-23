class PagesController < ApplicationController
  def index
    @pages = Page.all
    render json: @pages
  end

  def show
    begin
      @page = Page.includes(:items).find(params[:id])
    rescue ActiveRecord::RecordNotFound
      return render nothing: true, status: :not_found
    end
    render json: @page
  end

  def create
    @page = Page.new(params[:page])
    render nothing: true, status: :internal_server_error unless @page.save
    render json: @page
  end

  def destroy
    ap params
    ap params[:id]
    begin
      @page = Page.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      return render nothing: true, status: :not_found
    end
    if @page.destroy
      render json: @page
    else
      render nothing: true, status: :internal_server_error
    end
  end

  def items
    begin
      @items = Page.includes(:items).find(params[:page_id]).items
    rescue ActiveRecord::RecordNotFound
      return render nothing: true, status: :not_found
    end
    render json: @items.to_json(include: :pages)
  end

  def add_item
    begin
      @page = Page.find(params[:page_id])
      @item = Item.find(JSON.parse(params[:item])['id'])
    rescue ActiveRecord::RecordNotFound
      render nothing: true, status: :not_found
    end
    @page.items << @item
    render json: @item.to_json(include: :pages)
  end

  def remove_items
    begin
      @page = Page.find(params[:page_id])
    rescue ActiveRecord::RecordNotFound
      render nothing: true, status: :not_found
    end
    item_ids = JSON.parse(params[:item_ids])
    @affected_items = @page.page_items.where(item_id: item_ids).destroy_all
    return render json: @affected_items if item_ids.size == @affected_items.size
    return render nothing: true, status: :bad_request if @affected_items.present?
    render nothing: true, status: :internal_server_error
  end
end