<<<<<<< HEAD
# Bot-dashbord
=======
# Placement Dashboard

Simple Express app that serves `index.html`, accepts a CSV upload, and exposes the latest uploaded file at `/data`.

## Local run

```bash
npm install
npm start
```

App starts on `http://localhost:3000` by default.

## Environment variables

- `PORT` - server port. Default: `3000`
- `HOST` - bind host. Default: `0.0.0.0`

## Deploy on Ubuntu server

### 1. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

### 2. Upload project to server

Copy the project to a directory such as:

```bash
/var/www/placement-dashboard
```

Then install dependencies:

```bash
cd /var/www/placement-dashboard
npm install --production
```

### 3. Run with PM2

```bash
sudo npm install -g pm2
cd /var/www/placement-dashboard
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Optional: reverse proxy with Nginx

Create `/etc/nginx/sites-available/placement-dashboard`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/placement-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Health check

After deploy, verify:

```bash
curl http://127.0.0.1:3000/health
```

Expected response:

```json
{"ok":true}
```

>>>>>>> f7b7b30 (Save current changes before pull)
