# Wine Not - Wine Inventory Management System

A full-stack web application for managing wine inventory across multiple restaurants. This application allows you to track wines, manage inventory quantities, and monitor purchasing and selling prices. **This web application also has a companion iOS app that shares the same database**, providing seamless multi-platform access to your inventory data.

# Code Review
[![Alt Text](https://img.youtube.com/vi/WhPrqrmIcBA/hqdefault.jpg)](https://www.youtube.com/watch?v=WhPrqrmIcBA)

## Features

- **Restaurant Management**: Add and manage multiple restaurant locations
- **Wine Catalog**: Comprehensive wine database with details including:
  - Producer information
  - Country and region
  - Grape varieties
  - Wine type (red, white, sparkling, orange, dessert)
  - Year and tasting notes
- **Inventory Tracking**: Real-time inventory management with:
  - Quantity tracking
  - Buying and selling prices
  - Wine images
- **Visual Interface**: Modern, responsive UI built with React, Redux, and Tailwind CSS
- **Chart Visualization**: Visual representation of inventory data (in development)

## Tech Stack

### Backend
- **Django**  - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database
- **CORS Headers** - Cross-origin resource sharing

### Frontend
- **React**  - UI framework
- **Redux Toolkit**  - State management
- **React Router DOM**  - Routing
- **Tailwind CSS**  - Styling
- **DaisyUI** - UI components
- **Axios**  - HTTP client
- **Vite** - Build tool


### Features
### Adding a Restaurant
1. Navigate to the home page
2. Click "Add Restaurant"
3. Fill in the name and address
4. Submit the form

### Adding a Wine
1. Select a restaurant from the list
2. Click "Add Wine"
3. Fill in wine details:
   - Wine name
   - Producer
   - Country
   - Year
   - Wine type
   - Select grape varieties
4. Submit the form

### Managing Inventory
1. Click on a wine from the wine list
2. View current inventory details
3. Click "Edit" to update:
   - Quantity
   - Buying price
   - Selling price
4. Click "Update" to save changes

## Demo Credential Email Setup

The login page includes an "Email Me Demo Credentials" flow that sends a fixed shared demo login to the visitor's email address.

Configure these backend environment variables so email delivery works in your deployed app:

- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_HOST_USER`
- `EMAIL_HOST_PASSWORD`
- `EMAIL_USE_TLS`
- `EMAIL_USE_SSL`
- `DEFAULT_FROM_EMAIL`

Optional overrides for the shared demo login:

- `DEMO_CREDENTIAL_USERNAME` defaults to `natalie-admin`
- `DEMO_CREDENTIAL_PASSWORD` defaults to `1234567`
- `DEMO_CREDENTIAL_FROM_EMAIL` defaults to `DEFAULT_FROM_EMAIL`


