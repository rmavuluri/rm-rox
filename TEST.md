Fulcrum Dashboard – Ideation Document

Overview

The Fulcrum Dashboard will be developed as a comprehensive, web-based management platform using modern frontend technologies. The goal is to create an intelligent, event-driven interface that allows efficient management of Kafka ecosystem resources such as producers, consumers, topics, schemas, and onboarding workflows. The application will also include authentication through Okta, AI chatbot integration, and seamless backend connectivity.

⸻

1. Application Architecture and Technology Stack

The dashboard will be designed using React with Vite for faster development and optimized builds. It will use TypeScript for type safety and maintainability, and Tailwind CSS for consistent UI styling. Backend services will be powered by Spring Boot or Node.js/Express, depending on the service design. Terraform will be used for infrastructure provisioning and Docker/Nginx for deployment.

The platform will adopt a modular architecture, separating core UI components, authentication, routing, and API integration layers. This ensures scalability, maintainability, and easier feature enhancements in the future.

⸻

2. Authentication and Access Management

User authentication will be implemented using Okta SDK integrated with React/Vite. The setup will handle login, logout, and session management. Role-based access control (RBAC) will determine visibility and permissions for different user types, enabling role-based UI rendering and secure access to protected routes.

⸻

3. Dashboard Features and Functional Modules

The main features of the dashboard will include:
	•	Dashboard Home: Centralized view summarizing cluster status, topic metrics, and consumer activity.
	•	Producers and Consumers Management: Interfaces to onboard, configure, and monitor producer/consumer groups.
	•	Topics and Schemas: Detailed view and CRUD capabilities for topics and schemas, integrated with Glue schema registry.
	•	Onboarding Workflows: Guided processes for new LOB integrations into the Fulcrum ecosystem.
	•	AI Chatbot: Integrated AI assistant to guide users in configuration and troubleshooting activities.

Each feature will follow a micro-frontend style modular approach to allow independent deployment and scalability.

⸻

4. Application Flow and Routing

The routing structure will be defined using React Router, incorporating state management with Redux Toolkit or Recoil to manage data flow across modules. Navigation will be seamless, with lazy loading for large modules and error boundaries to ensure a smooth user experience.

Data flow patterns will follow unidirectional data flow, with components communicating through well-defined context providers. API responses will be normalized and cached for better performance.

⸻

5. Build and Deployment Strategy

Build and deployment configurations will leverage Vite, Docker, and Nginx. The CI/CD pipelines will be integrated using GitLab CI, with Terraform modules incorporated for infrastructure automation. Each deployment will include automated testing, security scanning, and version tagging.

The deployment will support both development and production environments with environment-based configuration management.

⸻

6. Integration with DevOps and Backend

Terraform modules from the DevOps repository will be integrated to manage MSK clusters, IAM roles, and associated resources. The frontend will communicate with backend services through RESTful APIs or GraphQL endpoints. All service endpoints and schema dependencies will be documented for reference.

Backend APIs (developed in Spring Boot or Node.js) will handle data aggregation, authentication, and orchestration with AWS components like MSK, EventBridge, and Glue.

⸻

7. Performance and Optimization

Performance will be a key focus during implementation. Code will be optimized by using Vite’s build-time bundling, React Suspense for asynchronous loading, and caching mechanisms. API responses will be compressed and paginated to reduce latency. Continuous profiling and monitoring using Grafana and Prometheus will ensure real-time visibility into performance metrics.

⸻

8. Accessibility and Compliance

The user interface will comply with WCAG 2.1 AA accessibility standards to ensure inclusivity. Keyboard navigation, color contrast, and screen reader compatibility will be tested and validated throughout the development cycle.

⸻

9. Infrastructure and Environment Management

Cloud resources will be provisioned using Terraform for consistency and reproducibility. Each environment (Dev, QA, Prod) will be maintained separately with access control through AWS IAM. Configuration data and credentials will be securely managed via AWS Secrets Manager.

⸻

10. Next Steps
	1.	Finalize UI wireframes and design components.
	2.	Set up GitLab repository and establish CI/CD pipelines.
	3.	Implement authentication and routing.
	4.	Develop core dashboard modules and API integrations.
	5.	Conduct unit, integration, and performance testing.
	6.	Prepare deployment scripts and infrastructure setup.
	7.	Launch the MVP and gather user feedback for enhancement.

