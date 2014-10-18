class PagesController < ApplicationController
  def index
    @pages = Page.all
    render json: @pages
  end

  def show
    begin
      @page = Page.find(params[:id])
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

  def items
    begin
      @items = Page.find(params[:page_id]).items
    rescue ActiveRecord::RecordNotFound
      return render nothing: true, status: :not_found
    end
    json =  @items.to_json(include: :pages)
    puts json
    render json: json
  end
end