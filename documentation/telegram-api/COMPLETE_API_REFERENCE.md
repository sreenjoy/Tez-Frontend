# Complete Telegram API Reference

## Overview

This document provides a comprehensive reference for all API endpoints required for the Telegram integration in the Tez CRM platform. These endpoints facilitate authentication, messaging, contact management, media handling, and CRM integration.

## Authentication Endpoints

### 1. Initialize Telegram Connection

#### `POST /api/telegram/auth/initialize`

Starts the Telegram authentication process.

**Request Body:**
```json
{
  "apiId": "YOUR_API_ID",
  "apiHash": "YOUR_API_HASH"
}
```

**Response:**
```json
{
  "success": true,
  "connectionId": "conn_12345",
  "status": "initialized"
}
```

### 2. Request Phone Code

#### `POST /api/telegram/auth/request-code`

Requests the verification code to be sent to the user's phone.

**Request Body:**
```json
{
  "phoneNumber": "+15551234567",
  "connectionId": "conn_12345"
}
```

**Response:**
```json
{
  "success": true,
  "phoneCodeHash": "abc123def456",
  "codeLength": 5,
  "timeout": 120
}
```

### 3. Verify Phone Code

#### `POST /api/telegram/auth/verify-code`

Verifies the phone code provided by the user.

**Request Body:**
```json
{
  "phoneNumber": "+15551234567",
  "phoneCodeHash": "abc123def456",
  "verificationCode": "12345",
  "connectionId": "conn_12345"
}
```

**Response:**
```json
{
  "success": true,
  "requiresPassword": false,
  "user": {
    "id": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "phone": "+15551234567"
  },
  "session": "encrypted_session_data"
}
```

### 4. Submit 2FA Password

#### `POST /api/telegram/auth/verify-password`

Submits the two-factor authentication password if required.

**Request Body:**
```json
{
  "password": "secure_password_123",
  "connectionId": "conn_12345"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "phone": "+15551234567"
  },
  "session": "encrypted_session_data"
}
```

### 5. Check Authentication Status

#### `GET /api/telegram/auth/status`

