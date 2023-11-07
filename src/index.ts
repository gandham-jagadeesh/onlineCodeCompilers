import express from "express";
import submissionController from "./controllers/submissionRouteController";
import cors from "cors";
import scaling from "./util/scaling"
const app = express();

app.use(express.json())
app.use(cors())

app.post("/submission",submissionController);

scaling(app);