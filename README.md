# Blockchain Parrucchiere — Hardhat Starter

Progetto Hardhat pronto per deploy di `SalonRegistry.sol` su testnet/mainnet.

## Requisiti
- Node.js >= 18 (consigliato 20)
- npm o yarn
- chiave privata di un wallet con fondi per gas
- RPC endpoint (Infura/Alchemy/Ankr, ecc.)

## Setup rapido
```bash
# 1) Installa dipendenze
npm install

# 2) Configura l'ambiente
cp .env.example .env
# Apri .env e inserisci: PRIVATE_KEY_DEPLOYER, RPC_MAINNET, RPC_TESTNET, ETHERSCAN_API_KEY, SALONE_NOME, SALONE_CITTA

# 3) Compila
npx hardhat compile

# 4) Test
npx hardhat test

# 5) Deploy su sepolia (default NETWORK=testnet)
NETWORK=testnet npx hardhat run scripts/deploy.ts

# 6) (Opzionale) Verifica su Etherscan
NETWORK=testnet npx hardhat verify --network sepolia <INDIRIZZO_CONTRATTO> "<SALONE_NOME>" "<SALONE_CITTA>"
```

## Script utili
- `scripts/deploy.ts` — deploy del contratto `SalonRegistry` con argomenti presi da `.env`
- `scripts/init.ts` — task di esempio
- task personalizzata: `npx hardhat salon:ping`

## Note sicurezza
- Non committare `.env`.
- Tieni la chiave privata al sicuro.
# blockchain_parrucchiere_hardhat
