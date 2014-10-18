class Item < ActiveRecord::Base
  attr_accessible :name, :category, :desc, :created_at, :updated_at

  has_many :page_items
  has_many :pages, through: :page_items
end
