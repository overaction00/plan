class CreatePageItems < ActiveRecord::Migration
  def up
    create_table :page_items do |t|
      t.integer :page_id
      t.integer :item_id
      t.timestamps
    end
    add_index :page_items, :page_id
    add_index :page_items, :item_id
  end

  def down
    remove_index :page_items, :page_id
    remove_index :page_items, :item_id
    drop_table :page_items
  end
end
