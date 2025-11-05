import express from 'express'
import cors from 'cors'

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.get('/', function (req, res) {
    res.json({status: "Working"})
})

app.listen(PORT, function () {
    console.log(`Server is running on port http://localhost:${PORT}`)
})