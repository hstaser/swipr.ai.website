// Comprehensive Vercel serverless function for swipr.ai backend
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with real database in production)
const users = new Map();
const waitlist = new Map();
const portfolios = new Map();
const follows = new Map();
const analytics = new Map();
const contactMessages = new Map();
const jobApplications = new Map();
const stockData = new Map();
const chatSessions = new Map();

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Stock data simulation
const stockPrices = {
  'AAPL': { price: 185.50, change: 2.4, volume: 52000000, marketCap: '2.9T' },
  'TSLA': { price: 245.20, change: 5.7, volume: 41000000, marketCap: '778B' },
  'NVDA': { price: 425.80, change: 3.2, volume: 35000000, marketCap: '1.05T' },
  'GOOGL': { price: 125.30, change: -1.2, volume: 28000000, marketCap: '1.57T' },
  'AMZN': { price: 142.75, change: 1.8, volume: 33000000, marketCap: '1.48T' },
  'MSFT': { price: 365.20, change: 0.9, volume: 25000000, marketCap: '2.71T' },
  'META': { price: 315.80, change: -0.5, volume: 18000000, marketCap: '798B' },
  'SPY': { price: 445.60, change: 1.1, volume: 85000000, marketCap: 'ETF' }
};

// Utility functions
const validateEmail = (email) => validator.isEmail(email);
const validatePassword = (password) => password && password.length >= 8;
const generateId = () => uuidv4();
const getCurrentTimestamp = () => new Date().toISOString();

// Middleware
const corsMiddleware = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

const authenticateToken = (authHeader) => {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const generatePortfolioOptimization = (riskLevel, investmentAmount, preferences = {}) => {
  const allocations = {
    conservative: { stocks: 0.3, bonds: 0.6, cash: 0.1 },
    moderate: { stocks: 0.6, bonds: 0.3, cash: 0.1 },
    aggressive: { stocks: 0.8, bonds: 0.15, cash: 0.05 }
  };
  
  const allocation = allocations[riskLevel] || allocations.moderate;
  
  const stocks = ['AAPL', 'NVDA', 'TSLA', 'GOOGL', 'MSFT'];
  const portfolio = stocks.map(symbol => ({
    symbol,
    allocation: (allocation.stocks / stocks.length * 100).toFixed(1),
    amount: ((allocation.stocks / stocks.length) * investmentAmount).toFixed(2),
    currentPrice: stockPrices[symbol]?.price || 0,
    expectedReturn: (Math.random() * 20 + 5).toFixed(1) + '%'
  }));
  
  return {
    totalValue: investmentAmount,
    expectedReturn: ((allocation.stocks * 12 + allocation.bonds * 4 + allocation.cash * 1)).toFixed(1) + '%',
    riskScore: riskLevel === 'conservative' ? 3 : riskLevel === 'moderate' ? 6 : 9,
    allocations: allocation,
    recommendations: portfolio,
    rebalanceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    diversificationScore: 8.5
  };
};

const generateChatResponse = (message, userId = null) => {
  const responses = {
    'tech stock': "Based on current analysis, NVDA shows strong fundamentals with AI tailwinds. Your portfolio already has 28% NVDA allocation, which provides good exposure to the AI trend.",
    'diversify': "I recommend diversifying across sectors: 30% tech (AAPL, NVDA), 25% healthcare (JNJ, PFE), 20% finance (JPM, BAC), 15% consumer goods (PG, KO), 10% bonds/cash for stability.",
    'expected return': "With your current allocation (60% stocks, 30% bonds, 10% cash), expected annual return is 8-12%. Tech heavy weighting increases potential but adds volatility.",
    'AAPL': "AAPL is currently trading at $185.50 (+2.4%). Strong buy signals: iOS 18 adoption, services growth, China recovery. Consider accumulating on dips below $180."
  };
  
  for (const [key, response] of Object.entries(responses)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return response;
    }
  }
  
  return "I'm here to help with investment decisions! Ask me about portfolio allocation, stock analysis, or market trends.";
};

