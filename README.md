# SkillMatch Project

## Table of Contents

1. [Overview](#Project-Overview)
2. [Product Spec](#Product-Spec)
3. [Schema](#Schema)
4. [Getting Started](#Getting-Started)


## Project Overview


### Description

SkillMatch is a web-based platform that facilitates connections between service providers ("workers") and potential clients ("employers"). The platform aims to create a seamless experience for users seeking to offer or find services, leveraging modern web technologies to provide a dynamic and engaging environment.


### App Evaluation

[Evaluation of your app across the following attributes]
- **Category:** Marketplace, Productivity
- **Mobile:** Yes, the app is primarily targeted for mobile use.
- **Story:** The app helps workers find job opportunities and enables employers to find suitable workers.
- **Market:** Anyone with an access to the internet and needing skilled services or looking to offer their skills.
- **Habit:** Users can access it daily to monitor listings and manage their profiles.
- **Scope:** The app streamlines the interaction between skilled workers and employers, creating a simple and intuitive experience.

## Product Spec

### 1. User Stories

**Required Must-have Stories**

 -User can sign up for an account to offer or find services.
 -User can securely log in to manage their profile and services.
 -User can create and customize their profiles to showcase skills and availability.
 -User can browse service listings to find the right worker or employer.
 -User can request services and manage incoming requests.


### 2. Screen Archetypes

**Login Screen**
-The login screen enables users to securely sign in with their credentials.
**Registration Screen**
-Allows new users to sign up by filling in personal information and creating an account.
**Profile Completion Screen**
-Guides users to complete their profile by entering details such as skills and availability.
**Account Dashboard Screen**
-Displays the user's account details, such as personal information and skillsets.
**Skill Management Screen**
-Users can add, edit, and manage their skills.

### 3. Navigation

**Tab Navigation** (Tab to Screen)

   **Home Tab**: Leads to a home dashboard
   **Account Tab**: Leads to the Account Dashboard Screen
   **Skills Tab**: Leads to the Skill Management Screen
   **Password Tab**: Allows users to change their password
   **Contract Tab**: Manage and view contracts
   **Notification Tab**: Set up and manage notifications
   **Logout Tab**: Logs the user out of their account


**Flow Navigation** (Screen to Screen)
   [**Sign In Button**]
   Leads to [**Account Dashboard Screen**]
   [**Sign Up Button**]
   Leads to [**Profile Completion Screen**]
   [**Complete Profile Button**]
   Leads to **[Account Dashboard Screen**]


## Schema

### Models

**User**
| Property | Type   | Description                                  |
|----------|--------|----------------------------------------------|
| id       | Integer| Unique identifier for each user              |
| username | String | Unique username for the user                 |
| password | String | Hashed password for secure login             |
| email    | String | User's email address                         |
| role     | String | User's role in the platform ("worker", "employer") |
| ...      | ...    | ...                                          |

**Skill**
| Property       | Type   | Description                                  |
|----------------|--------|----------------------------------------------|
| id             | Integer| Unique identifier for each skill             |
| user_id        | Integer| Reference to the user who owns this skill    |
| skill_name     | String | Name of the skill                            |
| skill_level    | String | Skill proficiency level                      |
| ...            | ...    | ...                                          |

**Listing**
| Property       | Type   | Description                                  |
|----------------|--------|----------------------------------------------|
| id             | Integer| Unique identifier for each listing           |
| user_id        | Integer| Reference to the user who created the listing|
| title          | String | Title of the listing                         |
| description    | String | Detailed description of the listing          |
| location       | String | Location of the service                      |
| rate           | Float  | Hourly rate or fixed price for the service   |
| ...            | ...    | ...                                          |

### Networking

**User Endpoints**

[POST] /users/register - Create a new user account with registration details
[POST] /users/login - Authenticate the user and provide access to their profile
[GET] /users/{id} - Retrieve profile details of a specific user


**Skill Endpoints**

[GET] /skills/{user_id} - Retrieve all skills of a specific user
[POST] /skills - Add a new skill to a user's profile
[PUT] /skills/{id} - Update a specific skill with new information
[DELETE] /skills/{id} - Remove a skill from a user's profile


**Listing Endpoints**

[GET] /listings - Retrieve all available service listings
[GET] /listings/{id} - Retrieve detailed information about a specific listing
[POST] /listings - Create a new service listing
[PUT] /listings/{id} - Update an existing service listing
[DELETE] /listings/{id} - Delete a specific service listing



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
4. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```
5. **Apply Migrations:**

   ```bash
    cd backend
    python manage.py migrate
   ```
6. **Run the Development Server:**

   ```bash
   python manage.py runserver
   ```

#### React Frontend

1. **Navigate to the React App Directory:**
   ```bash
    cd ../frontend
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Run the Development Server:**
   ```bash
    npm run dev
   ```
