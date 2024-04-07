# SkillMatch Project

SkillMatch project is a platform for connecting service providers with service seekers.

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Node.js and npm (Node package manager)

### Setting Up the Development Environment

#### Django Backend

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/SkillMatch.git
   cd SkillMatch
   ```
2. **Create a Virtual Environment:**
   ```bash
   python3 -m venv venv
   ```
3. **Activate the Virtual Environment:**
   - **For macOS/Linux:**
   ```bash
   source venv/bin/activate
   ```
   - **For Windows:**
   ```bash
   venv\Scripts\activate
   ```
4. **Install Django:**
   ```bash
   pip install django
   ```
5. **Apply Migrations:**
   ```bash
    cd skillmatch_django
    python manage.py migrate
   ```
6. **Run the Development Server:**
   ```bash
   python manage.py runserver
   ```

#### React Frontend

1. **Navigate to the React App Directory:**
   ```bash
    cd ../skillmatch_react
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Run the Development Server:**
   ```bash
    npm start
   ```
