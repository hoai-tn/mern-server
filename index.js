const express = require("express");
const app = express();
const port = 9999;

//middleware
app.use(express.json());

app.use("/", (req, res) => {
  res.send("Hello word!")
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
