
'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  add,
  isSameDay,
  parseISO,
  setHours,
  setMinutes,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Appointment } from '@/lib/types';
import { Badge } from './ui/badge';

type CalendarView = 'month' | 'week' | 'day';

interface AgendaCalendarViewProps {
  appointments: Appointment[];
}

const statusVariant: { [key in Appointment['status']]: 'default' | 'secondary' | 'destructive' } = {
    scheduled: 'default',
    completed: 'secondary',
    cancelled: 'destructive'
};

const statusColors: { [key in Appointment['status']]: string } = {
    scheduled: 'bg-blue-500 border-blue-600',
    completed: 'bg-green-500 border-green-600',
    cancelled: 'bg-red-500 border-red-600'
};


export function AgendaCalendarView({ appointments }: AgendaCalendarViewProps) {
  const [view, setView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrev = () => {
    if (view === 'month') setCurrentDate(add(currentDate, { months: -1 }));
    else if (view === 'week') setCurrentDate(add(currentDate, { weeks: -1 }));
    else setCurrentDate(add(currentDate, { days: -1 }));
  };

  const handleNext = () => {
    if (view === 'month') setCurrentDate(add(currentDate, { months: 1 }));
    else if (view === 'week') setCurrentDate(add(currentDate, { weeks: 1 }));
    else setCurrentDate(add(currentDate, { days: 1 }));
  };
  
  const handleToday = () => {
      setCurrentDate(new Date());
  }

  const headerTitle = () => {
    if (view === 'month') return format(currentDate, 'MMMM yyyy', { locale: es });
    if (view === 'week') {
      const start = startOfWeek(currentDate, { locale: es });
      const end = endOfWeek(currentDate, { locale: es });
      return `${format(start, 'd MMM')} - ${format(end, 'd MMM, yyyy')}`;
    }
    return format(currentDate, 'eeee, d MMMM, yyyy', { locale: es });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleToday}>Hoy</Button>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={handlePrev}><ChevronLeft/></Button>
                <Button variant="ghost" size="icon" onClick={handleNext}><ChevronRight/></Button>
            </div>
            <h2 className="text-xl font-bold capitalize">{headerTitle()}</h2>
        </div>
        <div className="flex items-center gap-2">
          {(['month', 'week', 'day'] as CalendarView[]).map((v) => (
            <Button
              key={v}
              variant={view === v ? 'default' : 'outline'}
              onClick={() => setView(v)}
              className="capitalize"
            >
              {v === 'month' ? 'Mes' : v === 'week' ? 'Semana' : 'Día'}
            </Button>
          ))}
        </div>
      </div>
      {view === 'month' && <MonthView date={currentDate} appointments={appointments} />}
      {view === 'week' && <WeekView date={currentDate} appointments={appointments} />}
      {view === 'day' && <DayView date={currentDate} appointments={appointments} />}
    </div>
  );
}

// Month View Component
function MonthView({ date, appointments }: { date: Date, appointments: Appointment[] }) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart, { locale: es });
  const endDate = endOfWeek(monthEnd, { locale: es });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="grid grid-cols-7 border-t border-l">
      {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
        <div key={`${day}-${i}`} className="text-center font-bold p-2 border-b border-r bg-muted/50">{day}</div>
      ))}
      {days.map((day, i) => (
        <div key={i} className={cn("h-32 border-b border-r p-1 overflow-y-auto", !isSameMonth(day, date) && "bg-muted/30")}>
          <div className={cn("text-sm", isToday(day) && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center font-bold")}>
            {format(day, 'd')}
          </div>
          <div className="space-y-1 mt-1">
            {appointments
              .filter(appt => isSameDay(parseISO(appt.appointmentDate), day))
              .map(appt => (
                <div key={appt.id} className={cn("text-xs p-1 rounded-md text-white", statusColors[appt.status])}>
                  <p className="font-semibold truncate">{appt.serviceName}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Week & Day View Components
const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23 hours

function WeekView({ date, appointments }: { date: Date, appointments: Appointment[] }) {
    const weekStart = startOfWeek(date, { locale: es });
    const days = eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart, { locale: es }) });
    
    return (
        <div className="flex border-t">
            <div className="w-16 flex-shrink-0">
                {/* Hour labels */}
                 {hours.map(hour => (
                    <div key={hour} className="h-16 border-b text-center pt-1 text-xs text-muted-foreground">
                        {format(setMinutes(setHours(new Date(), hour), 0), 'ha')}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 flex-grow">
                {days.map(day => (
                    <div key={day.toISOString()} className="border-l relative">
                        <div className="text-center p-2 border-b sticky top-0 bg-background z-10">
                            <p className="font-semibold">{format(day, 'eee', {locale: es})}</p>
                             <p className={cn("text-lg", isToday(day) && "text-primary font-bold")}>
                                {format(day, 'd')}
                            </p>
                        </div>
                        {hours.map(hour => (
                            <div key={hour} className="h-16 border-b"></div>
                        ))}
                        {/* Render appointments */}
                        {appointments.filter(a => isSameDay(parseISO(a.appointmentDate), day)).map(appt => {
                            const apptDate = parseISO(appt.appointmentDate);
                            const top = apptDate.getHours() * 64 + (apptDate.getMinutes() / 60) * 64; // 64px per hour
                            return (
                                <div key={appt.id}
                                     style={{ top: `${top}px` }}
                                     className={cn("absolute left-1 right-1 p-2 rounded-md z-20 text-white", statusColors[appt.status])}>
                                    <p className="font-bold text-xs truncate">{appt.serviceName}</p>
                                    <p className="text-xs truncate">{appt.userName}</p>
                                    <p className="text-xs truncate">{format(apptDate, 'p', {locale: es})}</p>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

function DayView({ date, appointments }: { date: Date, appointments: Appointment[] }) {
    return (
       <div className="flex border-t">
            <div className="w-16 flex-shrink-0">
                 {hours.map(hour => (
                    <div key={hour} className="h-16 border-b text-center pt-1 text-xs text-muted-foreground">
                        {format(setMinutes(setHours(new Date(), hour), 0), 'ha')}
                    </div>
                ))}
            </div>
            <div className="flex-grow border-l relative">
                {hours.map(hour => (
                    <div key={hour} className="h-16 border-b"></div>
                ))}
                {/* Render appointments */}
                {appointments.filter(a => isSameDay(parseISO(a.appointmentDate), date)).map(appt => {
                    const apptDate = parseISO(appt.appointmentDate);
                    const top = apptDate.getHours() * 64 + (apptDate.getMinutes() / 60) * 64; // 64px per hour
                    return (
                        <div key={appt.id}
                                style={{ top: `${top}px` }}
                                className={cn("absolute left-1 right-1 p-2 rounded-md z-10 text-white", statusColors[appt.status])}>
                            <p className="font-bold truncate">{appt.serviceName}</p>
                            <p className="text-sm truncate">{appt.userName}</p>
                             <p className="text-sm truncate">@{format(apptDate, 'p', {locale: es})}</p>
                            <Badge variant={statusVariant[appt.status]} className="mt-1">{appt.status}</Badge>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
