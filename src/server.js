import express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./apis/products/index.js";
import cors from "cors";

const server = express();

const port = 5001;

server.use(express.json());
server.use(cors());

server.use("/products", productsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is listening on port ${port}`);
});
server.on("error", (error) => {
  console.log("new error", error);
});
