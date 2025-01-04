import { format } from "date-fns";
import { env } from "~/env";
import {
  type BookingDetails,
  type BookingUpdateDetails,
} from "~/server/api/routers/email";

// Utility function for creating a consistent email layout
const createEmailLayout = (content: string, title: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f4f5f7; 
            margin: 0; 
            padding: 20px 0;
        }
        .email-container {
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white; 
            border-radius: 16px; 
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background: linear-gradient(135deg, #e11d48, #f43f5e); 
            color: white; 
            padding: 25px; 
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        .email-content {
            padding: 30px;
        }
        .details-box {
            background-color: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 12px; 
            padding: 20px;
            margin-bottom: 20px;
        }
        .detail-row {
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-row span {
            color: #718096;
            font-weight: 500;
        }
        .detail-row strong {
            color: #2d3748;
            font-weight: 600;
        }
        a:visited {
            color: inherit;
        }
        .cta-button {
            display: block;
            min-width: 200px;
            padding: 12px 20px;
            background-color: #e11d48;
            color: white;
            text-decoration: none;
            text-align: center;
            border-radius: 10px;
            font-weight: 700;
            transition: background-color 0.3s ease;
        }
        .cta-button-outline {
            display: block;
            min-width: 200px;
            padding: 12px 20px;
            background-color: white;
            color: #334155;
            text-decoration: none;
            text-align: center;
            border-radius: 10px;
            border-width: 1px;
            border-color: #cbd5e1;
            font-weight: 700;
            transition: background-color 0.3s ease;
        }
        .cta-button:hover {
            background-color: #f43f5e;
        }
        .vehicle-image {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            object-fit: cover;
            mix-blend-mode: multiply;
        }
        .buttons-wrapper {
            display: flex; 
            align-items: center; 
            gap: 0.5rem; 
            justify-content: flex-end;
        }

        @media (max-width: 600px) {
            .buttons-wrapper {
                flex-direction: column;
            }
            .cta-button {
                margin-top: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>${title}</h1>
        </div>
        ${content}
    </div>
</body>
</html>
`;

export const bookingEmailToVendor = (bookingDetails: BookingDetails) => {
  const content = `
    <div class="email-content">
        <h2 style="text-align: center; color: #2d3748; margin-bottom: 20px;">
            New Booking Alert! 🚗✨
        </h2>
        <div class="details-box">
            <div class="detail-row">
                <span>Booking ID: </span>
                <strong>${bookingDetails.id.split("-")[-1]}</strong>
            </div>
            <div class="detail-row">
                <span>Vehicle: </span>
                <strong>${bookingDetails.vehicleName}</strong>
            </div>
            <div class="detail-row">
                <span>Vehicle Image</span>
                <img 
                    src="${bookingDetails.vehicleImages[0]!.url}" 
                    alt="Vehicle" 
                    class="vehicle-image" 
                    style="max-width: 200px; max-height: 150px;"
                >
            </div>
            <div class="detail-row">
                <span>Rental Period: </span>
                <strong>${format(new Date(bookingDetails.rentalStart), "dd MMM yyyy")} - ${format(new Date(bookingDetails.rentalEnd), "dd MMM yyyy")}</strong>
            </div>
            <div class="detail-row">
                <span>Renter Name: </span>
                <strong>${bookingDetails.userName!}</strong>
            </div>
            <div class="detail-row">
                <span>Contact Number: </span>
                <strong>${bookingDetails.userPhoneNumber ?? "N/A"}</strong>
            </div>
            <div class="detail-row">
                <span>Quantity: </span>
                <strong>${bookingDetails.quantity}</strong>
            </div>
            <div class="detail-row">
                <span>Payment Method: </span>
                <strong>${bookingDetails.paymentMethod}</strong>
            </div>
            <div class="detail-row">
                <span>Total Amount: </span>
                <strong>रु. ${bookingDetails.totalPrice}</strong>
            </div>
            <div class="detail-row" style="border-bottom: none;">
                <span>Special Notes: </span>
                <strong>${bookingDetails.notes ?? "No additional notes"}</strong>
            </div>
        </div>
        <p style="text-align: center; color: #718096; margin-top: 20px;">
            Prepare your vehicle and confirm readiness in the Velocity vendor portal.
        </p>
        <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">
            View Orders
        </a>
    </div>`;

  return createEmailLayout(content, "New Vehicle Booking");
};

export const bookingEmailToUser = (bookingDetails: BookingDetails) => {
  const content = `
    <div class="email-content">
        <p style="text-align: center; color: #718096; margin-bottom: 20px;">
            You will receive a confirmation email once the booking is accepted.
        </p>
        <div class="details-box">
            <div class="detail-row">
                <span>Vehicle: </span>
                <strong>${bookingDetails.vehicleName}</strong>
            </div>
            <div class="detail-row">
                <span>Vendor: </span>
                <strong>${bookingDetails.businessName!}</strong>
            </div>
            <div class="detail-row">
                <span>Rental Dates: </span>
                <strong>${format(new Date(bookingDetails.rentalStart), "dd MMM yyyy")} - ${format(new Date(bookingDetails.rentalEnd), "dd MMM yyyy")}</strong>
            </div>
            <div class="detail-row">
                <span>Quantity: </span>
                <strong>${bookingDetails.quantity}</strong>
            </div>
            <div class="detail-row">
                <span>Payment Method: </span>
                <strong>${bookingDetails.paymentMethod}</strong>
            </div>
            <div class="detail-row" style="border-bottom: none;">
                <span>Total Amount: </span>
                <strong>रु. ${bookingDetails.totalPrice}</strong>
            </div>
        </div>
        <p style="text-align: center; color: #718096; margin-top: 20px; ">
            Your ride is booked and ready! Check your booking details and get ready for an amazing journey.
        </p>
        <div style="buttons-wrapper">
            <a href="${env.NEXT_PUBLIC_APP_URL}/orders" class="cta-button-outline">
                Get Direction to Store
            </a>
            <a href="${env.NEXT_PUBLIC_APP_URL}/orders" class="cta-button">
                View My Booking
            </a>
        </div>
    </div>`;

  return createEmailLayout(content, "Booking Sent to Vendor");
};

export const bookingRejectionEmailToUser = (
  bookingDetails: BookingUpdateDetails,
) => {
  const content = `
    <div class="email-content">
        <h2 style="text-align: center; color: #2d3748; margin-bottom: 20px;">
            Booking Update 📋
        </h2>
        <div class="details-box">
            <div class="detail-row">
                <span>Vehicle: </span>
                <strong>${bookingDetails.vehicleName}</strong>
            </div>
            <div class="detail-row">
                <span>Requested Dates: </span>
                <strong>${format(new Date(bookingDetails.rentalStart), "dd MMM yyyy")} - ${format(new Date(bookingDetails.rentalEnd), "dd MMM yyyy")}</strong>
            </div>
            <div class="detail-row" style="border-bottom: none;">
                <span>Total Refund: </span>
                <strong>रु. ${bookingDetails.totalPrice}</strong>
            </div>
        </div>
        <p style="text-align: center; color: #718096; margin-top: 20px;">
            We're sorry, but your booking couldn't be completed. Our team is actively working to find alternative solutions for you.
        </p>
        <a href="${env.NEXT_PUBLIC_APP_URL}/support" class="cta-button">
            Contact Support
        </a>
    </div>`;

  return createEmailLayout(content, "Booking Update");
};

export const bookingConfirmationEmailToUser = (
  bookingDetails: BookingUpdateDetails,
) => {
  const content = `
    <div class="email-content"> 
        <div class="details-box">
            <div class="detail-row">
                <span>Booking ID: </span>
                <strong>${bookingDetails.id}</strong>
            </div>
            <div class="detail-row">
                <span>Vehicle: </span>
                <strong>${bookingDetails.vehicleName}</strong>
            </div>
            <div class="detail-row">
                <span>Vendor: </span>
                <strong>${bookingDetails.businessName!}</strong>
            </div>
            <div class="detail-row">
                <span>Rental Dates: </span>
                <strong>${format(new Date(bookingDetails.rentalStart), "dd MMM yyyy")} - ${format(new Date(bookingDetails.rentalEnd), "dd MMM yyyy")}</strong>
            </div>
            <div class="detail-row">
                <span>Quantity: </span>
                <strong>${bookingDetails.quantity}</strong>
            </div>
            <div class="detail-row" style="border-bottom: none;">
                <span>Total Amount: </span>
                <strong>रु. ${bookingDetails.totalPrice}</strong>
            </div>
        </div>
        <p style="text-align: center; color: #718096; margin-top: 20px;">
            Your vehicle is locked and loaded! Remember to bring all necessary documents when picking up. Enjoy your ride! 🚗💨
        </p>
        <a href="${env.NEXT_PUBLIC_APP_URL}/orders" class="cta-button">
            View Booking Details
        </a>
    </div>`;

  return createEmailLayout(content, "Booking Confirmed  🎉");
};
