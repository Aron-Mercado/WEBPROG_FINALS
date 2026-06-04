# Food Ordering System

React frontend + PHP REST API + MySQL.

## Before you run (required)

### 1. Backend secrets

```text
copy backend\.env.example backend\.env
```

Edit `backend/.env` and set your MySQL password:

```env
DB_PASS=your_mysql_password
```

Do **not** put passwords in `database.php` or commit `backend/.env`.

### 2. Frontend API URL

```text
copy frontend\finalsFrontEnd\.env.example frontend\finalsFrontEnd\.env
```

Set `VITE_API_BASE` to your API (XAMPP example):

```env
VITE_API_BASE=http://localhost/php/Finals/backend/public/api
```

Restart `npm run dev` after changing `.env`.

### 3. Database

Import `backend/sample_data.sql` in phpMyAdmin, or use your existing `food_delivery` database.

If `orders` has no `status` column, run `database/migrations/001_add_orders_status.sql`.

## Run locally

1. Start MySQL (XAMPP).
2. API via Apache: project under `htdocs`, open the `backend/public` URL path above.
3. Frontend:

```powershell
cd frontend\finalsFrontEnd
npm install
npm run dev
```

## GitHub checklist

| Commit | Do not commit |
|--------|----------------|
| Source code | `backend/.env`, `frontend/finalsFrontEnd/.env` |
| `*.env.example` files | `database/*export*.sql` (real user data) |
| `backend/sample_data.sql` | Plaintext passwords in SQL dumps |

Set `APP_DEBUG=false` on any shared server. Set `CORS_ORIGIN` to your real frontend URL.

## API

- `POST /api/register`, `POST /api/login`
- `GET /api/products` (`?archived=1` for managers)
- `POST|PUT|DELETE /api/products/{id}` (manager)
- `GET|POST /api/orders`, `PUT /api/orders/status/{id}` (manager)

Sample manager user is in `sample_data.sql` (bcrypt hash only — change password locally after import).