// Main handler function
module.exports = async function handler(req, res) {
  corsMiddleware(res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  const body = req.body || {};
  
  try {
    // ==================== AUTHENTICATION ENDPOINTS ====================
    
    if (url === '/api/auth/register' && method === 'POST') {
      const { email, password, name } = body;
      
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'All fields required' });
      }
      
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      
      if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      
      if (users.has(email)) {
        return res.status(409).json({ error: 'User already exists' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 12);
      const userId = generateId();
      
      const user = {
        id: userId,
        email,
        name,
        password: hashedPassword,
        createdAt: getCurrentTimestamp(),
        verified: false,
        profile: {
          riskTolerance: 'moderate',
          investmentGoals: [],
          experience: 'beginner'
        }
      };
      
      users.set(email, user);
      
      const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
      
      return res.status(201).json({
        message: 'User created successfully',
        token,
        user: { id: userId, email, name }
      });
    }
    
    if (url === '/api/auth/login' && method === 'POST') {
      const { email, password } = body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }
      
      const user = users.get(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
      
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, name: user.name }
      });
    }
    
    // ==================== WAITLIST ENDPOINTS ====================
    
    if (url === '/api/waitlist' && method === 'POST') {
      const { email, name, interests = [] } = body;
      
      if (!email || !name) {
        return res.status(400).json({ error: 'Email and name required' });
      }
      
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      
      if (waitlist.has(email)) {
        return res.status(409).json({ error: 'Email already on waitlist' });
      }
      
      const waitlistEntry = {
        id: generateId(),
        email,
        name,
        interests,
        position: waitlist.size + 1,
        joinedAt: getCurrentTimestamp(),
        referrals: 0,
        status: 'active'
      };
      
      waitlist.set(email, waitlistEntry);
      
      return res.status(201).json({
        message: 'Successfully added to waitlist',
        position: waitlistEntry.position,
        id: waitlistEntry.id
      });
    }
    
    // ==================== PORTFOLIO ENDPOINTS ====================
    
    if (url === '/api/portfolio/optimize' && method === 'POST') {
      const { riskLevel, amount, preferences } = body;
      
      if (!riskLevel || !amount) {
        return res.status(400).json({ error: 'Risk level and amount required' });
      }
      
      if (amount < 100) {
        return res.status(400).json({ error: 'Minimum investment amount is $100' });
      }
      
      const optimization = generatePortfolioOptimization(riskLevel, amount, preferences);
      
      return res.status(200).json({
        message: 'Portfolio optimized successfully',
        data: optimization
      });
    }
    
    if (url === '/api/portfolio/simulate' && method === 'POST') {
      const { allocation, timeframe = 12 } = body;
      
      if (!allocation) {
        return res.status(400).json({ error: 'Portfolio allocation required' });
      }
      
      const monthlyData = [];
      let currentValue = 10000;
      
      for (let i = 0; i <= timeframe; i++) {
        const monthlyReturn = (Math.random() - 0.5) * 0.04 + 0.008; // -2% to +2% monthly, avg 0.8%
        currentValue *= (1 + monthlyReturn);
        
        monthlyData.push({
          month: i,
          value: Math.round(currentValue),
          return: ((currentValue - 10000) / 10000 * 100).toFixed(2)
        });
      }
      
      return res.status(200).json({
        message: 'Portfolio simulation completed',
        data: {
          simulation: monthlyData,
          finalValue: currentValue,
          totalReturn: ((currentValue - 10000) / 10000 * 100).toFixed(2),
          volatility: (Math.random() * 15 + 10).toFixed(1), // 10-25% volatility
          sharpeRatio: (Math.random() * 2 + 0.5).toFixed(2) // 0.5-2.5 Sharpe ratio
        }
      });
    }
    
    // ==================== STOCK DATA ENDPOINTS ====================
    
    if (url === '/api/stocks/prices' && method === 'GET') {
      return res.status(200).json({
        message: 'Stock prices retrieved successfully',
        data: stockPrices,
        timestamp: getCurrentTimestamp()
      });
    }
    
    if (url.startsWith('/api/stocks/') && method === 'GET') {
      const symbol = url.split('/')[3]?.toUpperCase();
      
      if (!symbol || !stockPrices[symbol]) {
        return res.status(404).json({ error: 'Stock not found' });
      }
      
      const stock = stockPrices[symbol];
      const analysis = {
        ...stock,
        symbol,
        recommendation: stock.change > 0 ? 'BUY' : 'HOLD',
        targetPrice: (stock.price * (1 + Math.random() * 0.2)).toFixed(2),
        analystRating: Math.random() > 0.5 ? 'Strong Buy' : 'Buy',
        riskLevel: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
      };
      
      return res.status(200).json({
        message: 'Stock data retrieved successfully',
        data: analysis
      });
    }
    
    // ==================== SOCIAL FEATURES ====================
    
    if (url === '/api/social/follow' && method === 'POST') {
      const authHeader = req.headers.authorization;
      const user = authenticateToken(authHeader);
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const { targetUserId } = body;
      
      if (!targetUserId) {
        return res.status(400).json({ error: 'Target user ID required' });
      }
      
      const followKey = `${user.userId}-${targetUserId}`;
      
      if (follows.has(followKey)) {
        return res.status(409).json({ error: 'Already following this user' });
      }
      
      follows.set(followKey, {
        followerId: user.userId,
        followingId: targetUserId,
        followedAt: getCurrentTimestamp()
      });
      
      return res.status(201).json({
        message: 'Successfully followed user',
        isFollowing: true
      });
    }
    
    if (url === '/api/social/unfollow' && method === 'POST') {
      const authHeader = req.headers.authorization;
      const user = authenticateToken(authHeader);
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const { targetUserId } = body;
      const followKey = `${user.userId}-${targetUserId}`;
      
      if (!follows.has(followKey)) {
        return res.status(404).json({ error: 'Not following this user' });
      }
      
      follows.delete(followKey);
      
      return res.status(200).json({
        message: 'Successfully unfollowed user',
        isFollowing: false
      });
    }
    
    // ==================== CHAT/AI ENDPOINTS ====================
    
    if (url === '/api/chat' && method === 'POST') {
      const { message, sessionId } = body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message required' });
      }
      
      const session = sessionId || generateId();
      
      if (!chatSessions.has(session)) {
        chatSessions.set(session, {
          id: session,
          messages: [],
          createdAt: getCurrentTimestamp()
        });
      }
      
      const chatSession = chatSessions.get(session);
      const response = generateChatResponse(message);
      
      chatSession.messages.push(
        { role: 'user', content: message, timestamp: getCurrentTimestamp() },
        { role: 'assistant', content: response, timestamp: getCurrentTimestamp() }
      );
      
      return res.status(200).json({
        message: 'Chat response generated',
        response,
        sessionId: session
      });
    }
    
    // ==================== ANALYTICS ENDPOINTS ====================
    
    if (url === '/api/analytics/track' && method === 'POST') {
      const { event, properties = {}, userId } = body;
      
      if (!event) {
        return res.status(400).json({ error: 'Event name required' });
      }
      
      const analyticsEvent = {
        id: generateId(),
        event,
        properties,
        userId: userId || 'anonymous',
        timestamp: getCurrentTimestamp(),
        userAgent: req.headers['user-agent'] || '',
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      };
      
      analytics.set(analyticsEvent.id, analyticsEvent);
      
      return res.status(201).json({
        message: 'Event tracked successfully',
        eventId: analyticsEvent.id
      });
    }
    
    // ==================== CONTACT ENDPOINTS ====================
    
    if (url === '/api/contact' && method === 'POST') {
      const { name, email, message } = body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields required' });
      }
      
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      
      const contactMessage = {
        id: generateId(),
        name,
        email,
        message,
        status: 'new',
        createdAt: getCurrentTimestamp()
      };
      
      contactMessages.set(contactMessage.id, contactMessage);
      
      return res.status(201).json({
        message: 'Message sent successfully',
        id: contactMessage.id
      });
    }
    
    // ==================== JOB APPLICATION ENDPOINTS ====================
    
    if (url === '/api/jobs/apply' && method === 'POST') {
      const { position, name, email, phone, coverLetter, resumeUrl } = body;
      
      if (!position || !name || !email || !coverLetter) {
        return res.status(400).json({ error: 'Required fields missing' });
      }
      
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      
      const application = {
        id: generateId(),
        position,
        name,
        email,
        phone: phone || '',
        coverLetter,
        resumeUrl: resumeUrl || '',
        status: 'submitted',
        appliedAt: getCurrentTimestamp()
      };
      
      jobApplications.set(application.id, application);
      
      return res.status(201).json({
        message: 'Application submitted successfully',
        applicationId: application.id
      });
    }
    
    // ==================== STOCK SWIPE ENDPOINTS ====================
    
    if (url === '/api/stocks/swipe' && method === 'POST') {
      const { symbol, direction, userId } = body;
      
      if (!symbol || !direction) {
        return res.status(400).json({ error: 'Symbol and direction required' });
      }
      
      if (!['left', 'right'].includes(direction)) {
        return res.status(400).json({ error: 'Direction must be left or right' });
      }
      
      const swipeAction = {
        id: generateId(),
        symbol,
        direction,
        userId: userId || 'anonymous',
        timestamp: getCurrentTimestamp(),
        action: direction === 'right' ? 'invest' : 'pass'
      };
      
      // Simulate portfolio update for right swipes
      let portfolioUpdate = null;
      if (direction === 'right' && stockPrices[symbol]) {
        portfolioUpdate = {
          symbol,
          shares: Math.floor(1000 / stockPrices[symbol].price),
          amount: 1000,
          price: stockPrices[symbol].price
        };
      }
      
      return res.status(200).json({
        message: `Successfully ${direction === 'right' ? 'invested in' : 'passed on'} ${symbol}`,
        swipe: swipeAction,
        portfolioUpdate
      });
    }
    
    // ==================== GENERAL ENDPOINTS ====================
    
    if (url === '/api/health' && method === 'GET') {
      return res.status(200).json({
        status: 'ok',
        timestamp: getCurrentTimestamp(),
        version: '1.0.0',
        modules: {
          bcrypt: !!bcrypt,
          jwt: !!jwt,
          validator: !!validator,
          uuid: !!uuidv4
        },
        endpoints: {
          auth: ['/api/auth/register', '/api/auth/login'],
          waitlist: ['/api/waitlist'],
          portfolio: ['/api/portfolio/optimize', '/api/portfolio/simulate'],
          stocks: ['/api/stocks/prices', '/api/stocks/{symbol}', '/api/stocks/swipe'],
          social: ['/api/social/follow', '/api/social/unfollow'],
          chat: ['/api/chat'],
          analytics: ['/api/analytics/track'],
          contact: ['/api/contact'],
          jobs: ['/api/jobs/apply']
        }
      });
    }

    if (url === '/api/test' && method === 'GET') {
      return res.status(200).json({
        message: 'API is working',
        timestamp: getCurrentTimestamp(),
        testPassed: true
      });
    }
    
    // Default 404 for unmatched routes
    return res.status(404).json({ 
      error: 'API endpoint not found',
      availableEndpoints: '/api/health'
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
