# Order Management System

**Description:**
The Order Management System is a simple application that allows you to perform various operations related to orders, products, and customer information. You can create, edit, delete, and view orders, products, and customers. Additionally, the system provides an order history view for a day.

**Table of Contents:**
1. [Installation](#installation)
2. [Usage](#usage)
3. [Features](#features)
4. [Contributing](#contributing)
5. [License](#license)
6. [Contact](#contact)

**Installation:**
Follow these steps to set up the Order Management System:

1. Clone the repository.
2. Run `npm install` to install the required dependencies.
3. CD into the `backend` directory and run `npm install` to install backend dependencies (for backend Branch).
4. Ensure that you have MongoDB installed and running. In the `backend` directory, run `npm run dev` to start the server (port 3000).
5. Return to the root directory and run `npm run build` to build the app.
6. Run `npm run preview` to start the application.
7. Some environment variables might need to be set up.

**Usage:**
1. **Menu Page:** To manage items or products, use the following options:
   - Click on the `Add` button in the top-right corner to create a new item or product.
   - Click `edit` to modify an existing item or product.
   - Click `remove` to delete an item or product.
   - You can also hide an item by clicking on the `hide` button, which will remove it from the order page.

2. **Order Page:** To create a new order, follow these steps:
   - Click on the `Add` button in the top-right corner to create a new order.
   - Fill in the customer information form and click 'submit' to proceed to the order section.
   - In the order section, you can add items to the cart, edit item quantities, remove items from the cart, and submit the order.

3. **Main Order Page:** Here, you can:
   - View the current active orders.
   - Edit, complete, or delete orders.
   - View completed orders and the total sales of the day.

4. **Order History Page:** In this section, you can:
   - View the order history of a specific day.
   - Check the total sales for that day.

5. **Customer Page:** This page allows you to:
   - View customer information.
   - Edit or delete customer information.


6. **Dashboard Page:** Here, you can find various statistics:
   - Total sales of the day
   - Total number of orders
   - Total number of customers
   - Number of items sold
   - Revenue chart
   - Top items sold

**Features:**
- Create, edit, delete, and view orders, products, and customers.
- View order history for a specific day.
- Generate various statistics, such as total sales and top items sold.

**Contributing:**
Contributions to the Order Management System are welcome! If you want to contribute, follow the guidelines specified in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

**License:**
This project is licensed under the [MIT License](LICENSE).

**Contact:**
If you have any questions, suggestions, or feedback, feel free to reach out. You can contact me via email at [dnthem@gmail.com](mailto:dnthem@example.com) or through GitHub.