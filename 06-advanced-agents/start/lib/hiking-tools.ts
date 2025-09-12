import { tool } from 'ai';
import { z } from 'zod';

// Hiking concierge tools for the workshop
export const checkWeatherTool = tool({
  description: 'Get detailed weather forecast for hiking location including temperature, precipitation, wind conditions, and visibility',
  parameters: z.object({
    location: z.string().describe('Trail location or nearby city'),
    date: z.string().describe('Date for forecast (YYYY-MM-DD)')
  }),
  execute: async ({ location, date }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock weather data generation
    const temp = Math.floor(Math.random() * 30) + 50; // 50-80°F
    const precipitation = Math.floor(Math.random() * 30); // 0-30%
    const wind = Math.floor(Math.random() * 15) + 5; // 5-20 mph
    const visibility = Math.floor(Math.random() * 5) + 5; // 5-10 miles
    
    return {
      location,
      date,
      temperature_high: temp,
      temperature_low: temp - 15,
      precipitation_chance: precipitation,
      wind_speed: wind,
      visibility: visibility,
      conditions: precipitation > 60 ? 'Rainy' : precipitation > 30 ? 'Partly Cloudy' : 'Sunny',
      hiking_recommendation: precipitation > 70 ? 'Not recommended' : 
                           precipitation > 40 ? 'Use caution' : 'Good conditions'
    };
  }
});

export const checkTrailConditionsTool = tool({
  description: 'Get current trail conditions, difficulty, status, and any closures or restrictions',
  parameters: z.object({
    trail_name: z.string().describe('Name of the hiking trail'),
    park: z.string().optional().describe('Park or area name')
  }),
  execute: async ({ trail_name, park }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock trail data
    const difficulties = ['Easy', 'Moderate', 'Hard', 'Very Hard'];
    const statuses = ['Open', 'Open with restrictions', 'Partially closed'];
    const surfaces = ['Well-maintained', 'Rocky', 'Muddy', 'Snow-covered'];
    
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const surface = surfaces[Math.floor(Math.random() * surfaces.length)];
    
    return {
      trail_name,
      park: park || 'Unknown',
      difficulty,
      status,
      surface_conditions: surface,
      length_miles: Math.floor(Math.random() * 10) + 1,
      elevation_gain: Math.floor(Math.random() * 2000) + 500,
      estimated_time: `${Math.floor(Math.random() * 6) + 2}-${Math.floor(Math.random() * 4) + 4} hours`,
      last_updated: '2024-01-15',
      notes: status === 'Open' ? 'Trail in good condition' : 
             status === 'Open with restrictions' ? 'Some sections may be challenging' :
             'Check with rangers before hiking'
    };
  }
});

export const getSafetyAlertsTool = tool({
  description: 'Check for current safety alerts, warnings, wildlife activity, and emergency information for hiking areas',
  parameters: z.object({
    location: z.string().describe('Area to check for safety alerts')
  }),
  execute: async ({ location }) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock safety alerts
    const alertTypes = ['Wildlife Activity', 'Weather Warning', 'Trail Hazard', 'Fire Restriction'];
    const severities = ['Low', 'Moderate', 'High'];
    
    const numAlerts = Math.floor(Math.random() * 3); // 0-2 alerts
    const alerts = [];
    
    for (let i = 0; i < numAlerts; i++) {
      alerts.push({
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        description: `Current ${alertTypes[i % alertTypes.length].toLowerCase()} reported in ${location} area`,
        date_issued: '2024-01-15'
      });
    }
    
    return {
      location,
      alert_count: alerts.length,
      alerts,
      emergency_contact: '(555) 123-PARK',
      ranger_station: `${location} Ranger Station`,
      last_updated: '2024-01-15 09:00'
    };
  }
});

export const recommendGearTool = tool({
  description: 'Recommend appropriate hiking gear based on trail difficulty, weather conditions, and trip duration',
  parameters: z.object({
    difficulty: z.enum(['Easy', 'Moderate', 'Hard', 'Very Hard']).describe('Trail difficulty level'),
    weather_conditions: z.string().optional().describe('Expected weather conditions'),
    duration: z.enum(['day', 'overnight', 'multi-day']).optional().describe('Trip duration')
  }),
  execute: async ({ difficulty, weather_conditions, duration = 'day' }) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Base gear for all hikes
    const baseGear = [
      'Sturdy hiking boots',
      'Water bottles/hydration system',
      'Navigation (map, compass, GPS)',
      'First aid kit',
      'Emergency whistle'
    ];
    
    // Add gear based on difficulty
    if (difficulty === 'Hard' || difficulty === 'Very Hard') {
      baseGear.push('Trekking poles', 'Headlamp/flashlight', 'Emergency shelter');
    }
    
    // Add weather-specific gear
    if (weather_conditions?.toLowerCase().includes('rain')) {
      baseGear.push('Rain jacket', 'Waterproof pack cover');
    }
    if (weather_conditions?.toLowerCase().includes('cold')) {
      baseGear.push('Insulating layers', 'Warm hat', 'Gloves');
    }
    
    // Add gear for longer trips
    if (duration === 'overnight' || duration === 'multi-day') {
      baseGear.push('Sleeping bag', 'Tent/shelter', 'Cooking gear', 'Extra food');
    }
    
    return {
      difficulty,
      weather_conditions: weather_conditions || 'fair',
      duration,
      essential_gear: baseGear,
      optional_gear: ['Camera', 'Binoculars', 'Field guides'],
      estimated_cost: `$${baseGear.length * 25}-${baseGear.length * 50}`,
      notes: `Recommendations for ${difficulty.toLowerCase()} ${duration} hike`
    };
  }
});