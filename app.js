const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const tagRoutes = require("./routes/tags");
const messsageRoutes = require("./routes/messages");

const app = express();

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use("/tags",tagRoutes);
app.use("/messages", messsageRoutes);

app.use((req,res,next) =>{
    var err = new Error("Not Found");
    err.status = 404;
    return next(err);
});

if (app.get("env") === "development"){
    app.use((err,req,res,next) =>{
        res.status(err.status || 500);
        return res.json({
            message: err.message,
            error: err
        });
    });
}

app.listen(3000,() => {
    console.log("Server up on port 3000");
});
