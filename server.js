const express = require("express"); 
const dotenv = require("dotenv"); 
const sourceRoutes = require("./routes/sourceRoutes");

dotenv.config();

const app = express(); app.use(express.json());

app.use("/api/source", sourceRoutes);

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server running on port ${port}`));