const {MongoClient, ServerApiVersion} = require("mongodb");
const {findUser, insertUser} = require("./interfaces/users");
const url = "mongodb://localhost:27017/mydb";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(url, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

async function connectDB() {
    return new Promise((resolve, reject) => {
        client.connect()
            .then(res => {
                global.MongoDBClient = res.db("xhs")
                resolve(res.db("xhs"))
            })
            .catch(err => {
                reject(err)
            })
    })
}

module.exports.connectDB = connectDB
