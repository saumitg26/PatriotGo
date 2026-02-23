// config/awsconfig.js
const awsconfig = {
  enabled: true, // Set to true to use DynamoDB, false for demo mode
  region: 'us-east-1', 
  tableName: 'YourChatTableName',
  ridesTableName: 'YourRidesTableName',
  endpoint: '', // Leave empty unless using a local DynamoDB instance
  credentials: {
    accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_KEY',
  },
};

export default awsconfig;
