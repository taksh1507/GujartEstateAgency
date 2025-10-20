# Gujarat Estate Admin Dashboard

A comprehensive admin dashboard for managing the Gujarat Estate Agency real estate platform. Built with React.js and designed to work with a Node.js/FastAPI backend.

## 🚀 Features

- **Dashboard Analytics**: Real-time statistics and performance metrics
- **Property Management**: Full CRUD operations for properties
- **User Management**: Manage registered users and their activities
- **Inquiry Management**: Handle property inquiries and customer communications
- **Analytics & Reports**: Visual charts and data insights
- **Settings Management**: Configure site settings and admin preferences
- **Authentication**: Secure admin login with JWT tokens
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React.js 18.3.1
- **Build Tool**: Vite 5.2.0
- **Styling**: Tailwind CSS 3.4.3
- **Icons**: Lucide React 0.323.0
- **Charts**: Recharts 2.11.0
- **Forms**: React Hook Form 7.52.1
- **Routing**: React Router DOM 6.26.2
- **HTTP Client**: Axios 1.7.3
- **Notifications**: React Hot Toast 2.4.1

## 📂 Project Structure

```
admin-dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.jsx      # Main layout with sidebar
│   │   └── LoadingSpinner.jsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx # Authentication context
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── Properties.jsx  # Property management
│   │   ├── PropertyForm.jsx # Add/Edit property
│   │   ├── Users.jsx       # User management
│   │   ├── Inquiries.jsx   # Inquiry management
│   │   ├── Analytics.jsx   # Analytics & charts
│   │   ├── Settings.jsx    # Settings management
│   │   └── Login.jsx       # Admin login
│   ├── services/           # API services
│   │   └── api.js          # API client & endpoints
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API server running (Node.js/FastAPI)

### Installation

1. **Clone and navigate to admin dashboard**
   ```bash
   cd admin-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your API configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the dashboard**
   - Open http://localhost:3001
   - Use "Mock Login" for development or real credentials if backend is connected

## 🔧 API Integration

The admin dashboard is designed to work with a backend API. Key endpoints expected:

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/profile` - Get admin profile

### Properties
- `GET /api/admin/properties` - List properties
- `POST /api/admin/properties` - Create property
- `PUT /api/admin/properties/:id` - Update property
- `DELETE /api/admin/properties/:id` - Delete property

### Users
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Analytics
- `GET /api/admin/analytics/dashboard` - Dashboard stats
- `GET /api/admin/analytics/properties` - Property analytics
- `GET /api/admin/analytics/users` - User analytics

### Inquiries
- `GET /api/admin/inquiries` - List inquiries
- `PATCH /api/admin/inquiries/:id/status` - Update inquiry status

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Component-specific styles use Tailwind classes

### API Configuration
- Update `src/services/api.js` for different API endpoints
- Modify authentication flow in `src/contexts/AuthContext.jsx`

### Features
- Add new pages in `src/pages/`
- Create reusable components in `src/components/`
- Extend API services in `src/services/`

## 📊 Dashboard Features

### Analytics Dashboard
- Real-time property statistics
- User registration trends
- Revenue tracking
- Inquiry management metrics
- Interactive charts and graphs

### Property Management
- Add/Edit/Delete properties
- Image upload and management
- Property status tracking
- Advanced filtering and search
- Bulk operations

### User Management
- View registered users
- User activity tracking
- Role management
- User status control

### Inquiry Management
- View property inquiries
- Respond to customer queries
- Inquiry status tracking
- Communication history

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

### Environment Variables for Production
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_NODE_ENV=production
```

## 🔒 Security Features

- JWT token-based authentication
- Automatic token refresh
- Protected routes
- Input validation
- XSS protection
- CSRF protection (when integrated with backend)

## 📱 Responsive Design

- Mobile-first approach
- Responsive sidebar navigation
- Adaptive charts and tables
- Touch-friendly interface
- Cross-browser compatibility

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Mock Data
The dashboard includes mock data for development. Replace with real API calls when backend is ready.

## 🤝 Integration with Main Website

This admin dashboard is designed to manage the main Gujarat Estate website through a shared backend API. Changes made in the admin panel will reflect on the main website in real-time.

### Workflow
1. Admin adds/updates properties → API updates database → Main website shows changes
2. Users submit inquiries on main website → API stores data → Admin sees inquiries
3. Admin manages users → API updates user data → Affects main website user experience

## 📄 License

This project is part of the Gujarat Estate Agency platform.

## 🆘 Support

For technical support or questions about the admin dashboard, please contact the development team.

---

**Note**: This admin dashboard requires a backend API to be fully functional. The current version includes mock data for development and demonstration purposes.