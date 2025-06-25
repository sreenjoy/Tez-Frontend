# Message Scheduler

## Overview

The Message Scheduler is a powerful feature that enables users to send bulk messages to multiple Telegram contacts with controlled timing intervals. This feature is designed to work around Telegram's anti-spam measures, which prevent sending too many cold outreach messages simultaneously.

## Key Features

- **Bulk Message Campaigns**: Create campaigns to send the same message to multiple recipients
- **Contact Selection**: Choose recipients from your synchronized Telegram contacts
- **Scheduled Delivery**: Set a future date and time for your campaign to start
- **Controlled Intervals**: Configure the time gap between messages to avoid Telegram's rate limits
- **Campaign Management**: View, track, and delete scheduled campaigns

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User Interface │────▶│  Campaign Store │────▶│   Scheduler     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │  Message Queue  │
                                                │                 │
                                                └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │  Telegram API   │
                                                │                 │
                                                └─────────────────┘
```

### Components

1. **User Interface**: The frontend interface where users create and manage campaigns
2. **Campaign Store**: Database storage for campaign configurations and status
3. **Scheduler**: Background service that triggers campaigns at their scheduled time
4. **Message Queue**: Queue system that handles the sequential sending of messages with specified intervals
5. **Telegram API**: Integration with Telegram's API for sending messages

## Implementation Details

### Campaign Creation Flow

1. User selects contacts from their synchronized Telegram contacts
2. User composes a message to be sent to all selected contacts
3. User sets a schedule date/time and interval between messages
4. System stores the campaign configuration in the database
5. At the scheduled time, the system activates the campaign

### Message Sending Process

When a campaign is activated:

```javascript
async function processCampaign(campaignId) {
  const campaign = await getCampaignById(campaignId);
  
  // Mark campaign as in progress
  await updateCampaignStatus(campaignId, 'in_progress');
  
  // Get all recipients
  const recipients = await getCampaignRecipients(campaignId);
  
  // Process each recipient with the specified interval
  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    
    try {
      // Send message to current recipient
      await sendTelegramMessage(
        campaign.userId,
        recipient.telegramId,
        campaign.message
      );
      
      // Record successful delivery
      await recordMessageSent(campaignId, recipient.id, 'delivered');
      
      // Wait for the specified interval before sending the next message
      // This is crucial to avoid Telegram's anti-spam measures
      if (i < recipients.length - 1) {
        await delay(campaign.interval * 1000);
      }
    } catch (error) {
      // Record failed delivery
      await recordMessageSent(campaignId, recipient.id, 'failed', error.message);
      
      // Add additional delay after an error to prevent getting blocked
      await delay(campaign.interval * 2 * 1000);
    }
  }
  
  // Mark campaign as completed
  await updateCampaignStatus(campaignId, 'completed');
}
```

## Handling Telegram's Rate Limits

Telegram implements several anti-spam measures to prevent bulk messaging abuse. Our scheduler works around these limitations through:

### 1. Controlled Timing

- **Minimum Interval**: The system enforces a minimum 30-second interval between messages
- **Recommended Interval**: For cold outreach, we recommend 60-120 seconds between messages
- **Adaptive Delays**: The system adds additional delays after errors to prevent account restrictions

### 2. Batch Size Limitations

- **Daily Limits**: The system tracks the number of messages sent per day to stay within Telegram's limits
- **New Contact Limits**: Special handling for messages to new contacts (not in the user's contact list)

### 3. Error Handling

- **Temporary Failures**: The system will retry failed messages with exponential backoff
- **Permanent Blocks**: If Telegram blocks message sending, the campaign is paused and the user is notified
- **Account Protection**: The system monitors for warning signs from Telegram and can pause campaigns to protect the user's account

## Best Practices

1. **Message Personalization**: Even though sending in bulk, include personalization elements
2. **Reasonable Batch Sizes**: Keep campaigns to under 100 recipients per day
3. **Proper Intervals**: Use longer intervals (2-3 minutes) for cold outreach
4. **Content Guidelines**: Avoid spam-like content, excessive links, or suspicious attachments
5. **Contact List Quality**: Send to relevant contacts who have some connection to you

## Technical Considerations

### Database Schema

```sql
CREATE TABLE message_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  interval_seconds INTEGER NOT NULL DEFAULT 60,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE campaign_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES message_campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  telegram_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  UNIQUE(campaign_id, contact_id)
);
```

### API Endpoints

#### Campaign Management

- `POST /api/message-scheduler/campaigns` - Create a new campaign
- `GET /api/message-scheduler/campaigns` - List all campaigns
- `GET /api/message-scheduler/campaigns/:id` - Get campaign details
- `DELETE /api/message-scheduler/campaigns/:id` - Delete a campaign

#### Campaign Execution

- `POST /api/message-scheduler/campaigns/:id/start` - Manually start a campaign
- `POST /api/message-scheduler/campaigns/:id/pause` - Pause an in-progress campaign
- `GET /api/message-scheduler/campaigns/:id/status` - Get detailed campaign status

## Conclusion

The Message Scheduler provides a powerful way to manage bulk outreach while respecting Telegram's platform limitations. By implementing controlled timing and proper error handling, the system allows for efficient communication with multiple contacts without risking account restrictions or bans. 