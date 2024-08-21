import mongoose from "mongoose"


type ConnectionObject = {
    isConnceted? : number
}
// connecting mongoDB with project 

const connection : ConnectionObject = {}
async function dbConnect(): Promise<void>{
      if(connection.isConnceted){
        console.log("Already connected to database");
        return
      }

      try {
       const db =  await mongoose.connect(process.env.MONGODB_URI || "")
       connection.isConnceted  = db.connections[0].readyState
      } catch (error) {     
        console.log("Database Connection Failed")
        process.exit()
      }
}

export default dbConnect;