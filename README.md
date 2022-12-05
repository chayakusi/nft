# nft

Instructions:

1. In terminal, do npm i
2. Make a schema and make changes in the schema.js file.
3. Exceute following commands in the terminal.
   cd server
   node schema.js
4. Close all terminals
5. Make a new split terminal window.
6. Exceute following commands in the 2 new terminals.
   Terminal 1: cd client;npm start
   Terminal 2: cd server;npm run devStart

About this Project:

1. Dashboard will show the nft owned by the customer.
2. Trader can add money and can buy NFT as per the current rate.
3. Once you buy with Name and TokenId, the NFT will be shown in the dashboard. That particular NFT will not be shown in the Buy NFT Page.
4. To Buy, trader has two choices of commision which will overall decide the whole transaction type.
5. Trader can sell their NFT and the transaction will show "POSTED".
6. Until someone buys the "POSTED" NFT, the owner of the NFT will remain the same.
7. Every trader can see their transactions and their user profile.
8. Every manager has some mancode in the login table. Only those users can go to Manager dashboard.
9. Manager can see all the users transactions and can add more NFTs and can filter out the date for the transactions
10. In NFT Table: is_avl is the NFT that are available(1-> available, 0-> not available).
