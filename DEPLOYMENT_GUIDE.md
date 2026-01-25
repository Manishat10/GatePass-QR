# GatePass-QR Deployment Guide

This guide describes how to deploy the GatePass-QR application.
- **Backend**: Deployed to [Render](https://render.com/).
- **Frontend**: Deployed to [Vercel](https://vercel.com/).

## 1. Prerequisites
- A **GitHub** account.
- The project code pushed to a GitHub repository.
- Accounts on **Render** and **Vercel**.

---

## 2. Deploy Backend to Render

1.  **Log in to Render** and go to your [Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Blueprints**.
3.  Connect your **GitHub repository**.
4.  Render will detect the `render.yaml` file in the root.
5.  **Service Name**: `gatepass-qr-backend` (or your preferred name).
6.  **Environment Variables**:
    -   You will be prompted to enter values for `MONGODB_URI` and `FRONTEND_BASE_URL`.
    -   **MONGODB_URI**: Your production MongoDB connection string (e.g., from MongoDB Atlas).
    -   **FRONTEND_BASE_URL**: Leave this blank for now (we will update it after deploying the frontend).
    -   `JWT_SECRET`: Render will auto-generate this because of the `generateValue: true` setting in `render.yaml`.
7.  Click **Apply**.
8.  Wait for the deployment to finish. Once live, **copy the Backend URL** (e.g., `https://gatepass-qr-backend.onrender.com`).

---

## 3. Deploy Frontend to Vercel

1.  **Log in to Vercel** and go to your [Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your **GitHub repository**.
4.  **Configure Project**:
    -   **Root Directory**: Click `Edit` and select `frontend`. **This is crucial.**
    -   **Framework Preset**: It should auto-detect "Create React App".
    -   **Environment Variables**:
        -   Name: `REACT_APP_API_URL`
        -   Value: The **Backend URL** you copied from Render (e.g., `https://gatepass-qr-backend.onrender.com/api`).
        -   *Note: Make sure to append `/api` if your backend routes are prefixed with it (check `backend/server.js` or `backend/routes`). Looking at your code, routes seem to be mounted directly or via convention. Check if your axios calls in frontend use `/api` prefix. IF your `frontend/env.example.txt` says `http://localhost:5000/api`, then yes, append `/api`.*
5.  Click **Deploy**.
6.  Wait for the deployment to finish. Once live, **copy the Frontend URL** (e.g., `https://gatepass-qr-frontend.vercel.app`).

---

## 4. Final Configuration

Now that you have the Frontend URL, you need to tell the Backend about it (for CORS).

1.  Go back to your **Render Dashboard**.
2.  Select your `gatepass-qr-backend` service.
3.  Go to **Environment**.
4.  Find `FRONTEND_BASE_URL` and click **Edit**.
5.  Paste your **Frontend URL** (from Vercel).
6.  Click **Save Changes**. Render will automatically restart your service to apply the new variable.

---

## 5. Verification

1.  Open your **Vercel Frontend URL**.
2.  Try to log in or register.
3.  If everything works, you have successfully deployed your application!

> [!IMPORTANT]
> **MongoDB Access**: If you are using MongoDB Atlas, make sure to **whitelist IP 0.0.0.0/0** (or Render's IP ranges) in your Atlas Network Access settings so Render can connect to your database.
