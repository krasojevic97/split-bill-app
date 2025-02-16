import {useState} from 'react';

const BillCalculator = () =>{
    const [totalPrice,setTotalPrice] = useState(0);

    function handleSubmit(e){
        console.log(e)
        e.preventDefault();
        const billValue = Number(e.target.elements["bill-value"].value);
        const serviceImpression = Number(e.target.elements["service-impression"].value);
        const friendImpression = Number(e.target.elements["friend-service-impression"].value);
        const calculatedPrice = billValue + (billValue * serviceImpression / 100) + (billValue * friendImpression / 100);
        setTotalPrice(calculatedPrice);
    }

    // function handleChange(e){
    //     setTotalPrice(Number(e.target.elements["bill-value"].value)+
    //     (Number(e.target.elements["bill-value"].value)+Number(e.target.elements["service-impression"].value)/100)
    // }
    

    return (
        <form className="calculator-layout" onSubmit={handleSubmit}>
            <label for="billValue">How much was the bill?</label><input id="billValue" name="bill-value" className="calc-input" type="number" />
            <label for="serviceImpression">How did you like the service?</label><input name="service-impression" className="calc-input" type="number" />
            <label for="friendsImpression"></label><input className="calc-input"  name="friend-service-impression" type="number" />
            <button>Submit</button>
            <p className="resulting-payment">{`You pay ${totalPrice}`}</p>
        </form>
    )
}

export default BillCalculator;