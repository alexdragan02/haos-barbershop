require("dotenv").config();
const http=require("http");
const app=require("./app");

const PORT=process.env.PORT;

const server=http.createServer(app);

server.listen(PORT,()=>{
    console.log(`merge treaba la http://localhost:${PORT}`);

})


