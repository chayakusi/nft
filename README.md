# nft

Instructions:

1. In terminal, do npm i
2. Make a schema and make changes in the schema.js file.
3. Exceute following commands in the terminal.
   cd server
   node schema.js
   npm run devStart
4. Make a new terminal window
5. Exceute following commands in the new terminal.
   cd client
   npm start

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

BUGS

1. Even if the balance is insufficient, the trader will get success alert even though the transaction will not happen.
2. Have to execute cancel transactions functionality.
