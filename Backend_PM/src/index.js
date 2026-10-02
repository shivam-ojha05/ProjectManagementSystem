import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/index.js";


const port = process.env.PORT || 3000;

connectDB()
    .then(() =>{
        app.listen(port, () =>{
        console.log(`App listening on port http://localhost:${port}`);
        });
    })
    .catch((err) =>{
        console.log("Mongodb conneccting error", err)
        process.exit(1)
    })



