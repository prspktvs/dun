import { EventParams, logEvent } from 'firebase/analytics'

import { analytics } from '../config/firebase'


export const logAnalytics = (event_name: string, data?: Partial<EventParams>) => logEvent(analytics, event_name, data)