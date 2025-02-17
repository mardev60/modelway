import { Injectable } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  formatFirebaseTimestamp(timestamp: any): Date {
    if (!timestamp) return new Date(0);

    // Handle Firestore Timestamp with _seconds and _nanoseconds
    if (timestamp._seconds) {
      return new Date(
        timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
      );
    }

    // Handle Firestore Timestamp object
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }

    // Handle string date
    if (typeof timestamp === 'string') {
      return new Date(timestamp);
    }

    // Handle regular seconds timestamp
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }

    return new Date(0);
  }

  isOld(date: Date | undefined): boolean {
    if (!date) return true;
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    return diffInMinutes > 5;
  }

  getStatusColor(latency: number | null): { text: string; bg: string } {
    if (latency === null) {
      return { text: 'text-white', bg: 'bg-red-800' };
    }
    if (latency < 200) {
      return { text: 'text-green-800', bg: 'bg-green-100' };
    } else if (latency < 500) {
      return { text: 'text-lime-800', bg: 'bg-lime-100' };
    } else if (latency < 1000) {
      return { text: 'text-yellow-800', bg: 'bg-yellow-100' };
    } else if (latency < 1500) {
      return { text: 'text-orange-800', bg: 'bg-orange-100' };
    } else {
      return { text: 'text-red-800', bg: 'bg-red-100' };
    }
  }

  getStatus(latency: number | null): string {
    if (latency === null) {
      return 'Provider Down';
    }
    if (latency < 200) {
      return 'Excellent';
    } else if (latency < 500) {
      return 'Very Good';
    } else if (latency < 1000) {
      return 'Good';
    } else if (latency < 1500) {
      return 'Fair';
    } else {
      return 'Degraded';
    }
  }

  formatTimeAgo(date: Date | undefined): string {
    if (!date || date.getTime() === 0) {
      return 'Never';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  }
}
