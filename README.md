# **🎬 CineMatch: Movie & TV Recommendation App**

## **🔗 Developer**

**Amirreza**

* [GitHub Profile](https://github.com/amirsohly)

## **💡 About CineMatch**

**CineMatch is a modern React application providing intelligent, instant movie and TV show recommendations with a soft UI and theme switching.** It is a single-page application (SPA) built with **React** and **Vite** designed to help users discover their next favorite movie or TV show. It leverages the comprehensive dataset and recommendation algorithms of **The Movie Database (TMDB)** to provide highly-relevant suggestions.

The app focuses heavily on user experience (UX) and modern aesthetics:

### **Key Design & UX Features**

* **Soft UI (Neumorphism-inspired):** Features a sleek, three-dimensional visual style with subtle shadows, rounded elements, and modern color gradients for a high-end feel.  
* **Seamless Theme Toggle:** Effortlessly switch between **Light Mode** and **Dark Mode** with smooth CSS transitions for optimal viewing comfort in any environment.  
* **Responsive Control:** Uses a single, powerful search bar combined with a dedicated toggle to switch between searching **Movies**, **TV Shows**, or **All** media types.

### **Key Logic & API Features**

* **Instant Autocomplete:** Provides real-time suggestions as the user types, including posters, titles, and release years.  
* **Intelligent Recommendations:** After selecting a title, the app fetches recommendations based on TMDB's complex algorithms (rather than simple similarities) to ensure high relevance.  
* **Prioritized Sorting:** All results (up to 20 recommendations) are automatically sorted by **User Rating (Vote Average)** first, and then by **Release Date** to ensure the best and newest titles are displayed first.

## **⚙️ Installation and Setup**

This project uses **Vite** as a build tool and package manager **npm**.

### **Prerequisites**

1. Node.js (LTS version recommended)  
2. An active API Key from [The Movie Database (TMDB)](https://www.themoviedb.org/).

### **Steps**

1. **Clone the Repository:**  
   git clone \[https://github.com/amirsohly/cinematch-app.git\](https://github.com/amirsohly/cinematch-app.git)  
   cd cinematch-app

2. **Install Dependencies:**  
   npm install

3. Configure Environment Variables (API Key):  
   Create a file named .env in the root directory of the project and add your TMDB API Key:  
   \# .env  
   VITE\_TMDB\_API\_KEY="YOUR\_TMDB\_API\_KEY\_HERE"

   *(Note: The .gitignore file is configured to prevent this file from being pushed to GitHub.)*  
4. **Run Locally (Development):**  
   npm run dev  
