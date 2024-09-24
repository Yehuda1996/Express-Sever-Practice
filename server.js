import express from "express";
import userRoutes from "./routes/userRoutes.js";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(userRoutes);
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});

