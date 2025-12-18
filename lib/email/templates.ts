export const verificationEmailTemplate = (url: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 10px 20px; background-color: #0A251D; color: white; text-decoration: none; border-radius: 5px; }
    .footer { margin-top: 20px; font-size: 0.8em; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Verify your email address</h1>
    <p>Welcome to CourseHub! Please click the button below to verify your email address:</p>
    <p><a href="${url}" class="button">Verify Email</a></p>
    <p>Or copy and paste this link into your browser:</p>
    <p>${url}</p>
    <div class="footer">
      <p>If you didn't create an account, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>
`;

export const passwordResetEmailTemplate = (url: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 10px 20px; background-color: #0A251D; color: white; text-decoration: none; border-radius: 5px; }
    .footer { margin-top: 20px; font-size: 0.8em; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset your password</h1>
    <p>We received a request to reset your password. Click the button below to choose a new one:</p>
    <p><a href="${url}" class="button">Reset Password</a></p>
    <p>Or copy and paste this link into your browser:</p>
    <p>${url}</p>
    <div class="footer">
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>
`;

export const passwordChangedEmailTemplate = () => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .footer { margin-top: 20px; font-size: 0.8em; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Changed</h1>
    <p>Your CourseHub account password was recently changed. If you made this change, you can safely ignore this email.</p>
    <p><strong>If you did not change your password, please contact support immediately or reset your password.</strong></p>
    <div class="footer">
      <p>This is an automated security notification.</p>
    </div>
  </div>
</body>
</html>
`;

export const notificationPreferenceChangedEmailTemplate = () => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .footer { margin-top: 20px; font-size: 0.8em; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Notification Preferences Updated</h1>
    <p>Your notification preferences on CourseHub have been updated.</p>
    <p>If you didn't make this change, please check your account settings.</p>
    <div class="footer">
      <p>This is an automated notification.</p>
    </div>
  </div>
</body>
</html>
`;
