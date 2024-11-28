import "./style.css";

const EmailTemplate = () => {
  return (
    <main className="flex h-screen items-center justify-center">
      {/* <div className="container">
        <div className="header">
          <h1>Welcome to Velocity</h1>
        </div>
        <div className="content">
          <h2>Hi [User Name]!</h2>
          <p>
            Your Velocity account is now active. Explore or rent vehicles with
            ease.
          </p>
          <a href="#" className="cta-button">
            Start Exploring
          </a>
        </div>
      </div> */}

      {/* <div className="container" style={{ marginTop: "20px" }}>
        <div className="header">
          <h1>Booking Confirmed</h1>
        </div>
        <div className="content">
          <h2>Your Vehicle Rental Details</h2>
          <div className="booking-details">
            <div className="detail-row">
              <span>Vehicle:</span>
              <strong>[Vehicle Model]</strong>
            </div>
            <div className="detail-row">
              <span>Vendor Name:</span>
              <strong>[Vendor Name]</strong>
            </div>
            <div className="detail-row">
              <span>Dates:</span>
              <strong>[Start Date] - [End Date]</strong>
            </div>
            <div className="detail-row">
              <span>Quantity:</span>
              <strong>[Quantity]</strong>
            </div>
            <div className="detail-row">
              <span>Payment Method:</span>
              <strong>[Cash | Online]</strong>
            </div>
            <div className="detail-row">
              <span>Total Amount:</span>
              <strong>रु. [Total Price]</strong>
            </div>
          </div>
          <a href="#" className="cta-button">
            View Booking
          </a>
        </div>
      </div> */}

      <div className="container">
        <div className="header">
          <h1>New Vehicle Booking Confirmed</h1>
        </div>
        <div className="content">
          <h2>Congratulats on getting another Order!!! 🥳🥳</h2>
          <div style={{ marginBottom: "10px;" }} className="booking-details">
            <div className="detail-row">
              <span>Booking ID:</span>
              <strong>[Unique Booking ID]</strong>
            </div>
            <div className="detail-row">
              <span>Vehicle Model:</span>
              <strong>[Vehicle Model]</strong>
            </div>
            <div className="detail-row">
              <span>Vehicle Image:</span>
              <strong>[Vehicle Image]</strong>
            </div>
            <div className="detail-row">
              <span>Booking Dates:</span>
              <strong>[Start Date] - [End Date]</strong>
            </div>
            <div className="detail-row">
              <span>Renter Name:</span>
              <strong>[Renter Full Name]</strong>
            </div>
            <div className="detail-row">
              <span>Renter Contact:</span>
              <strong>[Renter Phone Number]</strong>
            </div>
            <div className="detail-row">
              <span>Booking Quantity:</span>
              <strong>[Quantity]</strong>
            </div>
            <div className="detail-row">
              <span>Payment Method:</span>
              <strong>[Cash | Online]</strong>
            </div>
            <div className="detail-row">
              <span>Total Booking Amount:</span>
              <strong>रु. [Total Price]</strong>
            </div>

            <div className="detail-row">
              <span>User Note:</span>
              <strong>[Customer Notes]</strong>
            </div>
          </div>
          <div className="action-note">
            Please prepare your vehicle for the upcoming rental. Confirm vehicle
            readiness in the Velocity vendor portal.
          </div>
          <div className="actions">
            <a className="cta-button" href="/">
              View Bookings
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmailTemplate;
