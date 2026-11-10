# Blockchain Parrucchiere / SalonBooking

[![Hardhat CI](https://github.com/Sebadevel/blockchain_parrucchiere_hardhat/actions/workflows/ci.yml/badge.svg)](https://github.com/Sebadevel/blockchain_parrucchiere_hardhat/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An open-source **educational prototype** exploring blockchain-backed appointments for salons, independent professionals and other booking applications.

This repository is **not** the production Salonbook SaaS application. It includes two independent Solidity examples:

- `SalonRegistry.sol`: simple registration of salon metadata and booking events, without payments or persistent booking records.
- `SalonBooking.sol`: UUPS-upgradeable paid-booking example with cancellations, rescheduling, fee parameters and an owner-controlled withdrawal function.

It also includes a small demonstration DApp in `dapp/`, static documentation in `docs/`, and Hardhat tests. Solidity sources, tests and deployment scripts are under `contracts/`, `test/` and `scripts/`.

> **Security warning:** Prototype only. **Do not use with real funds or in production without a dedicated security audit, additional invariant tests and a full review of custody and cancellation logic.** In particular, the owner may withdraw funds deposited for outstanding bookings, so future refunds are not guaranteed. The booking contract does not enforce availability or prevent double bookings. The documentation and example deployment addresses may reflect an earlier development state; do not treat them as verified live services. A successful CI run is not a smart-contract audit.

## Quick start

Node.js 20 and pnpm 9 are recommended. Use the committed `pnpm-lock.yaml` for reproducible dependencies.

```bash
corepack enable
corepack prepare pnpm@9 --activate
pnpm install --frozen-lockfile
pnpm exec hardhat compile
pnpm exec hardhat test
```

Local compile and tests do **not** require a funded wallet. Deployments require an RPC endpoint, a funded wallet and separate configuration.

## Environment and deployment

Copy `.env.example` to `.env`. Never commit actual private keys, API keys or production credentials.

**Note:** The existing `scripts/deploy.ts` deploys **SalonRegistry**, not the upgradeable SalonBooking contract. Some historical environment examples use names different from `hardhat.config.ts`. For deployments, the config reads `PRIVATE_KEY`, `SEPOLIA_RPC_URL`, `MAINNET_RPC_URL`, `POLYGON_RPC_URL` and `AMOY_RPC_URL`. Check all settings and network IDs before using any deploy script. Do not deploy to mainnet as part of this preparation work.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) to report bugs or propose changes. Automated checks compile the Solidity contracts and run the Hardhat test suite on pull requests.

## Security and license

See [SECURITY.md](SECURITY.md) for the prototype's limitations and responsible disclosure guidance.

Distributed under the [MIT license](LICENSE). Attribution and notices must be retained.