Checks the current authentication status.

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe"
  },
  "lastActive": "2023-07-15T14:30:00Z"
}
```

### 6. Logout

#### `POST /api/telegram/auth/logout`

Terminates the Telegram session.

**Response:**
```json
{
  "success": true,
  "message": "Successfully logged out from Telegram"
}
```

## Chat Endpoints

### 1. Get All Chats

#### `GET /api/telegram/chats`

Retrieves all available chats.

**Query Parameters:**
- `limit` (optional): Maximum number of chats to return (default: 50)
- `offset` (optional): Offset for pagination
- `archived` (optional): Include archived chats (default: false)

**Response:**
```json
{
  "chats": [
    {
      "id": "chat123",
      "type": "private",
      "title": null,
      "username": "contactuser",
      "firstName": "Jane",
      "lastName": "Smith",
      "photo": {
        "small": "https://cdn.telegram.org/photo_small.jpg",
        "big": "https://cdn.telegram.org/photo_big.jpg"
      },
      "lastMessage": {
        "id": "msg456",
        "text": "Hello there!",
        "date": "2023-07-15T15:30:00Z",
        "senderId": "user789"
      },
      "unreadCount": 3,
      "isVerified": false,
      "isPinned": true,
      "isMuted": false
    }
  ],
  "totalCount": 120,
  "hasMore": true
}
```

### 2. Get Chat by ID

#### `GET /api/telegram/chats/:chatId`

Retrieves detailed information about a specific chat.

**Response:**
```json
{
  "id": "chat123",
  "type": "private",
  "title": null,
  "username": "contactuser",
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+15551234567",
  "bio": "Product Manager",
  "photo": {
    "small": "https://cdn.telegram.org/photo_small.jpg",
    "big": "https://cdn.telegram.org/photo_big.jpg"
  },
  "lastMessage": {
    "id": "msg456",
    "text": "Hello there!",
    "date": "2023-07-15T15:30:00Z",
    "senderId": "user789"
  },
  "unreadCount": 3,
  "membersCount": 2,
  "isVerified": false,
  "isPinned": true,
  "isMuted": false,
  "notificationSettings": {
    "muteUntil": null,
    "sound": "default",
    "showPreviews": true
  },
  "permissions": {
    "canSendMessages": true,
    "canSendMedia": true,
    "canSendPolls": true,
    "canSendStickers": true,
    "canChangeInfo": false
  }
}
```

### 3. Create New Chat

#### `POST /api/telegram/chats`

Creates a new chat with a user or a group.

**Request Body:**
```json
{
  "type": "private",
  "userId": "user456",
  "message": "Hi, I'd like to discuss our product"
}
```

**Response:**
```json
{
  "success": true,
  "chat": {
    "id": "chat789",
    "type": "private",
    "firstName": "Bob",
    "lastName": "Johnson",
    "username": "bobjohnson"
  },
  "message": {
    "id": "msg123",
    "text": "Hi, I'd like to discuss our product",
    "date": "2023-07-15T16:00:00Z",
    "status": "sent"
  }
}
```

### 4. Search Chats

#### `GET /api/telegram/chats/search`

Searches for chats by name or content.

**Query Parameters:**
- `query`: Search term
- `limit` (optional): Maximum number of results (default: 20)

**Response:**
```json
{
  "chats": [
    {
      "id": "chat123",
      "type": "private",
      "firstName": "Jane",
      "lastName": "Smith",
      "username": "janesmith",
      "matchType": "name"
    }
  ],
  "messages": [
    {
      "id": "msg456",
      "chatId": "chat789",
      "text": "Let's discuss the product pricing",
      "date": "2023-07-14T10:30:00Z",
      "chatName": "Marketing Team"
    }
  ]
}
```

### 5. Update Chat Settings

#### `PATCH /api/telegram/chats/:chatId`

Updates settings for a specific chat.

**Request Body:**
```json
{
  "isPinned": true,
  "isMuted": false,
  "muteUntil": null,
  "notificationSound": "default"
}
```

**Response:**
```json
{
  "success": true,
  "chat": {
    "id": "chat123",
    "isPinned": true,
    "isMuted": false,
    "notificationSettings": {
      "muteUntil": null,
      "sound": "default",
      "showPreviews": true
    }
  }
}
```

## Message Endpoints

### 1. Get Messages

#### `GET /api/telegram/chats/:chatId/messages`

Retrieves messages from a specific chat.

**Query Parameters:**
- `limit`: Number of messages to retrieve (default: 50)
- `offset`: Message ID to start from (for pagination)
- `ephemeral`: Boolean indicating whether to store messages (default: true)

**Response:**
```json
{
  "messages": [
    {
      "id": "msg123",
      "text": "Hello, how are you?",
      "from": {
        "id": "user456",
        "firstName": "Jane",
        "lastName": "Smith",
        "username": "janesmith"
      },
      "date": "2023-07-15T14:30:00Z",
      "replyToMessageId": null,
      "forwardFrom": null,
      "editedAt": null,
      "media": null,
      "reactions": []
    }
  ],
  "hasMore": true,
  "totalCount": 235
}
```

### 2. Send Message

#### `POST /api/telegram/messages/send`

Sends a message to a Telegram chat.

**Request Body:**
```json
{
  "chatId": "chat123",
  "text": "Hi there, just following up on our conversation.",
  "replyToMessageId": null,
  "media": null,
  "scheduledFor": null,
  "silentMode": false,
  "clearDraft": true
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg456",
    "text": "Hi there, just following up on our conversation.",
    "date": "2023-07-15T16:30:00Z",
    "status": "sent"
  }
}
```

### 3. Forward Message

#### `POST /api/telegram/messages/forward`

Forwards a message to another chat.

**Request Body:**
```json
{
  "messageId": "msg123",
  "fromChatId": "chat456",
  "toChatId": "chat789",
  "hideCaption": false,
  "hideSender": false,
  "scheduledFor": null
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg987",
    "forwardedFrom": {
      "chatId": "chat456",
      "messageId": "msg123",
      "senderName": "Jane Smith"
    },
    "date": "2023-07-15T16:35:00Z",
    "status": "sent"
  }
}
```

### 4. Edit Message

#### `PATCH /api/telegram/messages/:messageId`

Edits a previously sent message.

**Request Body:**
```json
{
  "chatId": "chat123",
  "text": "Updated message content with corrections",
  "media": null
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg123",
    "text": "Updated message content with corrections",
    "editedAt": "2023-07-15T16:40:00Z",
    "status": "edited"
  }
}
```

### 5. Delete Message

#### `DELETE /api/telegram/messages/:messageId`

Deletes a message from the chat.

**Query Parameters:**
- `chatId`: ID of the chat containing the message
- `deleteForEveryone`: Boolean indicating whether to delete for all users (default: false)

**Response:**
```json
{
  "success": true,
  "deletedMessageId": "msg123"
}
```

### 6. React to Message

#### `POST /api/telegram/messages/:messageId/react`

Adds a reaction to a message.

**Request Body:**
```json
{
  "chatId": "chat123",
  "reaction": "👍",
  "big": false
}
```

**Response:**
```json
{
  "success": true,
  "reaction": {
    "messageId": "msg123",
    "reaction": "👍",
    "count": 1,
    "recent": [
      {
        "userId": "user456",
        "name": "John Doe"
      }
    ]
  }
}
```

### 7. Scheduled Messages

#### `GET /api/telegram/chats/:chatId/scheduled`

Retrieves scheduled messages for a chat.

**Response:**
```json
{
  "scheduledMessages": [
    {
      "id": "sched_123",
      "text": "Meeting reminder for tomorrow",
      "scheduledFor": "2023-07-16T09:00:00Z",
      "media": null
    }
  ]
}
```

### 8. Cancel Scheduled Message

#### `DELETE /api/telegram/messages/scheduled/:messageId`

Cancels a scheduled message.

**Query Parameters:**
- `chatId`: ID of the chat containing the scheduled message

**Response:**
```json
{
  "success": true,
  "canceledMessageId": "sched_123"
}
```

## Media Endpoints

### 1. Upload Media

#### `POST /api/telegram/media/upload`

Uploads media to be sent in messages.

**Request:**
Multipart form data with:
- `file`: The media file to upload
- `type`: Type of media (photo, video, document, audio, voice)
- `caption` (optional): Caption for the media

**Response:**
```json
{
  "success": true,
  "media": {
    "id": "media123",
    "type": "photo",
    "fileSize": 1024000,
    "fileName": "product_image.jpg",
    "mimeType": "image/jpeg",
    "dimensions": {
      "width": 1200,
      "height": 800
    },
    "thumbnail": {
      "url": "https://cdn.telegram.org/thumbnail.jpg",
      "width": 320,
      "height": 213
    },
    "url": "https://cdn.telegram.org/full_image.jpg",
    "expiresAt": "2023-07-16T16:30:00Z"
  }
}
```

### 2. Download Media

#### `GET /api/telegram/media/:mediaId/download`

Downloads media from a message.

**Query Parameters:**
- `chatId`: ID of the chat containing the message
- `messageId`: ID of the message containing the media
- `thumb` (optional): Whether to download thumbnail only (default: false)

**Response:**
Binary file stream with appropriate Content-Type header.

### 3. Send Voice Message

#### `POST /api/telegram/media/voice`

Uploads and sends a voice message.

**Request:**
Multipart form data with:
- `file`: The voice recording file
- `chatId`: ID of the chat to send to
- `duration`: Duration of the recording in seconds
- `waveform` (optional): Voice message waveform data

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg789",
    "media": {
      "type": "voice",
      "duration": 15,
      "waveform": [0, 4, 8, 16, 12, 8, 4],
      "fileSize": 45000
    },
    "date": "2023-07-15T16:45:00Z",
    "status": "sent"
  }
}
```

