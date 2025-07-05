````markdown
# Task Management Web App

A modern, full-stack Kanban-style task management app with smart workload balancing, secure JWT authentication, and a responsive, professional UI.

---

## Features

- Role-Based Permissions  
  - The assigner of a task can edit or delete it.  
  - The assignee can only change the task's status (In Progress, Done), but cannot edit task details.

- Smart Assign 
  - Automatically assigns new tasks to the user with the fewest active tasks, balancing workload smartly.

- Task Editing & Conflict Resolution**  
  - Edit tasks in a sleek modal.  
  - If edits conflict with server data, a user-friendly conflict resolver helps merge changes.

- **JWT Authentication**  
  - Secure authentication and role-based access control via JSON Web Tokens.

- **Real-Time Updates**  
  - Tasks and activity logs update live across all clients with Socket.io.

- **Responsive, Custom UI**  
  - Mobile-friendly with custom CSS and smooth animations.

---

## Tech Stack

- Frontend: React + Context API + react-beautiful-dnd  
- Backend: Node.js + Express + MongoDB (Mongoose)  
- Authentication: JWT  
- Real-Time: Socket.io  
- Styling: Custom CSS

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Mitanshu23DS/Weblar_intern_sample.git
cd Weblar_intern_sample
````

2. Install server dependencies:

```bash
npm install
```

3. Install client dependencies:

```bash
cd client_
npm install
```

---

## Running the App

From the project root, you need to start both the client and server:

**Start Client**

```bash
cd client_
npm start
```

**Start Server**

```bash
nodemon server.js
```

**Important:** Ensure MongoDB is running locally, or update your MongoDB connection string in `server.js`.

---

## Usage

* Register or log in to start using the board.
* Create tasks, assign them to users, and move them across columns.
* Assigned users can update task progress.
* View live activity logs of all actions.
* Use Smart Assign to auto-distribute tasks evenly.

---

## Demo

![Kanban Board Screenshot](https://via.placeholder.com/900x400?text=Task+Management+Demo)

---

## Developed by Mitanshu Shinde

* [Portfolio](https://gentle-profiterole-dda1b8.netlify.app/)
* [LinkedIn](https://linkedin.com)
* [GitHub](https://github.com/Mitanshu23DS)


