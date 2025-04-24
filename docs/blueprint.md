# **App Name**: NostalDamus

## Core Features:

- Hero Banner Component: Display the 'Unlock the Nostalgia Goldmine' hero banner with headline, subtitle, and 'Explore Properties' CTA across key pages.
- Property Library UI: Display a billboard-style chart for browsing properties.  Implement filtering and sorting.
- Remix Idea Generation: Generate creative remix premises based on user-selected properties. The LLM will act as a creative concept generator and tool for producing titles and premises.

## Style Guidelines:

- Primary color: Deep Teal (#008080) to evoke a sense of nostalgia and depth.
- Secondary color: Muted Gold (#B8860B) to add a touch of retro elegance.
- Accent: Electric Blue (#7DF9FF) to highlight key elements and CTAs, creating a modern, energetic feel.
- Use a grid-based layout to structure content effectively, ensuring readability and visual appeal.
- Incorporate pixel-art style icons to reinforce the 90s theme.

## Original User Request:
Okay, you want to create an extremely detailed, "one-shot" prompt that covers everything needed to build the complete NostalDamus prototype as we've defined it, minimizing the need for further clarification during the initial build phase.

This master prompt will integrate project setup, data loading, configuration, and all the specific requirements for each page and AI feature.

Master Prompt for NostalDamus Prototype Build (Comprehensive "One-Shot")

Project Title: NostalDamus Prototype

Core Concept: NostalDamus is a specialized platform designed to identify, evaluate, and creatively explore nostalgic intellectual property (IP) from the mid-1990s (specifically 1993-1998) with high revival potential, leveraging the 30-year nostalgia cycle. It provides analytical insights and creative AI tools for entertainment industry professionals.

Target Audience: Entertainment executives, producers, creative professionals (writers, visual artists), developers, and cultural analysts interested in data-informed and AI-assisted IP revival.

Technology Stack:

Frontend: Your chosen framework (e.g., React, Next.js, Vue.js, Angular) for building the user interface.
Backend/APIs: Firebase Cloud Functions (Node.js or Python) for server-side logic, data access, and orchestrating AI calls.
AI Workflow: Genkit framework running within Firebase Cloud Functions to define and manage AI actions.
AI Models: Google Cloud Vertex AI (specifically accessing Gemini models for text generation/analysis and a Text-to-Image model like Imagen for visual generation).
Database: Firestore (NoSQL cloud database) for storing structured data (property details, user info, saved remix concepts).
Storage: Firebase Storage for hosting image assets (property thumbnails, AI-generated visuals).
Hosting: Firebase Hosting for deploying and serving the web application.
Authentication: Firebase Authentication for managing user accounts.
Initial Project Setup (Steps to Perform First):

Create a New Firebase Project: Go to the Firebase console and create a new project.
Upgrade to Blaze Plan: You will need the Blaze pay-as-you-go plan to enable Cloud Functions (which require billing) and access Google Cloud APIs like Vertex AI.
Enable Firebase Services: Enable Authentication, Firestore, Storage, and Cloud Functions in the Firebase console for your project.
Install Firebase CLI: Install the Firebase command-line interface (npm install -g firebase-tools).
Initialize Firebase Project Locally: Run firebase init in your project directory. Select the services you enabled (Hosting, Functions, Firestore, Storage). Configure your project settings (e.g., public directory for Hosting, language for Functions).
Configure Firestore: Set up initial security rules (start permissive for prototype, then lock down). Consider your data model based on Property Library requirements below.
Configure Storage: Set up initial security rules (start permissive).
Initial Data Loading (Pre-populate for Prototype Functionality):

Source Data & Images: Research and collect data for hundreds of popular properties from 1993-1998 across Music, Movies, TV Shows, Video Games, Toys, and Trends. For each property, find or create a relevant, high-quality thumbnail image.
Prepare Structured Data: Organize the collected data into a structured format (e.g., a JSON file or CSV) that maps to your desired Firestore document structure (see Property Library scope below for required fields).
Upload Images to Firebase Storage: Manually upload the thumbnail images to a designated folder in Firebase Storage (e.g., properties/thumbnails/). Record the download URLs for each image.
Load Data into Firestore: Use the Firebase CLI, a custom script, or a simple web interface you build to import the structured data into a "properties" collection in Firestore. Ensure each document includes all required fields, including the thumbnail_image_url pointing to the image in Storage.
General Requirements (Applicable Site-wide):

Consistent Hero Banner Component: Create a reusable frontend component for the "Unlock the Nostalgia Goldmine" hero banner. It should display the main headline ("Unlock the Nostalgia Goldmine"), a compelling subtitle ("Identify, analyze, and visualize the next big hit from the 90s"), and a primary Call-to-Action button ("Explore Properties"). This component will be included at the top of the Homepage, Property Library, Remix Lab, Analysis Tools, and Market Intelligence pages.
Navigation Menu: Implement a functional navigation component in the header linking to /property-library, /analysis-tools, /remix-lab, /market-intelligence, and /account.
Basic Authentication: Implement user signup, login, and logout using Firebase Authentication. The /account page should display basic user information (e.g., email). Secure pages (like potentially Remix Lab, Analysis Tools, etc., if you choose) should require authentication.
Loading States: Implement clear visual indicators (e.g., spinners, disabled buttons) whenever the application is fetching data (from Firestore, Storage) or waiting for an AI response (from Cloud Functions/Genkit).
Mobile Responsiveness: Design and implement the UI using responsive design principles (CSS media queries, flexible layouts) so it adapts well to different screen sizes.
Basic Error Handling & Feedback: Display user-friendly messages if data fails to load or AI requests encounter errors.
Frontend-Backend Communication: Use the Firebase SDKs (e.g., firebase/firestore, firebase/functions) in your frontend code to interact with Firestore, Storage, and trigger Cloud Functions.
Backend Setup & AI Integration (Firebase Cloud Functions, Genkit, Vertex AI):

Initialize Genkit: Within your Firebase Cloud Functions project, initialize Genkit. Follow the Genkit documentation to set up your environment.
Configure Vertex AI:
In your Google Cloud project (linked to Firebase), enable the Vertex AI API.
Ensure your Cloud Functions have the necessary permissions to call the Vertex AI API (service account roles).
Configure the Genkit Vertex AI plugin with your Google Cloud project ID and location.
Create Genkit Actions (within Cloud Functions): Define specific Genkit actions (which will be deployed as Cloud Functions) to handle the AI logic for the Remix Lab, Analysis Tools, and Market Intelligence. These actions will contain the prompts for the Vertex AI models.
Homepage Scope:

Display the Hero Banner.
Include a "Featured Properties" section below the banner.
Featured Properties Content: Query Firestore to fetch a small, curated list (e.g., top 6 based on a placeholder score or simply 6 notable ones).
For each featured property, display: Name, the relevant thumbnail_image_url from Firestore, brief_description, and placeholder_revival_potential_score.
Each featured property item must be a clickable link to the Analysis Tools page for that specific property (passing the property ID as a URL parameter).
Property Library Page Scope (Robust & Visually Accurate Chart):

Include the Hero Banner.
Goal: Display the comprehensive property list in a visually accurate "Billboard style chart" format, with robust handling for the large dataset.
Data Fetching: Query the "properties" collection in Firestore to retrieve property data.
Display Layout: Billboard Style Chart:
Render the fetched properties in a table or list with columns: Rank (placeholder_rank), Thumbnail Image (thumbnail_image_url), Name, Category, Years, Peak (placeholder_peak), Weeks (placeholder_weeks), and Action (an "Analyze" button/link).
Display the thumbnail images from Firebase Storage within the list rows at a small, consistent size.
Apply CSS for a clean, chart-like visual style (borders, alternating row colors, clear headers).
Robust List Handling (Frontend & Firestore Queries):
Implement Pagination: Fetch data in pages (e.g., 20-50 properties per query) using Firestore's limit() and startAfter() or startAt() methods based on the user's current page.
Implement Filtering: Create UI filters for Category, Years (range or specific), and Genres/Subgenres. Use Firestore where() clauses in your queries to filter the data fetched from the backend.
Implement Sorting: Allow sorting by placeholder_rank, name, years, placeholder_peak, placeholder_weeks, and placeholder_revival_potential_score. Use Firestore orderBy() clauses in your queries.
Linking: Each row must link to the Analysis Tools page for that property (passing the property ID).
Display loading states for data fetching/filtering/sorting.
Remix Lab Page Scope:

Include the Hero Banner.
Goal: Generate creative remix concepts (text and conditional visual) using AI.
Input Interface:
Display available properties (can query from Firestore).
UI to select one or more properties (e.g., checkboxes, a selection list).
UI to choose a "Reboot Type": TV Show, Movie, Video Game, Toys.
"Generate Remix" button.
AI Generation Pipeline (Firebase Cloud Function + Genkit + Vertex AI):
Create a Genkit action (deployed as a Cloud Function) named generateRemix.
This action takes selected property IDs/names and reboot type as input.
Inside generateRemix:
Fetch property data from Firestore using the input IDs.
AI Call 1 (Text - Vertex AI Gemini): Construct a detailed prompt for a Vertex AI Gemini model, instructing it to act as a creative concept generator and produce: a Remix Title, a Robust Remix Premise (1-2 paragraphs), and an Original Concept Breakdown (brief overview for each selected property, formatted for a list).
AI Call 2 (Visual - Conditional Text-to-Image AI): Attempt to construct a prompt (based on the generated premise) for a Text-to-Image AI model (like Imagen via Vertex AI or other API). Call the API. Implement logic to return null/error if image generation fails or is skipped.
Return the text output and image data/URL (if available) to the frontend.
Output Display:
Display the generated Remix Title.
Display the Original Concept Breakdown (using a list format).
Display the Robust Remix Premise.
Conditionally display the generated Concept Image. If image data is available, show the image (load from URL if necessary). If not, hide the image element or show a placeholder message.
Loading indicator while generating.
(Optional): "Save Concept" button to save generated text + image URL to Firestore.
Analysis Tools Page Scope:

Include the Hero Banner.
Goal: Provide AI-generated, text-based analysis simulating actionable intelligence.
Input Interface:
UI to select one or more properties.
Page should load pre-selected property if ID is in URL parameters.
UI to choose a "Reboot Type": TV Show, Movie, Video Game, Toys.
"Analyze" button.
AI-Generated Analysis Pipeline (Firebase Cloud Function + Genkit + Vertex AI):
Create a Genkit action (Cloud Function) named analyzeProperty.
This action takes selected property IDs/names and reboot type as input.
Inside analyzeProperty:
Fetch property data from Firestore.
AI Call (Vertex AI Gemini): Construct a detailed prompt for a Vertex AI Gemini model, instructing it to act as an entertainment industry analyst and generate a structured, plausible text analysis. The analysis should cover potential appeal, format compatibility, opportunities, and challenges, and use illustrative numbers.
Formatting Instruction: Instruct the AI to format the analysis using Markdown (headings, lists, paragraphs).
Return the AI-generated Markdown text to the frontend.
Output Display:
Display the generated analysis text using a Markdown rendering library in your frontend.
Use CSS to style the rendered Markdown.
Include a static image placeholder for a graph/chart.
Loading indicator while analyzing.
Market Intelligence Page Scope:

Include the Hero Banner.
Goal: Display a detailed, AI-generated trend report for 1993-1998.
Content Source:
Simplest Prototype: Copy the Markdown text of the detailed "1993-1998 Generative AI Deep Research Trend Report" (from our previous discussion) and store it as a string in your frontend or a file in Firebase Storage. Fetch and display this static content.
More Dynamic Prototype (Optional for first pass): Create a Genkit action (Cloud Function) named generateTrendReport. This action takes the year range (1993-1998) as input and calls a Vertex AI Gemini model with the detailed prompt for the deep research report (as written in our previous turns, emphasizing detail and Markdown formatting). The page would call this function to get the report dynamically.
Display Layout:
Display the report content using a Markdown rendering library in your frontend.
Use CSS to style the rendered report for readability (clear headings, lists, paragraphs).
Visuals (Static): Include static image placeholders or relevant visuals integrated within or alongside the report content.
Loading indicator if fetching the report dynamically.
  