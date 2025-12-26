import React, { memo } from 'react'
import razorpay from '../../assets/razorpay-icon.svg';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';


const Razorpaybutton = ({amount,handlePaymentSuccess,handleFinalizeCheckout,checkoutid}) => {

    const navigate = useNavigate();
    const localhostbackendurl = import.meta.env.VITE_BACKEND_URL; // Adjust this to your backend URL
    const handlepayment = async (e) => {
        // Logic for handling Razorpay payment
        e.preventDefault();
        // setLoading(true); // Set loading state to true
        //console.log("Payment initiated");
        try {
           const data = await fetch(`${localhostbackendurl}/orders`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount, // Amount in paise (200 INR)
                currency: "INR",
            }),
        });
        const orderdata = await data.json();

        initiatePayment(orderdata.order);
        } catch (error) {
            //console.error("Error initiating payment:", error);
            alert("Failed to initiate payment. Please try again later.");
            // Optionally, you can redirect or handle the error in a user-friendly way
        }


    }

    const initiatePayment = (order) => {

       //console.log("Initiating Razorpay payment:", order);
       const options={
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay key ID
        amount: order.amount, // Amount in paise
        currency: order.currency,
        order_id: order.id, // Razorpay order ID
        description: "Payment for your order",
        handler: async (response)=> {
          // Handle the payment response here
         const paymentResponse = await fetch(`${localhostbackendurl}/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
          const paymentData = await paymentResponse.json();
          //console.log("Payment verification response:", paymentData);
          if(paymentData.status === 200){
            //console.log("Payment verification successful:", paymentData);
            // setLoading(false); // Set loading state to false
             alert("Payment successful!");
            return await handlePaymentSuccess(paymentData);
            // await handleFinalizeCheckout();
            // navigate('/order-confirmation');
          }
          else{
            navigate('/checkout');
            // setLoading(false); // Set loading state to false
            ////console.error("Payment verification failed:", paymentData);
            alert("Payment verification failed. Please try again.");
          }
          // Perform any necessary actions after successful payment
        },
        prefill: {
          name: "Customer Name",
          email: "sHm7o@example.com",
       },
        notes: {
          address: "Customer Address",
        },
        theme: {
          color: "#F37254", // Customize the theme color
        },
      };
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    }
  return (
    <button type='submit' onClick={handlepayment} className='bg-black w-full   border border-gray-100  text-white py-2 rounded-lg font-semibold hover:bg-gray-950 cursor-pointer'>
                                Pay with <img src={razorpay} alt="Razorpay" className=' saturate-300 inline-block w-[5.5rem] ml-2' />
                             </button>
  )
}

export default Razorpaybutton; //Razorpaybutton
