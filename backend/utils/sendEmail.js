import transporter from '../config/email.js';

const emailTemplates = {
  welcome: (name, otp) => ({
    subject: 'Welcome to RentEase - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px; text-align: center;">
          <h1 style="color: #7C3AED; margin: 0 0 20px 0;">Welcome to RentEase</h1>
          <p style="color: #666; font-size: 16px; margin: 20px 0;">Hi ${name},</p>
          <p style="color: #666; font-size: 14px; margin: 20px 0;">Thank you for joining RentEase! Please verify your email with the OTP below:</p>
          <div style="background: #f0f0f0; padding: 20px; margin: 30px 0; border-radius: 5px;">
            <h2 style="color: #7C3AED; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h2>
          </div>
          <p style="color: #999; font-size: 12px;">This OTP expires in 10 minutes.</p>
          <a href="${process.env.FRONTEND_URL}" style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Open RentEase</a>
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999;">
            <p>© 2024 RentEase. All rights reserved.</p>
            <p><a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #7C3AED; text-decoration: none;">Unsubscribe</a></p>
          </div>
        </div>
      </div>
    `,
  }),
  welcomeNoOtp: (name) => ({
    subject: 'Welcome to RentEase',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px; text-align: center;">
          <h1 style="color: #7C3AED; margin: 0 0 20px 0;">Welcome to RentEase</h1>
          <p style="color: #666; font-size: 16px; margin: 20px 0;">Hi ${name},</p>
          <p style="color: #666; font-size: 14px; margin: 20px 0;">Thanks for registering with RentEase. Your account is ready to use.</p>
          <a href="${process.env.FRONTEND_URL}" style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Open RentEase</a>
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999;">
            <p>© 2024 RentEase. All rights reserved.</p>
            <p><a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #7C3AED; text-decoration: none;">Unsubscribe</a></p>
          </div>
        </div>
      </div>
    `,
  }),

  bookingRequest: (ownerName, renterName, listingTitle, startDate, endDate, amount) => ({
    subject: `New Booking Request for ${listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px;">
          <h1 style="color: #7C3AED; margin: 0 0 20px 0;">New Booking Request</h1>
          <p style="color: #666; font-size: 16px;">Hi ${ownerName},</p>
          <p style="color: #666; font-size: 14px;">You have received a new booking request!</p>
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #7C3AED; border-radius: 5px;">
            <p><strong>Listing:</strong> ${listingTitle}</p>
            <p><strong>Renter:</strong> ${renterName}</p>
            <p><strong>Check-in:</strong> ${new Date(startDate).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(endDate).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹${amount}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/my-bookings" style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">View Request</a>
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999;">
            <p>© 2024 RentEase. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  }),

  bookingOtp: (name, otp, listingTitle, startDate, endDate, amount) => ({
    subject: `Confirm Your Rental OTP for ${listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px; text-align: center;">
          <h1 style="color: #7C3AED; margin: 0 0 20px 0;">Verify Your Booking</h1>
          <p style="color: #666; font-size: 16px; margin: 20px 0;">Hi ${name},</p>
          <p style="color: #666; font-size: 14px; margin: 20px 0;">Use the OTP below to confirm your booking for ${listingTitle}.</p>
          <div style="background: #f0f0f0; padding: 20px; margin: 30px 0; border-radius: 5px;">
            <h2 style="color: #7C3AED; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h2>
          </div>
          <p style="color: #999; font-size: 12px;">Valid for 10 minutes.</p>
          <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; text-align: left;">
            <p><strong>Check-in:</strong> ${new Date(startDate).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(endDate).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹${amount}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/my-bookings" style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">View booking</a>
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999;">
            <p>© 2024 RentEase. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  }),

  bookingConfirmed: (renterName, listingTitle, ownerName, ownerPhone, startDate, endDate, bookingId) => ({
    subject: `Booking Confirmed - ${listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px;">
          <h1 style="color: #22c55e; margin: 0 0 20px 0; text-align: center;">✓ Booking Confirmed</h1>
          <p style="color: #666; font-size: 16px;">Hi ${renterName},</p>
          <p style="color: #666; font-size: 14px;">Your booking has been confirmed by the owner!</p>
          <div style="background: #f0fdf4; padding: 20px; margin: 20px 0; border-left: 4px solid #22c55e; border-radius: 5px;">
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Item:</strong> ${listingTitle}</p>
            <p><strong>Owner:</strong> ${ownerName}</p>
            <p><strong>Owner Phone:</strong> ${ownerPhone}</p>
            <p><strong>Check-in:</strong> ${new Date(startDate).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(endDate).toLocaleDateString()}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/my-bookings" style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">View Booking</a>
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999;">
            <p>© 2024 RentEase. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  }),

  bookingRejected: (renterName, listingTitle, reason) => ({
    subject: `Booking Rejected - ${listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px;">
          <h1 style="color: #ef4444; margin: 0 0 20px 0; text-align: center;">✗ Booking Rejected</h1>
          <p style="color: #666; font-size: 16px;">Hi ${renterName},</p>
          <p style="color: #666; font-size: 14px;">Unfortunately, your booking request has been rejected.</p>
          <div style="background: #fef2f2; padding: 20px; margin: 20px 0; border-left: 4px solid #ef4444; border-radius: 5px;">
            <p><strong>Item:</strong> ${listingTitle}</p>
            <p><strong>Reason:</strong> ${reason || 'No reason provided'}</p>
          </div>
          <p style="color: #666; font-size: 14px;">Try browsing similar listings on RentEase.</p>
          <a href="${process.env.FRONTEND_URL}/listings" style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Browse Listings</a>
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999;">
            <p>© 2024 RentEase. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  }),

  paymentSuccessful: (renterName, bookingId, listingTitle, amount) => ({
    subject: `Payment Successful - Booking Confirmed`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px;">
          <h1 style="color: #22c55e; margin: 0 0 20px 0; text-align: center;">✓ Payment Successful</h1>
          <p style="color: #666; font-size: 16px;">Hi ${renterName},</p>
          <p style="color: #666; font-size: 14px;">Your payment has been processed successfully!</p>
          <div style="background: #f0fdf4; padding: 20px; margin: 20px 0; border-left: 4px solid #22c55e; border-radius: 5px;">
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Item:</strong> ${listingTitle}</p>
            <p><strong>Amount Paid:</strong> ₹${amount}</p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">Transaction Date: ${new Date().toLocaleDateString()}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/my-bookings" style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">View Receipt</a>
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999;">
            <p>© 2024 RentEase. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  }),

  paymentReceived: (ownerName, renterName, bookingId, amount) => ({
    subject: `Payment Received - Payout Ready`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px;">
          <h1 style="color: #22c55e; margin: 0 0 20px 0; text-align: center;">✓ Payment Received</h1>
          <p style="color: #666; font-size: 16px;">Hi ${ownerName},</p>
          <p style="color: #666; font-size: 14px;">Payment has been received from a renter!</p>
          <div style="background: #f0fdf4; padding: 20px; margin: 20px 0; border-left: 4px solid #22c55e; border-radius: 5px;">
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Renter:</strong> ${renterName}</p>
            <p><strong>Amount Received:</strong> ₹${amount}</p>
            <p style="color: #999; font-size: 12px;">Payout will be processed within 2-3 business days.</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/my-bookings" style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">View Details</a>
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999;">
            <p>© 2024 RentEase. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  }),

  passwordReset: (name, resetLink) => ({
    subject: 'Reset Your RentEase Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px;">
          <h1 style="color: #7C3AED; margin: 0 0 20px 0;">Password Reset</h1>
          <p style="color: #666; font-size: 16px;">Hi ${name},</p>
          <p style="color: #666; font-size: 14px;">Click the button below to reset your password:</p>
          <a href="${resetLink}" style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reset Password</a>
          <p style="color: #999; font-size: 12px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999;">
            <p>© 2024 RentEase. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  }),

  newMessage: (name, senderName, listingTitle, messagePreview) => ({
    subject: `New Message from ${senderName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px;">
          <h1 style="color: #7C3AED; margin: 0 0 20px 0;">New Message</h1>
          <p style="color: #666; font-size: 16px;">Hi ${name},</p>
          <p style="color: #666; font-size: 14px;">${senderName} sent you a message about "${listingTitle}":</p>
          <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #7C3AED; border-radius: 5px;">
            <p style="color: #666; font-style: italic;">"${messagePreview.substring(0, 100)}..."</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/chat" style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reply Now</a>
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999;">
            <p>© 2024 RentEase. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  }),

  reviewReceived: (name, reviewerName, rating, comment) => ({
    subject: `New Review from ${reviewerName} - ${rating} stars`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px;">
          <h1 style="color: #7C3AED; margin: 0 0 20px 0;">New Review Received</h1>
          <p style="color: #666; font-size: 16px;">Hi ${name},</p>
          <p style="color: #666; font-size: 14px;">${reviewerName} left a review:</p>
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #fbbf24; border-radius: 5px;">
            <p style="color: #fbbf24; font-size: 18px; margin: 0 0 10px 0;">★★★★★</p>
            <p style="color: #666;">"${comment}"</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/profile" style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">View Review</a>
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999;">
            <p>© 2024 RentEase. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  }),

  bookingCancelled: (name, listingTitle, reason) => ({
    subject: `Booking Cancelled - ${listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 20px;">
        <div style="background: white; border-radius: 10px; padding: 30px;">
          <h1 style="color: #f59e0b; margin: 0 0 20px 0;">Booking Cancelled</h1>
          <p style="color: #666; font-size: 16px;">Hi ${name},</p>
          <p style="color: #666; font-size: 14px;">Your booking has been cancelled.</p>
          <div style="background: #fffbeb; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b; border-radius: 5px;">
            <p><strong>Item:</strong> ${listingTitle}</p>
            <p><strong>Reason:</strong> ${reason || 'No reason provided'}</p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">Your deposit will be refunded within 5-7 business days.</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/listings" style="background: linear-gradient(135deg, #7C3AED, #2563EB); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Browse Listings</a>
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999;">
            <p>© 2024 RentEase. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  }),
};

export const sendEmail = async (to, templateName, data) => {
  try {
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template "${templateName}" not found`);
    }

    const emailContent = template(...Object.values(data));

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      ...emailContent,
    });

    console.log(`Email sent to ${to} using template: ${templateName}`);
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
    throw error;
  }
};

export default sendEmail;
