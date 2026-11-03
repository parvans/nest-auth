export function verifyEmailTemplate(verificationUrl: string) {
  return `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f5f7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #333333;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 580px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }
    .header {
      background-color: #111827;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 32px 30px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0;
    }
    .btn {
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      display: inline-block;
    }
    .alt-link {
      font-size: 13px;
      color: #6b7280;
      word-break: break-all;
    }
    .footer {
      border-top: 1px solid #f3f4f6;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      background-color: #fafafa;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Nest App</h1>
    </div>
    <div class="content">
      <div class="greeting">Hi User,</div>
      <p>Please click the button below to verify your email address and activate your account:</p>
      
      <div class="btn-container">
        <a href="${verificationUrl}" class="btn" target="_blank">Verify Email Address</a>
      </div>

      <p style="font-size: 14px; color: #4b5563;">
        This link will expire in 24 hours.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      
      <p class="alt-link">
        If the button above does not work, copy and paste this link into your browser:<br />
        <a href="${verificationUrl}" style="color: #2563eb;">${verificationUrl}</a>
      </p>
    </div>
    <div class="footer">
      &copy; 2026 Nest App, Inc. All rights reserved.
    </div>
  </div>
</body>
</html>
        `;
}

export function resetPasswordTemplate(resetUrl: string) {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f5f7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #333333;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 580px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }
    .header {
      background-color: #111827;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 32px 30px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0;
    }
    .btn {
      background-color: #dc2626; /* Warning red color for password reset */
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      display: inline-block;
    }
    .warning-box {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 12px 16px;
      margin: 20px 0;
      font-size: 14px;
      color: #991b1b;
      border-radius: 4px;
    }
    .alt-link {
      font-size: 13px;
      color: #6b7280;
      word-break: break-all;
    }
    .footer {
      border-top: 1px solid #f3f4f6;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      background-color: #fafafa;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>YourApp</h1>
    </div>
    <div class="content">
      <div class="greeting">Hi User,</div>
      <p>We received a request to reset your password. Click the button below to choose a new password:</p>
      
      <div class="btn-container">
        <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
      </div>

      <div class="warning-box">
        <strong>Security Notice:</strong> This link is valid for <strong>15 minutes</strong>. If you did not request a password reset, you can safely ignore this email; your password will remain unchanged.
      </div>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      
      <p class="alt-link">
        If the button above doesn't work, copy and paste this link into your browser:<br />
        <a href="${resetUrl}" style="color: #dc2626;">${resetUrl}</a>
      </p>
    </div>
    <div class="footer">
      &copy; 2026 Nest App, Inc. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;
}
