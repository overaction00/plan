class PageItem < ActiveRecord::Base
  attr_accessible :page_id, :item_id, :created_at, :updated_at

  belongs_to :page
  belongs_to :item
end
