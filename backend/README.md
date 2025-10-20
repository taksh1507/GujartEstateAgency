# Gujarat Estate Backend API

Node.js backend API for Gujarat Estate Agency with Google Drive integration for image storage.

## 🚀 Features

- **Google Drive Integration**: Secure image storage and management
- **Property Management**: Full CRUD operations for properties
- **User Authentication**: JWT-based auth for admin and users
- **Inquiry System**: Handle property inquiries
- **Image Upload**: Optimized image processing with Sharp
- **Security**: Helmet, CORS, rate limiting
- **Validation**: Joi schema validation
- **Error Handling**: Comprehensive error management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT
- **Image Processing**: Sharp
- **File Upload**: Multer
- **Validation**: Joi
- **Google APIs**: googleapis
- **Security**: Helmet, CORS, bcryptjs

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **Google Cloud Account** with Drive API enabled
3. **Service Account** JSON credentials file

## 🔧 Installation

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   # Server Configuration
   PORT=8000
   NODE_ENV=development
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   
   # Google Drive Configuration
   GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id_here
   GOOGLE_APPLICATION_CREDENTIALS=./google-drive-credentials.json
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ADMIN_URL=http://localhost:3001
   ```

5. **Add Google Drive credentials**
   - Place your `google-drive-credentials.json` file in the backend root
   - Make sure the file path matches `GOOGLE_APPLICATION_CREDENTIALS`

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔑 Google Drive Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Drive API

### 2. Create Service Account
1. Go to IAM & Admin > Service Accounts
2. Create a new service account
3. Download the JSON key file
4. Rename it to `google-drive-credentials.json`
5. Place it in the backend root directory

### 3. Create Google Drive Folder
1. Create a folder in Google Drive for property images
2. Share the folder with the service account email (found in JSON file)
3. Give "Editor" permissions
4. Copy the folder ID from the URL
5. Add it to your `.env` file as `GOOGLE_DRIVE_FOLDER_ID`

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/admin/login          # Admin login
POST   /api/auth/admin/logout         # Admin logout
GET    /api/auth/admin/profile        # Get admin profile
POST   /api/auth/user/register        # User registration
POST   /api/auth/user/login           # User login
```

### Properties (Public)
```
GET    /api/properties                # Get all properties
GET    /api/properties/search         # Search properties
GET    /api/properties/featured       # Get featured properties
GET    /api/properties/:id            # Get single property
```

### Admin - Image Management
```
POST   /api/admin/properties/upload-image        # Upload image (multipart)
POST   /api/admin/properties/upload-image-base64 # Upload image (base64)
DELETE /api/admin/properties/delete-image        # Delete image
GET    /api/admin/storage/info                   # Get storage info
GET    /api/admin/images/list                    # List all images
```

### Inquiries
```
POST   /api/inquiries                 # Submit inquiry
GET    /api/inquiries                 # Get user inquiries
GET    /api/inquiries/:id             # Get single inquiry
GET    /api/inquiries/property/:id    # Get property inquiries
```

### Users
```
GET    /api/users/profile             # Get user profile
PUT    /api/users/profile             # Update user profile
```

## 🔐 Authentication

### Admin Login
```javascript
POST /api/auth/admin/login
{
  "email": "admin@gujaratestate.com",
  "password": "admin123"
}
```

### Response
```javascript
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@gujaratestate.com",
      "role": "admin"
    },
    "token": "jwt_token_here"
  }
}
```

## 📤 Image Upload

### Multipart Upload
```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('propertyId', '123');
formData.append('fileName', 'property.jpg');
formData.append('fileType', 'image/jpeg');

fetch('/api/admin/properties/upload-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

### Base64 Upload
```javascript
fetch('/api/admin/properties/upload-image-base64', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...',
    propertyId: '123',
    fileName: 'property.jpg',
    fileType: 'image/jpeg'
  })
});
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **File Type Validation**: Only allow image files
- **File Size Limits**: Configurable upload limits

## 📊 Error Handling

All endpoints return consistent error responses:

```javascript
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## 🔧 Configuration

### Environment Variables
```env
# Server
PORT=8000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Google Drive
GOOGLE_DRIVE_FOLDER_ID=folder_id
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json

# CORS
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:3001

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure proper CORS origins
4. Set up SSL/HTTPS
5. Use process manager (PM2)

### PM2 Deployment
```bash
npm install -g pm2
pm2 start server.js --name "gujarat-estate-api"
pm2 startup
pm2 save
```

## 📝 Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
```

### Adding New Routes
1. Create route file in `routes/`
2. Add middleware in `middleware/`
3. Update `server.js` to include route
4. Add validation schemas in `middleware/validation.js`

## 🧪 Testing

### Test Image Upload
```bash
curl -X POST http://localhost:8000/api/admin/properties/upload-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@test-image.jpg" \
  -F "propertyId=123" \
  -F "fileName=test.jpg" \
  -F "fileType=image/jpeg"
```

### Test Health Check
```bash
curl http://localhost:8000/api/health
```

## 🔍 Monitoring

### Health Check
```
GET /api/health
```

Returns server status, uptime, and environment info.

### Logs
- Development: Console logs with colors
- Production: Structured JSON logs

## 🤝 Integration

### Frontend Integration
Update frontend API base URL:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Admin Dashboard Integration
The admin dashboard expects these endpoints:
- Image upload: `POST /api/admin/properties/upload-image-base64`
- Image delete: `DELETE /api/admin/properties/delete-image`
- Authentication: `POST /api/auth/admin/login`

## 📄 License

This project is part of the Gujarat Estate Agency platform.

---

**Note**: This backend is designed to work with the Gujarat Estate frontend and admin dashboard. Make sure all three components are properly configured and running.