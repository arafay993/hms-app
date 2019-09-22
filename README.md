# Hotel Management System


### Technology Stack

> - React (For Front-end development).
> - Node JS (For Back-end Development).
> - Express (For Rest API Development).
> - PostgreSQL (For storing data permanently).
> - Sequelize (A Promise-based ORM for Node JS).

### Problem Statement

You are the owner of a high-end restaurant that uses very expensive ingredients in its dishes. Your food costs are running high, and you need to put a stop to that. As a starting point, you need to record all your recipes in a system that would allow you to calculate the cost for menu items, so you can compare it with the price charged and ensure that you are making enough profit to keep you and your business alive.


### Synopsis

**Menu items** are the items that can be sold from your menu.
There are two types of ingredients i.e **inventory ingredient** and **intermediate ingredient**.
An **Inventory ingredient** is one that is bought from the market. Each inventory ingredient has a price.
An **Intermediate ingredient** is one that is created from a combination of one or more inventory/intermediate ingredients. 
An **intermediate ingredient recipe** is a DAG of inventory and intermediate ingredients that are used to prepare that intermediate ingredient.
Each intermediate ingredient has a price computed from the price of all its ingredients.
A **menu item recipe** is a DAG of inventory and intermediate ingredients, terminating at (or originating from) a menu item.

#### Version used

> - Node : v10.16.0
> - npm : 
> - React : v16.8.1

#### Database Models

> - **Recipe** (a.k.a Menu Item Recipe).
> - **Ingredient** (a single table for Storing inventory & intermediate ingredients by introducing a field called group).
> - **RecipeIngredient** (Association table of Recipe & Ingredient).

Note: There exist a Many-To-Many relationship between Recipe and Ingredient.

#### Repository Structure

> - ```/client/``` (React app located here).
> - ```/server/``` (Node JS app located here).

React app and Node JS app communicates with each other using REST API's. The configuration of the proxy server is defined in ```client/package.json``` as ```"proxy": "http://localhost:8080"```. You can adjust it according to your need.

#### Configuration

First thing first, create a new database called **hms**.

> - ```createdb hms``` (This utility is provided by the PostgreSQL itself, you just need to run it in your terminal).

Make sure your PostgreSQL server is up and running. On Linux shell, you can execute ```sudo service postgres status``` to see if it is active or not. Database configuration is defined in ```/server/config/database.json```.

After cloning the Repo, run the following commands inside their scopes (i.e client & server directory):

> - ```npm install```.
> - ```npm start```.

You will see the client app running on localhost:3000, while your server app running on localhost:8080. Additionally you can set the Environment variable for Development/Production on Linux like this ```export NODE_ENV=development```/```export NODE_ENV=production``` and restart the server.


### Developed by
-Abdul Rafay Khan, since Sep/24/2019