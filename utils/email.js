const nodemailer = require("nodemailer");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = "Aves Air <" + process.env.EMAIL_USERNAME + ">";
  }
  newTransport() {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      port: 587,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendWelcome(name) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: "Welcome to Aves Air",
      html: `
    <div
      class="navbar"
      style="background-color: #228be6; text-align: center; padding: 10px"
    >
      <h1 class="color-primary" style="color: #fff">Aves Air</h1>
    </div>
    <div
      class="container"
      style="
        width: 80%;
        margin: 0 auto;
        background-repeat: no-repeat;
        background-position: center;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      "
    >
      <p
        class="text template"
        style="
          font-size: 1.2rem;
          line-height: 1.5;
          margin-top: 20px;
          position: absolute;
          text-align: center;
        "
      >
        Hi ${name} 🤩 , Welcome to <b> Aves Air </b> , your one-stop solution
        for seamless flight bookings! We are thrilled to have you on board and
        ready to take you on an incredible journey in the skies .
      </p>
    </div>
    <div>
      <p class="" style="text-align: center; font-size: 0.8rem">
        © 2023 Aves Air. All rights reserved.
      </p>
    </div>
  `,
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendBookingConfirmation(booking) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: "Aves Air - Booking Confirmation",
      html: `<div style="background-color: #228be6; text-align: center; padding: 3px">
      <h1 style="color: #fff">Aves Air</h1>
    </div>
    <div>
      <p>
        Congratulations! Your flight booking with Aves Air has been confirmed!
        We are excited to have you as our valued passenger on your upcoming
        journey.
      </p>
      <p>Your booking is confirmed.</p>
      <div
        style="
          box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
          width: 500px;
          padding: 1rem;
        "
      >
        <p style="font-weight: bold">ID : ${booking._id}</p>
        <p style="font-weight: bold">
          Seats : ${booking.seatNumbers.toString()}
        </p>
        <p style="font-weight: bold">Price : ${booking.price}</p>
        <p>
          Thank you for choosing Aves Air for your journey. We look forward to
          welcoming you onboard!
        </p>
      </div>
      <p>Happy Journey</p>
      <p>By Aves Air Team</p>
    </div>`,
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendBookingCancellation() {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: "Aves Air - Booking Cancellation",
      html: `<div style="background-color: #228be6; text-align: center; padding: 3px">
      <h1 style="color: #fff">Aves Air</h1>
    </div>
    <div>
    <p style="font-size: 1.2rem; font-weight: bold; text-align: center">
      This is to inform you that your flight booking with Aves Air has been
      successfully cancelled. We understand that plans can change, and we
      appreciate you choosing our services for your travel needs.
    </p>
    <p>Thank you for choosing Aves Air, and we wish you smooth travels ahead.</p>
    <p>By Aves Air Team</p>
    <div>
      <p class="" style="text-align: center; font-size: 0.8rem">
        © 2023 Aves Air. All rights reserved.
      </p>
    </div>`,
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendFlightCancellation() {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: "Aves Air - Flight Cancellation",
      html: `<div style="background-color: #228be6; text-align: center; padding: 3px">
      <h1 style="color: #fff">Aves Air</h1>
    </div>
    <div>
    <p style="font-size: 1.2rem; font-weight: bold; text-align: center">
      This is to inform you that your flight booking with Aves Air has been
      successfully cancelled. We understand that plans can change, and we
      appreciate you choosing our services for your travel needs.
    </p>
    <p>Thank you for choosing Aves Air, and we wish you smooth travels ahead.</p>
    <p>By Aves Air Team</p>
    <div>
      <p class="" style="text-align: center; font-size: 0.8rem">
        © 2023 Aves Air. All rights reserved.
      </p>
    </div>`,
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: "Aves Air - Password Reset",
      html: `<h3>Click on the link to reset your password.</h3>
      <a href=" ${this.url}">Reset Password</a>
      `,
    };
    await this.newTransport().sendMail(mailOptions);
  }
};
