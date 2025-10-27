# Wine Not - Wine Inventory Management System

A full-stack web application for managing wine inventory across multiple restaurants. This application allows you to track wines, manage inventory quantities, and monitor purchasing and selling prices. **This web application also has a companion iOS app that shares the same database**, providing seamless multi-platform access to your inventory data.

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
- **Django** (5.2) - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database
- **CORS Headers** - Cross-origin resource sharing

### Frontend
- **React** (19.0) - UI framework
- **Redux Toolkit** (2.8.2) - State management
- **React Router DOM** (7.6.0) - Routing
- **Tailwind CSS** (4.1.7) - Styling
- **DaisyUI** (5.0.35) - UI components
- **Axios** (1.9.0) - HTTP client
- **Vite** (6.2.0) - Build tool

## Project Structure

```
wine_not/
├── backend/              # Django backend
│   ├── wines/           # Wine app
│   ├── restaurants/      # Restaurant app
│   ├── inventories/      # Inventory app
│   └── main/            # Main Django settings
├── frontend/             # React frontend
│   ├── src/
│   │   ├── app/         # Redux store
│   │   └── features/    # Feature modules
│   │       ├── wines/
│   │       ├── restaurants/
│   │       └── inventories/
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- pip (Python package manager)
- npm (Node package manager)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up PostgreSQL database:
   - Create a database named `wine_not`
   - Update the database credentials in `backend/main/settings.py`:
     ```python
     DATABASES = {
         'default': {
             'ENGINE': 'django.db.backends.postgresql',
             'NAME': 'wine_not',
             'USER': 'your_username',
             'PASSWORD': 'your_password',
             'HOST': 'localhost',
             'PORT': '5432',
         }
     }
     ```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create a superuser (optional):
```bash
python manage.py createsuperuser
```

7. Start the development server:
```bash
python manage.py runserver
```

The backend will be running at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

## Usage

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

## Development

### Running Tests
Backend (Django):
```bash
cd backend
python manage.py test
```

Frontend (React):
```bash
cd frontend
npm test
```

### Code Formatting
Frontend:
```bash
cd frontend
npm run format
```



