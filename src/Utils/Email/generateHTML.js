export const template = (code, firstName, subject) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${subject}</title>
</head>

<body style="margin:0; padding:0; background-color:#eef2f7; font-family: Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef2f7; padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #2563eb, #1e40af); padding:28px; text-align:center;">
              <h1 style="margin:0; font-size:26px; color:#ffffff; letter-spacing:0.5px;">
                Sara7a Application
              </h1>
              <p style="margin:6px 0 0; font-size:14px; color:#dbeafe;">
                Secure Account Verification
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px; color:#111827; font-size:16px; line-height:1.7;">

              <p style="margin-top:0;">
                Hello <strong>${firstName}</strong>,
              </p>

              <p>
                We received a request to create a new account on
                <strong>Sara7a Application</strong>.
                Please confirm your email address using the verification code below.
              </p>

              <!-- OTP Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td align="center">
                    <div style="
                      background-color:#f8fafc;
                      border:1px solid #e5e7eb;
                      border-radius:10px;
                      padding:22px 28px;
                      display:inline-block;
                    ">
                      <p style="margin:0 0 8px; font-size:14px; color:#6b7280;">
                        Your Verification Code
                      </p>
                      <span style="
                        font-size:34px;
                        font-weight:bold;
                        letter-spacing:6px;
                        color:#2563eb;
                        display:block;
                      ">
                        ${code}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin-bottom:0;">
                This code is valid for a limited time and should not be shared with anyone.
                If you did not request this verification, you can safely ignore this email.
              </p>

              <!-- Divider -->
              <hr style="border:none; border-top:1px solid #e5e7eb; margin:32px 0;">

              <p style="font-size:14px; color:#374151;">
                Need help? Contact our support team anytime.
              </p>

              <p style="margin-top:24px;">
                Best regards,<br/>
                <strong>Sara7a Application Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb; padding:18px; text-align:center; font-size:12px; color:#6b7280;">
              <p style="margin:4px 0;">
                © 2024 Sara7a Application. All rights reserved.
              </p>
              <p style="margin:4px 0;">
                <a href="[PrivacyPolicyLink]" style="color:#2563eb; text-decoration:none;">Privacy Policy</a>
                &nbsp;•&nbsp;
                <a href="[TermsLink]" style="color:#2563eb; text-decoration:none;">Terms of Service</a>
                &nbsp;•&nbsp;
                <a href="[SupportLink]" style="color:#2563eb; text-decoration:none;">Support</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- End Container -->

      </td>
    </tr>
  </table>

</body>
</html>
`;
