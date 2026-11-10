# Contributing

Thanks for considering a contribution to the public SalonBooking blockchain prototype.

1. Open an issue explaining the bug, security concern or improvement. For sensitive vulnerabilities, follow [SECURITY.md](SECURITY.md) instead of posting exploit details.
2. Create a branch and keep your change focused.
3. Use Node.js 20 and pnpm 9; run `pnpm install --frozen-lockfile`, `pnpm exec hardhat compile` and `pnpm exec hardhat test`.
4. Add or update tests for behavioral changes and explain the threat model for security-sensitive changes.
5. Submit a pull request explaining the changes, tests and any deployment or compatibility effects.

Please do not include private keys, wallet seed phrases, customer information, proprietary Salonbook code, or live credentials. Contract changes that affect storage layout, UUPS upgrades or financial flows require explicit review and should never be deployed automatically.

This project is an educational reference, not a certified production booking system.
