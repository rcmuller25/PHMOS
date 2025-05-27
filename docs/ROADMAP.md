# PHMOIS Development Roadmap

This document outlines a systematic, update-by-update plan for enhancing PHMOIS (Primary Healthcare Mobile Outreach Information System) over time. Instead of deploying all features at once, we will focus on core stability and functionality in manageable increments. Each update will build upon the previous one, ensuring stability and gradual improvement.

---

## Update 1: Core Stability, Login, and Route Logging

### Goals

- **L1: Bug Fixes & Stability Improvements:**  
  Resolve known issues and refine the offline-first capability to ensure reliable operation even without connectivity.

- **L2: Implement a Simple Email/Password Login:**  
  - **Offline-First Authentication:**  
    Integrate a straightforward, offline-compatible login screen that allows users to authenticate via email and password.  
  - **Custom Branding:**  
    Include basic branding elements on the login screen (customization details are still being refined).  
  - **User Experience:**  
    Provide clear error messages, basic password guidelines, and a simple flow that maintains ease of use.

- **L3: Establish Basic Access Control & Facility Management:**  
  - **Universal Access:**  
    All practitioner accounts can access data from all facilities.  
  - **Active Facility Selection:**  
    Implement functionality that lets practitioners temporarily select an "active" facility to tailor the dashboard and data displays to a specific facility for that session.
  - **Access Monitoring:**  
    Log the daily routes or farms visited by practitioners for tracking and analytics.

- **L4: Route & Farm Logging Functionality:**  
  - **Simple Logging Mechanism:**  
    Provide a straightforward method for practitioners to log the routes they cover, including basic information such as route/farm identifier and visit start time.  
  - **Offline Storage:**  
    Ensure that log data is stored securely on the device and synchronized when connectivity is restored.

### Technical Considerations

- **Offline-First:**  
  All features—login, access control, and logging—will maintain the offline-first approach. Cached credentials and logs must be stored securely.
  
- **Security & Modularity:**  
  The initial authentication will be email/password based, yet the code should be designed so that integrating multi-factor authentication and advanced security features in later updates is straightforward.
  
- **Scalability:**  
  Develop each new module (login, access control, route logging) independently to facilitate easier updates in the future without affecting the core functionality.

---

## Future Updates (Preview)

- **Update 2:**  
  Enhance authentication by adding multi-factor options, improving password management, and implementing advanced security measures.

- **Update 3:**  
  Expand the route logging system by integrating features such as GPS/location data (optional) and automated verification of visits.

- **Update 4:**  
  Introduce detailed reporting and analytics for route performance and patient interactions, along with enhanced audit logging functionality.

_(Future updates will build on the core established in Update 1 to ensure a stable and systematically improved application.)_

---

## Clarification Notes

1. **Login Screen Customization:**  
   Custom branding elements are planned, although the specifics are still being sorted out.

2. **Route Logging Details:**  
   The initial version of route logging will remain simple, focusing on basic data entry without overcomplicating the process.

3. **Active Facility Selection:**  
   Practitioners will have the ability to select an "active" facility during their session, tailoring the data display to that particular facility while retaining universal access.

---

This roadmap lays the foundation for a stable, secure, and incrementally enhanced version of PHMOIS. Each update will add critical functionality without compromising overall system performance, allowing for systematic, long-term development.

