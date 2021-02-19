const express = require("express");
const app = express();
const flipsRouter = require("./flips/flips.router");
const flips = require("./data/flips-data");
const counts = require("./data/counts-data");

// TODO: Follow instructions in the checkpoint to implement ths API.

app.use(express.json())



app.use("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];

  if(foundCount === undefined) {
    next(`Count id not found: ${countId}`);
  } else {
    res.json({ data: foundCount });
  }
})

app.use("/counts", (req, res) => {
  res.json({ data: counts });
})

app.use("/flips", flipsRouter);


// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  const { status = 500, message = "Something went Wrong!"} = error
  response.status(status).json({ error: message });
});

module.exports = app;
