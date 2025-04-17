# Backend Implementation Guide for Telegram API Integration

## Introduction

This document provides a detailed guide for backend developers implementing the Telegram API integration with Tez CRM. It covers architectural patterns, security considerations, and implementation strategies for all API endpoints.

## Architecture Overview

### System Components

![Architecture Diagram](../assets/telegram-architecture.png)

1. **API Gateway Layer**
   - Routes requests to appropriate microservices
   - Handles authentication and rate limiting
   - Provides request logging and monitoring

2. **Telegram Service**
   - Core service responsible for Telegram API communication
   - Manages MTProto session handling
   - Implements all Telegram-specific business logic

3. **Real-time Messaging Service**
   - WebSocket server for real-time updates
   - Message queue for handling high throughput
   - Event broadcasting system

4. **Storage Services**
   - Message and chat storage
   - Media file storage and CDN integration
   - User preferences and settings

5. **CRM Integration Layer**
   - Bidirectional sync with CRM entities
   - Business logic for mapping Telegram entities to CRM records
   - Trigger system for automated workflows

## Core Implementation Details

### Authentication Implementation

```typescript
// Example authentication service implementation
class TelegramAuthService {
  async initializeAuth(apiId: string, apiHash: string): Promise<AuthSession> {
    // Create a new MTProto session
    const client = new TelegramClient(
      new StringSession(''), // Empty session initially
      parseInt(apiId, 10),
      apiHash,
      {
        connectionRetries: 5,
        useWSS: true,
      }
    );
    
    await client.connect();
    
    // Store session in database
    const sessionString = client.session.save();
    const session = await this.sessionRepository.create({
      userId: requestContext.userId,
      sessionString,
      createdAt: new Date(),
      status: 'INITIALIZED',
    });
    
    return {
      sessionId: session.id,
      status: 'INITIALIZED',
    };
  }
  
  async requestCode(sessionId: string, phoneNumber: string): Promise<RequestCodeResult> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) throw new SessionNotFoundException();
    
    const client = new TelegramClient(
      new StringSession(session.sessionString),
      parseInt(process.env.TELEGRAM_API_ID, 10),
      process.env.TELEGRAM_API_HASH,
      { connectionRetries: 5 }
    );
    
    await client.connect();
    
    const result = await client.sendCode(
      {
        apiId: parseInt(process.env.TELEGRAM_API_ID, 10),
        apiHash: process.env.TELEGRAM_API_HASH,
      },
      phoneNumber
    );
    
    // Update session in database
    await this.sessionRepository.update(session.id, {
      phoneNumber,
      phoneCodeHash: result.phoneCodeHash,
      status: 'CODE_REQUESTED',
    });
    
    return {
      phoneCodeHash: result.phoneCodeHash,
      sessionId: session.id,
      timeout: result.timeout,
      status: 'CODE_REQUESTED',
    };
  }
  
  // Additional authentication methods implementation...
}
```

### Real-time Communication Setup

```typescript
// Initialize WebSocket server
const initializeRealTimeServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/api/telegram/socket',
  });
  
  // Middleware for authentication
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decodedToken = verifyJwt(token);
      socket.data.userId = decodedToken.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });
  
  // Handle connections
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.userId}`);
    
    // Join user-specific room
    socket.join(`user:${socket.data.userId}`);
    
    // Handle incoming events
    socket.on('typing', handleTypingEvent);
    socket.on('read', handleReadEvent);
    socket.on('disconnect', handleDisconnect);
  });
  
  return io;
};
```

### Message Handling Implementation

```typescript
class MessageService {
  async getMessages(chatId: string, options: {
    limit: number,
    offsetId?: number,
    offsetDate?: number
  }): Promise<PaginatedMessages> {
    const session = await this.getCurrentUserSession();
    const client = this.createClientFromSession(session);
    
    const messages = await client.getMessages(chatId, {
      limit: options.limit || 30,
      offsetId: options.offsetId,
      offsetDate: options.offsetDate,
    });
    
    // Transform Telegram messages to our API format
    const transformedMessages = messages.map(this.transformMessage);
    
    // Store messages in our database for faster retrieval next time
    await this.messageRepository.storeMessages(transformedMessages);
    
    return {
      messages: transformedMessages,
      hasMore: messages.length === options.limit,
      totalCount: await client.getHistoryCount(chatId),
    };
  }
  
