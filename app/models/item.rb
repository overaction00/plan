class Item < ActiveRecord::Base
  attr_accessible :name, :category, :desc, :created_at, :updated_at

  validates_presence_of :name, :category
  validates_uniqueness_of :name

  has_many :page_items
  has_many :pages, through: :page_items
end