⸻

Would you like me to include a diagram section (like architecture or workflow) and a timeline/milestone table next to make this ideation document ready for leadership presentation?

Target High-Level Value and Benefits

The Fulcrum Dashboard aims to deliver a unified, intelligent interface for managing Kafka ecosystem resources and accelerating digital business operations across the enterprise. It transforms the traditionally complex event-driven architecture into a simplified, secure, and responsive platform.

Key Business Values
	1.	Operational Efficiency:
Centralizes the management of producers, consumers, topics, and schemas, reducing operational overhead and manual interventions across lines of business (LOBs).
	2.	Faster Onboarding:
Provides automated onboarding workflows for LOB integrations, enabling new teams or systems to be connected to the Fulcrum platform in minutes rather than days.
	3.	Enhanced Observability and Insights:
Integrates with monitoring tools like Grafana and Prometheus, offering real-time cluster insights, event flow tracking, and system health visibility.
	4.	Security and Compliance:
Implements Okta authentication for secure access management and AWS Secrets Manager for credential protection, ensuring compliance with enterprise security policies.
	5.	Scalability and Reusability:
Built on a modular, cloud-native architecture that can easily scale to handle enterprise-grade workloads and be reused across multiple digital initiatives.
	6.	AI-Powered Guidance:
Embedded AI chatbot assists users in troubleshooting, onboarding, and operational decisions—reducing dependency on manual support and enabling proactive issue resolution.
	7.	Developer Productivity:
Streamlined CI/CD pipeline integration, Terraform automation, and code modularity allow faster iterations and reduced deployment time.

⸻

Architecture Engagement

The architecture engagement focuses on strategic alignment, technical governance, and cross-domain collaboration to ensure the Fulcrum Dashboard integrates seamlessly within the enterprise ecosystem.

1. Architectural Design Alignment
	•	Aligns with enterprise event-driven architecture principles to ensure interoperability across all LOB systems.
	•	Promotes standardization by defining reusable modules for authentication, data flow, and integration patterns.
	•	Supports multi-environment consistency through Terraform-based IaC and GitLab CI/CD automation.

2. Cross-Team Engagement
	•	DevOps Collaboration: Integration with Terraform and Docker pipelines ensures consistent build and release processes.
	•	Security & IAM Teams: Continuous validation of access controls and Okta integration patterns.
	•	Data and Platform Teams: Establish clear boundaries for topic ownership, schema evolution, and Glue catalog integration.
	•	AI/Analytics Teams: Collaboration to design the AI chatbot and real-time monitoring insights powered by event data.

3. Governance and Standards
	•	Enforces naming conventions, schema governance, and version control for Kafka topics and connectors.
	•	Adheres to architecture review board (ARB) standards for scalability, resilience, and compliance.
	•	Periodic architecture reviews will ensure technology choices remain aligned with enterprise roadmap and modernization strategy.

⸻

Impact

The Fulcrum Dashboard will have a transformative impact on both technical and business operations, acting as the central nervous system of event-driven communication within the enterprise.

1. Technical Impact
	•	Unified Platform: Brings together disparate producer and consumer systems into a single managed interface.
	•	Faster Issue Resolution: Real-time anomaly detection and AI-guided diagnostics minimize downtime.
	•	Optimized Resource Usage: Terraform-managed infrastructure and performance metrics reduce cloud resource wastage.
	•	Improved Reliability: Automated CI/CD pipelines and monitoring enable consistent, repeatable deployments with minimal manual effort.

2. Business Impact
	•	Reduced Time-to-Market: Onboarding new event sources or consumers becomes a self-service, low-touch process.
	•	Cost Optimization: Eliminates redundant systems and reduces licensing or custom integration costs.
	•	Empowered Teams: Enables business users to view, analyze, and act on real-time event data without deep technical dependency.
	•	Innovation Enablement: Provides the foundation for future AI-driven enhancements, predictive analytics, and autonomous operations.

⸻



Fulcrum Dashboard Overview

The Fulcrum Dashboard is a unified management console designed to simplify and accelerate the onboarding, monitoring, and governance of the Kafka ecosystem within the Fulcrum platform. It addresses the key challenge of fragmented visibility and manual coordination across producers, consumers, topics, and schemas in event-driven systems.

