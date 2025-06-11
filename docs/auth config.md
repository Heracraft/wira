Goes over the config options required for the project to function as expected.
Last updated: Jun 10th 2025.

---

## URL Configuration

**Site URL**

https://wira-five.vercel.app //or whatever it is

**Redirect URLs**
- http://localhost:3000/auth/callback/**

- http://localhost:3000/auth/callback

- https://wira-five.vercel.app/callback

- https://wira-five.vercel.app/callback**

## Emails

### Confirm signup

**Subject heading**: Confirm Your Signup

**Source**

```html
<h4>Confirm your email address to start connecting through wira</h4>

Welcome to WIra! We're excited to have you join our talent network. Before you can access your account, we need to verify your email address.

Please confirm your email by clicking the button below:
<br/>
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}"
   style="display: inline-block; padding: 10px 20px; background-color: #6068E7; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s ease; margin-top:1rem;margin-bottom:1rem">
  Verify My Email
</a>
<br/>
If the button doesn’t work, you can also copy and paste this link into your browser:
<p>{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}</p>

This verification helps us keep your account secure and ensures you receive important updates. 

If you didn’t sign up for WIra, you can ignore this email.

```

### Reset password

**Reset Your Password**

**Source**

```html
<h4>Reset your password to continue using Wira</h4>

We received a request to reset your password. If you made this request, you can set a new password by clicking the button below:

<br/>
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}"
   style="display: inline-block; padding: 10px 20px; background-color: #6068E7; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s ease; margin-top:1rem;margin-bottom:1rem">
  Reset My Password
</a>
<br/>
If the button doesn’t work, you can also copy and paste this link into your browser:
<p>{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}</p>

For your security, this link will expire shortly. If you did not request a password reset, you can safely ignore this email and your account will remain unchanged.

Thanks for being part of the Wira community!

```