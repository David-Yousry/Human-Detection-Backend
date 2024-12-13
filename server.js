const mongoose = require('mongoose');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://dbUser:dbPass@human-detection.u91s6.mongodb.net/DB?retryWrites=true&w=majority&appName=Human-Detection';
const client = new MongoClient(uri);


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
  
      // Start watching the collection for changes
      const changeStream = collection.watch();
  
      changeStream.on('change', (change) => {
        // console.log('Change detected:', change);
        const msg = {
          type: change.operationType,
          key: change.documentKey._id,
          fullDocument: change.fullDocument,
          collection: change.ns.coll,
        }
        console.log('Change detected:', msg);
        console.log('Change detected####:', JSON.stringify(msg));
        // Broadcast the change to all connected WebSocket clients
        wss.clients.forEach((ws) => {
          if (ws.readyState === WebSocket.OPEN) {
            
            ws.send(JSON.stringify(msg));
          }
        });
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


