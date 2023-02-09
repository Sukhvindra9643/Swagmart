import React, { Fragment,useEffect } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../MetaData";
import "./ConfirmOrder.css";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { createOrder, clearErrors } from "../../actions/orderAction";
import { useAlert } from "react-alert";
import {v4 as uuidv4} from "uuid"
const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error } = useSelector((state) => state.newOrder);
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const tax = subtotal * 0.18;

  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;
  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: subtotal,
    taxPrice: tax,
    shippingPrice: shippingCharges,
    totalPrice: totalPrice,
  };
  const onlinePayment = ()=>{
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };
   
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/payment/process");

  }
  const codPayment = ()=>{
    order.paymentInfo = {
      id: uuidv4(),
      status: "COD",
    };
    dispatch(createOrder(order));
    navigate("/success");
  }
  // const proceedToPayment = (mode) => {
  //   console.log(mode)
  //   if(mode === "cod"){
  //    codPayment();
  //   }else if(mode === "online"){
  //     onlinePayment();
  //   }
  // };
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

  }, [dispatch, error, alert]);
  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>
                      {item.name}
                    </Link>{" "}
                    <span>
                      {item.quantity} X ₹{item.price} ={" "}
                      <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className="orderSummary">
            <Typography>Order Summery</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>₹{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>₹{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>₹{tax}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalPrice}</span>
            </div>
                <button onClick={codPayment} className="mb-2">Cash On Delivery</button>
                <button onClick={onlinePayment} className="mt-2">Online</button>
            {/* <button onSubmit={proceedToPayment(mode)}>Proceed</button> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
