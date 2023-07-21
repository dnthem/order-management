# Report

## Date: 07/04/2023

## Goals:
- [x] Call API first, then update local indexedDB
  - [x] Use database id as key for each document in indexedDB
    - [x] Change all id in indexedDB to database id
- [x] Set only one active user at a time:
  - [x] When user logs in, set the user as active user
  - [x] Store user JWT on cache
  - [x] Set JWT expriation time

## Date: 07/03/2023

### Summary:
- Fixed bug: when user logs out, all data in local indexedDB will be removed
- Improved fetching API.
- Improved error handling.

### Next:


## Date: 06/25/2023

### Summary:
- Completed login, signup, and logout pages
- Each user when logs in, will load all data from database to local indexedDB
- All data in local indexedDB will be removed when user logs in and replaced with data from database

### Next:
- When user logs out, save all data from local indexedDB to database
- Also remove all data from local indexedDB when user logs out
- Handle offline mode
- Allow user to choose between online and offline mode
  - Online mode: data will be saved to database on every user's action
  - Offline mode: 
    - data will be saved to local indexedDB on every user's action.
    - data will be saved to database when user wants to switch to online mode

### Potential issues:
- When user logs in, all data will be loaded from database to local indexedDB. This may cause performance issue when the database is large. 
  - Solution: 
    - Load only the data that is needed for the current page
    - Load the rest of the data in the background
    - Load the data in chunks
    - Load the data in the background and cache it in local indexedDB
    - Load the data in the background and cache it in local indexedDB in chunks
    - Load the data in the background and cache it in local indexedDB in chunks and only load the data that is needed for the current page
- Should set expriation time for authenication token
  - Solution: 
    - Set expriation time for authenication token -> refresh token -> new authenication token


## Date: 06/22/2023

### Summary:
- Completed login, signup, and logout pages
- updated dashboard by removing ItemCount store from indexedDB which could be calculated from orders and thus minized the collection in mongoDB
- Fixed customer's orderCount and totalSpent get reseted when a new order is added

### Next:
- When user logs in, load all data from database to local indexedDB
- When user logs out, save all data from local indexedDB to database
- Handle offline mode