# Project Proof of Work

**Author:** Engr. Sunday Adams Omale  
**Project:** High-availability-static-site-and-Fortress-web-server  
**Date Completed:** April 2026

---
"A mental model overview for both projects.

Project 1 is all about storage and delivery. Think of Amazon S3 as a hard drive in the cloud. You put your website files in it. But instead of letting anyone access that hard drive directly, you put a bouncer in front called CloudFront. CloudFront is a Content Delivery Network — it caches your files at over 400 locations around the world, so when someone in Tokyo visits your site, they're not waiting for a server in Virginia to respond. They get it from Tokyo. Instantly.

The clever part is that we're going to make the S3 bucket completely private. Not even a direct URL will work. The only way to reach your files is through CloudFront. That's called Origin Access Control, and it's a security pattern every cloud engineer should know.

Project 2 is about networking and compute. We build a Virtual Private Cloud — your own isolated network inside AWS. Inside that network, we run a Linux server with Nginx, add an SSL certificate so the site runs on HTTPS, and then we protect the whole thing with a Load Balancer and Auto Scaling Group. The servers are completely hidden from the internet. They can't be reached directly. Period.

# ☁️ AWS Cloud Engineering Projects — From Zero to Production

> **Level:** Beginner → Intermediate  
> **Stack:** AWS S3 · CloudFront · VPC · EC2 · ALB · Auto Scaling · Route 53 · ACM · Nginx · Certbot

---

## 📋 Table of Contents

