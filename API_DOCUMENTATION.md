# BookReader API Documentation

## Backend Integration Guide

### Base URL
```
https://api.bookreader.com/v1
```

### Authentication
All API requests require authentication using Bearer tokens:
```
Authorization: Bearer YOUR_API_TOKEN
```

## API Endpoints

### 1. Search Books
```
POST /books/search
```

**Request Body:**
```json
{
  "query": "search term",
  "category": "fiction|science|history|technology|business|comics|all",
  "page": 1,
  "limit": 12
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "books": [
      {
        "id": 1,
        "title": "Book Title",
        "author": "Author Name",
        "category": "fiction",
        "rating": 4.8,
        "image_url": "https://...",
        "status": "free|premium",
        "description": "Book description"
      }
    ],
    "total": 100,
    "page": 1,
    "totalPages": 9
  }
}
```

### 2. Get Books by Category
```
GET /books/category/{categoryName}?page=1&limit=12
```

### 3. Get Book Details
```
GET /books/{bookId}
```

### 4. Open Book Reader
```
POST /books/{bookId}/read
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Book Title",
    "content": "Full book content or chapters",
    "currentPage": 1,
    "totalPages": 300,
    "readingProgress": 25.5,
    "bookmarks": [],
    "notes": []
  }
}
```

### 5. User Authentication
```
POST /auth/login
POST /auth/register
GET /auth/profile
```

### 6. User Library
```
GET /user/library
POST /user/library/add/{bookId}
DELETE /user/library/remove/{bookId}
```

### 7. Reading Progress
```
POST /user/reading-progress/{bookId}
```

**Request Body:**
```json
{
  "currentPage": 45,
  "progress": 35.2,
  "timeSpent": 1200,
  "lastReadAt": "2025-10-06T10:30:00Z"
}
```

### 8. Bookmarks & Notes
```
POST /user/bookmarks/{bookId}
GET /user/bookmarks/{bookId}
POST /user/notes/{bookId}
```

## JavaScript Integration Examples

### Search Implementation
```javascript
async function searchBooks(searchData) {
  try {
    const response = await fetch('/api/books/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(searchData)
    });
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}
```

### Book Reader Implementation
```javascript
async function openBookReader(bookId) {
  try {
    const response = await fetch(`/api/books/${bookId}/read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    const result = await response.json();
    
    // Open book reader interface
    window.location.href = `/reader/${bookId}`;
    
    return result.data;
  } catch (error) {
    console.error('Book reader error:', error);
    throw error;
  }
}
```

### Category Fetching
```javascript
async function fetchBooksByCategory(category) {
  try {
    const response = await fetch(`/api/books/category/${category}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    const result = await response.json();
    return result.data.books;
  } catch (error) {
    console.error('Category fetch error:', error);
    throw error;
  }
}
```

## Database Schema (Reference)

### Books Table (Updated to match ERD)
```sql
CREATE TABLE books (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  price DECIMAL(10, 2) DEFAULT 0.00,
  cover_url VARCHAR(255),
  file_url VARCHAR(255),
  category_id BIGINT NOT NULL,
  status ENUM('free', 'premium') DEFAULT 'free',
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_pages INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Users Table (Matching ERD)
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  is_locked TINYINT(3) DEFAULT 0,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### Categories Table (From ERD)
```sql
CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
);

### Orders Table (From ERD)  
```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  book_id BIGINT NOT NULL,
  purchase_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

### Reviews Table (From ERD)
```sql
CREATE TABLE reviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  book_id BIGINT NOT NULL,
  rating INTEGER(10),
  comment VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);
```

### Reading Progress Table
```sql
CREATE TABLE reading_progress (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  book_id BIGINT,
  current_page INT DEFAULT 1,
  progress DECIMAL(5,2) DEFAULT 0.0,
  time_spent INT DEFAULT 0,
  last_read_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);
```

## Next Steps for Backend Integration

1. **Set up your backend server** (Node.js/Express, Python/Django, PHP/Laravel, etc.)
2. **Implement the API endpoints** following the schema above
3. **Replace the mock functions** in script.js with actual API calls
4. **Add authentication** system for user management
5. **Implement book reader interface** for reading experience
6. **Add payment integration** for premium books
7. **Set up database** with proper indexing for search performance

## Frontend Features Ready for Backend

✅ Search functionality with category filtering
✅ Category-based book browsing  
✅ Book card interactions
✅ User authentication buttons
✅ Newsletter subscription
✅ Mobile responsive design
✅ Loading states and error handling