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
## Screens 
<img width="162" height="333" alt="image" src="https://github.com/user-attachments/assets/a055745a-2911-494b-9246-f103b9d3b13e" />
<img width="162" height="333" alt="image" src="https://github.com/user-attachments/assets/a055745a-2911-494b-9246-f103b9d3b13e" />




---

## 🎓 About the Developer
Developed by a George Mason University Computer Science student. This project explores the intersection of mobile development, real-time systems, and cloud data warehousing to solve modern urban mobility challenges.

**Go Patriots!** 🦅