1. [Project 1 — High-Availability Static Site](#project-1--high-availability-static-site)
2. [Project 2 — The Fortress Web Server](#project-2--the-fortress-web-server)
3. [Key Concepts Glossary](#key-concepts-glossary)
4. [Prerequisites](#prerequisites)
5. [Cost Estimates](#cost-estimates)

---

## Prerequisites

Before starting, ensure you have:

- An **AWS Account** (Free Tier works for both projects)
- **AWS CLI** installed and configured
- A **domain name** (optional for Project 1, recommended for Project 2)
- Basic understanding of the **Linux command line**

```bash
# Verify AWS CLI is installed
aws --version

# Configure your credentials
aws configure
# AWS Access Key ID: [your key]
# AWS Secret Access Key: [your secret]
# Default region: us-east-1
# Default output format: json
```

---

## Project 1 — High-Availability Static Site

### 🎯 Goal
Master **Amazon S3** (storage), **CloudFront** (CDN), and **DNS** by hosting a professional portfolio or business landing page that loads in milliseconds, anywhere in the world.

### 🧠 What You'll Learn (In Plain English)

| AWS Service | What It Is | Real-World Analogy |
|---|---|---|
| **S3 Bucket** | A folder in the cloud that stores files | A USB drive in the sky |
| **Static Website** | HTML/CSS/JS files served without a server | A magazine — print once, distribute everywhere |
| **CloudFront (CDN)** | A network of servers worldwide that cache your site | McDonald's franchises — same product, near you |
| **Origin Access Control** | Locks S3 so only CloudFront can read it | A VIP backstage pass |
| **Route 53** | AWS DNS — maps domain names to IP addresses | The internet's phone book |

### 🏗️ Architecture

```
User (Any Country)
        │
        ▼
 ┌─────────────────────┐
 │    CloudFront CDN   │  ← Nearest edge location worldwide
 │    Distribution     │    e.g. Johannesburg, London, NYC
 └──────────┬──────────┘
            │  Only CloudFront can access S3
            ▼
 ┌─────────────────────┐
 │    S3 Bucket        │  ← Private. No public access.
 │    (Private)        │    index.html, style.css, images/
 └─────────────────────┘
            ↑
    Origin Access Control (OAC)
    enforces this restriction
```

### 📁 Step-by-Step Implementation

#### Step 1 — Create Your Website Files

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Hello, World 🌍</h1>
  <p>My AWS-powered portfolio is live!</p>
</body>
</html>
```

```css
/* style.css */
body {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #f5f5f5;
}
h1 { color: #232f3e; }
```

#### Step 2 — Create an S3 Bucket

1. Go to **AWS Console** → Search "S3" → Click **Create bucket**
2. **Bucket name:** `my-portfolio-2024` *(must be globally unique)*
3. **Region:** `us-east-1`
4. **Block all public access:** ✅ Keep ENABLED (CloudFront handles access)
5. Click **Create bucket**

```bash
# CLI alternative
aws s3 mb s3://my-portfolio-2024 --region us-east-1
```

#### Step 3 — Enable Static Website Hosting

1. Open your bucket → **Properties** tab
2. Scroll to **Static website hosting** → Click **Edit**
3. Select **Enable**
4. **Index document:** `index.html`
5. **Error document:** `error.html`
6. Click **Save changes**

#### Step 4 — Upload Your Files

```bash
# Upload all files in your website folder
aws s3 sync ./website s3://my-portfolio-2024

# Or upload individual files
aws s3 cp index.html s3://my-portfolio-2024/
aws s3 cp style.css s3://my-portfolio-2024/
```

#### Step 5 — Create a CloudFront Distribution

1. Go to **CloudFront** → **Create Distribution**
2. **Origin Domain:** Select your S3 bucket
3. **Origin Access:** Select **Origin Access Control (OAC)**
   - Click **Create new OAC** → Use defaults → Create
4. **Viewer Protocol Policy:** Redirect HTTP to HTTPS
5. **Default root object:** `index.html`
6. Click **Create Distribution**

> ⚠️ CloudFront will show a banner — copy the S3 bucket policy it provides.

#### Step 6 — Update S3 Bucket Policy

1. Go to your **S3 bucket** → **Permissions** → **Bucket Policy** → **Edit**
2. Paste the policy CloudFront generated:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-portfolio-2024/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DIST_ID"
        }
      }
    }
  ]
}
```

3. Click **Save changes**

#### Step 7 — Test Your Site

- Wait ~10 minutes for CloudFront to deploy
- Visit your CloudFront URL: `https://d1um9xjttzmmpf.cloudfront.net/`
- ✅ Your site is live worldwide!

#### Step 8 (Optional) — Custom Domain

```
1. AWS Certificate Manager (ACM) → Request public cert
   → Add domain: yourdomain.com, www.yourdomain.com
   → DNS validation (click "Create CNAME in Route 53")

2. CloudFront distribution → Edit
   → Alternate domain name: yourdomain.com
   → Custom SSL certificate: [your ACM cert]

3. Route 53 → Hosted zone → Create A record
   → Alias → CloudFront distribution
```

### ✅ Project 1 Checklist

- [ ] S3 bucket created with public access BLOCKED
- [ ] HTML/CSS files uploaded
- [ ] Static website hosting enabled
- [ ] CloudFront distribution created
- [ ] Origin Access Control (OAC) configured
- [ ] S3 bucket policy updated to allow only CloudFront
- [ ] Site accessible via CloudFront URL (https)
- [ ] (Optional) Custom domain connected via Route 53

---

## Project 2 — The Fortress Web Server

### 🎯 Goal
Master **VPC** (networking), **Security Groups** (firewall), **EC2** (compute), **SSL**, and **Auto Scaling** — deploying a production-grade, highly available web server the way real enterprises do it.

### 🧠 What You'll Learn (In Plain English)

| Concept | What It Is | Analogy |
|---|---|---|
| **VPC** | Your private section of the AWS cloud | A gated estate |
| **Public Subnet** | Network with internet access | The driveway/front gate |
| **Private Subnet** | Network with NO direct internet access | The house inside the estate |
| **Internet Gateway** | Connects VPC to the internet | The main estate gate |
| **EC2 Instance** | A virtual Linux server | A rented computer in a data center |
| **Security Group** | A stateful firewall for EC2 | A bouncer at the door |
| **ALB** | Distributes traffic across multiple servers | A traffic warden |
| **Auto Scaling** | Adds/removes servers based on load | Hiring more staff when busy |
| **Nginx** | Web server software | The receptionist who serves pages |
| **Certbot / ACM** | Issues SSL certificates | The lock on your front door |

### 🏗️ Full Architecture

```
         Internet
              │
              ▼
 ┌────────────────────────────────────────────┐
 │              VPC (10.0.0.0/16)              │
 │   ┌──────────────────────────────────────┐  │
 │   │          Internet Gateway            │  │
 │   └──────────────┬───────────────────────┘  │
 │                  │                           │
 │   ┌──────────────▼───────────────────────┐  │
 │   │  PUBLIC SUBNETS (AZ-a + AZ-b)        │  │
 │   │                                      │  │
 │   │  ┌────────────────────────────────┐  │  │
 │   │  │   Application Load Balancer    │  │  │
 │   │  │   Port 80 → redirect to 443    │  │  │
 │   │  │   Port 443 + ACM SSL Cert      │  │  │
 │   │  └───────────────┬────────────────┘  │  │
 │   └──────────────────┼───────────────────┘  │
 │                      │                       │
 │   ┌──────────────────▼───────────────────┐  │
 │   │  PRIVATE SUBNETS (AZ-a + AZ-b)       │  │
 │   │                                      │  │
 │   │  ┌──────────────┐ ┌──────────────┐   │  │
 │   │  │  EC2 (AZ-a)  │ │  EC2 (AZ-b)  │   │  │
 │   │  │  Nginx+SSL   │ │  Nginx+SSL   │   │  │
 │   │  └──────────────┘ └──────────────┘   │  │
 │   │         Auto Scaling Group            │  │
 │   │         Min: 1 | Desired: 2 | Max: 4  │  │
 │   └──────────────────────────────────────┘  │
 └────────────────────────────────────────────┘
```

### 📁 Step-by-Step Implementation

#### Step 1 — Create a Custom VPC

1. **AWS Console** → Search "VPC" → **Create VPC**
2. Select **VPC and more**
3. Configure:
   - **Name tag:** `fortress-vpc`
   - **IPv4 CIDR:** `10.0.0.0/16`
   - **Number of AZs:** `2`
   - **Public subnets:** `2`
   - **Private subnets:** `2`
   - **NAT gateways:** `None` (add later if needed)
4. Click **Create VPC**

```bash
# CLI
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=fortress-vpc}]'
```

#### Step 2 — Create Security Groups

**ALB Security Group (public-facing):**

| Type | Protocol | Port | Source |
|---|---|---|---|
| HTTP | TCP | 80 | 0.0.0.0/0 |
| HTTPS | TCP | 443 | 0.0.0.0/0 |

**EC2 Security Group (private — only accepts from ALB):**

| Type | Protocol | Port | Source |
|---|---|---|---|
| HTTP | TCP | 80 | `alb-sg` (SG ID) |
| SSH | TCP | 22 | Your IP only (x.x.x.x/32) |

> 🔐 EC2 instances NEVER accept direct internet traffic — only from the load balancer.

#### Step 3 — Launch EC2 Instance with User Data

1. **EC2** → **Launch Instance**
2. Configuration:
   - **AMI:** Amazon Linux 2023 (free tier)
   - **Instance type:** `t2.micro`
   - **Key pair:** Create new → Download `.pem`
   - **VPC:** `fortress-vpc`
   - **Subnet:** Public subnet (temporarily)
   - **Security group:** `ec2-sg`

3. **User Data script** (runs automatically on first boot):

```bash
#!/bin/bash
# System update
yum update -y

# Install Nginx
yum install -y nginx

# Enable and start Nginx
systemctl enable nginx
systemctl start nginx

# Custom index page
cat > /usr/share/nginx/html/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>The Fortress</title>
  <style>
    body { font-family: Arial, sans-serif; background: #0d1117; color: #c9d1d9; 
           display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
    .card { background: #161b22; border: 1px solid #30363d; border-radius: 12px; 
            padding: 40px; text-align: center; max-width: 500px; }
    h1 { color: #58a6ff; font-size: 2rem; margin-bottom: 10px; }
    .badge { background: #238636; color: white; padding: 4px 12px; 
             border-radius: 20px; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🔐 The Fortress</h1>
    <p>AWS EC2 + Nginx + SSL</p>
    <span class="badge">✅ Server is Healthy</span>
    <p style="margin-top:20px; color:#8b949e; font-size:0.9rem;">
      Running behind ALB + Auto Scaling Group
    </p>
  </div>
</body>
</html>
EOF

# Install Certbot (for SSL if using a domain without ALB)
yum install -y python3-certbot-nginx
```

#### Step 4 — Verify Nginx

```bash
# SSH into instance
chmod 400 your-key.pem
ssh -i your-key.pem ec2-user@YOUR_PUBLIC_IP

# Check status
sudo systemctl status nginx

# Test
curl http://localhost
```

#### Step 5 — Install SSL Certificate

**Option A: Certbot (standalone Nginx, no ALB)**

```bash
# Ensure your domain points to the EC2 IP first
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run

# Renewal is automatic — certbot installs a cron job
```

**Option B: AWS Certificate Manager (recommended with ALB)**

```
AWS Console → Certificate Manager (ACM)
→ Request → Public certificate
→ Add: yourdomain.com, *.yourdomain.com
→ DNS Validation
→ "Create records in Route 53" (automatic)
→ Wait for "Issued" (~5 minutes)
```

You attach this cert to the ALB listener in Step 7 — zero-touch renewal, fully managed.

#### Step 6 — Configure Nginx for Production

```bash
sudo nano /etc/nginx/conf.d/fortress.conf
```

```nginx
# HTTP → HTTPS redirect
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (Certbot path)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Modern SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Web root
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

```bash
sudo nginx -t       # Test config
sudo systemctl reload nginx
```

#### Step 7 — Create Application Load Balancer (ALB)

1. **EC2** → **Load Balancers** → **Create Load Balancer** → **Application Load Balancer**
2. Configure:
   - **Name:** `fortress-alb`
   - **Scheme:** Internet-facing
   - **VPC:** `fortress-vpc`
   - **Subnets:** Both public subnets (AZ-a and AZ-b)
   - **Security group:** `alb-sg`

3. **Listeners:**
   - Port 80 → Redirect to HTTPS (301)
   - Port 443 → Forward to target group

4. **Create Target Group:**
   - Type: Instances
   - Protocol: HTTP, Port 80
   - VPC: `fortress-vpc`
   - Health check path: `/`
   - Register your EC2 instances

5. **SSL on Port 443:**
   - Select your ACM certificate

6. Click **Create load balancer**

#### Step 8 — Auto Scaling Group

**Create Launch Template:**

1. EC2 → **Launch Templates** → **Create**
2. Same AMI, instance type, security group, and user data as before
3. Do NOT assign public IP (private subnet instances)

**Create Auto Scaling Group:**

1. EC2 → **Auto Scaling Groups** → **Create**
2. Select your launch template
3. **Network:** `fortress-vpc` → Private subnets (both AZs)
4. **Load balancer:** Attach to ALB target group
5. **Group size:**
   - Minimum capacity: `1`
   - Desired capacity: `2`
   - Maximum capacity: `4`
6. **Scaling policy:** Target tracking → CPU utilization → 70%
7. Create!

AWS will now:
- Maintain 2 running instances at all times
- Add more when CPU > 70%
- Remove instances when load drops
- Replace unhealthy instances automatically

#### Step 9 — Move EC2 to Private Subnet

1. Stop your EC2 instance
2. **Actions** → **Instance Settings** → Modify subnet
3. Select a **private subnet**
4. Remove public IP association
5. Start instance

> ✅ Your server is now invisible to the internet. Only the ALB can reach it.

#### Step 10 — Connect Domain to ALB

In **Route 53** (or your DNS provider):

```
Type: A Record
Name: yourdomain.com
Value: Alias → Application and Classic Load Balancer → [your ALB]

Type: CNAME
Name: www
Value: yourdomain.com
```

Wait 2-5 minutes for DNS propagation, then visit `https://yourdomain.com` ✅

### ✅ Project 2 Checklist

- [ ] Custom VPC with public + private subnets created
- [ ] Internet Gateway attached
- [ ] Security groups created (ALB: public; EC2: only from ALB)
- [ ] EC2 launched with Nginx user data script
- [ ] Nginx running and serving custom page
- [ ] SSL certificate installed (Certbot or ACM)
- [ ] Nginx configured with HTTPS + security headers
- [ ] Application Load Balancer created (both AZs)
- [ ] Target Group with health checks registered
- [ ] Auto Scaling Group (min 1, desired 2, max 4)
- [ ] CPU-based scaling policy configured
- [ ] EC2 moved to private subnet
- [ ] Domain pointing to ALB via Route 53

---

## Key Concepts Glossary

| Term | Plain English |
|---|---|
| **S3** | Amazon's object storage service |
| **CloudFront** | Amazon's CDN — copies of your site near every user |
| **OAC** | Origin Access Control — makes S3 private |
| **VPC** | Your own private section of AWS |
| **Subnet** | A smaller network inside a VPC |
| **EC2** | Virtual servers you can rent by the hour |
| **Security Group** | Stateful firewall rules for EC2 instances |
| **ALB** | Distributes traffic evenly across multiple servers |
| **Auto Scaling** | Automatically manages server count based on demand |
| **ACM** | Free, auto-renewing SSL certificates from Amazon |
| **Certbot** | Free SSL certificates from Let's Encrypt |
| **Nginx** | High-performance open-source web server |
| **SSL/TLS** | Encryption — the "S" in HTTPS |
| **Route 53** | Amazon's DNS service |
| **User Data** | Startup script that runs when EC2 boots |
| **Target Group** | A group of EC2s that an ALB routes traffic to |

---

## 💡 Cost Estimates

| Service | Free Tier | After Free Tier |
|---|---|---|
| S3 | 5 GB, 20K requests/month | ~$0.023/GB |
| CloudFront | 1 TB data, 10M requests/month | ~$0.0085/GB |
| EC2 t2.micro | 750 hours/month (12 months) | ~$0.0116/hr |
| ALB | 750 hours/month (12 months) | ~$0.008/hr |
| ACM | Always free | Free |
| Certbot | Always free | Free |

> 💡 **Tip:** Always set a **billing alert** at $5 and $10 to avoid surprise charges.

---

## 🔗 Resources

- [AWS Free Tier](https://aws.amazon.com/free/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Certbot for Nginx](https://certbot.eff.org/instructions?servertype=nginx)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)

---

*Built as part of an AWS Cloud Engineering learning series.*  
*Star ⭐ this repo if it helped you!*

## Project 1 — High Availability Static Site
Architecture
<img width="279" height="220" alt="Project 1 High Availability Static Site Architecture" src="https://github.com/user-attachments/assets/3bca371b-8ed7-4d72-b34f-1b16eba00d03" />

### S3 Bucket Created (Private)
<img width="923" height="373" alt="Screenshot 1 — S3 Bucket Created (Private)" src="https://github.com/user-attachments/assets/d484f46f-1d4d-4794-b838-782ef3500740" />


**What it shows:** The S3 bucket created with Block all public access turned ON.  
**Why it matters:** The bucket is completely private — no direct URL access. 
All traffic is forced through CloudFront using Origin Access Control (OAC). 
This is industry best practice and closes a common security gap.

---

### CloudFront Distribution Enabled

<img width="936" height="370" alt="Screenshot 2 — CloudFront Distribution Enabled" src="https://github.com/user-attachments/assets/736d60bc-80b6-4037-b9c0-e54088f59a72" />

**What it shows:** The CloudFront distribution in Enabled status with the 
domain name visible.  
**Why it matters:** CloudFront serves the website from 400+ global edge 
locations. This means a user in Tokyo gets the site from a nearby server — 
not from the US origin. Result: instant loading worldwide.

---

### Live Website on CloudFront URL
![Live Website](cloudfront-live-site.png)

**What it shows:** The coming soon page loading live in the browser via 
the CloudFront domain name.  
**Why it matters:** Proves the full pipeline works — S3 files served 
securely through CloudFront with HTTPS enforced and OAC protecting the bucket.

---

### S3 Direct URL Returns 403 Forbidden
![S3 403](s3-access-denied.png)

**What it shows:** Attempting to access the raw S3 URL returns 403 Forbidden.  
**Why it matters:** This CONFIRMS the security is working correctly. Nobody 
can bypass CloudFront and access files directly. This is the OAC in action.

---

## Project 2 — The Fortress Web Server
Architecture
<img width="288" height="235" alt="Project 2 Fortress Webserver Architecture" src="https://github.com/user-attachments/assets/1a0a6850-9014-4a86-8141-cbeb740d4d12" />

### Custom VPC Created

<img width="913" height="330" alt="Screenshot 5 — Custom VPC Created" src="https://github.com/user-attachments/assets/7487b363-cdc3-42c1-9f63-e67d15604ef8" />

**What it shows:** The fortress-vpc with public and private subnets across 
2 Availability Zones, Internet Gateway and NAT Gateway attached.  
**Why it matters:** This is a production-grade network topology. Web servers 
sit in private subnets — completely hidden from the internet. Only the Load 
Balancer in the public subnet is exposed.

---

### Security Groups Configured

<img width="930" height="420" alt="Screenshot 6 — Security Groups Configured" src="https://github.com/user-attachments/assets/f77f510d-3a9f-48bb-a00f-ea92967212a1" />

**What it shows:** Two security groups — alb-sg and webserver-sg — with 
their inbound rules visible.  
**Why it matters:** Shows Security Group Chaining in action. Port 80 on 
webserver-sg only allows traffic from alb-sg — not from the internet. 
This is how real enterprises protect their servers.

---

### EC2 Instance Running with Nginx

<img width="913" height="363" alt="Screenshot 7 — EC2 Instance Running with Nginx" src="https://github.com/user-attachments/assets/9a79b757-559d-4ca8-95d8-cf8d66423c49" />

**What it shows:** The fortress-server EC2 instance in Running state with 
3/3 status checks passed.  
**Why it matters:** Ubuntu server launched in the correct public subnet 
with Nginx installed automatically via User Data script on first boot.

---

### Nginx Welcome Page in Browser
<img width="582" height="319" alt="Screenshot 8 — Nginx Welcome Page in Browser" src="https://github.com/user-attachments/assets/41483a11-90a8-483a-8053-81bd4de90a80" />

**What it shows:** The Nginx welcome page loading in the browser via the 
EC2 public IP address.  
**Why it matters:** Confirms the web server is installed, running and 
accessible. Proves the VPC routing, Internet Gateway and security group 
rules are all configured correctly.

---
### Application Load Balancer Active

<img width="921" height="362" alt="Screenshot 9 — Application Load Balancer Active" src="https://github.com/user-attachments/assets/90414f72-d426-4ff8-8a36-f6b4f3c7b2b6" />

**What it shows:** The fortress-alb Application Load Balancer in Active 
state with its DNS name visible.  
**Why it matters:** The ALB sits in public subnets and distributes traffic 
across multiple servers. All inbound traffic goes through the ALB — 
servers are never directly exposed to the internet.

---
### Target Group Healthy

<img width="863" height="362" alt="Screenshot 10 — Target Group Healthy" src="https://github.com/user-attachments/assets/c885092c-7f9f-4380-a2a2-e2ede620ea44" />

**What it shows:** The fortress-tg target group showing the EC2 instance 
as Healthy.  
**Why it matters:** Healthy status means the ALB health checks are passing 
— the load balancer is successfully routing traffic to the Nginx server 
and getting valid responses back.

---
### Auto Scaling Group Running
<img width="904" height="341" alt="Screenshot 11 — Auto Scaling Group Running" src="https://github.com/user-attachments/assets/0a2cde6e-db8c-4195-a788-1a1a8e242c71" />


**What it shows:** The fortress-asg Auto Scaling Group with minimum 2, 
desired 2, maximum 4 instances configured and running.  
**Why it matters:** This is what makes the infrastructure truly 
enterprise-grade. If one server fails the ASG replaces it automatically. 
If traffic spikes the ASG adds servers. Zero manual intervention required.

---

### Site Loading Through ALB

<img width="595" height="234" alt="Screenshot 12 — Site Loading Through ALB" src="https://github.com/user-attachments/assets/fcfebb1d-f049-4e0f-8dd6-d31d8605a836" />

**What it shows:** The Nginx page loading in browser via the ALB DNS name 
instead of the direct EC2 IP.  
**Why it matters:** Proves the complete traffic flow works end to end — 
Internet → ALB → Target Group → EC2 → Nginx. This is production-grade 
architecture.

---

## Key Achievements

| Achievement | Detail |
|---|---|
| Private S3 + OAC | Zero public access — CloudFront only |
| Global CDN | 400+ edge locations worldwide |
| Custom VPC | 4 subnets across 2 Availability Zones |
| Security Group Chaining | Servers hidden from internet |
| High Availability | ALB + Auto Scaling Group |
| Zero Downtime | Self-healing infrastructure |
| Cost Optimised | Free tier where possible |
