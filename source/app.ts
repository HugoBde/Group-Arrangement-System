import express = require("express");

const app  = express();
const port = 8080;

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});