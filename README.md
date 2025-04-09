# Service Fabric Onboardgin Application - SnakesGameApp

This is a full-stack onboarding project featuring a **React + TypeScript frontend** and a **Service Fabric backend** built with **.NET Core 8**. It is created to show creation and communication of stateful and stateless services, ASP .NET Core Web services, reliable actors and reliable storage, upgrades, placement affinities and other Service Fabric specific capabilities.

---
### Backend (Service Fabric)

>  Prerequisites: Visual Studio 2022+, .NET 8 SDK, SF SDK

1. Open `SnakesGameApp` in Visual Studio
2. Right-click the SF project → **Publish**
3. Confirm deployment on local 5-node cluster
     
Local Service Fabric cluster will be available at [http://localhost:19080](http://localhost:19080) .

### Frontend (React)

>  Prerequisites: Node.js 18+, npm

```bash
cd FrontendApp
npm install
npm start
```

Frontend App will be available at [http://localhost:3000](http://localhost:3000) .
