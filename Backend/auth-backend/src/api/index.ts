import app from "../backendApp";
import serverless from "serverless-http";

module.exports.handler = serverless(app);
