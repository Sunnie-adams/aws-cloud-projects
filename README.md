# 📸 Project Screenshots — Proof of Work

**Author:** Engr. Sunday Adams Omale  
**Project:** My First Project — AWS Cloud Engineering  
**Date Completed:** April 2026

---
"A mental model overview for both projects.

Project 1 is all about storage and delivery. Think of Amazon S3 as a hard drive in the cloud. You put your website files in it. But instead of letting anyone access that hard drive directly, you put a bouncer in front called CloudFront. CloudFront is a Content Delivery Network — it caches your files at over 400 locations around the world, so when someone in Tokyo visits your site, they're not waiting for a server in Virginia to respond. They get it from Tokyo. Instantly.

The clever part is that we're going to make the S3 bucket completely private. Not even a direct URL will work. The only way to reach your files is through CloudFront. That's called Origin Access Control, and it's a security pattern every cloud engineer should know.

Project 2 is about networking and compute. We build a Virtual Private Cloud — your own isolated network inside AWS. Inside that network, we run a Linux server with Nginx, add an SSL certificate so the site runs on HTTPS, and then we protect the whole thing with a Load Balancer and Auto Scaling Group. The servers are completely hidden from the internet. They can't be reached directly. Period.

## Project 1 — High Availability Static Site
Architecture
<img width="279" height="220" alt="Project 1 High Availability Static Site Architecture" src="https://github.com/user-attachments/assets/3bca371b-8ed7-4d72-b34f-1b16eba00d03" />

### Screenshot 1 — S3 Bucket Created (Private)
![S3 Bucket]<img width="923" height="373" alt="Screenshot 1 — S3 Bucket Created (Private)" src="https://github.com/user-attachments/assets/d484f46f-1d4d-4794-b838-782ef3500740" />


**What it shows:** The S3 bucket created with Block all public access turned ON.  
**Why it matters:** The bucket is completely private — no direct URL access. 
All traffic is forced through CloudFront using Origin Access Control (OAC). 
This is industry best practice and closes a common security gap.

---

### Screenshot 2 — CloudFront Distribution Enabled

<img width="936" height="370" alt="Screenshot 2 — CloudFront Distribution Enabled" src="https://github.com/user-attachments/assets/736d60bc-80b6-4037-b9c0-e54088f59a72" />

**What it shows:** The CloudFront distribution in Enabled status with the 
domain name visible.  
**Why it matters:** CloudFront serves the website from 400+ global edge 
locations. This means a user in Tokyo gets the site from a nearby server — 
not from the US origin. Result: instant loading worldwide.

---

### Screenshot 3 — Live Website on CloudFront URL
![Live Website](cloudfront-live-site.png)

**What it shows:** The coming soon page loading live in the browser via 
the CloudFront domain name.  
**Why it matters:** Proves the full pipeline works — S3 files served 
securely through CloudFront with HTTPS enforced and OAC protecting the bucket.

---

### Screenshot 4 — S3 Direct URL Returns 403 Forbidden
![S3 403](s3-access-denied.png)

**What it shows:** Attempting to access the raw S3 URL returns 403 Forbidden.  
**Why it matters:** This CONFIRMS the security is working correctly. Nobody 
can bypass CloudFront and access files directly. This is the OAC in action.

---

## Project 2 — The Fortress Web Server
Architecture
<img width="288" height="235" alt="Project 2 Fortress Webserver Architecture" src="https://github.com/user-attachments/assets/1a0a6850-9014-4a86-8141-cbeb740d4d12" />

### Screenshot 5 — Custom VPC Created

<img width="913" height="330" alt="Screenshot 5 — Custom VPC Created" src="https://github.com/user-attachments/assets/7487b363-cdc3-42c1-9f63-e67d15604ef8" />

**What it shows:** The fortress-vpc with public and private subnets across 
2 Availability Zones, Internet Gateway and NAT Gateway attached.  
**Why it matters:** This is a production-grade network topology. Web servers 
sit in private subnets — completely hidden from the internet. Only the Load 
Balancer in the public subnet is exposed.

---

### Screenshot 6 — Security Groups Configured

<img width="930" height="420" alt="Screenshot 6 — Security Groups Configured" src="https://github.com/user-attachments/assets/f77f510d-3a9f-48bb-a00f-ea92967212a1" />

**What it shows:** Two security groups — alb-sg and webserver-sg — with 
their inbound rules visible.  
**Why it matters:** Shows Security Group Chaining in action. Port 80 on 
webserver-sg only allows traffic from alb-sg — not from the internet. 
This is how real enterprises protect their servers.

---

### Screenshot 7 — EC2 Instance Running with Nginx

<img width="913" height="363" alt="Screenshot 7 — EC2 Instance Running with Nginx" src="https://github.com/user-attachments/assets/9a79b757-559d-4ca8-95d8-cf8d66423c49" />

**What it shows:** The fortress-server EC2 instance in Running state with 
3/3 status checks passed.  
**Why it matters:** Ubuntu server launched in the correct public subnet 
with Nginx installed automatically via User Data script on first boot.

---

### Screenshot 8 — Nginx Welcome Page in Browser
<img width="582" height="319" alt="Screenshot 8 — Nginx Welcome Page in Browser" src="https://github.com/user-attachments/assets/41483a11-90a8-483a-8053-81bd4de90a80" />

**What it shows:** The Nginx welcome page loading in the browser via the 
EC2 public IP address.  
**Why it matters:** Confirms the web server is installed, running and 
accessible. Proves the VPC routing, Internet Gateway and security group 
rules are all configured correctly.

---
### Screenshot 9 — Application Load Balancer Active

<img width="921" height="362" alt="Screenshot 9 — Application Load Balancer Active" src="https://github.com/user-attachments/assets/90414f72-d426-4ff8-8a36-f6b4f3c7b2b6" />

**What it shows:** The fortress-alb Application Load Balancer in Active 
state with its DNS name visible.  
**Why it matters:** The ALB sits in public subnets and distributes traffic 
across multiple servers. All inbound traffic goes through the ALB — 
servers are never directly exposed to the internet.

---
### Screenshot 10 — Target Group Healthy

<img width="863" height="362" alt="Screenshot 10 — Target Group Healthy" src="https://github.com/user-attachments/assets/c885092c-7f9f-4380-a2a2-e2ede620ea44" />

**What it shows:** The fortress-tg target group showing the EC2 instance 
as Healthy.  
**Why it matters:** Healthy status means the ALB health checks are passing 
— the load balancer is successfully routing traffic to the Nginx server 
and getting valid responses back.

---
### Screenshot 11 — Auto Scaling Group Running
<img width="904" height="341" alt="Screenshot 11 — Auto Scaling Group Running" src="https://github.com/user-attachments/assets/0a2cde6e-db8c-4195-a788-1a1a8e242c71" />


**What it shows:** The fortress-asg Auto Scaling Group with minimum 2, 
desired 2, maximum 4 instances configured and running.  
**Why it matters:** This is what makes the infrastructure truly 
enterprise-grade. If one server fails the ASG replaces it automatically. 
If traffic spikes the ASG adds servers. Zero manual intervention required.

---

### Screenshot 12 — Site Loading Through ALB

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
