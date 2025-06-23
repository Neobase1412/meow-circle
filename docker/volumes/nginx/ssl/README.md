# Nginx 配置說明

## Demo 項目配置

此配置適用於 Demo 項目，使用 HTTP 協議通過 IP 地址訪問。

## 當前配置特點

- **HTTP Only**: 僅使用 80 端口，無需 SSL 證書
- **IP 訪問**: 支持通過 `http://<GCP-IP>` 訪問
- **反向代理**: 
  - Next.js 應用: `web:3000`
  - Supabase API: `kong:8000`
  - Supabase Studio: `studio:3000`
- **靜態文件優化**: 對 `_next/static/` 和 `/images/` 進行緩存

## 訪問方式

### 對外開放的服務
- **主應用**: `http://<GCP-IP>/` (通過 Nginx 代理到 Next.js)
- **Supabase Dashboard**: `http://<GCP-IP>/studio/` (通過 Nginx 代理到 Studio)

### 內部服務 (不對外開放)
- **Supabase API**: 僅供 Next.js 應用內部調用，不允許外部直接訪問

## 部署到 GCP

1. 確保 GCP 機器的防火牆開放端口：
   - **80** (Nginx - 唯一對外端口)
2. 運行 `docker compose up -d`
3. 訪問 `http://<GCP-IP>` 使用應用

## 如需啟用 HTTPS

如果將來需要域名和 HTTPS，可以：
1. 修改 nginx 配置添加 SSL
2. 使用 Let's Encrypt 或 GCP Load Balancer
3. 更新 docker-compose.yml 開放 443 端口