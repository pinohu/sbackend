# SuiteDashClientApp

A React Native mobile app template that uses SuiteDash as a backend via the SuiteDash Secure API. This project demonstrates how to build a custom, extensible mobile app leveraging SuiteDash for user management, data storage, and business logic.

## Features
- Fetch and display contacts from SuiteDash
- Modular API service for easy extension (projects, files, tasks, etc.)
- React Navigation for scalable screen management
- Robust error and loading state handling

## Architecture
- **React Native** for cross-platform mobile development
- **Axios** for API requests
- **@react-navigation/native** and **@react-navigation/stack** for navigation
- **Modular service layer** for SuiteDash API integration

## Setup Instructions

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure SuiteDash API Credentials**
   - Open `services/suiteDashApi.js`
   - Replace `YOUR_PUBLIC_ID` and `YOUR_SECRET_KEY` with your SuiteDash API credentials
   - For production, use environment variables or secure storage for credentials

4. **Run the app**
   ```bash
   npm run android   # For Android
   npm run ios       # For iOS (Mac only)
   npm start         # Start Metro bundler
   ```

## Extending the App
- Add new API methods to `services/suiteDashApi.js` for projects, files, tasks, etc.
- Create new screens in the `screens/` directory and add them to the navigator in `App.js`
- Follow best practices for error handling, caching, and performance as outlined in the guide

## Security Notes
- Never commit real API credentials to version control
- Use secure storage or environment variables for sensitive data in production

## References
- See `suitedash-mobile-app-guide.md` for detailed architectural guidance and best practices

## Docker Usage

You can run the Metro Bundler in a Docker container for CI/CD or local development:

```bash
docker build -t suitedash-mobile .
docker run -it --rm -p 8081:8081 --env-file .env suitedash-mobile
```

Or with Docker Compose:

```bash
docker-compose up --build
```

## GitHub Usage

1. Initialize git and commit your code:
   ```bash
   git init
   git add .
   git commit -m "Initial production-ready SuiteDash mobile app"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```
   Replace `your-username/your-repo` with your actual GitHub repo.

2. Set up CI/CD (optional but recommended) using GitHub Actions, Bitrise, or App Center for automated builds, tests, and deployments.

---

Built following the [SuiteDash Mobile App Guide](file://file-FpwacXERVxgQ6t2igTx2Qosuitedash-mobile-app-guide.md). 