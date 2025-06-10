
# Recipe Recommender - Frontend

This is the frontend application of the Recipe Recommender, built using React.js. It allows Home Cooks and Recipe Creators to interact with the system via an intuitive and responsive web interface.

## 🧰 Tech Stack

- React.js
- JavaScript (ES6+)
- Axios (for API communication)
- HTML5, CSS3
- React Router

## 📁 Project Structure

- `src/pages/` – Main screens (Login, Register, Home, Recipe Detail, etc.)
- `src/services/` – API service wrappers using Axios,User authentication and app state



## 🔐 User Roles

- **Home Cook**:
  - Register and log in
  - Enter ingredients
  - Get recipe recommendations
  - Like and save favorite recipes

- **Recipe Creator**:
  - Add/edit/delete recipes
  - Upload recipe images
  - View personal recipes

## 🔗 API Integration

- All API calls are made to the Spring Boot backend using Axios.
- Authentication and session management handled via tokens (or cookies if implemented).
- Responsive error handling and loading states.

## 🖼 Features

- Ingredient input interface with dynamic fields
- Recipe cards with image, description, and instructions
- Favorites management
- Search functionality for recipes
- Admin and Creator dashboard access (if authenticated)

## 📱 Responsive Design

- Compatible with all major browsers
- Responsive for desktop, tablet, and mobile devices

## 🔮 Future Improvements

- Implement advanced search filters (time, diet, etc.)
- Real-time comment section for recipes
- User profile management

## How it looks
![creator_page](https://github.com/user-attachments/assets/df09e757-f48b-44b5-9835-e9e742d331d0)
![Screenshot 2025-06-10 150802](https://github.com/user-attachments/assets/9e7cf908-4718-4d9f-bbea-e87ade9f29ff)

![user_page](https://github.com/user-attachments/assets/4af10355-018d-4c38-9467-87b462751ec1)



