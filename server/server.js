import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/data1", async (req, res) => {
    try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching data1:", error.message);
        res.status(500).json({ error: "Error fetching data1", details: error.message });
    }
});

app.get("/api/data2", async (req, res) => {
    try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users/1");
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching data2:", error.message);
        res.status(500).json({ error: "Error fetching data2", details: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
