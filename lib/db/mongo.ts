import { Resolver } from "node:dns/promises";
import { MongoClient, type Db } from "mongodb";

/**
 * One MongoClient per server process. On Vercel each warm function instance
 * reuses it; in dev, the global survives hot reloads so we don't leak
 * connections on every file save.
 */
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

/**
 * Optional, for local machines whose DNS refuses the SRV lookup that
 * mongodb+srv:// URIs need ("querySrv ECONNREFUSED"). Not needed on Vercel.
 *
 * With MONGODB_DNS_SERVERS="8.8.8.8,1.1.1.1", the SRV/TXT records are looked
 * up through those servers with a dedicated resolver and the URI is rewritten
 * to the equivalent plain mongodb:// seed list. (Changing Node's global DNS
 * servers is not reliable inside Next.js, so we don't.)
 */
async function resolveConnectionUri(uri: string): Promise<string> {
  const servers = process.env.MONGODB_DNS_SERVERS;
  if (!servers || !uri.startsWith("mongodb+srv://")) return uri;

  const url = new URL(uri.replace(/^mongodb\+srv:/, "http:"));
  const resolver = new Resolver({ timeout: 5000, tries: 2 });
  resolver.setServers(servers.split(",").map((s) => s.trim()));

  const [srv, txt] = await Promise.all([
    resolver.resolveSrv(`_mongodb._tcp.${url.hostname}`),
    resolver.resolveTxt(url.hostname).catch(() => [] as string[][]),
  ]);

  // TXT holds defaults like authSource/replicaSet; URI options win over them.
  const params = new URLSearchParams(
    txt.map((chunks) => chunks.join("")).join("&"),
  );
  url.searchParams.forEach((value, key) => params.set(key, value));
  if (!params.has("tls") && !params.has("ssl")) params.set("tls", "true");

  const auth = url.username
    ? `${url.username}${url.password ? `:${url.password}` : ""}@`
    : "";
  const hosts = srv.map((record) => `${record.name}:${record.port}`).join(",");
  return `mongodb://${auth}${hosts}${url.pathname || "/"}?${params}`;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return Promise.reject(new Error("MONGODB_URI is not set"));

  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = resolveConnectionUri(uri)
      .then((connectionUri) =>
        new MongoClient(connectionUri, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 8000,
          appName: "xelvo-website",
        }).connect(),
      )
      .catch((err) => {
        // Don't cache a failed connection; the next request should retry.
        globalForMongo._mongoClientPromise = undefined;
        throw err;
      });
  }
  return globalForMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB || "xelvo");
}
