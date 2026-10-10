CAMPUSMATE student registration prototype

Files added:
- register.html: registration form UI
- register.css: registration page styles
- register.js: client-side validation only

Also updated index.html to add a "Create an account" link.

IMPORTANT:
This does NOT create a real student account or verify email ownership. Do not collect real student data with this prototype yet. The next step is a PHP backend endpoint connected to the approved database. The server should validate the @rtu.edu.ph domain, verify the student against authorized records, hash passwords using PHP password_hash(), store an expiring one-time email verification token, send the verification email, and only allow verified accounts to sign in using PHP sessions. Do not store passwords in localStorage or JavaScript.

To preview: keep all files in the same folder and open index.html, then click "Create an account". Internet access is needed for Tailwind, Font Awesome, and Google Fonts CDN assets.
