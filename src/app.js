import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import { connectDB } from "./utils/server.js";
import cors from "cors";
import bodyParser from "body-parser";
import cityRoutes from "./routes/cityRoutes.js";
import shopRoutes from "./routes/shopRoutes.js"; 
import companyRoutes from "./routes/companyRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import itemTypeRoutes from './routes/itemTypeRoutes.js';
import unitRoutes from './routes/unitRoutes.js';
import addingItemRoutes from './routes/addingItemRoutes.js';
import itemMapSupplierRoutes from './routes/itemMapSupplierRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import formulaRoutes from './routes/formulaRoutes.js';

config({
    path: "./.env",
});

const port = process.env.PORT || 4000;
connectDB("mongodb://127.0.0.1:27017/billing");

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});

app.use("/api/v1/cities", cityRoutes);
app.use("/api/v1/shops", shopRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use('/api/v1/item-types', itemTypeRoutes);
app.use('/api/v1/units', unitRoutes);
app.use('/api/v1/items', addingItemRoutes);
app.use('/api/v1/item-map-suppliers', itemMapSupplierRoutes);
app.use('/api/v1/purchase', purchaseRoutes);
app.use('/api/v1/formula', formulaRoutes);


app.listen(port, () => console.log("Server running on port 4000"));