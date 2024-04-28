# How to run
- S1: Must config .env file
  + PRIVATE_KEY: private key of sending wallet
  + FROM_ADDRESS: address of sending wallet
  + TEST_MODE: 
    + If you want to run on Testnet SepoliaETH, set TEST_MODE=true
    + If you want to run on Mainnet Arbitrum, ignore TEST_MODE
  + CONTRACT_ADDRESS_TEST_PROXY: Contract Address on Sepolia ARB Test network
  + CONTRACT_ADDRESS_MAIN_PROXY: Contract Address on ARB Main network

- S2: Put send.csv file with following format `Address,Points,Nature,Fire,Water,Earth,Dark,Lightning,Aether` to folder /input/
  + Address: receiver address that you want to send
  + Points: quantity of points user earn from event
  + Nature: quantity of Nature Tokens that you want to send
  + Fire: quantity of Fire Tokens that you want to send
  + Water: quantity of Water Tokens that you want to send
  + Earth: quantity of Earth Tokens that you want to send
  + Dark: quantity of Dark Tokens that you want to send
  + Lightning: quantity of Lightning Tokens that you want to send
  + Aether: quantity of Aether Tokens that you want to send

- S3: Run `npm run dev` on cmd

- S4: Get result csv file after running at folder /out/
Output format file: `Amount,Address,Transaction Id,Status, Error message`
  + Address: receive address you want to send
  + Point: quantity of points user earn from event
  + Nature: quantity of Nature Tokens that you want to send
  + Fire: quantity of Fire Tokens that you want to send
  + Water: quantity of Water Tokens that you want to send
  + Earth: quantity of Earth Tokens that you want to send
  + Dark: quantity of Dark Tokens that you want to send
  + Lightning: quantity of Lightning Tokens that you want to send
  + Aether: quantity of Aether Tokens that you want to send
  + Transaction Id: Corresponding Transaction Id on the network
  + Status: Success/Fail
  + Error message: If it gets Fail status, it may be included Error message
