# Civitas MVP

Development of the Civitas MVP that integrates with ICP.

## 📋 Requirements

To run the app, you must have the following software installed on your machine:

- Node.js >= v20.12.2
- NPM >= v10.5.2
- PNPM >= v9.4.0
- DFX >= v0.24.2

## 🚀 Run the application locally

First, install the project's dependencies using PNPM:

```bash
pnpm i
```

Now, configure the `.env` file with the required environment variables. Use the `.env.example` file as a guide for the required values.

To generate the canisters, run:

```bash
dfx start --clean --background # Start empty ICP network replica
dfx generate backend # Generate JavaScript/WASM declarations for the Smart Contract
dfx build --check # Check that builds work correctly and prepare app
dfx deploy backend # Deploy backend to local replica
```

Finally, run the app in dev mode:

```bash
pnpm dev
```

## 🚀 Deploy to mainnet

To deploy the canisters, run the following commands:

```bash
dfx generate # Generate app
dfx deploy --network ic # Deploy to IC network
# Or dfx deploy --playground to run in playground mode
```
