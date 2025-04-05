# Tez API Reference

## Overview

This document provides detailed information about the RESTful API endpoints used by the Tez Frontend to communicate with backend services. The API follows standard REST conventions and returns responses in JSON format.

All API requests require authentication unless explicitly stated otherwise. Authentication is performed using JWT tokens provided in the `Authorization` header with the format `Bearer <token>`.

Base URL: `https://api.tez.app/v1`

## Authentication Endpoints

### POST /auth/login

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_123456789",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "sales_rep"
  }
}
```

**Status Codes:**
- `200 OK` - Authentication successful
- `401 Unauthorized` - Invalid credentials
- `422 Unprocessable Entity` - Invalid request format

### POST /auth/register

Creates a new user account.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "firstName": "Jane",
  "lastName": "Smith",
  "companyName": "Acme Corp"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_987654321",
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "admin"
  }
}
```

**Status Codes:**
- `201 Created` - User created successfully
- `409 Conflict` - Email already in use
- `422 Unprocessable Entity` - Invalid request format

### POST /auth/refresh

Refreshes an expired JWT token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `200 OK` - Token refreshed successfully
- `401 Unauthorized` - Invalid refresh token

### POST /auth/logout

Invalidates the current JWT token.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Status Codes:**
- `200 OK` - Logout successful
- `401 Unauthorized` - Not authenticated

## Pipeline Endpoints

### GET /pipelines

Retrieves all pipelines for the current organization.

**Query Parameters:**
- `includeStages` (boolean, optional) - Include stage details in response

