# EverQuint Assignment Solutions

This repository contains organized solutions for the EverQuint assignment tasks:
1. **Max Profit Solution**: A dynamic programming / memoized DFS solution to maximize earnings given a certain building time.
2. **Water Tank Problem**: An interactive web application to compute and visually represent units of water stored in-between blocks (the Trapping Rain Water problem).
3. **Team Workflow Board + Design System**: A React + TypeScript Kanban-style task manager featuring a custom reusable component library, dynamic filtering/sorting, local storage persistence, and a toast notification system.

---

## Directory Structure

```text
EverQuint-Assignment/
├── max-profit-sloution.js       # Solution to the max profit calculation task
├── README.md                    # Project documentation
├── water-tank-problem/          # Water Tank Problem Visualizer web app
│   ├── index.html               # Web app HTML structure
│   ├── style.css                # Web app CSS styling
│   └── app.js                   # Web app logic & interactive SVG builder
└── team-workflow-board/         # React Team Workflow Board app
    ├── package.json             # Configuration & package scripts
    ├── tsconfig.json            # TypeScript options
    ├── index.html               # SPA mounting entrypoint
    ├── src/                     # React source files
    │   ├── main.tsx             # DOM mounting configuration
    │   ├── App.tsx              # Application layout & state coordination
    │   ├── index.css            # Custom CSS & design system variables
    │   ├── types.ts             # Data models & state declarations
    │   ├── hooks/               # LocalStorage & toast state handlers
    │   └── components/          # Reusable React components
    │       ├── design-system/   # Custom styled UI elements (Button, Select, Modal, etc.)
    │       └── board/           # Kanban columns, cards, and filters
```

---

## 1. Max Profit Solution

The solution is implemented in [max-profit-sloution.js](file:///Users/Mohit.Singh/Documents/EverQuint-Assignment/max-profit-sloution.js).

### Problem Overview
Given a timeframe of `n` units, we need to choose which buildings (T, P, C) to build to maximize total earnings.
* **T (Theater)**: Takes 5 units of time to build, earns 1500 per remaining unit of time.
* **P (Pub)**: Takes 4 units of time to build, earns 1000 per remaining unit of time.
* **C (Commercial Park)**: Takes 10 units of time to build, earns 2000 per remaining unit of time.

---

## 2. Water Tank Problem (Web Application)

An interactive, responsive frontend dashboard to visualize the Trapping Rain Water algorithm.

### Files Involved
* [index.html](file:///Users/Mohit.Singh/Documents/EverQuint-Assignment/water-tank-problem/index.html): Structure and layout of the dashboard.
* [style.css](file:///Users/Mohit.Singh/Documents/EverQuint-Assignment/water-tank-problem/style.css): Premium glassmorphic styling, responsive layout, and custom interactive styles.
* [app.js](file:///Users/Mohit.Singh/Documents/EverQuint-Assignment/water-tank-problem/app.js): Dynamic SVG drawing visualizer, presets, and height controllers.

### How to Run
Run the static server utility in the project root:
```bash
npx serve .
```
Then navigate to:
👉 **`http://localhost:3000/water-tank-problem/`**

---

## 3. Team Workflow Board + Design System (React App)

A React + TypeScript application showcasing component design patterns, local storage persistence, and search/sort operations.

### Reusable UI Elements
Our component library contains fully-typed, responsive components built with vanilla CSS:
* **Button**: Supports sizes (`sm`, `md`, `lg`), variants (`primary`, `secondary`, `outline`, `danger`), disabled states, and Lucide icon placements.
* **TextInput**: Supports text inputs and textareas (multi-line) with labels, placeholders, errors, and custom layout icons.
* **Select**: Accessible dropdown selectors with custom indicators and focus glows.
* **Modal**: Accessible modal overlay supporting background-blur backdrop clicks and Escape-key closure.
* **Badge**: Pill tags supporting Low, Medium, and High priority labels.
* **Card**: Containers featuring soft shadows, rounded corners, and hover transitions.
* **Toast**: Slide-in notification stacks notifying users on task additions, updates, or deletes.

### Application Features
* **Kanban Grid**: Divided into **Backlog**, **In Progress**, and **Done** columns with dynamic card counters.
* **Task CRUD**: Creating, editing, and deleting items. State is synchronized with `localStorage` (retains tasks on refresh).
* **Direct Status Navigation**: Arrows on cards let users move tasks between columns.
* **Dynamic Search & Filters**: Search text fields (queries titles and descriptions), and filter dropdowns (by assignee, tags, or priorities).
* **Sorting Panel**: Sort columns by creation date or priority weight.

### How to Run
Navigate into the folder, install dependencies, and start the Vite dev server:
```bash
cd team-workflow-board
npm install
npm run dev
```
Then open:
👉 **`http://localhost:5173/`** in your browser.
