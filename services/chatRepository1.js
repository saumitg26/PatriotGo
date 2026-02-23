// services/chatRepository1.js
import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { chatTableName, getDynamoDocClient, isDynamoEnabled } from './dynamoClient';

const FALLBACK_MESSAGES = [
  {
    id: 'demo-1',
    roomId: 'demo-room',
    sender: 'driver',
    body: "Yo! I'm parked near the Rappahannock deck entrance.",
    createdAt: new Date().toISOString(),
  },
];

export async function listMessages(roomId, limit = 50) {
  if (!isDynamoEnabled) return FALLBACK_MESSAGES;

  try {
    const client = getDynamoDocClient();
    const response = await client.send(
      new QueryCommand({
        TableName: chatTableName,
        KeyConditionExpression: '#roomId = :roomId',
        ExpressionAttributeNames: { '#roomId': 'roomId' },
        ExpressionAttributeValues: { ':roomId': roomId },
        ScanIndexForward: true,
        Limit: limit,
      }),
    );
    return response.Items || [];
  } catch (err) {
    console.error("Dynamo List Error:", err);
    return FALLBACK_MESSAGES;
  }
}

export async function sendMessage(roomId, sender, body) {
  const createdAt = new Date().toISOString();
  const message = { id: `${roomId}-${createdAt}`, roomId, sender, body, createdAt };

  if (!isDynamoEnabled) return message;

  const client = getDynamoDocClient();
  await client.send(
    new PutCommand({
      TableName: chatTableName,
      Item: message,
    }),
  );
  return message;
}

export async function pingDynamo(roomId = 'health-check') {
  if (!isDynamoEnabled) return { ok: false };
  try {
    const client = getDynamoDocClient();
    await client.send(new QueryCommand({
      TableName: chatTableName,
      KeyConditionExpression: '#roomId = :roomId',
      ExpressionAttributeNames: { '#roomId': 'roomId' },
      ExpressionAttributeValues: { ':roomId': roomId },
      Limit: 1,
    }));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
