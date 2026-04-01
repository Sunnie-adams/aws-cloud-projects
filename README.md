# 📸 Project Screenshots — Proof of Work

**Author:** Engr. Sunday Adams Omale  
**Project:** My First Project — AWS Cloud Engineering  
**Date Completed:** April 2026

---

## Project 1 — High Availability Static Site

### Screenshot 1 — S3 Bucket Created (Private)
![S3 Bucket]<img width="923" height="373" alt="Screenshot 1 — S3 Bucket Created (Private)" src="https://github.com/user-attachments/assets/d484f46f-1d4d-4794-b838-782ef3500740" />


**What it shows:** The S3 bucket created with Block all public access turned ON.  
**Why it matters:** The bucket is completely private — no direct URL access. 
All traffic is forced through CloudFront using Origin Access Control (OAC). 
This is industry best practice and closes a common security gap.

---

### Screenshot 2 — CloudFront Distribution Enabled
![CloudFront Distribution](cloudfront-distribution.png)

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

### Screenshot 5 — Custom VPC Created
![VPC Created](vpc-created.png)

**What it shows:** The fortress-vpc with public and private subnets across 
2 Availability Zones, Internet Gateway and NAT Gateway attached.  
**Why it matters:** This is a production-grade network topology. Web servers 
sit in private subnets — completely hidden from the internet. Only the Load 
Balancer in the public subnet is exposed.

---

### Screenshot 6 — Security Groups Configured
![Security Groups](security-groups.png)

**What it shows:** Two security groups — alb-sg and webserver-sg — with 
their inbound rules visible.  
**Why it matters:** Shows Security Group Chaining in action. Port 80 on 
webserver-sg only allows traffic from alb-sg — not from the internet. 
This is how real enterprises protect their servers.

---

### Screenshot 7 — EC2 Instance Running with Nginx
![EC2 Running](ec2-running.png)

**What it shows:** The fortress-server EC2 instance in Running state with 
3/3 status checks passed.  
**Why it matters:** Ubuntu server launched in the correct public subnet 
with Nginx installed automatically via User Data script on first boot.

---

### Screenshot 8 — Nginx Welcome Page in Browser
![Nginx Live](nginx-welcome.png)

**What it shows:** The Nginx welcome page loading in the browser via the 
EC2 public IP address.  
**Why it matters:** Confirms the web server is installed, running and 
accessible. Proves the VPC routing, Internet Gateway and security group 
rules are all configured correctly.

---

### Screenshot 9 — Application Load Balancer Active
![ALB Active](alb-active.png)

**What it shows:** The fortress-alb Application Load Balancer in Active 
state with its DNS name visible.  
**Why it matters:** The ALB sits in public subnets and distributes traffic 
across multiple servers. All inbound traffic goes through the ALB — 
servers are never directly exposed to the internet.

---

### Screenshot 10 — Target Group Healthy
![Target Group](target-group-healthy.png)

**What it shows:** The fortress-tg target group showing the EC2 instance 
as Healthy.  
**Why it matters:** Healthy status means the ALB health checks are passing 
— the load balancer is successfully routing traffic to the Nginx server 
and getting valid responses back.

---

### Screenshot 11 — Auto Scaling Group Running
![Auto Scaling](auto-scaling-group.png)

**What it shows:** The fortress-asg Auto Scaling Group with minimum 2, 
desired 2, maximum 4 instances configured and running.  
**Why it matters:** This is what makes the infrastructure truly 
enterprise-grade. If one server fails the ASG replaces it automatically. 
If traffic spikes the ASG adds servers. Zero manual intervention required.

---

### Screenshot 12 — Site Loading Through ALB
![Site via ALB](site-via-alb.png)

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
