import { PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { getDynamoDocClient, isDynamoEnabled, ridesTableName } from './dynamoClient';

const FALLBACK_RIDES = [
  {
    rideId: 'ride-1',
    driverId: 'driver-1',
    driverName: 'SAUMIT G.',
    origin: 'Rappahannock Deck',
    originZone: 'North',
    campusZone: 'Main Quad',
    startTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 mins out
    timeWindowMinutes: 20,
    seatsTotal: 3,
    seatsAvailable: 2,
    recurrence: ['M', 'W', 'F'],
    riderIds: [],
  },
  {
    rideId: 'ride-2',
    driverId: 'driver-2',
    driverName: 'ALEX R.',
    origin: 'Fairfax Circle',
    originZone: 'East',
    campusZone: 'Johnson Center',
    startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 mins out
    timeWindowMinutes: 30,
    seatsTotal: 2,
    seatsAvailable: 1,
    recurrence: ['Tu', 'Th'],
    riderIds: ['student-demo'],
  },
];

function timeWindowMatch(startTimeISO, targetTimeISO, windowMinutes = 45) {
  if (!startTimeISO || !targetTimeISO) return true;
  const rideTime = new Date(startTimeISO).getTime();
  const target = new Date(targetTimeISO).getTime();
  const diffMinutes = Math.abs(rideTime - target) / (1000 * 60);
  return diffMinutes <= windowMinutes;
}

export async function listRides({ campusZone, originZone, targetTime, windowMinutes = 45 } = {}) {
  if (!isDynamoEnabled) {
    return FALLBACK_RIDES.filter((ride) => {
      const zoneOk = campusZone ? ride.campusZone === campusZone : true;
      const originOk = originZone ? ride.originZone === originZone : true;
      const timeOk = targetTime ? timeWindowMatch(ride.startTime, targetTime, windowMinutes) : true;
      return zoneOk && originOk && timeOk;
    });
  }

  const client = getDynamoDocClient();
  const response = await client.send(
    new ScanCommand({
      TableName: ridesTableName,
      Limit: 50,
    }),
  );

  let items = response.Items || [];
  if (campusZone) items = items.filter((r) => r.campusZone === campusZone);
  if (originZone) items = items.filter((r) => r.originZone === originZone);
  if (targetTime) items = items.filter((r) => timeWindowMatch(r.startTime, targetTime, windowMinutes));

  return items.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
}

export async function createRide(rideInput) {
  const ride = {
    ...rideInput,
    rideId: rideInput.rideId || `ride-${Date.now()}`,
    createdAt: new Date().toISOString(),
    riderIds: rideInput.riderIds || [],
  };

  if (!isDynamoEnabled) {
    return ride;
  }

  const client = getDynamoDocClient();
  await client.send(
    new PutCommand({
      TableName: ridesTableName,
      Item: ride,
    }),
  );
  return ride;
}

export async function joinRide(rideId, userId) {
  if (!rideId || !userId) throw new Error('rideId and userId required');

  if (!isDynamoEnabled) {
    return { rideId, userId, status: 'joined' };
  }

  const client = getDynamoDocClient();
  await client.send(
    new UpdateCommand({
      TableName: ridesTableName,
      Key: { rideId },
      ConditionExpression: 'seatsAvailable > :zero AND (attribute_not_exists(riderIds) OR not contains(riderIds, :userId))',
      UpdateExpression: 'SET riderIds = list_append(if_not_exists(riderIds, :emptyList), :newRider) ADD seatsAvailable :negOne',
      ExpressionAttributeValues: {
        ':zero': 0,
        ':userId': userId,
        ':newRider': [userId],
        ':emptyList': [],
        ':negOne': -1,
      },
      ReturnValues: 'ALL_NEW',
    }),
  );

  return { rideId, userId, status: 'joined' };
}