  async sendMessage(options: {
    chatId: string,
    text?: string,
    replyToMessageId?: number,
    entities?: MessageEntity[],
    media?: MediaInput,
    scheduleDate?: Date,
  }): Promise<Message> {
    const session = await this.getCurrentUserSession();
    const client = this.createClientFromSession(session);
    
    // Prepare message parameters
    const messageParams: any = {
      message: options.text,
    };
    
    if (options.replyToMessageId) {
      messageParams.replyTo = options.replyToMessageId;
    }
    
    if (options.entities && options.entities.length > 0) {
      messageParams.formattingEntities = options.entities;
    }
    
    if (options.scheduleDate) {
      messageParams.scheduleDate = options.scheduleDate;
    }
    
    // Handle media attachments
    if (options.media) {
      const mediaFile = await this.mediaService.getMediaFile(options.media.id);
      messageParams.file = mediaFile.path;
    }
    
    // Send message and get result
    const result = await client.sendMessage(options.chatId, messageParams);
    
    // Transform result to our API format
    const transformedMessage = this.transformMessage(result);
    
    // Store in database
    await this.messageRepository.storeMessage(transformedMessage);
    
    // Emit real-time event
    this.eventEmitter.emit('messageSent', {
      userId: session.userId,
      message: transformedMessage,
    });
    
    return transformedMessage;
  }
  
  // Additional message methods...
}
```

## Database Schema

### Core Tables

**Sessions Table**
```sql
CREATE TABLE telegram_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_string TEXT NOT NULL,
  phone_number VARCHAR(20),
  phone_code_hash VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

**Chats Table**
```sql
CREATE TABLE telegram_chats (
  id BIGINT PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  title VARCHAR(255),
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  photo_url VARCHAR(255),
  bio TEXT,
  about TEXT,
  member_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Messages Table**
```sql
CREATE TABLE telegram_messages (
  id BIGINT NOT NULL,
  chat_id BIGINT NOT NULL REFERENCES telegram_chats(id),
  sender_id BIGINT,
  text TEXT,
  media_type VARCHAR(50),
  media_url VARCHAR(255),
  date TIMESTAMP WITH TIME ZONE,
  edited_date TIMESTAMP WITH TIME ZONE,
  forward_from_id BIGINT,
  reply_to_message_id BIGINT,
  entities JSONB,
  views_count INTEGER,
  is_outgoing BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (chat_id, id)
);
```

**CRM Associations Table**
```sql
CREATE TABLE telegram_crm_associations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id BIGINT NOT NULL REFERENCES telegram_chats(id),
  crm_entity_type VARCHAR(50) NOT NULL,
  crm_entity_id UUID NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chat_id, crm_entity_type, crm_entity_id)
);
```

## Error Handling

### Global Error Handler

```typescript
// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
  // Log error details
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.id,
    userId: req.userId,
  });
  
  // Handle Telegram API specific errors
  if (err instanceof TelegramAPIError) {
    return res.status(err.httpStatus || 500).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }
  
  // Handle validation errors
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.details,
      },
    });
  }
  
  // Default error response
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message,
    },
  });
};
```

### Telegram-specific Error Handling

```typescript
class TelegramErrorHandler {
  static handleError(error) {
    if (error.message.includes('AUTH_KEY_UNREGISTERED')) {
      return new TelegramAPIError({
        message: 'Authentication session has expired',
        code: 'AUTH_EXPIRED',
        httpStatus: 401,
        details: { requiresReauth: true },
      });
    }
    
    if (error.message.includes('FLOOD_WAIT_')) {
      const seconds = parseInt(error.message.split('FLOOD_WAIT_')[1], 10);
      return new TelegramAPIError({
        message: `Rate limited by Telegram, please wait ${seconds} seconds`,
        code: 'RATE_LIMITED',
        httpStatus: 429,
        details: { waitSeconds: seconds },
      });
    }
    
    // Handle other specific Telegram errors...
    
    return new TelegramAPIError({
      message: 'An error occurred with the Telegram API',
      code: 'TELEGRAM_API_ERROR',
      httpStatus: 500,
      details: { originalError: error.message },
    });
  }
}
```

## Caching Strategy

### Redis Cache Configuration

```typescript
const redisCacheConfig = {
  chats: {
    ttl: 60 * 5, // 5 minutes
    key: (chatId) => `telegram:chat:${chatId}`,
  },
  messages: {
    ttl: 60 * 3, // 3 minutes
    key: (chatId, options) => {
      const offsetKey = options.offsetId 
        ? `:offset:${options.offsetId}` 
        : '';
      const limitKey = `:limit:${options.limit || 30}`;
      return `telegram:messages:${chatId}${offsetKey}${limitKey}`;
    },
  },
  contacts: {
    ttl: 60 * 30, // 30 minutes
    key: (userId) => `telegram:contacts:${userId}`,
  },
};

