import fs from 'fs';
import http from 'http';
import https from 'https';
import config from '../config';
import app from './app';

const { serverKeyPath, serverCertPath, hostname, http_port, https_port } =
  config;

const readCredentials = () => {
  const privateKey = fs.readFileSync(serverKeyPath, 'utf8');
  const certificate = fs.readFileSync(serverCertPath, 'utf8');
  return { key: privateKey, cert: certificate };
};

const startServer = (server, port, protocol) => {
  server.listen(port, () => {
    console.log(
      `${protocol.toUpperCase()} server running on ${hostname}:${port}`,
    );
  });
};

const startHttpServer = () => {
  const httpServer = http.createServer(app);
  startServer(httpServer, http_port, 'http');
};

const startHttpsServer = () => {
  const credentials = readCredentials();
  const httpsServer = https.createServer(credentials, app);
  startServer(httpsServer, https_port, 'https');
};

export default { startHttpServer, startHttpsServer };
