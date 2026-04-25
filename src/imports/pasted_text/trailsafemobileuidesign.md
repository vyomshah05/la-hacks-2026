Design a modern mobile app UI for an offline wilderness survival and hiking safety app called TrailSafe. This is a mobile app built in React Native with Expo. The app helps users navigate and survive when lost outdoors, especially with no internet connection.

Core product concept:
TrailSafe automatically prepares for low-signal or offline situations by downloading and storing a compact offline map of the user’s nearby area on-device. It refreshes the surrounding map area every 24 hours, up to around 10 km², and allows the user to browse, search, and navigate that map fully offline. If the user gets lost, the app helps them with:
1) an offline map,
2) a live camera AR guidance view that shows where to go,
3) an AI guide / agent that chats with them, gives reminders, and helps guide them back.

App structure:
The app has 3 major experiences:
- Map: offline tile download, route display, location history, search, destination guidance
- AI Guide: local + cloud agent routing, survival reminders, lost-mode chat support
- Voice / SOS: chat, spoken guidance, emergency beacon / rescue support
- AR Overlay: the most important UI in the app when a user is lost; this is the screen they stare at in a high-stress outdoor situation

Design goals:
- mobile-first, portrait iPhone layout
- readable in bright sunlight
- one-handed use
- map-first and safety-first
- calm, trustworthy, minimal, modern
- premium outdoors aesthetic, but not playful
- highly legible typography, strong contrast, large touch targets
- clean hierarchy, rounded cards, floating controls, bottom sheets
- colors: muted greens, slate, off-white, dark translucent overlays, with one warm warning accent
- the UI should feel believable as a real consumer safety app and impressive enough for a hackathon demo

Important product behaviors the UI should communicate:
- maps are stored offline on-device
- nearby area downloads every 24 hours
- user can browse and search the downloaded map without internet
- live location and route history are preserved
- camera-based guidance helps the user choose a direction or path
- the AI guide can give reminders, live chat support, and navigation help while the user is lost
- offline state and readiness must always be obvious

Create the following mobile screens:

1. Onboarding / Safety Setup
- short explanation of offline survival functionality
- ask for location permission
- ask for camera permission
- optional notifications / safety reminders
- optional SOS / emergency contact setup
- CTA: “Enable Safe Hike Mode”

2. Home Screen
- top status card showing:
  - connectivity quality
  - offline map readiness
  - battery level
  - last map refresh/download time
- quick actions:
  - Start Hike
  - Open Offline Map
  - Lost Mode
  - AR Guide
- compact map preview
- small checklist card with safety prep items

3. Offline Map Screen
- full-screen map is the primary visual focus
- current location dot
- saved start point / trailhead marker
- destination marker
- breadcrumb trail / route history
- downloaded map boundary visible
- search or “Find” bar at top
- floating controls for recenter, compass, download area
- bottom sheet showing:
  - offline status
  - downloaded area size
  - storage usage
  - “Available offline”
- this screen must feel useful with zero signal

4. Download / Refresh Area Screen
- explain that the app stores a compact offline map locally
- show the selected nearby region for offline use
- indicate 24-hour refresh behavior
- show progress bar / downloading state
- show estimated storage size
- CTA: “Save Offline Area”

5. Lost Mode Screen
- emergency-focused mode
- strong visual hierarchy
- reassuring headline like “You’re Offline, but Not Lost”
- show current status:
  - offline / online
  - last known location saved
  - battery level
  - whether user is stationary
- large action buttons:
  - Guide Me Back
  - Show Last Known Path
  - Open AR View
  - Contact SOS
- map snapshot and next-step instructions
- calm but serious tone

6. AR Guidance Screen
This is the most important screen in the product.
It should be designed as the critical “lost outdoors” interface and must feel readable, stable, and trustworthy.

Layout:
- camera feed as full-screen background
- small top status bar showing:
  - GPS accuracy
  - compass accuracy
  - distance to destination
- large centered directional arrow pointing toward the destination
- large bold distance label below arrow, such as “1.4 km”
- destination label below the distance
- bottom semi-transparent dark strip showing:
  - heading in degrees
  - cardinal direction
- optional mini map inset in a corner
- optional confidence badge like “Likely trail ahead” or “Heading to trailhead”

AR screen design requirements:
- bright daylight readability
- very high contrast overlays
- large arrow and distance text
- must work one-handed
- clean, uncluttered interface
- should feel like the user can rely on it in a high-stress moment
- no futuristic sci-fi clutter; practical and calm

7. AI Guide / Chat Screen
- chat interface for the survival agent
- suggestions like:
  - “Am I going the right way?”
  - “Guide me back to the trailhead”
  - “What should I do if I stay offline?”
  - “Remind me to conserve battery”
- header should show:
  - offline / online
  - map ready
  - current guidance mode
- chat should feel grounded in the map, route history, position, and surroundings
- include reminder cards and survival tips

8. Voice / SOS Screen
- emergency help experience
- voice interaction UI for spoken guidance
- SOS panel with location payload preview
- show last known position and location history summary
- show battery level and timestamp
- strong CTA for SOS beacon / emergency contact
- should feel urgent but controlled

9. Navigation Back to Safety Screen
- step-by-step guidance UI
- highlighted recommended route on map
- progress toward trailhead or destination
- directional compass indicator
- switch between map mode and AR mode
- clear next action card like “Walk 120 m northeast”

Design system guidance:
- use a cohesive mobile design system
- consistent typography, spacing, chips, floating buttons, bottom sheets, status pills, and translucent overlays
- prioritize trust, clarity, safety, and legibility over novelty
- the map should remain the core anchor of the product
- AI and AR should support the map, not overpower it
- make offline readiness visible across all major screens

Output:
Generate polished, cohesive mobile app screens suitable for a React Native / Expo app called TrailSafe. The design should look production-inspired, demo-ready for a hackathon, and centered around offline navigation, AR guidance, and survival support.

