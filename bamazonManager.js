var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",

    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    //    console.log("connected as id " + connection.threadId);
    bamazonM();
});

function bamazonM() {

    inquirer.prompt([

        {
            type: "list",
            name: "initialQuery",
            message: "Bamazon Manager",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "QUIT"]
    }

]).then(function (user) {

        if (user.initialQuery === "View Products for Sale") {
            console.log("\nViewing all products for sale: ")

            function viewProducts() {
                var query = connection.query(
                    "SELECT * FROM products",
                    function (err, res) {
                        if (err) throw err;
                        //                         console.log(res);

                        for (var i = 0; i < res.length; i++) {
                            var fullResponse = (res[i].id + ". " + res[i].product_name + " – $" + res[i].price + " – " + res[i].stock_quantity) + " available";
                            console.log(fullResponse);
                        }

                        bamazonM();
                    }
                );
            }

            viewProducts();

        } else if (user.initialQuery === "View Low Inventory") {
            console.log("\nViewing all LOW INVENTORY products: ")

            function viewLowStock() {
                var query = connection.query(
                    "SELECT * FROM products",
                    function (err, res) {
                        if (err) throw err;

                        for (var i = 0; i < res.length; i++) {
                            if (res[i].stock_quantity < 5) {

                                var lowStockItems = (res[i].id + ". " + res[i].product_name + " – $" + res[i].price + " – " + res[i].stock_quantity) + " available";
                                console.log(lowStockItems);
                            }
                        }

                        bamazonM();
                    }
                );
            }

            viewLowStock();

        } else if (user.initialQuery === "Add to Inventory") {
            console.log("\nAdd stock to a product: ")

            inquirer.prompt([

                {
                    type: "input",
                    name: "productID",
                    message: "Which product are you updating? (USE ID#)"
            },

                {
                    type: "input",
                    name: "stockIncrease",
                    message: "How much are you increasing the stock by?"
            }

        ]).then(function (user) {

                var productIDAdjusted = user.productID - 1;

                function addStock() {
                    console.log("Updating inventories...");

                    var query = connection.query(
                        "SELECT * FROM products",
                        function (err, res) {
                            if (err) throw err;

                            var newStock = parseInt(res[productIDAdjusted].stock_quantity) + parseInt(user.stockIncrease);

                            //                        console.log(newStock);

                            var query = connection.query(
                                "UPDATE products SET ? WHERE ?", [
                                    {
                                        stock_quantity: newStock
      },
                                    {
                                        id: user.productID
      }
    ],
                                function (err, res) {
                                    var query = connection.query(
                                        "SELECT * FROM products",
                                        function (err, res) {
                                            console.log("Inventory for " + res[productIDAdjusted].product_name + " now showing " + res[productIDAdjusted].stock_quantity + " available.\n");
                                            bamazonM();
                                        });
                                }
                            );

                        }
                    );

                }

                addStock();
            });

        } else if (user.initialQuery === "Add New Product") {
            console.log("\nAdd a new product: ")

            inquirer.prompt([

                {
                    type: "input",
                    name: "productName",
                    message: "Enter the product's name: "
            },

                {
                    type: "input",
                    name: "productDept",
                    message: "Enter the product's corresponding department: "
            },

                {
                    type: "input",
                    name: "productPrice",
                    message: "Enter the product's price: "
            },
                {
                    type: "input",
                    name: "productStock",
                    message: "Enter the amount available to sell: "
            }

        ]).then(function (user) {

                function addProduct() {
                    console.log("Adding new product...");
                    var query = connection.query(
                        "INSERT INTO products SET ?", {
                            product_name: user.productName,
                            department_name: user.productDept,
                            price: user.productPrice,
                            stock_quantity: user.productStock
                        },
                        function (err, res) {
                            console.log(res.affectedRows + " product added.\n");
                            bamazonM();
                        }
                    );
                };
                
                addProduct();
            });

        } else if (user.initialQuery === "QUIT") {
            connection.end();
        }

    });

}
