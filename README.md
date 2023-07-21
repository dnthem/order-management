# Order Management System

**Description:**
The Order Management System is a simple application that allows you to perform various operations related to orders, products, and customer information. You can create, edit, delete, and view orders, products, and customers. Additionally, the system provides an order history view for a day.

**Table of Contents:**
- [Order Management System](#order-management-system)
- [**Overview**](#overview)
- [**Installation:**](#installation)
- [**Usage:**](#usage)
- [**Features:**](#features)
- [**Contributing:**](#contributing)
- [**License:**](#license)
- [**Contact:**](#contact)


# **Overview**

There are two versions of the Order Management System:
  1. Order Management System that totally runs on client side (no server required) and uses indexedDB to store data. See [here](https://order-management-app.netlify.app/) for demo
  2. Order Management System that runs on client side and requires a server to store data in mongoDB. The application requires user to sign up and log in. See [here](https://order-management-api.netlify.app/) for demo

# **Installation:**
Follow these steps to set up the Order Management System version 1 (no server required):
1. Clone the repository.
2. Check out `Development` branch.
3. Run `npm install` to install all dependencies.
4. Run `npm dev run` to start the application for development
5. Run `npm build` to build the application for production

Follow these steps to set up the Order Management System version 2 (server required):
1. Clone the repository.
2. Check out `Backend` branch.
3. Similar to the first version, run `npm install` to install all dependencies.
4. Backend - serverside is in different repository. Clone the repository [here](https://github.com/dnthem/order_management_backend)
5. Clone the repository and follow the instruction to set up the backend server
6. Set up environment variables in `.env` file
   ```
    DEV=true
    VITE_CI=true
    VITE_PREVIEW_URL=https://localhost:3000
    VITE_HEADLESS=false
    VITE_SKIP_TESTS=false #true
    VITE_API_URL=http://localhost:3000 
    VITE_INDEXEDDB_SAMPLE_DATA=false
    VITE_ORIGIN=http://localhost:5173/
   ```

# **Usage:**
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

# **Features:**
- Create, edit, delete, and view orders, products, and customers.
- View order history for a specific day.
- Generate various statistics, such as total sales and top items sold.

# **Contributing:**
Contributions to the Order Management System are welcome! If you want to contribute, follow the guidelines specified in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

# **License:**
This project is licensed under the [MIT License](LICENSE).

# **Contact:**
If you have any questions, suggestions, or feedback, feel free to reach out. You can contact me via email at [dnthem@gmail.com](mailto:dnthem@example.com) or through GitHub.
