import './App.css';
import { useState,useEffect} from 'react';
import axios from 'axios';

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends,setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(()=>{
    axios.get('http://localhost:5000/api/friends')
    .then(res=>setFriends(res.data))
    .catch(err=>console.error(err));
  },[]);


  function handleShowAddFriend(){
    setShowAddFriend((show)=>!show);
    setSelectedFriend(null);
  }

  function handleAddFriend(friend){
    axios.post('http://localhost:5000/api/friends', friend)
      .then(response => {
        setFriends((prevFriends) => [...prevFriends, response.data]);
        setShowAddFriend(false);
      })
      .catch(error => console.error('Error adding friend:', error));
  
  }

  function handleSelection(friend){
    setSelectedFriend((cur) => (cur?.id===friend.id ? null : friend))
    setShowAddFriend(false);
  }

  function handleSplitBill(value){
    setFriends(friends => friends.map(friend => (friend.id===selectedFriend.id ? {...friend , amountOwed: friend.amountOwed + value} : friend)))
    setSelectedFriend((prev) =>
    prev ? { ...prev, amountOwed: prev.amountOwed + value } : null
    );
  }

  function handleRemove(friend){
    if(friend.amountOwed!==0){
      alert("You can't remove a friend who has an outstanding balance");
      return;
    }else{
    axios.delete(`http://localhost:5000/api/friends/${friend.id}`)
        .then(() => {
          alert(friend.name + " has been removed from your friends list");
          setFriends(friends => friends.filter(f => f.id !== friend.id));
          setSelectedFriend(null);
        })
        .catch(error => console.error('Error removing friend:', error));
    }
  }

  return (
    <div className="app">
        <div className="app-container">
        <h1 style={{color:"white"}}>Friends List</h1>
        <Friends friendsList={friends} onSelection={handleSelection} handleRemove={handleRemove} selectedFriend={selectedFriend}/>
        <Button  onClick={handleShowAddFriend}>{showAddFriend ? "Close":"Add Friend"}</Button>
        </div>
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend}/>} 
        {selectedFriend && <FormSplitBill friend={selectedFriend} onSplitBill={handleSplitBill}></FormSplitBill>}     
    </div>
  )
}

function Friends({friendsList,onSelection,selectedFriend,handleRemove}){
  return (
      <ul className="friends-display">
          {
            friendsList.map(friend=>(<Friend onSelection={onSelection} onRemove={handleRemove} friend={friend} key={friend.id} selectedFriend={selectedFriend}/>))
          }
      </ul>
  )
}


function Friend({friend,onSelection,selectedFriend, onRemove}){
  const isSelected = selectedFriend?.id===friend.id;
  return (
      <li className={`friend-display friend-image ${isSelected ? "selected":""}`} >
          <div style={{display:"flex", gap:"1em"}}>
            <img src={friend.image}/>
            <div>
                <h3>{friend.name}</h3>
                <p>{friend.amountOwed>0 ? `${friend.name} owes you ${friend.amountOwed}$` : 
                    (friend.amountOwed<0 ? `You owe ${friend.name} ${Math.abs(friend.amountOwed)}$`: 
                    `You and ${friend.name} are even.`)}
                </p>
            </div>
          </div>
          <div style={{display:"flex",gap:"1em"}}>
          <Button onClick={()=>onSelection(friend)}>{isSelected ? "Close" : "Select"}</Button>
          <Button onClick={()=>onRemove(friend)}>Remove</Button>
          </div>
      </li>
  )
}

function Button({children,onClick}){
  return <button className="add-friend-btn" onClick={onClick}>{children}</button>
}

function FormAddFriend({onAddFriend}){
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  function handleSubmit(e){
    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image:`${image}?=${id}`,
      amountOwed:0,
      id
    }
    console.log(newFriend);
    if(name && image){
      onAddFriend(newFriend);
      setName('');
      setImage('');
    }else{
      alert("Please fill in all fields");
    }
    
  }
  return (
    <form className="add-friend-form" onSubmit={handleSubmit}>
      <h1 style={{color:'white',alignSelf:"center"}}>Add a friend</h1>
      <label>Friend Name</label>
      <input type="text" name="name" value={name} onChange={(e)=>{setName(e.target.value)}}/>
      <label>Image URL</label>
      <input type="text" name="image" value={image} onChange={(e)=>{setImage(e.target.value)}}/>
      <Button name={name} image={image}>Submit</Button>
    </form>
    )
}

function FormSplitBill({friend,onSplitBill}){
  const [bill, setBill] = useState(0);
  const [paidByUser,setPaidByUser] = useState('');
  const [whoIsPaying,setWhoIsPaying] = useState("")

  const paidByFriend = bill ? bill-paidByUser : "";


  function handleSubmit(e){
    e.preventDefault();
    if(!bill || !paidByUser) return;
    onSplitBill(whoIsPaying==="you" ? paidByFriend : -paidByUser); 
    console.log(whoIsPaying);
  }
  function saveData(e){
    e.preventDefault();
    console.log('bill:',bill);
    console.log('paidByUser:',paidByUser);
    console.log('whoIsPaying:',whoIsPaying);
    
  }
  function handleSetBill(e){
    const value = parseFloat(e.target.value);
    if(Number.isNaN(value)){
      e.target.value = 0;
    }else{
      setBill(value);
    };
  }
  function handleSetPaidByUser(e){
    const value = parseFloat(e.target.value);
    if(Number.isNaN(value)){
     setPaidByUser(0);
    }else{
      if(value>=bill){
        setPaidByUser(bill-1);
      }else{
        setPaidByUser(value);
      }
    };
  }
  return (
    <form className='add-friend-form' onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>
      <label>Bill value</label><input type="text" value={bill} onChange={e=>handleSetBill(e)}/>
      <label>Your expense</label><input type="text" value={paidByUser} onChange={e=>handleSetPaidByUser(e)}/>
      <label>{friend.name}'s expense</label><input type="text" value={paidByFriend} disabled/>
      <label>Who's splitting the bill?</label><select value={whoIsPaying} onChange={e=>setWhoIsPaying(e.target.value)}>
        <option value="you">You</option>
        <option value="friend">{friend.name}</option>
      </select>
      <Button>Split</Button>
    </form>
  )
}

export default App;
