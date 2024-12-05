import { format } from "date-fns";
import { env } from "~/env";
import {
  type BookingDetails,
  type BookingUpdateDetails,
} from "~/server/api/routers/email";

export const bookingEmailToVendor = (bookingDetails: BookingDetails) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f5;">
    <div style="background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #e11d48, #f43f5e); color: white; padding: 20px; text-align: center;">
            <h1>New Vehicle Booking Confirmed</h1>
        </div>
        <div style="padding: 30px; color: #333;">
            <h2>Congratulats on getting another Order!!! 🥳🥳</h2>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Booking ID:</span>
                    <strong>${bookingDetails.id}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Vehicle Model:</span>
                    <strong>${bookingDetails.vehicleName}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Vehicle Image:</span>
                    <img src="${bookingDetails.vehicleImages[0]!}" class="rounded-md object-cover aspect-video" alt="Vehicle Image">
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Booking Dates:</span>
                    <strong>${format(new Date(bookingDetails.rentalStart), "dd MMM - yyyy")} - ${format(new Date(bookingDetails.rentalEnd), "dd MMM - yyyy")}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Renter Name:</span>
                    <strong>${bookingDetails.userName!}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Renter Contact:</span>
                    <strong>${bookingDetails.userPhoneNumber!}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Booking Quantity:</span>
                    <strong>${bookingDetails.quantity}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Payment Method:</span>
                    <strong>${bookingDetails.paymentMethod}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Total Booking Amount:</span>
                    <strong>रु. ${bookingDetails.totalPrice}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>User Note:</span>
                    <strong>${bookingDetails.notes}</strong>
                </div>
            </div>
            <div style="margin-top: 15px;">Please prepare your vehicle for the upcoming rental. Confirm vehicle readiness in the Velocity vendor portal.</div>
            <div style="display: flex; justify-content: flex-end; margin-top: 15px;">
                <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: block; width: 200px; margin: 10px 0; padding: 12px 20px; background-color: #e11d48; color: white; text-decoration: none; text-align: center; border-radius: 8px; font-weight: bold;">
                    View Bookings
                </a>
            </div>
        </div>
    </div>
</body>
</html>
`;

export const bookingEmailToUser = (bookingDetails: BookingDetails) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f5;">
    <div style="background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; margin-top: 20px;">
        <div style="background: linear-gradient(135deg, #e11d48, #f43f5e); color: white; padding: 20px; text-align: center;">
            <h1>Booking Confirmed</h1>
        </div>
        <div style="padding: 30px; color: #333;">
            <h2>Your Vehicle Rental Details</h2>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Vehicle:</span>
                    <strong>${bookingDetails.vehicleName}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Vendor Name:</span>
                    <strong>${bookingDetails.businessName!}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Dates:</span>
                    <strong>${format(new Date(bookingDetails.rentalStart), "dd MMM - yyyy")} - ${format(new Date(bookingDetails.rentalEnd), "dd MMM - yyyy")}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Quantity:</span>
                    <strong>${bookingDetails.quantity}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Payment Method:</span>
                    <strong>${bookingDetails.paymentMethod}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Total Amount:</span>
                    <strong>रु. ${bookingDetails.totalPrice}</strong>
                </div>
            </div>
            <a href="${env.NEXT_PUBLIC_APP_URL}/orders" style="display: block; width: 200px; margin: 20px auto; padding: 12px 20px; background-color: #e11d48; color: white; text-decoration: none; text-align: center; border-radius: 8px; font-weight: bold;">
                View Booking
            </a>
        </div>
    </div>
</body>
</html>
`;

export const bookingRejectionEmailToUser = (
  bookingDetails: BookingUpdateDetails,
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f5;">
    <div style="background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; margin-top: 20px;">
        <div style="background: linear-gradient(135deg, #d63031, #ff7675); color: white; padding: 20px; text-align: center;">
            <h1>Booking Cancelled</h1>
        </div>
        <div style="padding: 30px; color: #333;">
            <h2>Booking Update</h2>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Vehicle:</span>
                    <strong>${bookingDetails.vehicleName}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Requested Dates:</span>
                    <strong>${format(new Date(bookingDetails.rentalStart), "dd MMM - yyyy")} - ${format(new Date(bookingDetails.rentalEnd), "dd MMM - yyyy")}</strong>
                </div> 
                <div style="display: flex; justify-content: space-between;">
                    <span>Total Refund:</span>
                    <strong>रु. ${bookingDetails.totalPrice}</strong>
                </div>
            </div>
            <div style="margin-top: 15px; text-align: center; color: #718096;">
                We apologize for the inconvenience. Our team is working to find alternative options for you.
            </div>
            <a href="${env.NEXT_PUBLIC_APP_URL}/support" style="display: block; width: 200px; margin: 20px auto; padding: 12px 20px; background-color: #d63031; color: white; text-decoration: none; text-align: center; border-radius: 8px; font-weight: bold;">
                Contact Support
            </a>
        </div>
    </div>
</body>
</html>
`;

export const bookingConfirmationEmailToUser = (
  bookingDetails: BookingUpdateDetails,
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f5;">
    <div style="background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; margin-top: 20px;">
        <div style="background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 20px; text-align: center;">
            <h1>Booking Confirmed</h1>
        </div>
        <div style="padding: 30px; color: #333;">
            <h2>Your Rental is All Set!</h2>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Booking ID:</span>
                    <strong>${bookingDetails.id}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Vehicle:</span>
                    <strong>${bookingDetails.vehicleName}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Vendor:</span>
                    <strong>${bookingDetails.businessName!}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Rental Dates:</span>
                    <strong>${format(new Date(bookingDetails.rentalStart), "dd MMM - yyyy")} - ${format(new Date(bookingDetails.rentalEnd), "dd MMM - yyyy")}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    <span>Quantity:</span>
                    <strong>${bookingDetails.quantity}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Total Amount:</span>
                    <strong>रु. ${bookingDetails.totalPrice}</strong>
                </div>
            </div>
            <div style="margin-top: 15px; text-align: center; color: #718096;">
                Your vehicle is reserved. Please bring necessary documents when picking up the vehicle. Have a safe trip! 🚗💨
            </div>
            <a href="${env.NEXT_PUBLIC_APP_URL}/orders" style="display: block; width: 200px; margin: 20px auto; padding: 12px 20px; background-color: #16a34a; color: white; text-decoration: none; text-align: center; border-radius: 8px; font-weight: bold;">
                View Booking Details
            </a>
        </div>
    </div>
</body>
</html>
`;