By providing a single pane of glass for operational insights, onboarding workflows, and intelligent automation, the dashboard reduces dependency on engineering teams, improves operational efficiency, and ensures consistent governance across lines of business. It also integrates with AI-driven assistants to enhance decision-making and streamline event management tasks.

⸻

Business Outcomes (Reframed In-Scope Items)
	1.	Operational Efficiency and Standardization
Establish a consistent framework for managing Kafka resources—producers, consumers, topics, and schemas—through standardized onboarding workflows and self-service capabilities.
	2.	Faster Time to Onboard New Applications
Simplify onboarding for line-of-business teams by automating configuration and validation steps, minimizing manual intervention, and reducing setup time.
	3.	Improved Governance and Compliance
Ensure role-based access, data visibility, and traceability across all Kafka resources through centralized authentication and access control mechanisms.
	4.	Enhanced User Experience and Productivity
Deliver an intuitive, role-based dashboard that adapts to user needs, improving navigation, reducing complexity, and enhancing overall platform adoption.
	5.	Increased Platform Reliability and Security
Incorporate secure session management, authentication fallback mechanisms, and CI/CD-driven automated deployment to reduce operational risks and improve uptime.
	6.	Optimized Performance and Resource Utilization
Enable proactive monitoring and performance tuning, ensuring responsive UI, optimized build pipelines, and efficient use of cloud infrastructure resources.
	7.	Improved Cross-Team Collaboration
Integrate with DevOps workflows, ensuring seamless coordination between frontend, backend, and infrastructure teams, and accelerating release cycles.
	8.	Accessibility and Compliance Readiness
Deliver a compliant, inclusive interface aligned with WCAG 2.1 AA accessibility standards, ensuring usability across diverse user groups.





=================================================


Summary of Impact

The Fulcrum Dashboard will have a major impact by providing a single, unified place to manage all Kafka-related resources such as producers, consumers, topics, and schemas. It will make the onboarding of new applications faster and reduce the amount of manual work done by engineering teams through automation and self-service features. The dashboard will also improve visibility and control across the entire event-driven ecosystem, helping different teams collaborate more efficiently. By standardizing processes and ensuring compliance through built-in access control and monitoring, it will enhance security, reliability, and operational efficiency. Overall, the Fulcrum Dashboard will streamline event management, improve productivity, and support better governance across all lines of business.

⸻

Actions Needed
	1.	Platform Enablement
	•	Develop and deploy the Fulcrum Dashboard UI.
	•	Implement role-based access control (RBAC) with IAM and internal authentication.
	•	Enable automated onboarding workflows for producers and consumers.
	2.	API and Schema Enhancements
	•	Develop APIs for topic management (create, list).
	•	Implement schema management APIs (create, list, compare).
	•	Establish schema validation and version governance through Glue Schema Registry.
	3.	Operational and Compliance Enhancements
	•	Centralize auditing, access, and compliance reporting within the dashboard.
	•	Integrate monitoring and performance analytics for proactive tuning.
	•	Implement accessibility improvements (WCAG 2.1 AA standards).
	4.	Documentation and Training
	•	Create onboarding and usage documentation for business users.
	•	Conduct enablement sessions for LOBs to utilize dashboard capabilities.
	5.	DevOps and Integration
	•	Integrate with existing DevOps workflows (GitLab CI/CD, Terraform).
	•	Ensure consistent coordination between frontend, backend, and infrastructure teams.

⸻

Notes
	•	Immediate Focus Areas:
	•	Onboarding producers and consumers through the dashboard.
	•	Role-based access control.
	•	Topic and schema management APIs.
	•	Documentation and user guidance.
	•	AI and Automation Integration:
The dashboard is designed to include AI-driven assistants to automate decision-making and governance activities.
	•	Out of Scope (for current release):
	•	Topic-level monitoring.
	•	Event data filtering within topics.
	•	IAM role creation.
	•	Strategic Alignment:
These enhancements align with enterprise goals of efficiency, compliance, and data-driven governance, enabling rapid onboarding of new event-based applications.

⸻

Impacted Applications / Systems





Dashboard Project – Implementation Approach

1. User Interface (UI) Design

Main Point:
Design and finalize the initial UI layouts for the Dashboard application.