**Response:**
```json
{
  "pipelines": [
    {
      "id": "pl_123456789",
      "name": "Sales Pipeline",
      "description": "Main sales process",
      "stages": [
        {
          "id": "stg_123456789",
          "name": "Lead",
          "order": 1,
          "dealCount": 12,
          "totalValue": 36000
        },
        {
          "id": "stg_234567890",
          "name": "Qualified",
          "order": 2,
          "dealCount": 8,
          "totalValue": 24000
        }
      ]
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Request successful
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions

### POST /pipelines

Creates a new pipeline.

**Request Body:**
```json
{
  "name": "Enterprise Sales",
  "description": "Pipeline for enterprise clients",
  "stages": [
    {
      "name": "Initial Contact",
      "order": 1
    },
    {
      "name": "Needs Analysis",
      "order": 2
    }
  ]
}
```

**Response:**
```json
{
  "id": "pl_567890123",
  "name": "Enterprise Sales",
  "description": "Pipeline for enterprise clients",
  "stages": [
    {
      "id": "stg_345678901",
      "name": "Initial Contact",
      "order": 1,
      "dealCount": 0,
      "totalValue": 0
    },
    {
      "id": "stg_456789012",
      "name": "Needs Analysis",
      "order": 2,
      "dealCount": 0,
      "totalValue": 0
    }
  ]
}
```

**Status Codes:**
- `201 Created` - Pipeline created successfully
- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions

### GET /pipelines/{pipelineId}

Retrieves details for a specific pipeline.

**Path Parameters:**
- `pipelineId` - ID of the pipeline to retrieve

**Response:**
```json
{
  "id": "pl_123456789",
  "name": "Sales Pipeline",
  "description": "Main sales process",
  "stages": [
    {
      "id": "stg_123456789",
      "name": "Lead",
      "order": 1,
      "dealCount": 12,
      "totalValue": 36000
    },
    {
      "id": "stg_234567890",
      "name": "Qualified",
      "order": 2,
      "dealCount": 8,
      "totalValue": 24000
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Request successful
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Pipeline not found

### PUT /pipelines/{pipelineId}

Updates a specific pipeline.

**Path Parameters:**
- `pipelineId` - ID of the pipeline to update

**Request Body:**
```json
{
  "name": "Updated Pipeline Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "id": "pl_123456789",
  "name": "Updated Pipeline Name",
  "description": "Updated description",
  "stages": [...]
}
```

**Status Codes:**
- `200 OK` - Pipeline updated successfully
- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Pipeline not found

### DELETE /pipelines/{pipelineId}

Deletes a specific pipeline.

**Path Parameters:**
- `pipelineId` - ID of the pipeline to delete

**Response:**
```json
{
  "message": "Pipeline deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Pipeline deleted successfully
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Pipeline not found

## Deal Endpoints

### GET /deals

Retrieves all deals matching the given criteria.

**Query Parameters:**
- `pipelineId` (string, optional) - Filter by pipeline
- `stageId` (string, optional) - Filter by stage
- `ownerId` (string, optional) - Filter by owner
- `status` (string, optional) - Filter by status (active, won, lost)
- `search` (string, optional) - Search in deal name and company
- `page` (integer, optional) - Page number for pagination
- `limit` (integer, optional) - Items per page (default: 20)
- `sort` (string, optional) - Field to sort by (e.g., "createdAt", "value")
- `order` (string, optional) - Sort order ("asc" or "desc")

**Response:**
```json
{
  "deals": [
    {
      "id": "dl_123456789",
      "name": "Acme Corp - Enterprise License",
      "company": "Acme Corporation",
      "value": 15000,
      "currency": "USD",
      "stageId": "stg_123456789",
      "pipelineId": "pl_123456789",
      "ownerId": "usr_123456789",
      "contactName": "John Smith",
      "contactEmail": "john@acmecorp.com",
      "contactPhone": "+1 555-123-4567",
      "probability": 60,
      "expectedCloseDate": "2023-12-31T00:00:00Z",
      "createdAt": "2023-06-15T14:30:00Z",
      "updatedAt": "2023-06-20T09:15:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

**Status Codes:**
- `200 OK` - Request successful
- `400 Bad Request` - Invalid query parameters
- `401 Unauthorized` - Not authenticated

### POST /deals

Creates a new deal.

**Request Body:**
```json
{
  "name": "BigCorp - Software Subscription",
  "company": "BigCorp Inc.",
  "value": 25000,
  "currency": "USD",
  "stageId": "stg_123456789",
  "pipelineId": "pl_123456789",
  "contactName": "Jane Doe",
  "contactEmail": "jane@bigcorp.com",
  "contactPhone": "+1 555-987-6543",
  "probability": 40,
  "expectedCloseDate": "2023-11-30T00:00:00Z"
}
```

**Response:**
```json
{
  "id": "dl_987654321",
  "name": "BigCorp - Software Subscription",
  "company": "BigCorp Inc.",
  "value": 25000,
  "currency": "USD",
  "stageId": "stg_123456789",
  "pipelineId": "pl_123456789",
  "ownerId": "usr_123456789",
  "contactName": "Jane Doe",
  "contactEmail": "jane@bigcorp.com",
  "contactPhone": "+1 555-987-6543",
  "probability": 40,
  "expectedCloseDate": "2023-11-30T00:00:00Z",
  "createdAt": "2023-07-10T11:45:00Z",
  "updatedAt": "2023-07-10T11:45:00Z"
}
```

**Status Codes:**
- `201 Created` - Deal created successfully
- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions

### GET /deals/{dealId}

Retrieves details for a specific deal.

**Path Parameters:**
- `dealId` - ID of the deal to retrieve

**Response:**
```json
{
  "id": "dl_123456789",
  "name": "Acme Corp - Enterprise License",
  "company": "Acme Corporation",
  "value": 15000,
  "currency": "USD",
  "stageId": "stg_123456789",
  "pipelineId": "pl_123456789",
  "ownerId": "usr_123456789",
  "contactName": "John Smith",
  "contactEmail": "john@acmecorp.com",
  "contactPhone": "+1 555-123-4567",
  "probability": 60,
  "expectedCloseDate": "2023-12-31T00:00:00Z",
  "createdAt": "2023-06-15T14:30:00Z",
  "updatedAt": "2023-06-20T09:15:00Z",
  "notes": "Customer is interested in a multi-year contract.",
  "customFields": {
    "industryType": "Technology",
    "leadSource": "Conference",
    "decisionMaker": true
  }
}
```

**Status Codes:**
- `200 OK` - Request successful
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Deal not found

### PUT /deals/{dealId}

Updates a specific deal.

**Path Parameters:**
- `dealId` - ID of the deal to update

**Request Body:**
```json
{
  "name": "Acme Corp - Enterprise Plus License",
  "value": 20000,
  "probability": 75,
  "stageId": "stg_234567890",
  "notes": "Customer upgraded their interest to the Enterprise Plus tier."
}
```

**Response:**
```json
{
  "id": "dl_123456789",
  "name": "Acme Corp - Enterprise Plus License",
  "company": "Acme Corporation",
  "value": 20000,
  "currency": "USD",
  "stageId": "stg_234567890",
  "pipelineId": "pl_123456789",
  "ownerId": "usr_123456789",
  "contactName": "John Smith",
  "contactEmail": "john@acmecorp.com",
  "contactPhone": "+1 555-123-4567",
  "probability": 75,
  "expectedCloseDate": "2023-12-31T00:00:00Z",
  "createdAt": "2023-06-15T14:30:00Z",
  "updatedAt": "2023-07-10T16:20:00Z",
  "notes": "Customer upgraded their interest to the Enterprise Plus tier.",
  "customFields": {
    "industryType": "Technology",
    "leadSource": "Conference",
    "decisionMaker": true
  }
}
```

**Status Codes:**
- `200 OK` - Deal updated successfully
- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Deal not found

### DELETE /deals/{dealId}

Deletes a specific deal.

**Path Parameters:**
- `dealId` - ID of the deal to delete

**Response:**
```json
{
  "message": "Deal deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Deal deleted successfully
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Deal not found

## Task Endpoints

### GET /tasks

Retrieves all tasks matching the given criteria.

**Query Parameters:**
- `userId` (string, optional) - Filter by assigned user
- `dealId` (string, optional) - Filter by associated deal
- `status` (string, optional) - Filter by status (pending, completed)
- `dueDate` (string, optional) - Filter by due date
- `priority` (string, optional) - Filter by priority (low, medium, high)
- `page` (integer, optional) - Page number for pagination
- `limit` (integer, optional) - Items per page (default: 20)

**Response:**
```json
{
  "tasks": [
    {
      "id": "tsk_123456789",
      "title": "Follow up with client",
      "description": "Send product specifications",
      "status": "pending",
      "priority": "high",
      "dueDate": "2023-07-15T17:00:00Z",
      "assignedToId": "usr_123456789",
      "dealId": "dl_123456789",
      "createdAt": "2023-07-10T09:00:00Z",
      "updatedAt": "2023-07-10T09:00:00Z"
    }
  ],
  "meta": {
    "total": 28,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

**Status Codes:**
- `200 OK` - Request successful
- `400 Bad Request` - Invalid query parameters
- `401 Unauthorized` - Not authenticated

### POST /tasks

Creates a new task.

**Request Body:**
```json
{
  "title": "Schedule demo call",
  "description": "Set up product demonstration for technical team",
  "priority": "medium",
  "dueDate": "2023-07-20T15:30:00Z",
  "assignedToId": "usr_234567890",
  "dealId": "dl_123456789"
}
```

**Response:**
```json
{
  "id": "tsk_987654321",
  "title": "Schedule demo call",
  "description": "Set up product demonstration for technical team",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2023-07-20T15:30:00Z",
  "assignedToId": "usr_234567890",
  "dealId": "dl_123456789",
  "createdAt": "2023-07-10T14:25:00Z",
  "updatedAt": "2023-07-10T14:25:00Z"
}
```

**Status Codes:**
- `201 Created` - Task created successfully
- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions

### PUT /tasks/{taskId}

Updates a specific task.

**Path Parameters:**
- `taskId` - ID of the task to update

**Request Body:**
```json
{
  "status": "completed",
  "description": "Demo scheduled for July 21st at 2 PM"
}
```

**Response:**
```json
{
  "id": "tsk_987654321",
  "title": "Schedule demo call",
  "description": "Demo scheduled for July 21st at 2 PM",
  "status": "completed",
  "priority": "medium",
  "dueDate": "2023-07-20T15:30:00Z",
  "assignedToId": "usr_234567890",
  "dealId": "dl_123456789",
  "createdAt": "2023-07-10T14:25:00Z",
  "updatedAt": "2023-07-15T10:30:00Z"
}
```

**Status Codes:**
- `200 OK` - Task updated successfully
- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Task not found

### DELETE /tasks/{taskId}

Deletes a specific task.

**Path Parameters:**
- `taskId` - ID of the task to delete

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Task deleted successfully
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Task not found

## AI Assistant Endpoints

### POST /ai/query

Sends a question to the AI assistant and receives a response.

**Request Body:**
```json
{
  "question": "What is the pricing for the Enterprise plan?",
  "context": {
    "pipelineId": "pl_123456789",
    "dealId": "dl_123456789",
    "userContext": "Sales representative discussing pricing with potential customer"
  }
}
```

**Response:**
```json
{
  "id": "ai_resp_123456789",
  "answer": "The Enterprise plan starts at $1,999/month for up to 100 users. It includes all features from the Professional plan plus dedicated support, advanced security features, and custom integrations. For your specific needs, I recommend scheduling a call with our solutions team who can provide a tailored quote.",
  "confidence": 0.92,
  "sources": [
    {
      "title": "Pricing Documentation",
      "url": "internal://docs/pricing-2023"
    }
  ],
  "timestamp": "2023-07-10T15:45:10Z"
}
```

**Status Codes:**
- `200 OK` - Request successful
- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Not authenticated
- `429 Too Many Requests` - Rate limit exceeded

### POST /ai/feedback

Provides feedback on an AI assistant response.

**Request Body:**
```json
{
  "responseId": "ai_resp_123456789",
  "feedbackType": "approve",
  "comment": "Great response, very accurate",
  "improvement": null
}
```

**Response:**
```json
{
  "message": "Feedback recorded successfully",
  "feedbackId": "fb_123456789"
}
```

**Status Codes:**
- `200 OK` - Feedback recorded successfully
- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Response ID not found

### POST /ai/train

Uploads training data for the AI assistant.

**Request Body:**
```json
{
  "trainingData": [
    {
      "question": "What services are included in the Basic plan?",
      "answer": "The Basic plan includes core CRM functionality, up to 5 user accounts, 10GB storage, email integration, and standard support.",
      "context": "Sales representative explaining product offerings"
    }
  ],
  "pipelineId": "pl_123456789"
}
```

**Response:**
```json
{
  "message": "Training data accepted",
  "trainingJobId": "tj_123456789",
  "estimatedCompletionTime": "2023-07-10T18:30:00Z"
}
```

**Status Codes:**
- `202 Accepted` - Training data accepted
- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions

### GET /ai/training-status

Retrieves the status of AI training for the organization.

**Response:**
```json
{
  "trainingStatus": {
    "lastTrainingTime": "2023-07-05T09:15:00Z",
    "dataPoints": 253,
    "coverage": {
      "products": 95,
      "pricing": 85,
      "processes": 70,
      "overall": 83
    },
    "activeTrainingJobs": [
      {
        "id": "tj_123456789",
        "status": "processing",
        "progress": 65,
        "estimatedCompletionTime": "2023-07-10T18:30:00Z"
      }
    ]
  }
}
```

**Status Codes:**
- `200 OK` - Request successful
- `401 Unauthorized` - Not authenticated

## Analytics Endpoints

### GET /analytics/dashboard

Retrieves dashboard analytics for the given criteria.

**Query Parameters:**
- `pipelineId` (string, optional) - Filter by pipeline
- `startDate` (string, required) - Start date for the analytics period (ISO format)
- `endDate` (string, required) - End date for the analytics period (ISO format)
- `comparison` (boolean, optional) - Include comparison to previous period

**Response:**
```json
{
  "kpis": {
    "totalRevenue": {
      "value": 125000,
      "currency": "USD",
      "change": 15.4
    },
    "dealsWon": {
      "value": 8,
      "change": 33.3
    },
    "conversionRate": {
      "value": 23.5,
      "change": 2.1
    },
    "averageDealSize": {
      "value": 15625,
      "currency": "USD",
      "change": -5.2
    }
  },
  "charts": {
    "revenueTrend": {
      "labels": ["2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06"],
      "datasets": [
        {
          "label": "Revenue",
          "data": [75000, 82000, 90000, 95000, 110000, 125000]
        }
      ]
    },
    "stageDistribution": {
      "labels": ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"],
      "datasets": [
        {
          "label": "Deal Count",
          "data": [45, 30, 18, 12, 8]
        },
        {
          "label": "Value (USD)",
          "data": [1350000, 900000, 540000, 360000, 240000]
        }
      ]
    }
  }
}
```

**Status Codes:**
- `200 OK` - Request successful
- `400 Bad Request` - Invalid query parameters
- `401 Unauthorized` - Not authenticated

### GET /analytics/deals

Retrieves detailed deal analytics.

**Query Parameters:**
- `pipelineId` (string, optional) - Filter by pipeline
- `startDate` (string, required) - Start date for the analytics period
- `endDate` (string, required) - End date for the analytics period
- `groupBy` (string, optional) - Group data by dimension (stage, owner, month)

**Response:**
```json
{
  "summary": {
    "totalDeals": 125,
    "totalValue": 1875000,
    "averageValue": 15000,
    "winRate": 28.4
  },
  "breakdown": [
    {
      "dimension": "Lead",
      "dealCount": 45,
      "totalValue": 675000,
      "winRate": 0,
      "averageDaysInStage": 12.3
    },
    {
      "dimension": "Qualified",
      "dealCount": 30,
      "totalValue": 450000,
      "winRate": 0,
      "averageDaysInStage": 8.7
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Request successful
- `400 Bad Request` - Invalid query parameters
- `401 Unauthorized` - Not authenticated

## Error Handling

All API endpoints may return error responses with the following structure:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource could not be found",
    "details": {
      "resourceType": "Deal",
      "resourceId": "dl_nonexistent"
    }
  }
}
```

Common error codes include:

- `INVALID_REQUEST` - Malformed request or invalid parameters
- `AUTHENTICATION_REQUIRED` - User is not authenticated
- `PERMISSION_DENIED` - User lacks necessary permissions
- `RESOURCE_NOT_FOUND` - Requested resource does not exist
- `RATE_LIMIT_EXCEEDED` - Too many requests in a given time period
- `INTERNAL_SERVER_ERROR` - Unexpected server error

## Rate Limiting

The API implements rate limiting to prevent abuse. Limits are based on the user's subscription level:

- Free tier: 100 requests per minute
- Professional tier: 500 requests per minute
- Enterprise tier: 2000 requests per minute

Rate limit information is included in response headers:

- `X-Rate-Limit-Limit`: Maximum requests allowed per minute
- `X-Rate-Limit-Remaining`: Remaining requests for the current period
- `X-Rate-Limit-Reset`: Time in seconds until the rate limit resets

## Webhooks

The Tez API supports webhooks for real-time notifications of events. Webhook configuration is managed through the API:

### POST /webhooks

Registers a new webhook endpoint.

**Request Body:**
```json
{
  "url": "https://example.com/webhooks/tez",
  "events": ["deal.created", "deal.updated", "task.completed"],
  "secret": "whsec_abcdefghijklmnopqrstuvwxyz"
}
```

**Response:**
```json
{
  "id": "wh_123456789",
  "url": "https://example.com/webhooks/tez",
  "events": ["deal.created", "deal.updated", "task.completed"],
  "status": "active",
  "createdAt": "2023-07-10T16:30:00Z"
}
```

Webhook events are delivered with a signature header `X-Tez-Signature` for verification. The payload format depends on the event type but generally follows this structure:

```json
{
  "id": "evt_123456789",
  "type": "deal.created",
  "createdAt": "2023-07-10T16:35:00Z",
  "data": {
    "id": "dl_987654321",
    "name": "BigCorp - Software Subscription",
    "value": 25000,
    "stageId": "stg_123456789",
    "pipelineId": "pl_123456789"
  }
}
```

## Versioning

The Tez API is versioned to ensure backward compatibility. The current version is `v1`.

All requests should include the version in the URL: `https://api.tez.app/v1/...`

When a new version is released, the previous version will remain available for at least 12 months to allow for migration.

## Changelog

- **2023-07-01**: v1 released
  - Initial release with core endpoints for deals, pipelines, tasks, and AI

- **2023-06-01**: v1 beta
  - Added analytics endpoints
  - Enhanced AI assistant capabilities

- **2023-05-01**: v1 alpha
  - Initial API design
  - Basic CRUD operations for core resources 