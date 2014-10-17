class PagesController < ApplicationController
  def index
    @pages = Page.all
    render json: @pages
  end

  def show
    begin
      @page = Page.find(params[:id])
    rescue ActiveRecord::RecordNotFound => e
      return render nothing: true, status: :not_found
    end
    render json: @page
  end

  def create
    @page = Page.new(params[:page])
    render nothing: true, status: :internal_server_error unless @page.save
    render json: @page
  end

  def elements
    @page = params[:page_id]
    @elements = [
        {
            id: '1',
            item_id: '1',
            name: 'logo',
            category: 'a',
            pages: ['page1']
        },
        {
            id: '2',
            item_id: '2',
            name: 'login button',
            category: 'button',
            pages: %w(page2 page3)
        },
        {
            id: '3',
            item_id: '2',
            name: 'login button',
            category: 'button',
            pages: %w(page3 page4)
        },
    ]
    render json: @elements
  end
end