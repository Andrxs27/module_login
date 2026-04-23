const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/authRoutes"));

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000");
})