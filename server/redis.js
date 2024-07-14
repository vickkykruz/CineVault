const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
  console.error('Redis client error', err);
});

client.on('ready', () => {
  console.log('Redis client connected and ready');
});

client.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  console.error('Error connecting to Redis', err);
});

function setRedisKey(key, value) {
  if (client.isOpen) {
    client.set(key, value, (err) => {
      if (err) {
        console.error('Error setting key in Redis', err);
      } else {
        console.log(`Key set: ${key}`);
      }
    });
  } else {
    console.error('Cannot set key, Redis client is closed');
  }
}

// Ensure the client is connected before setting a key
client.on('ready', () => {
  setRedisKey('exampleKey', 'exampleValue');
});

// Properly close the client when your application exits
process.on('exit', () => {
  if (client.isOpen) {
    client.quit();
  }
});

// Reconnect logic (if needed)
client.on('end', () => {
  console.log('Redis client disconnected, attempting to reconnect...');
  client.connect().catch((err) => {
    console.error('Error reconnecting to Redis', err);
  });
});