# Telegram API Reference

## Authentication Endpoints

### POST /api/v1/telegram/auth/login
Authenticates a user and returns a JWT token.

**Request:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2023-06-01T00:00:00Z"
}
```

### POST /api/v1/telegram/auth/refresh
Refreshes an authentication token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2023-06-01T00:00:00Z"
}
```

## Chat Endpoints

### GET /api/v1/telegram/chats
Returns a list of all chats.

**Query Parameters:**
- `limit` (optional): Maximum number of chats to return (default: 50)
- `offset` (optional): Offset for pagination (default: 0)
- `status` (optional): Filter by chat status (active, archived)

**Response:**
```json
{
  "chats": [
    {
      "id": "chat123",
      "title": "Marketing Team",
      "type": "group",
      "participants": 12,
      "lastMessage": {
        "id": "msg456",
        "text": "Let's discuss the campaign",
        "sender": {
          "id": "user789",
          "name": "John Doe"
        },
        "timestamp": "2023-05-15T14:30:00Z"
      },
      "unreadCount": 5
    }
  ],
  "total": 42,
  "hasMore": true
}
```

### GET /api/v1/telegram/chats/{chatId}
Returns details about a specific chat.

**Response:**
```json
{
  "id": "chat123",
  "title": "Marketing Team",
  "type": "group",
  "participants": [
    {
      "id": "user789",
      "name": "John Doe",
      "avatar": "https://example.com/avatars/johndoe.jpg",
      "role": "admin"
    },
    {
      "id": "user790",
      "name": "Jane Smith",
      "avatar": "https://example.com/avatars/janesmith.jpg",
      "role": "member"
    }
  ],
  "createdAt": "2023-01-10T09:00:00Z",
  "description": "Team chat for marketing coordination"
}
```

### GET /api/v1/telegram/chats/{chatId}/messages
Returns messages from a specific chat.

**Query Parameters:**
- `limit` (optional): Maximum number of messages to return (default: 50)
- `before` (optional): Return messages before this message ID
- `after` (optional): Return messages after this message ID

**Response:**
```json
{
  "messages": [
    {
      "id": "msg456",
      "text": "Let's discuss the campaign",
      "sender": {
        "id": "user789",
        "name": "John Doe"
      },
      "timestamp": "2023-05-15T14:30:00Z",
      "edited": false,
      "attachments": []
    }
  ],
  "hasMore": true
}
```

### POST /api/v1/telegram/chats/{chatId}/messages
Sends a new message to a chat.

**Request:**
```json
{
  "text": "Hello team!",
  "attachments": [
    {
      "mediaId": "media123",
      "type": "image"
    }
  ],
  "replyTo": "msg456"
}
```

**Response:**
```json
{
  "id": "msg789",
  "text": "Hello team!",
  "sender": {
    "id": "user789",
    "name": "John Doe"
  },
  "timestamp": "2023-05-15T14:35:00Z",
  "edited": false,
  "attachments": [
    {
      "id": "media123",
      "type": "image",
      "url": "https://storage.tezcrm.com/media/image123.jpg",
      "thumbnailUrl": "https://storage.tezcrm.com/media/thumbnails/image123.jpg",
      "size": 245789
    }
  ],
  "replyTo": {
    "id": "msg456",
    "text": "Let's discuss the campaign",
    "sender": {
      "id": "user789",
      "name": "John Doe"
    }
  }
}
```

## Media Endpoints

### POST /api/v1/telegram/media/upload-url
Generates a pre-signed URL for direct media upload.

**Request:**
```json
{
  "filename": "report.pdf",
  "contentType": "application/pdf",
  "size": 2048576
}
```

**Response:**
```json
{
  "mediaId": "media123",
  "uploadUrl": "https://storage.tezcrm.com/upload/signed-url",
  "expiresAt": "2023-05-15T15:30:00Z"
}
```

### GET /api/v1/telegram/media/{mediaId}
Returns details about a specific media asset.

**Response:**
```json
{
  "id": "media123",
  "filename": "report.pdf",
  "contentType": "application/pdf",
  "size": 2048576,
  "url": "https://storage.tezcrm.com/media/report.pdf",
  "thumbnailUrl": "https://storage.tezcrm.com/media/thumbnails/report.jpg",
  "uploadedBy": {
    "id": "user789",
    "name": "John Doe"
  },
  "uploadedAt": "2023-05-15T14:35:00Z"
}
```

## WebSocket API

Connect to `wss://api.tezcrm.com/v1/telegram/ws` for real-time updates.

### Authentication
```json
{
  "type": "auth",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Subscribe to Events
```json
{
  "type": "subscribe",
  "channel": "chat_updates",
  "chatId": "chat123"
}
```

### Received Events
```json
{
  "type": "message.new",
  "message": {
    "id": "msg789",
    "text": "Hello team!",
    "sender": {
      "id": "user789",
      "name": "John Doe"
    },
    "timestamp": "2023-05-15T14:35:00Z"
  }
}
```

```json
{
  "type": "typing.indicator",
  "userId": "user790",
  "chatId": "chat123",
  "isTyping": true
}
```

### Send Typing Indicator
```json
{
  "type": "typing.indicator",
  "chatId": "chat123",
  "isTyping": true
}
```

## Push Notification Specifications

### Registration
```json
POST /api/v1/telegram/devices

{
  "token": "device-fcm-token",
  "platform": "android", // or "ios", "web"
  "appVersion": "1.2.3"
}
```

### Notification Payload Structure
```json
{
  "notificationType": "message", // or "mention", "reaction"
  "chatId": "chat123",
  "messageId": "msg789",
  "sender": {
    "id": "user790",
    "name": "Jane Smith"
  },
  "preview": "Hello team!",
  "badge": 5
}
```

## Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side error 