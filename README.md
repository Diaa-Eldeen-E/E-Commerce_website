
### E-Commerece single page application built using ReactJS for frontend and PHP/Laravel for backend


## Run Locally

### 1. Clone repo

```
$ git clone https://github.com/Diaa-Eldeen-E/E-Commerce_website.git
$ cd E-Commerce_website
```

### 2. Install mysql

Download it from here: https://dev.mysql.com/downloads/installer/

### 3. Run Backend

```
$ cd backend
$ composer install          # Install Composer Dependencies
$ cp .env.example .env      # Create a copy of your .env file
$ php artisan key:generate  # Generate an app encryption key
$ php artisan migrate       # Run database migrations
$ php artisan serve         # Start the backend server 
```

### 4. Run Frontend

```
# open new terminal
$ cd frontend
$ npm install   # Install NPM Dependencies
$ npm start     # Start the frontend server
```

### 5. Create Admin User

- Run this on chrome: http://localhost:8000/api/users/createadmin
- It returns admin email and password


### 6. Sign in, and Enjoy

- Open http://localhost:3000


