DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(25) NOT NULL,
    department_name VARCHAR(25),
    price INTEGER NOT NULL,
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Guitar", "Musical Instruments", 500, 4), ("USB Keyboard", "Computer Hardware", 30, 25), ("Asus Laptop", "Computer Hardware", 800, 14), ("Trenchcoat", "Clothing", 120, 8), ("Shadow of the Tomb Raider", "Video Games", 60, 100), ("LG TV", "Televisions", 2400, 5), ("Harry Potter Box Set", "Books", 65, 12), ("Canon T5i", "Cameras", 380, 6), ("Biology Textbook", "Books", 90, 3), ("God of War", "Video Games", 55, 35), ("Spider-Man", "Video Games", 60, 48);

SELECT * FROM products;