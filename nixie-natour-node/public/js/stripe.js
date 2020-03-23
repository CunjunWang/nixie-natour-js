// Created by CunjunWang on 2020/3/23

import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe('pk_test_ikugjEdqbtVReAl7LWPq9HPA001XQeixo4');

export const bookTour = async tourId => {
  try {
    // 1. get the session from the server
    const session = await axios(`http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`);

    // 2. create checkout form + charge the credit card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
