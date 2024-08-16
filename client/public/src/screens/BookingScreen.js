import React, { useState, useEffect } from "react";
import axios from "axios";



import moment from "moment";
// import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import Error from "../components/Error";

function BookingScreen({ match }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [room, setRoom] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  const roomid = match.params.roomid;
  const fromdate = moment(match.params.fromdate, "DD-MM-YYYY");
  const todate = moment(match.params.todate, "DD-MM-YYYY");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      window.location.href = "/login";
    }
    async function fetchMyAPI() {
      try {
        setError("");
        setLoading(true);
        const data = (
          await axios.post("/api/rooms/getroombyid", {
            roomid: match.params.roomid,
          })
        ).data;
        //console.log(data);
        setRoom(data);
      } catch (error) {
        console.log(error);
        setError(error);
      }
      setLoading(false);
    }

    fetchMyAPI();
  }, []);

  useEffect(() => {
    const totaldays = moment.duration(todate.diff(fromdate)).asDays() + 1;
    setTotalDays(totaldays);
    setTotalAmount(totalDays * room.rentperday);
  }, [room]);

  const paymentHandler = async () => {
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalAmount,
      totaldays: totalDays,
    };
    try {
      setLoading(true);
      // console.log(bookingDetails)
      const {
        data: { key },
      } = await axios.get("/api/getkey");
      const {
        data: { order },
      } = await axios.post("/api/bookings/bookroom", bookingDetails);
      // console.log(key)
      // console.log(order)

      var options = {
        key: key, // Enter the Key ID generated from the Dashboard
        amount: totalAmount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: room.name, //your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        callback_url: "/api/paymentverification/pay",
        prefill: {
          //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
          name: room.name, //your customer's name
          email: "@example.com",
          contact: "919997775551", //Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razor = new window.Razorpay(options);

      await razor.open();

      setLoading(false);
      // Swal.fire(
      //   "Congratulations",
      //   "Your Room Booked Successfully",
      //   "success"
      // ).then((result) => {
      //   window.location.href = "/home";
      // });
    } catch (error) {
      setError(error);
      console.dir(error);
      Swal.fire("Opps", "Error:" + error, "error");
    }
    setLoading(false);
  };

  // async function onToken(token) {
  //   console.log(token);
  //   const bookingDetails = {
  //     room,
  //     userid: JSON.parse(localStorage.getItem("currentUser"))._id,
  //     fromdate,
  //     todate,
  //     totalAmount,
  //     totaldays: totalDays,
  //     token,
  //   };
  //   console.log(bookingDetails);

  //   try {
  //     setLoading(true);
  //     const result = await axios.post("/api/bookings/bookroom", bookingDetails);
  //     setLoading(false);
  //     Swal.fire(
  //       "Congratulations",
  //       "Your Room Booked Successfully",
  //       "success"
  //     ).then((result) => {
  //       window.location.href = "/home";
  //     });
  //   } catch (error) {
  //     setError(error);
  //     console.dir(error);
  //     Swal.fire("Opps", "Error:" + error, "error");
  //   }
  //   setLoading(false);
  // }

  return (
    <div className="m-5">
      {loading ? (
        <Loader></Loader>
      ) : error.length > 0 ? (
        <Error msg={error}></Error>
      ) : (
        <div className="row justify-content-center mt-5 bs">
          <div className="col-md-6">
            <h1>{room.name}</h1>
            <img src={room.imageurls[0]} alt="" className="bigimg" />
          </div>
          <div className="col-md-6">
            <div style={{ textAlign: "right" }}>
              <h1>Booking Details</h1>
              <hr />
              <b>
                <p>
                  Name : {JSON.parse(localStorage.getItem("currentUser")).name}
                </p>
                <p>From Date : {match.params.fromdate}</p>
                <p>To Date : {match.params.todate}</p>
                <p>Max Count : {room.maxcount}</p>
              </b>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1>Amount</h1>
              <hr />
              <b>
                <p>Total Days : {totalDays}</p>
                <p>Rent per day : {room.rentperday}</p>
                <p>Total Amount : {totalAmount}</p>
              </b>
            </div>

            <div style={{ float: "right" }}>
              <button
                onClick={paymentHandler}
                id="rzp-button1"
                className="btn btn-primary"
              >
                Pay Now
              </button>

              {/* <StripeCheckout
                amount={totalAmount * 100}
                currency="USD"
                token={onToken}
                stripeKey="pk_test_51Nc4OsSFEMxgGSMgYtS56GqZ4qvtr5KtcmLtb1bE1PSMqdePriCTRlx6ioTenm9G9vF1yVqn1Wg6o1jKOGb4xA2M00F5ghN6rD"
              >
                <button className="btn btn-primary">Pay Now</button>
              </StripeCheckout> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingScreen;
