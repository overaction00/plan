class Page < ActiveRecord::Base
  attr_accessible :name, :desc, :created_at, :updated_at

  has_many :page_items
  has_many :items, through: :page_items
end
