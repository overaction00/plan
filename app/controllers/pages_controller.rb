class PagesController < ApplicationController
  def index
    @pages = [
        {
            id: '1',
            name: 'page1',
            url: '/pages/1',
            desc: 'page1 desc'
        },
        {
            id: '2',
            name: 'page2',
            url: '  /pages/2',
            desc: 'page2 desc'
        },
        {
            id: '3',
            name: 'page3',
            url: '/pages/3',
            desc: 'page3 desc'
        },
        {
            id: '4',
            name: 'page4',
            url: '/pages/4',
            desc: 'page4 desc'
        },
    ]
    render json: @pages
  end

  def show
    @page = {
        name: 'page' + params[:id].to_s,
        url: '/pages/' + params[:id].to_s,
        desc: "page#{params[:id]} desc"
    }
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