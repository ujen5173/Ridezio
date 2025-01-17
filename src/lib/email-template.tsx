import { format } from "date-fns";
import { env } from "~/env";
import {
  type BookingDetails,
  type BookingUpdateDetails,
} from "~/server/api/routers/email";

const createEmailLayout = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Plus Jakarta Sans', sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f5f5f5; margin: 0; padding: 0;">
    <div style="background-color: #f5f5f5; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            <div style="background: linear-gradient(to right, #1a1a1a, #2d2d2d); padding: 24px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between;">
                <svg style="height: 1.5rem; fill: #F1F1F1" viewBox="0 0 958 168" xmlns="http://www.w3.org/2000/svg"><path d="M286.853 38.536L304.147 0.007231H195.566V157.766H304.147L286.853 120.302H238.383V96.6545H281.575L286.853 59.1973H238.383V38.536H286.853Z"></path><path d="M34 0.421108L76.5 157.766L135.5 156.5L177 0.421108H135.5L104.5 114.5L75 0.421108H34Z"></path><path d="M369.961 3.43323e-05H326.263V157.766H421.004L432.394 120.302H369.961V3.43323e-05Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M516.925 0.842353C456.012 0.842353 445.188 39.3711 445.188 81.7435C445.188 123.902 456.012 162.438 516.925 162.438C577.607 162.438 588.423 123.902 588.423 81.7435C588.423 39.3711 577.831 0.842353 516.925 0.842353ZM489.552 83.2367C489.552 109.199 492.871 125.174 516.925 125.174C540.741 125.174 544.067 109.199 544.067 83.2295C544.067 57.4746 540.741 41.5072 516.925 41.5072C492.871 41.5072 489.552 57.4746 489.552 83.2367Z"></path><path d="M602.81 80.9013C602.817 26.1908 620.914 3.43323e-05 677.403 3.43323e-05C697.705 3.43323e-05 715.794 5.10101 728.172 12.7739L704.776 47.9092C697.271 43.8513 688.212 40.6649 675.422 40.6649C658.2 40.6649 645.838 44.7007 645.838 81.7435L603.159 85.485L602.81 80.9013Z"></path><path d="M793.904 0.385673H750.206V158.152H793.904V0.385673Z"></path><path d="M901.3 0.385673H857.602V158.152H901.3V0.385673Z"></path><path d="M947.454 0.385673H812.043L821.497 35.7717H865.195H938.595L947.454 0.385673Z"></path><path d="M602.81 81.2693C606.07 140.209 625.725 167.003 680.529 163.989C700.225 162.905 717.472 156.445 729.025 147.518L704.237 110.915C697.197 115.687 688.598 119.603 676.189 120.286C659.481 121.205 645.838 114.958 645.838 81.2693L602.81 81.2693Z"></path></svg>
                <div style="color: #ffffff; font-size: 14px; opacity: 0.8;">
                    Booking Reference: #${Math.random().toString(36).substr(2, 9).toUpperCase()}
                </div>
            </div>
            ${content}
            <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">Need assistance with your booking?</p>
                <a href="${env.NEXT_PUBLIC_APP_URL}/support" style="color: #FF385C; text-decoration: none; font-weight: 500;">Contact our support team →</a>
            </div>
        </div>
    </div>
</body>
</html>
`;

export const bookingEmailToVendor = (bookingDetails: BookingDetails) => {
  const content = `
    <div style="background: linear-gradient(135deg, #FF385C 0%, #E31C5F 100%); color: white; padding: 40px 24px; text-align: center;">
        <span style="display: inline-block; padding: 6px 12px; border-radius: 999px; font-size: 14px; font-weight: 500; margin-bottom: 16px; background: #fff7ed; color: #9a3412;">New Request</span>
        <h1 style="font-size: 28px; font-weight: 700; margin: 0;">New Booking Request</h1>
        <p style="font-size: 16px; opacity: 0.9; margin-top: 8px;">You have received a new booking request from ${bookingDetails.userName}</p>
    </div>
    
    <div style="padding: 32px 24px;">
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
            <img src="${bookingDetails.vehicleImages[0]!.url}" alt="${bookingDetails.vehicleName}" style="width: 100%; height: 240px; object-fit: cover;">
            <div style="padding: 24px;">
                <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #1e293b">${bookingDetails.vehicleName}</h2>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
                    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; margin-bottom: 4px;">Check-in</div>
                        <div style="font-size: 16px; font-weight: 600; color: #111827;">${format(new Date(bookingDetails.rentalStart), "MMM d, yyyy")}</div>
                    </div>
                    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; margin-bottom: 4px;">Check-out</div>
                        <div style="font-size: 16px; font-weight: 600; color: #111827;">${format(new Date(bookingDetails.rentalEnd), "MMM d, yyyy")}</div>
                    </div>
                    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; margin-bottom: 4px;">Customer</div>
                        <div style="font-size: 16px; font-weight: 600; color: #111827;">${bookingDetails.userName}</div>
                    </div>
                    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; margin-bottom: 4px;">Contact</div>
                        <div style="font-size: 16px; font-weight: 600; color: #111827;">${bookingDetails.userPhoneNumber ?? "No phone provided"}</div>
                    </div>
                </div>
            </div>
        </div>

        <div style="border: 1px solid #e2e8f0; background: #f9fafb; border-radius: 12px; padding: 24px; margin-top: 24px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px;">
                <span>Vehicles Requested</span>
                <span>${bookingDetails.quantity}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px;">
                <span>Payment Method</span>
                <span>${bookingDetails.paymentMethod}</span>
            </div>
            <div style="border-top: 2px solid #e5e7eb; margin-top: 12px; padding-top: 12px; font-weight: 700; font-size: 18px;">
                <span>Total Amount</span>
                <span>NPR ${bookingDetails.totalPrice}</span>
            </div>
        </div>

        <div style="text-align: center; margin-top: 32px;">
            <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #FF385C; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: background-color 0.2s;">Review Booking Request</a>
        </div>
    </div>`;

  return createEmailLayout(content);
};

export const bookingEmailToUser = (bookingDetails: BookingDetails) => {
  const content = `
    <div style="background: linear-gradient(135deg, #FF385C 0%, #E31C5F 100%); color: white; padding: 40px 24px; text-align: center;">
        <span style="display: inline-block; padding: 6px 12px; border-radius: 999px; font-size: 14px; font-weight: 500; margin-bottom: 16px; background: #fff7ed; color: #9a3412;">Approve Pending</span>
        <h1 style="font-size: 28px; font-weight: 700; margin: 0;">
            Your Booking Request is on the way!
        </h1>
        <p style="font-size: 16px; opacity: 0.9; margin-top: 8px;">
            We've sent your booking request to the vendor
        </p>
    </div>
    
    <div style="padding: 32px 24px;">
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 24px; margin-bottom: 32px;">
                <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #1e293b">${bookingDetails.vehicleName}</h2>

            <img src="${bookingDetails.vehicleImages[0]?.url}" alt="${bookingDetails.vehicleName}" style="width: 100%; height: 240px; object-fit: contain; border-radius: 12px; margin-bottom: 24px; border: 1px solid #e5e7eb;">
            
            <div style="display: flex; align-items: flex-start; padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
                <div style="width: 24px; height: 24px; margin-right: 16px; color: #FF385C;">📅</div>
                <div style="flex: 1;">
                    <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">Rental Period</div>
                    <div style="font-size: 16px; font-weight: 600; color: #111827;">${format(new Date(bookingDetails.rentalStart), "MMM d")} - ${format(new Date(bookingDetails.rentalEnd), "MMM d, yyyy")}</div>
                </div>
            </div>
            
            <div style="display: flex; align-items: flex-start; padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
                <div style="width: 24px; height: 24px; margin-right: 16px; color: #FF385C;">🚗</div>
                <div style="flex: 1;">
                    <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">Number of Vehicles</div>
                    <div style="font-size: 16px; font-weight: 600; color: #111827;">${bookingDetails.quantity} vehicle(s)</div>
                </div>
            </div>
            
            <div style="display: flex; align-items: flex-start; padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
                <div style="width: 24px; height: 24px; margin-right: 16px; color: #FF385C;">💳</div>
                <div style="flex: 1;">
                    <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">Payment Method</div>
                    <div style="font-size: 16px; font-weight: 600; color: #111827;">${bookingDetails.paymentMethod}</div>
                </div>
            </div>

            <div style="background: #ffe4e6; border: 2px solid #fb7185; border-radius: 12px; padding: 20px; margin-top: 24px; text-align: center;">
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Total Amount</div>
                <div style="font-size: 24px; font-weight: 700; color: #111827;">NPR ${bookingDetails.totalPrice}/-</div>
            </div>
        </div>

        <div style="margin: 32px 0; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="background: #f8fafc; padding: 16px; border-bottom: 1px solid #e5e7eb;">
                <h3 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0;">Shop Location</h3>
                <p style="font-size: 14px; color: #6b7280; margin: 4px 0 0 0;">${bookingDetails.businessName}</p>
            </div>
            ${bookingDetails.businessImages ? `<img src="${bookingDetails.businessImages[0]!.url}" alt="${bookingDetails.businessName}" style="width: 100%; height: 350px; object-fit: cover;">` : ""}

            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1426.2412986322759!2d85.33987908086468!3d27.635798644361767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb17002c66df73%3A0x34395f06aa922d88!2sGyani%20mart!5e0!3m2!1sen!2snp!4v1737114880528!5m2!1sen!2snp" width="600" height="450" style="border:0; width: 100%; height: 200px; object-fit: cover;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>

        <div style="background: #f8fafc; border-radius: 16px; padding: 24px; margin-top: 32px; border: 1px solid #e2e8f0;">
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827;">Price Breakdown</div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #e5e7eb;">
                <span style="color: #6b7280;">Base Rate</span>
                <span style="font-weight: 500;">NPR ${bookingDetails.totalPrice}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #e5e7eb;">
                <span style="color: #6b7280;">Service Fee</span>
                <span style="font-weight: 500;">Included</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: none;">
                <span style="font-weight: 700;">Total Amount</span>
                <span style="font-weight: 700;">NPR ${bookingDetails.totalPrice}</span>
            </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #FF385C; padding: 16px; margin: 24px 0; border-radius: 8px;">
            <p style="margin: 0;">
                We'll notify you once the vendor confirms your booking. 
            </p>
        </div>

        <div style="display: flex; gap: 16px; justify-content: center; margin-top: 32px;">
            <a href="${env.NEXT_PUBLIC_APP_URL}/orders" style="background: #FF385C; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.2s ease;">View Booking Details</a>
            <a href="${env.NEXT_PUBLIC_APP_URL}/support" style="background: #f3f4f6; color: #111827; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.2s ease;">Need Help?</a>
        </div>
    </div>`;

  return createEmailLayout(content);
};

export const bookingRejectionEmailToUser = (
  bookingDetails: BookingUpdateDetails,
) => {
  const content = `
    <div style="background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%); color: white; padding: 40px 24px; text-align: center;">
        <span style="display: inline-block; padding: 6px 12px; border-radius: 999px; font-size: 14px; font-weight: 500; margin-bottom: 16px; background: #fef2f2; color: #991b1b;">Booking Cancelled</span>
        <h1 style="font-size: 28px; font-weight: 700; margin: 0;">Booking Not Available</h1>
        <p style="font-size: 16px; opacity: 0.9; margin-top: 8px;">We're sorry, but your booking request couldn't be fulfilled</p>
    </div>
    
    <div style="padding: 32px 24px;">
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
            <div style="padding: 24px;">
                <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #1e293b">${bookingDetails.vehicleName}</h2>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
                    <div style="background: #f9fafb; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; margin-bottom: 4px;">Requested Dates</div>
                        <div style="font-size: 16px; font-weight: 600; color: #111827;">${format(new Date(bookingDetails.rentalStart), "MMM d")} - ${format(new Date(bookingDetails.rentalEnd), "MMM d, yyyy")}</div>
                    </div>
                    <div style="background: #f9fafb; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; margin-bottom: 4px;">Refund Amount</div>
                        <div style="font-size: 16px; font-weight: 600; color: #111827;">NPR ${bookingDetails.totalPrice}</div>
                    </div>
                </div>

                <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-top: 16px;">
                    <div style="font-size: 14px; font-weight: 600; color: #991b1b; margin-bottom: 8px;">Cancellation Note:</div>
                    <div style="font-size: 14px; color: #7f1d1d;">${"The vendor is unable to fulfill this booking request at this time."}</div>
                </div>

                <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin-top: 16px;">
                    <div style="font-size: 16px; font-weight: 600; color: #9a3412; margin-bottom: 8px;">Refund Information:</div>
                    <div style="font-size: 16px; color: #7c2d12;">
                        Please contact the vendor for refund coordination:<br>
                        Vendor: <strong><u> ${bookingDetails.businessName}</strong></u><br>
                        Contact: <strong><u>${bookingDetails.businessPhone.join(", ") ?? "Contact through support"}</strong></u><br><br>
                        You can also reach out to our support team for assistance with the refund process.
                    </div>
                </div>
            </div>
        </div>
    </div>`;

  return createEmailLayout(content);
};

export const bookingConfirmationEmailToUser = (
  bookingDetails: BookingUpdateDetails,
) => {
  const content = `
    <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 40px 24px; text-align: center;">
        <span style="display: inline-block; padding: 6px 12px; border-radius: 999px; font-size: 14px; font-weight: 500; margin-bottom: 16px; background: #dcfce7; color: #166534;">Confirmed</span>
        <h1 style="font-size: 28px; font-weight: 700; margin: 0;">Your Booking is Confirmed!</h1>
        <p style="font-size: 16px; opacity: 0.9; margin-top: 8px;">Get ready for an amazing journey</p>
    </div>
    
    <div style="padding: 32px 24px;">
        <div style="background: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 24px; margin-bottom: 32px; border: 1px solid #e5e7eb;">
            <div style="margin-bottom: 24px;">
                <div style="font-size: 14px; color: #6b7280;">Booking Reference</div>
                <div style="font-size: 20px; font-weight: 600;">${bookingDetails.id}</div>
            </div>
            
            <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #1e293b">${bookingDetails.vehicleName}</h2>
            <p style="margin: 0 0 24px 0; color: #6b7280;">Provided by ${bookingDetails.businessName}</p>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
                <div style="background: #f9fafb; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; margin-bottom: 4px;">Pick-up</div>
                    <div style="font-size: 16px; font-weight: 600; color: #111827;">${format(new Date(bookingDetails.rentalStart), "MMM d, yyyy")}</div>
                </div>
                <div style="background: #f9fafb; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; margin-bottom: 4px;">Drop-off</div>
                    <div style="font-size: 16px; font-weight: 600; color: #111827;">${format(new Date(bookingDetails.rentalEnd), "MMM d, yyyy")}</div>
                </div>
                <div style="background: #f9fafb; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; margin-bottom: 4px;">Vehicles</div>
                    <div style="font-size: 16px; font-weight: 600; color: #111827;">${bookingDetails.quantity}</div>
                </div>
                <div style="background: #f9fafb; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; margin-bottom: 4px;">Total Amount</div>
                    <div style="font-size: 16px; font-weight: 600; color: #111827;">NPR ${bookingDetails.totalPrice}</div>
                </div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 32px;">
            <p style="color: #059669; font-weight: 500; margin-bottom: 24px;">
                🎉 Everything is set! Remember to bring your <u>documents</u> when picking up the vehicle.
            </p>
            <a href="${env.NEXT_PUBLIC_APP_URL}/orders" style="display: inline-block; background: #FF385C; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: background-color 0.2s;">View Booking Details</a>
        </div>
    </div>`;

  return createEmailLayout(content);
};