Details:
	•	Create responsive UI layouts for Home, Topics, and Schema pages.
	•	Ensure designs align with enterprise UI standards and usability guidelines.
	•	Keep the design modular to support future enhancements and feature expansion.

⸻

2. Repository Setup

Main Point:
Establish GitLab repositories to support application development and configuration management.

Details:
	•	Create separate repositories for:
	•	UI application
	•	Kong configuration
	•	Admin client services
	•	Secrets and configuration artifacts
	•	Enforce repository standards such as branching strategy, access controls, and code ownership.

⸻

3. UI Application Folder Structure

Main Point:
Define a scalable and maintainable folder structure for the UI application.

Details:
	•	Organize the project into logical folders including:
	•	Components
	•	Pages
	•	Services
	•	Utilities
	•	Routing
	•	Configuration
	•	Hooks
	•	Ensure the structure supports reusability, testability, and long-term maintainability.

⸻

4. Dependency Identification

Main Point:
Identify and document all initial project dependencies.

Details:
	•	Define core dependencies such as React, Vite, Tailwind CSS, and routing libraries.
	•	Capture development and testing dependencies separately.
	•	Ensure dependency versions comply with enterprise security and compliance standards.

⸻

5. Tooling and Build Configuration

Main Point:
Configure essential build and development tools for the UI application.

Details:
	•	Configure Vite for build and development workflows.
	•	Set up PostCSS and Tailwind CSS for styling.
	•	Configure ESLint to enforce code quality and consistency across the codebase.

⸻

6. Code Formatting Standards

Main Point:
Standardize code formatting and repository hygiene.

Details:
	•	Configure Prettier for consistent code formatting.
	•	Define .npmrc, .npmignore, and .gitignore files to manage package behavior and repository cleanliness.
	•	Ensure formatting rules are aligned with team and enterprise standards.

⸻

7. Build and Automation Scripts

Main Point:
Create standardized scripts for application lifecycle management.

Details:
	•	Define scripts in package.json for:
	•	Build
	•	Unit testing
	•	Linting
	•	Custom operational tasks
	•	Ensure scripts are reusable across environments (local, CI/CD).

⸻

Infrastructure and Backend Enablement

8. ECS Infrastructure Provisioning

Main Point:
Provision ECS infrastructure using Terraform.

Details:
	•	Create Terraform scripts leveraging predefined Fulcrum modules where applicable.
	•	Configure ECS services with required containers:
	•	Main application container
	•	Sidecar container
	•	SSL initialization container
	•	Ensure infrastructure follows security, scalability, and availability best practices.

⸻

9. Secrets Management

Main Point:
Securely manage dashboard-related secrets.

Details:
	•	Store all sensitive configuration values in AWS Secrets Manager.
	•	Ensure proper IAM permissions and secret rotation policies are applied.
	•	Avoid hardcoding secrets in code or configuration files.

⸻

10. Kong Proxy Onboarding

Main Point:
Onboard dashboard services to Kong for API management.

Details:
	•	Configure new proxy routes directly in Kong.
	•	Apply authentication, authorization, and rate-limiting policies as required.
	•	Ensure consistency with existing enterprise API gateway standards.

⸻

11. OpenAPI Specification

Main Point:
Define OpenAPI specifications for Topics and Schemas APIs.

Details:
	•	Document request/response models for Topics and Schemas.
	•	Ensure specifications are versioned and reusable.
	•	Use OpenAPI as the contract for frontend, backend, and gateway integration.

⸻

12. API Gateway and Authorization

Main Point:
Implement API Gateway and authorization layers.

Details:
	•	Configure API Gateway endpoints aligned with OpenAPI specifications.
	•	Implement Authorizer layers for secure access control.
	•	Grant required permissions for downstream services and Lambda functions.

⸻

13. Admin Client Lambda

Main Point:
Develop an admin client Lambda to interact with MSK.

Details:
	•	Implement Lambda to fetch Topics and Schemas from MSK.
	•	Follow the defined OpenAPI specification for data exposure.
	•	Ensure proper error handling, logging, and observability.

⸻

14. UI Components for Topics and Schemas

Main Point:
Develop UI components to display and manage Topics and Schemas.

Details:
	•	Build reusable UI components aligned with backend APIs.
	•	Support pagination, filtering, and search where applicable.
	•	Ensure components are accessible and responsive.

