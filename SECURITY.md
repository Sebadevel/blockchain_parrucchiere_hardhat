# Security policy

This repository contains **experimental smart contracts** and demonstration UIs, not an audited production application. Do not send real funds to examples or assume historical contract addresses are safe.

## Known limitations to address before production use

- In `SalonBooking.sol`, an owner can withdraw ETH/native-token balances, including amounts paid for future bookings. This can prevent refunds. There is no escrow solvency invariant.
- The booking function does not enforce a shared availability calendar, slot capacity or double-booking prevention.
- Paid bookings are not settled through a complete service-fulfilment accounting lifecycle.
- UUPS upgrade administration is owner-controlled; ownership and upgrade procedures require an explicit trust model.
- The present tests cover core examples, not exhaustive fuzzing, reentrancy, economic attacks or storage-layout upgrade compatibility.
- Static example documentation and addresses can become stale; independently verify networks, addresses and transaction implications.

## Reporting vulnerabilities

Do not disclose private keys, customer details, or proof-of-concept exploits that can put funds at risk in public issues. Contact the repository maintainer privately through an available GitHub profile contact channel before coordinated disclosure. If no private channel is available, open a public issue describing the *general affected area* without exploit instructions, and request a secure reporting channel.

Do not consider a passing CI build to be proof that a contract is safe.
