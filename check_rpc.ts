import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const url = process.env.RPC_TESTNET;
  console.log("🔍 Test RPC:", url);
  try {
    const r = await axios.post(url!, {
      jsonrpc: "2.0",
      method: "eth_chainId",
      params: [],
      id: 1
    });
    console.log("✅ Risposta valida:", r.data);
  } catch (err: any) {
    console.error("❌ Errore RPC:", err.message);
  }
}

main();