class RedisCacheService {
  constructor(private readonly redis: Redis) {}
  
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.redis.set(
      key,
      JSON.stringify(value),
      'EX',
      ttl || 60 * 5 // Default 5 minutes
    );
  }
  
  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length) {
      await this.redis.del(...keys);
    }
  }
}
```

## Security Considerations

### Session Management

- Store Telegram session strings securely with encryption
- Implement automatic session refresh mechanism
- Support for multi-device session management
- Session revocation on suspicious activity

### API Security

- Implement rate limiting per user and IP
- Use HTTPS for all communications
- Validate all user inputs with strict schemas
- Implement proper CORS configuration
- Use API keys with appropriate scopes

### Data Protection

- Encrypt sensitive data at rest
- Implement granular access controls
- Use GDPR-compliant data retention policies
- Regular security audits of the codebase

## Performance Optimization

### Message Handling

- Implement pagination for all message list endpoints
- Use virtual scrolling on frontend for large message histories
- Lazy load media attachments
- Implement partial message updates via WebSockets

### Background Processing

- Process media uploads asynchronously
- Handle message sending with retries and queues
- Use worker pools for CPU-intensive operations
- Implement optimistic UI updates

## Testing Strategy

### Unit Tests

```typescript
describe('MessageService', () => {
  let messageService: MessageService;
  let mockSessionRepo: MockSessionRepository;
  let mockMessageRepo: MockMessageRepository;
  
  beforeEach(() => {
    mockSessionRepo = new MockSessionRepository();
    mockMessageRepo = new MockMessageRepository();
    messageService = new MessageService(
      mockSessionRepo,
      mockMessageRepo,
      new MockMediaService(),
      new MockEventEmitter()
    );
  });
  
  describe('sendMessage', () => {
    it('should send a text message successfully', async () => {
      // Setup
      const mockSession = createMockSession();
      mockSessionRepo.findCurrentUserSession.mockResolvedValue(mockSession);
      
      const sendMessageParams = {
        chatId: '123456789',
        text: 'Hello, world!',
      };
      
      const mockResult = createMockMessageResult();
      mockTelegramClient.sendMessage.mockResolvedValue(mockResult);
      
      // Execute
      const result = await messageService.sendMessage(sendMessageParams);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.text).toBe('Hello, world!');
      expect(mockMessageRepo.storeMessage).toHaveBeenCalledWith(
        expect.objectContaining({ id: mockResult.id })
      );
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'messageSent',
        expect.any(Object)
      );
    });
    
    it('should handle media attachments correctly', async () => {
      // Test implementation...
    });
    
    it('should handle errors from Telegram API', async () => {
      // Test implementation...
    });
  });
});
```

### Integration Tests

```typescript
describe('Telegram API Integration Tests', () => {
  let app;
  let authToken;
  
  beforeAll(async () => {
    app = await createTestApp();
    // Setup test user and authentication
    authToken = await getTestUserAuthToken();
  });
  
  describe('GET /api/telegram/chats', () => {
    it('should return list of chats for authenticated user', async () => {
      // Execute
      const response = await request(app)
        .get('/api/telegram/chats')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
    });
    
    it('should require authentication', async () => {
      // Execute
      const response = await request(app)
        .get('/api/telegram/chats');
      
      // Assert
      expect(response.status).toBe(401);
    });
  });
  
  // Additional tests...
});
```

## Deployment Considerations

### Scaling Strategy

- Horizontal scaling for API servers
- Separate WebSocket servers with sticky sessions
- Read replicas for database
- Redis cluster for caching and pub/sub
- CDN for media delivery

### Monitoring Setup

- Prometheus for metrics collection
- Grafana dashboards for visualization
- ELK stack for log aggregation
- Custom alerts for Telegram API rate limits
- Health check endpoints for all services

## Appendix

### Telegram API Limitations

- Maximum message size: 4096 characters
- Rate limits: Varies by method, typically 20-30 requests per second
- Media upload limits: 2GB per file
- Bot API vs Client API differences
- MTProto protocol considerations

### Useful Resources

- [Official Telegram API Documentation](https://core.telegram.org/api)
- [MTProto Protocol Documentation](https://core.telegram.org/mtproto)
- [Telegram JavaScript Library](https://github.com/gram-js/gramjs)
- [Redis Documentation](https://redis.io/documentation)
- [WebSocket Implementation Guide](https://socket.io/docs/v4/)

### Troubleshooting Common Issues

1. **Authentication Failures**
   - Check API ID and hash are correct
   - Verify phone number format (international format)
   - Ensure 2FA password is correct if enabled

2. **Rate Limiting**
   - Implement exponential backoff
   - Use separate session for different users
   - Cache frequent requests

3. **Media Upload Issues**
   - Check file size and format restrictions
   - Verify content type is properly set
   - Implement resumable uploads for large files 