# 🧠 AI Study Buddy (Elevate)

Elevate is a powerful AI-driven study platform designed to revolutionize the way you learn. By leveraging state-of-the-art Large Language Models (LLMs), Elevate processes your documents, summarizes content, and creates interactive study sessions tailored exactly to your curriculum. 

---

## 🚀 Features

- **Document Processing**: Upload PDFs and learning materials securely.
- **AI-Powered Insights**: Leverage **Groq** and **Google Gemini** to extract key insights and summarize large blocks of text instantly.
- **Modern Dashboard**: A sleek, highly responsive user interface built for maximum engagement and focus.
- **Secure Authentication**: User management, row-level security, and database handling powered entirely by Supabase.
- **Containerized**: Fully Dockerized for seamless local development and cloud deployment.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React, Vite
- **Styling**: Vanilla CSS, custom UI components, Clash Display typography

### Backend
- **Framework**: Python, FastAPI (`uvicorn`)
- **AI Integration**: Groq API, Google Gemini API
- **File Handling**: Custom Python PDF parsing and file processing services

### Infrastructure
- **Database / Auth**: Supabase (PostgreSQL)
- **Containerization**: Docker, Docker Compose
- **Deployment Target**: AWS Elastic Beanstalk (Amazon Linux 2023 Docker platform)

---

## ⚙️ Local Setup

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (3.9+)
- [Docker](https://www.docker.com/)

### 1. Clone the repository
```bash
git clone https://github.com/Hitansh55/IBM_AI_Project.git
cd ai-study-buddy
```

### 2. Configure Environment Variables
You will need to set up environment variables for both the backend and frontend to connect to Supabase and the AI APIs.

**Backend (`backend/.env`)**
```env
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

**Frontend (`frontend/.env`)**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Initialize the Database
Run the provided `schema.sql` file in your Supabase SQL Editor to correctly set up the necessary tables and row-level security (RLS) policies.

---

### 4. Running with Docker (Recommended)
You can easily spin up the entire full-stack application using Docker Compose.

```bash
docker-compose up --build
```
The application will be built and served at `http://localhost:8000`.

---

### 5. Running Manually (Without Docker)

**Start the Backend (FastAPI)**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 5000
```

**Start the Frontend (React)**
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

## ☁️ Deployment (AWS Elastic Beanstalk)

Elevate is configured for deployment on AWS Elastic Beanstalk using the **Docker** platform.

1. **Prepare the source bundle:**
   Ensure `Dockerfile` and `docker-compose.yml` are at the root level of your `.zip` archive. We recommend using the following command to generate a clean artifact:
   ```bash
   zip -r deploy.zip Dockerfile docker-compose.yml backend frontend schema.sql -x "frontend/node_modules/*" -x "backend/venv/*" -x "*.git*" -x "frontend/dist/*" -x "backend/__pycache__/*"
   ```
2. **Create the Environment:**
   - Go to the **AWS Elastic Beanstalk Console**.
   - Create a new environment and strictly select **Docker** as the platform.
   - Ensure the associated IAM Service Role has the `AWSElasticBeanstalkEnhancedHealth` and `AWSElasticBeanstalkService` policies attached.
3. **Deploy:**
   - Upload the newly generated `deploy.zip` file.
   - Add your environment variables in the AWS console under **Configuration > Environment properties**.