⸻

15. Documentation

Main Point:
Create comprehensive documentation for the entire implementation.

Details:
	•	Document setup, configuration, and deployment steps.
	•	Include architectural decisions, API contracts, and operational guidelines.
	•	Ensure documentation is clear, up to date, and accessible to all stakeholders.

	===================



	Dashboard Project – Tasks & User Flows

⸻

1. UI Design for Home, Topics, and Schemas Pages

Tasks
	•	Identify who will use the dashboard (Developer, Admin)
	•	Decide what information appears on:
	•	Home page
	•	Topics page
	•	Schemas page
	•	Create simple wireframes (layout only, no colors)
	•	Review and finalize page layouts

User Flow
	1.	User logs into the Dashboard
	2.	User lands on Home page
	3.	User clicks Topics or Schemas
	4.	User views information (read-only)

⸻

2. Create GitLab Repositories (UI, Kong, Admin Client, Secrets)

Tasks
	•	Create GitLab repositories for:
	•	UI application
	•	Kong proxy configuration
	•	Admin client Lambda
	•	Secrets/configuration
	•	Set access permissions and branch rules

User Flow
	1.	Developer opens GitLab
	2.	Developer selects the correct repository
	3.	Developer pulls code, makes changes, and commits

⸻

3. Define UI Folder Structure

Tasks
	•	Create folders for:
	•	Components
	•	Pages
	•	Services
	•	Utils
	•	Routing
	•	Config
	•	Hooks
	•	Ensure structure is consistent and easy to navigate

User Flow
	1.	Developer opens UI project
	2.	Developer quickly finds files based on folder purpose
	3.	Developer adds new pages or components easily

⸻

4. Identify Initial Project Dependencies

Tasks
	•	Identify required libraries (React, routing, UI components)
	•	Separate runtime and development dependencies
	•	Document dependency purpose

User Flow
	1.	Developer installs dependencies
	2.	Application builds successfully
	3.	Developer starts UI development

⸻

5. Configure Vite, Tailwind, PostCSS, and ESLint

Tasks
	•	Configure Vite for build and dev server
	•	Setup Tailwind CSS for styling
	•	Configure PostCSS
	•	Setup ESLint for code quality

User Flow
	1.	Developer runs npm start
	2.	UI loads locally
	3.	Linting catches issues during development

⸻

6. Setup Prettier, npmrc, npmignore, gitignore

Tasks
	•	Configure Prettier for formatting
	•	Define .gitignore to avoid unwanted files
	•	Configure npm settings

User Flow
	1.	Developer writes code
	2.	Code is auto-formatted
	3.	Clean commits are pushed to GitLab

⸻

7. Create Build, Test, and Custom Scripts

Tasks
	•	Add scripts for:
	•	Build
	•	Unit tests
	•	Linting
	•	Custom operations
	•	Test scripts locally

User Flow
	1.	Developer runs build/test commands
	2.	CI pipeline uses same scripts
	3.	Consistent builds across environments

⸻

8. Create Terraform Scripts for ECS

Tasks
	•	Create Terraform code for ECS service
	•	Use Fulcrum predefined modules
	•	Configure:
	•	Main container
	•	Sidecar container
	•	SSL init container

User Flow
	1.	Infrastructure engineer runs Terraform
	2.	ECS service is created
	3.	UI application is deployed

⸻

9. Maintain Secrets in AWS Secrets Manager

Tasks
	•	Identify all secrets (API keys, credentials)
	•	Store secrets securely in AWS Secrets Manager
	•	Grant ECS and Lambda access

User Flow
	1.	Application starts
	2.	Secrets are fetched securely
	3.	No secrets stored in code

⸻

10. Onboard New Proxy to Kong

Tasks
	•	Create Kong proxy configuration
	•	Define routes and services
	•	Apply required policies (auth, rate limit)

User Flow
	1.	API request comes from UI
	2.	Request goes through Kong
	3.	Request is routed to backend service

⸻

11. Create OpenAPI Specification (Topics & Schemas)

Tasks
	•	Define APIs for:
	•	Get Topics
	•	Get Schemas
	•	Document request and response formats
	•	Version the API

User Flow
	1.	UI calls API using OpenAPI contract
	2.	Backend returns standardized response
	3.	UI displays data correctly

⸻

