import React, {useEffect, useState} from 'react'
import axios from 'axios';
// import Slider from './Slider';
import '../css/Welcome.css'
import { Link } from 'react-router-dom';
export default function Welcome() {

    // const [NFTList, setNFTList] = useState([]);
    // const getHoldings = () => {
    //     Axios.get("http://localhost:3001/nft").then((response) => {
    //       setNFTList(response.data);
    //     });
    //   };

    //nft fetch in single run
    const [NFTdata, setNFTData] = useState([])
    const loadNFT = async() =>{
      const response = await axios.get("http://localhost:3001/nft/get")
      setNFTData(response.data)
    }

    useEffect(()=>{
      loadNFT()
    },[])
    

  return (
    <>
    <div className='d-flex justify-content-center align-items-center' style={{padding:"20px"}}>
    <div className='d-flex'>
      <h1>Welcome,&nbsp;</h1>
      <h1> Tanmay&nbsp;</h1>
    </div>
    <div className= 'p-4 bg-warning rounded-circle'></div>
    </div>
    {/* <div className='d-flex justify-content-center align-items-center flex-column' style={{padding:"20px"}}>
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
        
    </div> */}
    <div className='d-flex justify-content-center align-items-center flex-column'>
      <h3>Your Holdings</h3>
      <div style={{margin:"20px"}}>
        <table className='styled-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price USD</th>
            < th>Price ETH</th>
            </tr>
          </thead>
          <tbody>
            {NFTdata.map((item,index)=>{
              return(
                <tr>
                    <td>{item.name}</td>
                    <td>{item.price_usd}</td>
                    <td>{item.price_eth}</td>  
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
    <div className='d-flex justify-content-around align-items-center' style={{padding:"20px"}}>
        <Link to ="/buynft">
        <button className='rounded bg-success' style={{padding:"10px"}} >Buy NFT</button>
        </Link>
        <button className='rounded bg-danger' style={{padding:"10px"}}>Sell NFT</button>
    </div>

    </>
  )
}
