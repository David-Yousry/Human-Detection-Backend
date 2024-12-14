const mongoose = require('mongoose');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://dbUser:dbPass@human-detection.u91s6.mongodb.net/DB?retryWrites=true&w=majority&appName=Human-Detection';
const client = new MongoClient(uri);
const redisController = require('./src/controllers/redisController');
const sendEmail = require('./src/utils/email')
const User = require('./src/models/userModel');

dotenv.config({ path: './config.env' });
const app = require('./src/app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);


mongoose
  .connect(DB)
  .then(() => console.log("db connection successful"));



// connect to the websocket server  
const wss = new WebSocket.Server({ noServer: true });
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// watch for changes in the database on collection 'detections'
async function watchChanges() {
  try {
    await client.connect();
    const db = client.db('DB');
    const collection = db.collection('detections');
    const robotsCollection = db.collection('robots');

    // Start watching the collection for changes
    const changeStream = collection.watch();
    const changeStreamRobots = robotsCollection.watch();


    changeStream.on('change', async (change) => {
      if (change.operationType === 'insert') {
        if (change.fullDocument.detectionType === 'humanDetection') {
          const message = `Robot with id ${change.fullDocument.robotId} detected a human at https://www.google.com/maps?q=${change.fullDocument.location.latitude},${change.fullDocument.location.longitude} `;
          const vendors = await User.find({ role: 'vendor' });
          vendors.forEach(async (vendor) => {
            await sendEmail({
              email: vendor.email,
              subject: 'Human Detection Alert',
              message
            });

          })

        }
      }
      let msg = {};
      // console.log('Change detected:', change);
      redisController.getAllValues().then((values) => {
        msg = {
          type: change.operationType,
          key: change.documentKey._id,
          fullDocument: change.fullDocument,
          collection: change.ns.coll,
          redisValues: values
        }
        wss.clients.forEach((ws) => {
          if (ws.readyState === WebSocket.OPEN) {

            ws.send(JSON.stringify(msg));
            // ws.send("1");
            // ws.send("2");
          }
        });
      });
    });

    changeStreamRobots.on('change', (change) => {
      if (change.operationType === 'insert' || change.operationType === 'delete') {
        let msg = {};
        console.log('Change detected:', change);
        redisController.getAllValues().then((values) => {
          msg = {
            type: change.operationType,
            key: change.documentKey._id,
            fullDocument: change.fullDocument,
            collection: change.ns.coll,
            redisValues: values
          }
          wss.clients.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify(msg));
            }
          });
        });
      }
    });
  } catch (err) {
    console.error('Error watching changes:', err);
  }
}

watchChanges();


const port = process.env.PORT || 3000;
app.server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});


process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});


