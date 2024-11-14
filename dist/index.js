import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.get("/", (req, res) => {
    res.send("helloworld");
});
app.get("/api", (req, res) => {
    res.status(200).json({ message: "welcome to the api page" });
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${3000}`);
});
