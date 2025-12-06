# Running Frontend Locally

## CORS Issue with file:// Protocol

When opening HTML files directly from the file system (using `file://` protocol), browsers block CORS requests for security reasons. This is why you're seeing CORS errors in the console.

## Solution: Use a Local Web Server

### Option 1: Using Python (Recommended - Simple)

**Python 3:**
```bash
cd FE
python -m http.server 3000
```

**Python 2:**
```bash
cd FE
python -m SimpleHTTPServer 3000
```

Then open: `http://localhost:3000/html/admin-books.html`

### Option 2: Using Node.js (http-server)

```bash
# Install globally
npm install -g http-server

# Run in FE directory
cd FE
http-server -p 3000
```

Then open: `http://localhost:3000/html/admin-books.html`

### Option 3: Using PHP

```bash
cd FE
php -S localhost:3000
```

Then open: `http://localhost:3000/html/admin-books.html`

### Option 4: Using VS Code Live Server Extension

1. Install "Live Server" extension in VS Code
2. Right-click on `admin-books.html`
3. Select "Open with Live Server"

## Backend CORS Configuration

The backend has been configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:8080`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:8080`
- `null` (for file:// protocol - may not work in all browsers)

## Quick Start

1. **Start Backend:**
   ```bash
   cd BE
   mvn spring-boot:run
   ```
   Backend runs on: `http://localhost:8080`

2. **Start Frontend Server:**
   ```bash
   cd FE
   python -m http.server 3000
   ```
   Frontend runs on: `http://localhost:3000`

3. **Open in Browser:**
   - Navigate to: `http://localhost:3000/html/admin-books.html`
   - Or: `http://localhost:3000/html/index.html`

## Troubleshooting

### Still Getting CORS Errors?

1. Make sure backend is running on port 8080
2. Make sure frontend is served from a web server (not file://)
3. Check browser console for specific error messages
4. Verify the API URL in `FE/js/api.js` matches your backend URL

### Authentication Issues

The `/book/all` endpoint requires ADMIN role. Make sure you:
1. Log in as admin user first
2. The JWT token is stored in localStorage/sessionStorage
3. The token is included in API requests (check `api.js`)

### Database Connection

Make sure:
1. MySQL database is running
2. Database connection settings in `application.yaml` are correct
3. Tables are created (run Spring Boot once to auto-create)
4. Demo data is imported (see `BE/demo-data.sql`)

