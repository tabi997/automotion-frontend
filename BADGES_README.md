# Badge System for Vehicle Photos

## Overview
The badge system allows administrators to add visual indicators to vehicle photos in the stock page. Badges appear strategically positioned on vehicle images to highlight special features or status.

## Features

### Available Badges
- **🔥 Hot right now** - Urgent badge for high-demand vehicles
- **⭐ In demand** - Warning badge for popular vehicles
- **🔒 Reserved** - Info badge for reserved vehicles
- **🆕 New arrival** - Success badge for newly added vehicles
- **💰 Special offer** - Warning badge for vehicles with special pricing

### Badge Positioning
- Badges are positioned in the top-left corner of vehicle photos
- They have a subtle shadow for better visibility
- Multiple badges can be displayed simultaneously
- Badges are strategically placed to not obstruct the vehicle image

### OpenLane Integration
- The OpenLane redirect button has been moved from the photo to the bottom action area
- It now appears as a blue button next to "Detalii" and the phone icon
- This provides better UX and more space for photo badges

## Implementation

### Database Changes
- Added `badges` field to the `stock` table (JSONB type)
- Badges are stored as an array of objects with structure:
```json
{
  "id": "string",
  "text": "string", 
  "type": "success|warning|info|urgent",
  "icon": "string (optional)"
}
```

### Admin Interface
- Badge management is available in the vehicle form (Add/Edit Vehicle)
- Located in the "Detalii" tab under "Badge-uri vehicul"
- Checkboxes allow easy selection of multiple badges
- Badges are saved with the vehicle data

### Frontend Display
- Badges are rendered on the stock page vehicle cards
- They appear overlaid on the vehicle photos
- Responsive design ensures badges work on all screen sizes
- Badges use the existing Badge component with appropriate styling

## Usage

### Adding Badges to Vehicles
1. Go to Admin → Stock → Add Vehicle or Edit Vehicle
2. Navigate to the "Detalii" tab
3. Scroll down to "Badge-uri vehicul" section
4. Check the desired badges
5. Save the vehicle

### Badge Types and Colors
- **Success** (Green): New arrival
- **Warning** (Orange): In demand, Special offer  
- **Info** (Blue): Reserved
- **Urgent** (Red): Hot right now

## Technical Details

### Migration
Run the migration to add the badges field:
```sql
-- Add badges field to stock table
ALTER TABLE public.stock ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
```

### TypeScript Types
Updated `StockVehicle` interface to include:
```typescript
badges?: VehicleBadge[];
```

### Testing
Use the test script to add sample vehicles with badges:
```bash
node scripts/test-badges.js
```

## Future Enhancements
- Custom badge creation
- Badge positioning options
- Badge expiration dates
- Badge analytics and tracking
- Badge templates for different vehicle types