12. Create API Gateway and Authorizer

Tasks
	•	Configure API Gateway endpoints
	•	Setup authorization layer
	•	Grant permissions to Lambda and ECS

User Flow
	1.	UI sends request
	2.	API Gateway validates access
	3.	Authorized request reaches backend

⸻

13. Develop Admin Client Lambda (MSK Integration)

Tasks
	•	Create Lambda to fetch topics and schemas from MSK
	•	Follow OpenAPI contract
	•	Add logging and error handling

User Flow
	1.	UI calls Topics/Schemas API
	2.	API Gateway invokes Lambda
	3.	Lambda fetches data from MSK
	4.	Response sent back to UI

⸻

14. Develop UI Components for Topics and Schemas

Tasks
	•	Create reusable UI components
	•	Display topics and schema data
	•	Handle loading, empty, and error states

User Flow
	1.	User clicks Topics or Schemas
	2.	UI loads data
	3.	User views structured information

⸻

15. Create Documentation

Tasks
	•	Document:
	•	UI setup
	•	Infrastructure setup
	•	API usage
	•	Keep documentation simple and step-by-step

User Flow
	1.	New team member reads documentation
	2.	Understands how system works
	3.	Can contribute without extra help

⸻

Simple End-to-End User Flow (Q1)
	1.	User logs into Dashboard
	2.	User views Home page
	3.	User navigates to Topics
	4.	User reviews topic details
	5.	User navigates to Schemas
	6.	User reviews schema structure

⸻

Key Focus for Q1
	•	Read-only access
	•	Clear visibility
	•	Simple navigation
	•	Strong foundation for future onboarding

⸻

If you want next, I can:
	•	Convert this into UX JIRA tasks
	•	Draw a simple user flow diagram
	•	Create Q1 vs Future scope mapping
	•	Align tasks to sprint planning

Just let me know.


High-Level Use Cases – Dashboard (Fulcrum)

1. View Dashboard Overview (Q1)
	•	Users access a single dashboard to understand what Fulcrum provides
	•	Users quickly see available sections such as Topics and Schemas
	•	Users gain confidence that they are viewing trusted, platform-approved data

⸻

2. Discover Available Topics (Q1)
	•	Users view a list of Kafka topics available on the platform
	•	Users understand the purpose and ownership of each topic
	•	Users avoid creating duplicate or incorrect topics
	•	Users reduce dependency on platform teams for basic discovery

⸻

3. Review Topic Details (Q1)
	•	Users view metadata for a selected topic
	•	Users understand how a topic is intended to be used
	•	Users identify which schemas are associated with a topic

⸻

4. Discover Available Schemas (Q1)
	•	Users view schemas published on the platform
	•	Users understand event structure before integration
	•	Users reduce integration and data quality issues

⸻

5. Review Schema Details (Q1)
	•	Users inspect schema fields and data types
	•	Users verify compatibility with their applications
	•	Users gain clarity without needing platform support

⸻

6. Navigate Between Topics and Schemas (Q1)
	•	Users move easily between related topics and schemas
	•	Users maintain context while exploring platform data
	•	Users experience a consistent and intuitive UI flow

⸻

7. Secure Access to Dashboard (Q1 – Foundational)
	•	Users access the dashboard through existing authentication
	•	Users only see data they are permitted to view
	•	The platform enforces basic access controls

⸻

8. Centralized Visibility for Platform Data (Q1)
	•	Users rely on one trusted interface instead of multiple tools
	•	Platform information is consistent across teams
	•	Operational confusion is reduced

⸻

Future-Phase Use Cases (Out of Scope for Q1)

9. Submit Onboarding Requests
	•	Users request creation of new topics or schemas
	•	Requests follow a standardized and auditable process

⸻

10. Approve or Reject Onboarding Requests
	•	Privileged users review onboarding requests
	•	Governance and compliance requirements are enforced

⸻

11. Role-Based Dashboard Views
	•	Users see different UI experiences based on their role
	•	Actions are limited according to permissions

⸻

12. Track Onboarding Status
	•	Users monitor the progress of their onboarding requests
	•	Platform teams reduce manual status updates

⸻

13. AI-Assisted Onboarding (Longer Term)
	•	Users receive guidance during onboarding
	•	Common errors are reduced
	•	Time to integration is shortened
