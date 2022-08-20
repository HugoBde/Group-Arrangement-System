// Third Party import
import mongodb = require("mongodb");

// Create a client to connect to database
// NOTE: the URI is hard coded but this isn't best practice
//       since if we were to make the repository public, the 
//       username and passwords would be exposed. An alternative
//       would be to save the URI as an environment variable
//       which can be stored in a file that is not tracked by Git
const db_client = new mongodb.MongoClient("mongodb+srv://gas-admin:tXJg2afFSC5GkauF@gas-cluster.smm5ykq.mongodb.net/?retryWrites=true&w=majority");

// Export client for use by our app
export = db_client;