### Student Registration System

The Student Registration System is a web application designed to manage student data, built using Node.js with SQLite database for backend storage. It includes error handling mechanisms, CRUD (Create, Read, Update, Delete) operations, JWT (JSON Web Token) authentication for API endpoints, and an Angular frontend for performing CRUD operations.

#### Features:
- **Node.js Backend**: Utilizes the Node.js runtime environment for server-side logic.
- **SQLite Database**: Employs SQLite as the database management system for storing student information.
- **Error Handling**: Implements error handling mechanisms to gracefully handle errors and exceptions.
- **CRUD Operations**: Provides functionalities for creating, reading, updating, and deleting student records.
- **JWT Authentication**: Implements JSON Web Token (JWT) authentication for securing API endpoints.
- **Angular Frontend**: Utilizes Angular framework for building a user-friendly frontend interface.

#### Default Admin Account:
- The system comes with a default admin account with full access privileges.
- Admins have the authority to log in, add new accounts, modify existing accounts, and perform all CRUD operations.

#### API Overview:
| Method | Endpoint           | Description                        |
|--------|--------------------|------------------------------------|
| POST   | /api/auth/register | Register a new user                |
| POST   | /api/auth/login    | Authenticate user and generate JWT|
| POST   | /api/auth/logout   | Log out user and revoke JWT       |
| POST   | /api/auth/refresh  | Refresh JWT token                  |
| GET    | /api/users         | Get all users                      |
| GET    | /api/users/:id     | Get user by ID                     |
| POST   | /api/users         | Create a new user                  |
| PUT    | /api/users/:id     | Update user details                |
| DELETE | /api/users/:id     | Delete user                        |

#### Installation and Setup:
1. Clone the repository: `git clone <repository-url>`
2. Install dependencies:
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
3. Configure environment variables as necessary.
4. Run the application:
   - Backend: `cd backend && npm start`
   - Frontend: `cd frontend && ng serve`

#### Usage:
1. Navigate to the application URL in your web browser.
2. Log in using the provided admin credentials.
3. Perform CRUD operations as needed.
4. Log out to terminate the session.

## check my Aps

