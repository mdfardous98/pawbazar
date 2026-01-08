# PawBazar API Documentation

## Base URL

```
Development: http://localhost:5000
Production: https://your-api-domain.com
```

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "message": string,
  "data": object | array,
  "error": string (only on errors)
}
```

## Endpoints

### Health Check

```http
GET /health
```

Returns API health status.

**Response:**

```json
{
  "status": "OK",
  "message": "PawBazar API is running successfully",
  "timestamp": "2026-01-08T10:30:00.000Z",
  "version": "1.0.0"
}
```

### API Info

```http
GET /api
```

Returns API information and available endpoints.

---

## Listings

### Get All Listings

```http
GET /api/listings
```

**Query Parameters:**

- `category` (string): Filter by category
- `search` (string): Search in name, description, location
- `sort` (string): Sort by 'date', 'price', 'name' (default: 'date')
- `order` (string): 'asc' or 'desc' (default: 'desc')
- `limit` (number): Items per page (default: 20)
- `page` (number): Page number (default: 1)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "listing_id",
      "name": "Golden Retriever Puppy",
      "category": "Dogs",
      "price": 0,
      "location": "Dhaka",
      "description": "Friendly puppy looking for a home",
      "image": "https://example.com/image.jpg",
      "email": "owner@example.com",
      "date": "2026-01-08",
      "createdAt": "2026-01-08T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### Get Recent Listings

```http
GET /api/listings/recent
```

**Query Parameters:**

- `limit` (number): Number of listings (default: 6)

### Get Single Listing

```http
GET /api/listings/:id
```

### Get User's Listings

```http
GET /api/listings/user/my-listings
```

**Requires Authentication**

### Create Listing

```http
POST /api/listings
```

**Requires Authentication**

**Request Body:**

```json
{
  "name": "Pet Name",
  "category": "Dogs",
  "price": 0,
  "location": "City Name",
  "description": "Pet description",
  "image": "https://example.com/image.jpg"
}
```

### Update Listing

```http
PUT /api/listings/:id
```

**Requires Authentication** (Owner only)

### Delete Listing

```http
DELETE /api/listings/:id
```

**Requires Authentication** (Owner only)

---

## Orders

### Get User's Orders

```http
GET /api/orders
```

**Requires Authentication**

### Get Single Order

```http
GET /api/orders/:id
```

**Requires Authentication** (Owner only)

### Create Order

```http
POST /api/orders
```

**Requires Authentication**

**Request Body:**

```json
{
  "productId": "listing_id",
  "productName": "Pet Name",
  "buyerName": "Buyer Name",
  "quantity": 1,
  "price": 0,
  "address": "Delivery Address",
  "phone": "01700000000",
  "additionalNotes": "Optional notes"
}
```

### Update Order Status

```http
PATCH /api/orders/:id/status
```

**Requires Authentication** (Owner only)

**Request Body:**

```json
{
  "status": "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
}
```

### Cancel Order

```http
DELETE /api/orders/:id
```

**Requires Authentication** (Owner only)

---

## Search

### Advanced Search

```http
GET /api/search
```

**Query Parameters:**

- `q` (string): Search query
- `category` (string): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `location` (string): Filter by location
- `dateFrom` (string): Start date (YYYY-MM-DD)
- `dateTo` (string): End date (YYYY-MM-DD)
- `sortBy` (string): 'relevance', 'date', 'price', 'name', 'location'
- `order` (string): 'asc' or 'desc'
- `page` (number): Page number
- `limit` (number): Items per page

### Search Suggestions

```http
GET /api/search/suggestions?q=search_term
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "text": "Golden Retriever",
      "type": "name",
      "count": 5
    }
  ]
}
```

### Popular Searches

```http
GET /api/search/popular
```

---

## Statistics

### Public Statistics

```http
GET /api/stats/public
```

**Response:**

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalListings": 150,
      "totalAdoptions": 80,
      "totalProducts": 70,
      "recentListings": 12
    },
    "categories": [
      {
        "_id": "Dogs",
        "count": 45,
        "avgPrice": 500
      }
    ],
    "locations": [
      {
        "_id": "Dhaka",
        "count": 30
      }
    ]
  }
}
```

### User Statistics

```http
GET /api/stats/user
```

**Requires Authentication**

### Admin Statistics

```http
GET /api/stats/admin
```

**Requires Authentication**

---

## Analytics

### User Analytics

```http
GET /api/analytics/user
```

**Requires Authentication**

### Dashboard Analytics

```http
GET /api/analytics/dashboard
```

**Requires Authentication**

### Platform Analytics

```http
GET /api/analytics/platform
```

---

## Error Codes

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Responses

**Validation Error (400):**

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Please fix the following errors",
  "errors": ["Name is required", "Price must be a valid number"]
}
```

**Authentication Error (401):**

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "No authorization header provided"
}
```

**Not Found Error (404):**

```json
{
  "success": false,
  "error": "Not Found",
  "message": "Listing not found"
}
```

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** Rate limit info included in response headers

---

## Data Models

### Listing Model

```json
{
  "_id": "ObjectId",
  "name": "string (required, min: 3, max: 100)",
  "category": "string (required)",
  "price": "number (required, min: 0)",
  "location": "string (required)",
  "description": "string (required, min: 10, max: 1000)",
  "image": "string (required, valid URL)",
  "email": "string (required, valid email)",
  "date": "string (YYYY-MM-DD)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Order Model

```json
{
  "_id": "ObjectId",
  "productId": "string (required)",
  "productName": "string (required)",
  "buyerName": "string (required)",
  "email": "string (required, valid email)",
  "quantity": "number (required, min: 1)",
  "price": "number (required, min: 0)",
  "address": "string (required)",
  "phone": "string (required, valid phone)",
  "additionalNotes": "string (optional)",
  "status": "string (pending|confirmed|shipped|delivered|cancelled)",
  "date": "string (YYYY-MM-DD)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Environment Variables

### Server (.env)

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5174
MONGODB_URI=mongodb://localhost:27017/pawbazar
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
JWT_SECRET=your-jwt-secret
```

---

## Testing

### Using cURL

**Get all listings:**

```bash
curl -X GET "http://localhost:5000/api/listings"
```

**Create a listing (with auth):**

```bash
curl -X POST "http://localhost:5000/api/listings" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Pet",
    "category": "Dogs",
    "price": 0,
    "location": "Test City",
    "description": "Test description for API testing",
    "image": "https://example.com/test.jpg"
  }'
```

### Using Postman

1. Import the API endpoints
2. Set up environment variables for base URL and auth token
3. Test each endpoint with sample data

---

## Deployment

### Production Considerations

1. Set up proper MongoDB Atlas connection
2. Configure Firebase Admin SDK with service account
3. Set up environment variables in hosting platform
4. Enable CORS for production domains
5. Set up proper logging and monitoring
6. Configure rate limiting for production traffic

### Health Monitoring

Monitor these endpoints for system health:

- `GET /health` - API health
- `GET /api/stats/public` - Database connectivity
- Check response times and error rates
