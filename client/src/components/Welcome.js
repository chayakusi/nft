import React, {useState} from 'react'
import Axios from 'axios';
import Slider from './Slider';

export default function Welcome() {

    const [NFTList, setNFTList] = useState([]);
    const getHoldings = () => {
        Axios.get("http://localhost:3001/nft").then((response) => {
          setNFTList(response.data);
        });
      };

  return (
    <>
    <div className='d-flex justify-content-center align-items-center' style={{padding:"20px"}}>
    <div>Welcome, Tanmay</div>
    <div className= 'p-3 bg-warning rounded-circle'></div>
    </div>
    <div className='d-flex justify-content-center align-items-center flex-column' style={{padding:"20px"}}>
        <div>Your Current Holdings</div>
        <button onClick={getHoldings} style={{margin:"20px"}}>Show my Holdings</button>
        
        {NFTList.map((val,key) =>{
          
             return (
                <>
                <div>
                Name: {val.name}
                Price: {val.price_usd}
                Price: {val.price_eth}
                </div>
                <div>
                <Slider/>
              </div>
              </>
             )
        })}
        
    </div>
    <div className='d-flex justify-content-around align-items-center' style={{padding:"20px"}}>
        <button className='rounded bg-success' style={{padding:"10px"}} >Buy NFT</button>
        <button className='rounded bg-danger' style={{padding:"10px"}}>Sell NFT</button>
    </div>

    </>
  )
}
