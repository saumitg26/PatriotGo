import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
// Triple check: Is the file name lowercase 'awsconfig.js' in the 'config' folder?
import awsconfig from '../config/awsconfig'; 

let docClient;

export function getDynamoDocClient() {
  // Use optional chaining (?.) to prevent the crash
  if (!awsconfig?.enabled) {
    throw new Error('DynamoDB is disabled.');
  }

  if (!docClient) {
    const baseClient = new DynamoDBClient({
      region: awsconfig.region || 'us-east-1',
      endpoint: awsconfig.endpoint || undefined,
      credentials: awsconfig.credentials,
    });

    docClient = DynamoDBDocumentClient.from(baseClient, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }

  return docClient;
}

// Global safety fallbacks so the UI always has a string to display
export const chatTableName = awsconfig?.tableName || 'PatriotChat';
export const isDynamoEnabled = awsconfig?.enabled || false;
export const dynamoRegion = awsconfig?.region || 'us-east-1';
export const dynamoEndpoint = awsconfig?.endpoint || '';
export const ridesTableName = awsconfig?.ridesTableName || 'PatriotRides';
