class CreatePages < ActiveRecord::Migration
  def up
    create_table :pages do |t|
      t.string :name
      t.text :desc
      t.timestamps
    end
  end

  def down
    drop_table :pages
  end
end
