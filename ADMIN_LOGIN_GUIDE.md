# Admin Login Guide

## How Admin Authentication Works

In this application, admin users are identified by having `role = 1` in the database. By default, all newly registered users have `role = 1`, which means they are admins.

## How to Login as Admin

### Method 1: Login with Existing Admin Account

1. **Go to the Login Page**: Navigate to `/login` in your application
2. **Enter Credentials**: 
   - Email: Your registered email address
   - Password: Your password
3. **Click Submit**: The system will automatically check if you have admin privileges (`role = 1`)
4. **Access Admin Dashboard**: If you're an admin, you'll be able to access admin routes like `/admin/dashboard`

### Method 2: Make an Existing User an Admin

If you have a user account that isn't an admin, you can make them an admin using the API endpoint:

**Using cURL:**
```bash
curl -X PUT http://localhost:5000/api/v1/auth/set-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Using Postman or similar:**
- Method: `PUT`
- URL: `http://localhost:5000/api/v1/auth/set-admin`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "email": "user@example.com"
}
```

**Using JavaScript/Fetch:**
```javascript
fetch('http://localhost:5000/api/v1/auth/set-admin', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Method 3: Direct Database Update (MongoDB)

If you have direct access to MongoDB:

```javascript
// In MongoDB shell or MongoDB Compass
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: 1 } }
)
```

## Important Notes

1. **Default Role**: New users are created with `role = 1` by default, making them admins automatically.

2. **Role Values**:
   - `role = 1`: Admin user (can access admin routes)
   - `role ≠ 1`: Regular user (cannot access admin routes)

3. **Security Warning**: The `/set-admin` endpoint is currently unprotected. In production, you should:
   - Protect it with authentication
   - Only allow super admins to use it
   - Or remove it and use direct database updates

4. **Admin Routes**: Admin routes are protected by the `isAdmin` middleware which checks if `user.role === 1`.

## Testing Admin Access

After logging in, you can test if you have admin access by:
1. Navigating to admin routes (e.g., `/admin/dashboard`)
2. The `AdminRoute` component will automatically check your admin status via `/api/v1/auth/admin-auth`

## Troubleshooting

If you can't access admin routes:
1. Check if your user has `role = 1` in the database
2. Make sure you're logged in (check localStorage for auth token)
3. Verify the server is running and the database connection is working
4. Check browser console for any error messages

