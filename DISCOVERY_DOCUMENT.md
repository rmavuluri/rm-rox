# RM-ROX Frontend Application - Q2 2025 - DISCOVERY

## Introduction

The RM-ROX Frontend Application is a comprehensive web-based management platform developed using React and modern web technologies to enable efficient management and onboarding of Kafka ecosystem resources. The application serves as the centralized interface for managing producers, consumers, topics, schemas, and onboarding processes within the Fulcrum platform.

## RM-ROX Frontend Application - Purpose

The ongoing platform enhancement focuses on-

- To assess the current frontend application architecture, identify integration points with the backend API, evaluate authentication mechanisms (Okta), and document the existing features and capabilities. This document aims to gather requirements, identify dependencies, and evaluate the current state to inform the ideation phase for future enhancements and integrations.

This capability shall be available to fulcrum platform.

## High Level Scope

**In-Scope:**

- Analysis of current React application architecture and component structure.
- Documentation of existing features: Dashboard, Producers, Consumers, Topics, Schemas, and Onboarding workflows.
- Evaluation of Okta authentication integration and fallback mechanisms.
- Identification of API integration patterns and backend service dependencies.
- Assessment of accessibility features and WCAG 2.1 AA compliance implementation.
- Documentation of routing structure, state management, and data flow patterns.
- Review of build and deployment configurations (Vite, Docker, Nginx).

**Out-of-Scope:**

- Backend API development or modifications (assumed to be managed separately).
- Infrastructure provisioning or cloud resource management.
- Development of new features or functionality enhancements.
- Performance optimization or code refactoring activities.
- Third-party service configuration (Okta setup assumed to be provided by DevOps/Platform team).

## Current Status

**Application State:** The RM-ROX frontend application is currently implemented with React 18, Vite build tool, and Tailwind CSS. The application includes:

- Functional authentication with Okta OAuth 2.0 (with local storage fallback)
- Complete CRUD operations for Producers, Consumers, and Onboarding records
- Interactive Topics visualization using React Flow
- Schema registry integration and comparison features
- Responsive design with dark/light theme support
- WCAG 2.1 AA accessibility compliance features

**Integration Status:** The application integrates with a separate backend API service (default: http://localhost:4000) for all data operations. Okta authentication is configured but requires environment variables for full functionality.

## Dependencies

**Backend API Service:**
- Backend API availability and endpoint documentation
- API base URL configuration (VITE_BACKEND_URL environment variable)
- Endpoint specifications for onboardings, schemas, and related resources

**Authentication Service:**
- Okta configuration details (REACT_APP_OKTA_ISSUER, REACT_APP_OKTA_CLIENT_ID)
- Okta application setup and callback URL configuration
- Access to Okta documentation and integration guides

**Development Environment:**
- Node.js 18+ runtime
- npm package manager
- Access to project repository and version control

**External Libraries:**
- React ecosystem dependencies (React Router, React Flow, React Diff Viewer)
- Axios for HTTP client functionality
- Tailwind CSS for styling framework

## Next Steps

1. **Engage Backend Team:** Obtain backend API documentation, endpoint specifications, and integration requirements.
2. **Review Okta Configuration:** Validate Okta setup requirements and obtain necessary credentials for production deployment.
3. **Inventory Application Features:** Document all existing pages, components, and user workflows in detail.
4. **Assess Integration Points:** Identify all API endpoints, data transformation requirements, and error handling patterns.
5. **Review Deployment Pipeline:** Evaluate CI/CD pipeline requirements, Docker configuration, and production deployment process.
6. **Schedule Follow-Up:** Plan a meeting with stakeholders to validate findings and transition to ideation phase for future enhancements.

## References

**React Documentation:**
- https://react.dev

**Vite Build Tool:**
- https://vitejs.dev

**Okta React Integration:**
- https://developer.okta.com/docs/guides/sign-into-spa/react/before-you-begin

**Tailwind CSS:**
- https://tailwindcss.com/docs

**React Router:**
- https://reactrouter.com

**WCAG 2.1 Guidelines:**
- https://www.w3.org/WAI/WCAG21/quickref

**Architectural Engagement/Impact:**
- https://confluence.int.ally.com/display/EBEH/Fulcrum+Integration+Patterns
