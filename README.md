# PatriotGo 🚗 🟢 🟡

**PatriotGo** is a high-performance, real-time carpooling platform built for George Mason University. It utilizes a hybrid-cloud architecture to manage live ride-sharing, secure messaging, and big-data analytics for campus commuting trends.

---

## 🏗️ System Architecture

PatriotGo uses a sophisticated multi-database strategy to ensure speed, security, and analytical depth:

* **Supabase (PostgreSQL):** Handles core relational data, Authentication, and Realtime messaging via WebSockets.
* **Amazon DynamoDB:** Serves as our NoSQL key-value store for high-frequency user session data and rapid state management, ensuring sub-millisecond latency during peak campus hours.
* **Amazon Redshift:** Powering our "Eco-Analytics" engine. This data warehouse analyzes historical carpooling patterns to generate campus-wide sustainability reports and optimize route suggestions.



---

## 🌟 Key Features

* **Live Driver Feed:** Real-time carpool discovery using Supabase Realtime.
* **Instant Messaging:** Peer-to-peer coordination with a custom "Bento-style" UI.
* **Big Data Insights:** Redshift-powered analytics to track total carbon offset and commute efficiency across the Mason community.
* **High-Speed Session Handling:** DynamoDB integration for seamless user transitions and app state persistence.

---

## 🛠️ Tech Stack

* **Frontend:** React Native (Expo)
* **Realtime/Auth:** Supabase
* **NoSQL Database:** Amazon DynamoDB
* **Data Warehouse:** Amazon Redshift
* **Design:** Mason-themed UI (#006633, #FFCC33) with "Floating Island" navigation.

---

## 📜 Technical Implementation

### Data Flow
1.  **Operational:** Chat and Profile data are managed via **Supabase**.
2.  **Scalability:** Active ride states and session caches are pushed to **DynamoDB**.
3.  **Analytics:** Daily ride logs are ETL-processed into **Redshift** for long-term trend analysis.

---
## 📱 Screenshots

### 🔐 Login Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/a055745a-2911-494b-9246-f103b9d3b13e" width="250"/>
</p>

---

### 📝 Sign Up Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/333937c7-3637-41e3-a8e3-a5a32d8d6d70" width="250"/>
</p>

---

### 📰 Feed Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/61eb4d46-db9c-48b9-ac20-436dd86c0f5f" width="250"/>
</p>

---

### 📡 Pinging Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/30773c0b-c5c2-416e-9fd4-d6916458fa15" width="250"/>
</p>

---

### 💬 Chat / Updating Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/87120e34-62ac-4162-bf45-81b4a95ea966" width="250"/>
</p>

---

### 👤 Profile Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/1a1330d8-7caf-4cbc-a9c5-1ef327da5a55" width="250"/>
</p>

---

### ⚙️ Settings / Edit Profile Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/eb42b1a0-1758-478d-9673-8b86dc4358fe" width="250"/>
</p>








---

## 🎓 About the Development Team

This project was engineered by a team of Computer Science students at George Mason University during PatriotHacks 2025, a 36-hour hackathon focused on building high-impact technology under strict time constraints.

Our mission was to explore the synergy between mobile accessibility, real-time data integrity, and scalable cloud architectures to solve modern urban mobility challenges.

The goal of this project was to explore the intersection of:

- 📱 Mobile application development  
- ⚡ Real-time communication systems  
- ☁️ Cloud-backed data systems  
- 🌆 Technology for modern urban mobility  

### 👥 Team Members

- Saumit Guduguntla  
- Uday Kandi  
- Vrishak Vemuri  
- Tejas Ravipati  

Each team member contributed to the design, development, and implementation of the system, including frontend development, backend infrastructure, and real-time functionality.

---

*Built collaboratively at PatriotHacks in a competitive hackathon environment (PatriotHacks @George Mason University).*
