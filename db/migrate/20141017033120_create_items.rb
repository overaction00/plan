class CreateItems < ActiveRecord::Migration
  def up
    create_table :items do |t|
      t.string :name
      t.string :category
      t.text :desc
      t.timestamps
    end
    add_index :items, :category
  end

  def down
    remove_index :items, :category
    drop_table :items
  end
end
