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
    bamazon();
});

function bamazon() {

    console.log("Welcome to Bamazon!\n")

    function readProducts() {
        console.log("Our Products:");
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
//            console.log(res);

            for (var i = 0; i < res.length; i++) {
                var item = (res[i].id + ". " + res[i].product_name + " – $" + res[i].price);
                console.log(item);
            }

            inquirer.prompt([
                {
                    type: "input",
                    name: "productWanted",
                    message: "Which product would you like to purchase? (Enter its corresponding number)",
          },
                {
                    type: "input",
                    name: "quantityWanted",
                    message: "How many would you like?",
          }
        ]).then(function (user) {

//                console.log(user.productWanted);
//                console.log(user.quantityWanted);
                var productWantedAdjusted = user.productWanted - 1
//                console.log(productWantedAdjusted);
//                console.log(res[productWantedAdjusted].stock_quantity);

                console.log("Checking the product is in stock...\n");

                function checkStock() {
                    if (res[productWantedAdjusted].stock_quantity >= user.quantityWanted) {
                        console.log("Hooray! Your product is available.");
                        
                        var stockMinusOrder = res[productWantedAdjusted].stock_quantity - user.quantityWanted
                        
                        var orderTotal = res[productWantedAdjusted].price * user.quantityWanted

                        function updateProduct() {
                            console.log("Updating product inventory...\n");
                            var query = connection.query(
                                "UPDATE products SET ? WHERE ?", [
                                    {
                                        stock_quantity: stockMinusOrder
      },
                                    {
                                        id: user.productWanted
      }
    ],
                                function (err, res) {
//                                    console.log(res.affectedRows + " products updated.\n");
                                }
                            );

//                            console.log(query.sql);
                            console.log("Your order of " + res[productWantedAdjusted].product_name + " will be delivered within 2 days with Bamazon Bime!");
                            console.log("Your order total comes to $" + orderTotal + ".\n");
                            console.log("Thank you for shopping on Bamazon! Come again soon :)")
                            connection.end();
                        }

                        updateProduct();

                    } else {
                        console.log("Insufficient quantity.")
                        connection.end();
                    }
                };
                checkStock();


            })

        });
    };

    readProducts();
}