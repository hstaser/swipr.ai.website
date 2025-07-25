# swipr.ai Python Backend

Modern FastAPI backend replacing the Node.js version with improved performance and type safety.

## Features

- **FastAPI Framework**: Modern, fast, and type-safe API framework
- **Automatic API Documentation**: Built-in Swagger UI at `/docs`
- **Type Safety**: Full Pydantic model validation
- **JWT Authentication**: Secure user authentication
- **CORS Support**: Cross-origin resource sharing enabled
- **Password Hashing**: Secure bcrypt password hashing
- **Modular Design**: Clean, maintainable code structure

## Quick Start

### Local Development

1. **Install Python 3.9+**
2. **Run the startup script:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

### Manual Setup

1. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the server:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Docker Deployment

```bash
docker build -t swipr-api .
docker run -p 8000:8000 swipr-api
```

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`

## API Documentation

Once running, visit:
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/health

## Environment Variables

- `JWT_SECRET`: Secret key for JWT token signing (default: "your-secret-key-here")

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Waitlist
- `POST /api/waitlist` - Add user to waitlist

### Portfolio
- `POST /api/portfolio/optimize` - Generate portfolio optimization
- `POST /api/portfolio/simulate` - Simulate portfolio performance

### Stocks
- `GET /api/stocks/prices` - Get all stock prices
- `GET /api/stocks/{symbol}` - Get specific stock data
- `POST /api/stocks/swipe` - Record stock swipe action

### Social
- `POST /api/social/follow` - Follow a user
- `POST /api/social/unfollow` - Unfollow a user

### Chat
- `POST /api/chat` - AI chat interaction

### Analytics
- `POST /api/analytics/track` - Track user events

### Contact
- `POST /api/contact` - Send contact message

### Jobs
- `POST /api/jobs/apply` - Submit job application

### General
- `GET /api/health` - Health check
- `GET /api/test` - Test endpoint

## Key Improvements over Node.js Version

1. **Type Safety**: Full request/response validation with Pydantic
2. **Performance**: FastAPI is one of the fastest Python frameworks
3. **Documentation**: Automatic OpenAPI/Swagger documentation
4. **Error Handling**: Better HTTP exception handling
5. **Security**: Improved JWT and password handling
6. **Code Quality**: More maintainable and readable code structure

## Migration Notes

The Python backend maintains 100% API compatibility with the original Node.js version. All endpoints, request/response formats, and functionality remain identical.

To switch from Node.js to Python backend:
1. Start this Python server on port 8000
2. Update your frontend API client to point to the new server
3. No frontend code changes required