### 4. Send Video Note (Round Video)

#### `POST /api/telegram/media/video-note`

Uploads and sends a video note (circular video).

**Request:**
Multipart form data with:
- `file`: The video file
- `chatId`: ID of the chat to send to
- `duration`: Duration of the video in seconds
- `length`: Diameter of the video in pixels

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg790",
    "media": {
      "type": "videoNote",
      "duration": 10,
      "length": 384,
      "fileSize": 780000
    },
    "date": "2023-07-15T16:50:00Z",
    "status": "sent"
  }
}
```

## Contact Endpoints

### 1. Get Contacts

#### `GET /api/telegram/contacts`

Retrieves all Telegram contacts.

**Query Parameters:**
- `limit` (optional): Maximum number of contacts to return (default: 100)
- `offset` (optional): Offset for pagination
- `query` (optional): Search query to filter contacts

**Response:**
```json
{
  "contacts": [
    {
      "id": "user123",
      "firstName": "Jane",
      "lastName": "Smith",
      "username": "janesmith",
      "phone": "+15551234567",
      "photo": {
        "small": "https://cdn.telegram.org/photo_small.jpg",
        "big": "https://cdn.telegram.org/photo_big.jpg"
      },
      "lastSeen": "2023-07-15T15:30:00Z",
      "isVerified": false,
      "isMutualContact": true
    }
  ],
  "totalCount": 45,
  "hasMore": false
}
```

### 2. Get Contact by ID

#### `GET /api/telegram/contacts/:contactId`

Retrieves detailed information about a contact.

**Response:**
```json
{
  "id": "user123",
  "firstName": "Jane",
  "lastName": "Smith",
  "username": "janesmith",
  "phone": "+15551234567",
  "bio": "Product Manager at Acme Corp",
  "photo": {
    "small": "https://cdn.telegram.org/photo_small.jpg",
    "big": "https://cdn.telegram.org/photo_big.jpg"
  },
  "lastSeen": "2023-07-15T15:30:00Z",
  "isVerified": false,
  "isMutualContact": true,
  "commonChats": 2
}
```

### 3. Sync Contacts

#### `POST /api/telegram/contacts/sync`

Synchronizes Telegram contacts with CRM contacts.

**Request Body:**
```json
{
  "createMissing": true,
  "updateExisting": true,
  "matchByPhone": true
}
```

**Response:**
```json
{
  "success": true,
  "created": 5,
  "updated": 12,
  "skipped": 3,
  "failed": 0
}
```

### 4. Add Contact

#### `POST /api/telegram/contacts`

Adds a new contact to Telegram.

**Request Body:**
```json
{
  "phoneNumber": "+15551234567",
  "firstName": "Robert",
  "lastName": "Brown",
  "addToCRM": true
}
```

**Response:**
```json
{
  "success": true,
  "contact": {
    "id": "user789",
    "firstName": "Robert",
    "lastName": "Brown",
    "phone": "+15551234567",
    "isMutualContact": false
  },
  "crmContact": {
    "id": "crm123",
    "status": "created"
  }
}
```

### 5. Delete Contact

#### `DELETE /api/telegram/contacts/:contactId`

Removes a contact from Telegram.

**Query Parameters:**
- `removeFromCRM` (optional): Also remove from CRM (default: false)

**Response:**
```json
{
  "success": true,
  "message": "Contact successfully removed"
}
```

## Status & Presence Endpoints

### 1. Set Typing Status

#### `POST /api/telegram/chats/:chatId/typing`

Indicates that the user is typing in a chat.

**Request Body:**
```json
{
  "action": "typing"
}
```

**Response:**
```json
{
  "success": true
}
```

### 2. Set Online Status

#### `POST /api/telegram/status/set`

Sets the user's online status.

**Request Body:**
```json
{
  "online": true,
  "expiresIn": 300
}
```

**Response:**
```json
{
  "success": true,
  "status": "online",
  "expiresAt": "2023-07-15T17:05:00Z"
}
```

### 3. Get User Status

#### `GET /api/telegram/users/:userId/status`

Gets the online status of a user.

**Response:**
```json
{
  "userId": "user123",
  "status": "online",
  "lastSeen": null,
  "wasRecently": false
}
```

## Notification Endpoints

### 1. Get Notification Settings

#### `GET /api/telegram/notifications/settings`

Retrieves notification settings for the Telegram integration.

**Response:**
```json
{
  "enablePush": true,
  "enableEmail": false,
  "muteFrom": "23:00",
  "muteTo": "07:00",
  "soundEnabled": true,
  "soundName": "default",
  "vibrationEnabled": true,
  "includeMutedChats": false,
  "priority": "high",
  "perChatSettings": [
    {
      "chatId": "chat123",
      "isMuted": true,
      "muteUntil": "2023-08-15T00:00:00Z"
    }
  ]
}
```

### 2. Update Notification Settings

#### `PATCH /api/telegram/notifications/settings`

Updates notification settings.

**Request Body:**
```json
{
  "enablePush": true,
  "muteFrom": "22:00",
  "muteTo": "08:00",
  "soundEnabled": true,
  "soundName": "chime"
}
```

**Response:**
```json
{
  "success": true,
  "settings": {
    "enablePush": true,
    "enableEmail": false,
    "muteFrom": "22:00",
    "muteTo": "08:00",
    "soundEnabled": true,
    "soundName": "chime"
  }
}
```

### 3. Register Push Token

#### `POST /api/telegram/notifications/token`

Registers a device token for push notifications.

**Request Body:**
```json
{
  "token": "fcm_device_token_123",
  "platform": "android",
  "deviceId": "device_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Push token registered successfully"
}
```

## CRM Integration Endpoints

### 1. Associate Chat with Deal

#### `POST /api/telegram/crm/associate-chat`

Associates a Telegram chat with a CRM deal.

**Request Body:**
```json
{
  "chatId": "chat123",
  "dealId": "deal456",
  "addToActivityHistory": true
}
```

**Response:**
```json
{
  "success": true,
  "association": {
    "chatId": "chat123",
    "dealId": "deal456",
    "associatedAt": "2023-07-15T17:15:00Z",
    "associatedBy": "user789"
  }
}
```

### 2. Get Deals by Chat

#### `GET /api/telegram/crm/deals-by-chat/:chatId`

Retrieves all deals associated with a Telegram chat.

**Response:**
```json
{
  "deals": [
    {
      "id": "deal456",
      "name": "Enterprise License Deal",
      "stage": "Negotiation",
      "value": 25000,
      "associatedAt": "2023-07-15T17:15:00Z",
      "lastActivity": "2023-07-15T17:20:00Z"
    }
  ]
}
```

### 3. Create Deal from Chat

#### `POST /api/telegram/crm/create-deal`

Creates a new CRM deal from a Telegram chat.

**Request Body:**
```json
{
  "chatId": "chat123",
  "dealName": "New Software License",
  "pipeline": "sales",
  "stage": "qualified",
  "value": 5000,
  "includeHistory": true
}
```

**Response:**
```json
{
  "success": true,
  "deal": {
    "id": "deal789",
    "name": "New Software License",
    "pipeline": "sales",
    "stage": "qualified",
    "value": 5000,
    "associatedChat": "chat123",
    "createdAt": "2023-07-15T17:25:00Z"
  }
}
```

### 4. Create Task from Message

#### `POST /api/telegram/crm/create-task`

Creates a CRM task from a Telegram message.

**Request Body:**
```json
{
  "chatId": "chat123",
  "messageId": "msg456",
  "taskTitle": "Follow up on pricing request",
  "dueDate": "2023-07-20T17:00:00Z",
  "assignee": "user789",
  "priority": "high"
}
```

**Response:**
```json
{
  "success": true,
  "task": {
    "id": "task123",
    "title": "Follow up on pricing request",
    "dueDate": "2023-07-20T17:00:00Z",
    "assignee": "user789",
    "priority": "high",
    "associatedChat": "chat123",
    "associatedMessage": "msg456",
    "createdAt": "2023-07-15T17:30:00Z"
  }
}
```

### 5. Log Communication

#### `POST /api/telegram/crm/log-communication`

Logs Telegram communication in the CRM activity history.

**Request Body:**
```json
{
  "chatId": "chat123",
  "messageIds": ["msg123", "msg124", "msg125"],
  "contactId": "contact456",
  "dealId": "deal789",
  "summary": "Discussed product pricing and timeline"
}
```

**Response:**
```json
{
  "success": true,
  "activityLog": {
    "id": "log123",
    "type": "telegram_communication",
    "contact": "contact456",
    "deal": "deal789",
    "summary": "Discussed product pricing and timeline",
    "messageCount": 3,
    "createdAt": "2023-07-15T17:35:00Z"
  }
}
```

## Statistics & Analytics Endpoints

### 1. Get Chat Statistics

#### `GET /api/telegram/stats/chats/:chatId`

Retrieves statistics for a specific chat.

**Query Parameters:**
- `period`: Time period for statistics (day, week, month, year)
- `startDate` (optional): Start date for custom period
- `endDate` (optional): End date for custom period

**Response:**
```json
{
  "messageCount": 152,
  "sentMessages": 78,
  "receivedMessages": 74,
  "mediaCount": 12,
  "averageResponseTime": 180,
  "activityByHour": [
    { "hour": 9, "count": 15 },
    { "hour": 10, "count": 23 },
    { "hour": 11, "count": 18 }
  ],
  "activityByDay": [
    { "day": "2023-07-10", "count": 45 },
    { "day": "2023-07-11", "count": 32 },
    { "day": "2023-07-12", "count": 75 }
  ]
}
```

### 2. Get User Activity

#### `GET /api/telegram/stats/activity`

Retrieves activity statistics for the current user.

**Query Parameters:**
- `period`: Time period for statistics (day, week, month, year)

**Response:**
```json
{
  "totalChats": 25,
  "activeChats": 12,
  "totalMessages": 1243,
  "sentMessages": 645,
  "receivedMessages": 598,
  "mediaShared": 87,
  "averageResponseTime": 210,
  "busyHours": [
    { "hour": 10, "count": 145 },
    { "hour": 14, "count": 178 },
    { "hour": 16, "count": 132 }
  ],
  "busyDays": [
    { "day": "Monday", "count": 245 },
    { "day": "Wednesday", "count": 312 },
    { "day": "Thursday", "count": 278 }
  ]
}
```

### 3. Get Team Statistics

#### `GET /api/telegram/stats/team`

Retrieves Telegram usage statistics for the team.

**Query Parameters:**
- `period`: Time period for statistics (day, week, month, year)

**Response:**
```json
{
  "teamMembers": [
    {
      "userId": "user123",
      "name": "John Doe",
      "totalMessages": 645,
      "totalChats": 15,
      "averageResponseTime": 185
    },
    {
      "userId": "user456",
      "name": "Jane Smith",
      "totalMessages": 892,
      "totalChats": 22,
      "averageResponseTime": 120
    }
  ],
  "totalTeamMessages": 1537,
  "totalTeamChats": 37,
  "averageTeamResponseTime": 152
}
```

## Advanced Features

### 1. Message Search

#### `GET /api/telegram/search/messages`

Searches for messages across all chats.

**Query Parameters:**
- `query`: Search term
- `chatId` (optional): Limit search to specific chat
- `fromDate` (optional): Start date for search period
- `toDate` (optional): End date for search period
- `limit`: Maximum number of results (default: 20)
- `offset`: Offset for pagination

**Response:**
```json
{
  "messages": [
    {
      "id": "msg123",
      "chatId": "chat456",
      "text": "Let's discuss the product pricing tomorrow",
      "date": "2023-07-14T10:30:00Z",
      "from": {
        "id": "user789",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "chatType": "private",
      "chatName": "Jane Smith"
    }
  ],
  "totalCount": 15,
  "hasMore": false
}
```

### 2. Export Chat History

#### `POST /api/telegram/chats/:chatId/export`

Exports chat history to a file.

**Request Body:**
```json
{
  "format": "pdf",
  "includeMedia": true,
  "dateRange": {
    "from": "2023-06-01T00:00:00Z",
    "to": "2023-07-15T23:59:59Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "exportId": "export123",
  "status": "processing",
  "estimatedCompletionTime": "2023-07-15T18:00:00Z"
}
```

### 3. Get Export Status

#### `GET /api/telegram/exports/:exportId`

Checks the status of an export process.

**Response:**
```json
{
  "exportId": "export123",
  "status": "completed",
  "format": "pdf",
  "fileSize": 1540000,
  "downloadUrl": "https://api.tez.app/downloads/export123.pdf",
  "expiresAt": "2023-07-22T17:45:00Z"
}
```

### 4. Create Bot Message Template

#### `POST /api/telegram/templates`

Creates a message template for quick responses.

**Request Body:**
```json
{
  "name": "Product Inquiry Response",
  "text": "Thank you for your interest in our product. Our pricing starts at $99/month with a 14-day free trial. Would you like me to send you more information or schedule a demo?",
  "category": "sales",
  "variables": ["productName", "pricingTier", "trialDays"]
}
```

**Response:**
```json
{
  "success": true,
  "template": {
    "id": "tmpl123",
    "name": "Product Inquiry Response",
    "text": "Thank you for your interest in our product. Our pricing starts at $99/month with a 14-day free trial. Would you like me to send you more information or schedule a demo?",
    "category": "sales",
    "variables": ["productName", "pricingTier", "trialDays"],
    "createdAt": "2023-07-15T17:50:00Z"
  }
}
```

### 5. Send Template Message

#### `POST /api/telegram/messages/send-template`

Sends a message using a predefined template.

**Request Body:**
```json
{
  "chatId": "chat123",
  "templateId": "tmpl123",
  "variables": {
    "productName": "Tez CRM Pro",
    "pricingTier": "$199",
    "trialDays": "30"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "msg456",
    "text": "Thank you for your interest in our product Tez CRM Pro. Our pricing starts at $199/month with a 30-day free trial. Would you like me to send you more information or schedule a demo?",
    "date": "2023-07-15T17:55:00Z",
    "status": "sent"
  }
}
```

## Error Codes and Handling

| Code | Name | Description | Resolution |
|------|------|-------------|------------|
| 400 | BAD_REQUEST | Invalid request parameters | Check request body and parameters |
| 401 | UNAUTHORIZED | Authentication required | Re-authenticate with Telegram |
| 403 | FORBIDDEN | Permission denied | Check user permissions |
| 404 | NOT_FOUND | Resource not found | Verify resource IDs |
| 409 | CONFLICT | Resource conflict | Resolve conflicting state |
| 413 | PAYLOAD_TOO_LARGE | Request payload too large | Reduce payload size |
| 429 | TOO_MANY_REQUESTS | Rate limit exceeded | Implement exponential backoff |
| 500 | SERVER_ERROR | Internal server error | Contact support team |
| 503 | SERVICE_UNAVAILABLE | Telegram API unavailable | Retry with backoff strategy |

## Webhook Events

The following webhook events can be configured to receive real-time updates:

| Event Type | Description |
|------------|-------------|
| `message.new` | New message received |
| `message.edited` | Message was edited |
| `message.deleted` | Message was deleted |
| `message.read` | Message was read |
| `chat.new` | New chat created |
| `chat.closed` | Chat was closed or archived |
| `user.online` | User came online |
| `user.offline` | User went offline |
| `contact.added` | Contact was added |
| `contact.updated` | Contact information updated |
| `auth.statusChange` | Authentication status changed |

## Rate Limits

| Endpoint | Rate Limit | Time Window |
|----------|------------|-------------|
| Auth endpoints | 5 requests | 1 minute |
| Message sending | 30 messages | 1 minute |
| Media uploads | 20 uploads | 5 minutes |
| Chat retrievals | 60 requests | 1 minute |
| Contact operations | 30 requests | 1 minute |
| Search operations | 10 requests | 1 minute |
| Export operations | 2 requests | 1 hour |
| Statistics endpoints | 20 requests | 5 minutes | 