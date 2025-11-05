import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;


const API_TOKEN = "iPFrNohHxNDjMbrZwkqHdszWXHERTZaO";
const API_BASE = "https://www.ncdc.noaa.gov/cdo-web/api/v2";

app.use(cors());
app.use(express.static('public'));

async function proxyFetch(endpoint, res) {
    const url = `${API_BASE}${endpoint}`;
    console.log(`Przekazywanie zapytania do: ${url}`);

    try {
        const response = await fetch(url, {
            headers: { token: API_TOKEN }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Błąd z API NOAA:', errorData);
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Błąd proxy:', err);
        res.status(500).json({ error: err.message });
    }
}


app.get("/stations", (req, res) => {
    const limit = req.query.limit || 500;
    proxyFetch(`/stations?limit=${limit}`, res);
});

app.get("/datasets", (req, res) => proxyFetch("/datasets", res));

app.get("/data", (req, res) => {
    const query = req.url.replace("/data", "");
    proxyFetch(`/data${query}`, res);
});


app.listen(PORT, () => {
    console.log(`Proxy działa na http://localhost:${PORT}`);
    console.log(`Frontend dostępny na http://localhost:${PORT}`);
});