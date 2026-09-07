require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/api/authRoutes");
const transactionRoutes = require("./src/routes/api/transactionRoutes");
const walletRoutes = require("./src/routes/api/walletRoutes");
const viewRoutes = require("./src/routes/web/viewRoutes");

const app = express();

connectDB();

// Load Swagger document FIRST
let swaggerDocument = {};

try {
    swaggerDocument = require("./swagger-output.json");
} catch (err) {
    console.error("Swagger file not found. Run: npm run swagger");
}

// NOW use it
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/wallet", walletRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});