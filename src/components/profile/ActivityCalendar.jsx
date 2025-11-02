import { useState, useEffect, useMemo } from 'react';
import '../../styles/ActivityCalendar.css';

/**
 * ActivityCalendar - GitHub-style contribution graph
 * Affiche l'activité quotidienne (exercices complétés) sur un mois
 * Scroll horizontal pour voir les mois précédents
 */
const ActivityCalendar = ({ dailyActivity = {} }) => {
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  // Obtenir le mois à afficher (0 = mois actuel, -1 = mois précédent, etc.)
  const getMonthData = (offset) => {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const monthName = targetDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    // Nombre de jours dans le mois
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Premier jour du mois (0 = dimanche, 1 = lundi, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Ajuster pour commencer lundi (GitHub style)
    const firstDayAdjusted = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    return {
      monthName,
      daysInMonth,
      firstDayAdjusted,
      year,
      month
    };
  };

  const monthData = useMemo(() => getMonthData(currentMonthOffset), [currentMonthOffset]);

  // Générer les cases du calendrier
  const generateCalendarDays = () => {
    const { daysInMonth, firstDayAdjusted, year, month } = monthData;
    const days = [];

    // Ajouter des cases vides pour aligner le premier jour
    for (let i = 0; i < firstDayAdjusted; i++) {
      days.push({ empty: true, key: `empty-${i}` });
    }

    // Ajouter les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const exerciseCount = dailyActivity[dateKey] || 0;

      days.push({
        day,
        dateKey,
        exerciseCount,
        level: getActivityLevel(exerciseCount),
        key: dateKey
      });
    }

    return days;
  };

  // Déterminer le niveau d'activité (0-4) basé sur nombre d'exercices
  const getActivityLevel = (count) => {
    if (count === 0) return 0;      // Pas d'activité
    if (count <= 2) return 1;       // 1-2 exercices
    if (count <= 5) return 2;       // 3-5 exercices
    if (count <= 10) return 3;      // 6-10 exercices
    return 4;                        // 11+ exercices (super actif)
  };

  const calendarDays = useMemo(() => generateCalendarDays(), [monthData, dailyActivity]);

  // Navigation mois précédent/suivant
  const goToPreviousMonth = () => {
    setCurrentMonthOffset(prev => prev - 1);
  };

  const goToNextMonth = () => {
    // Ne pas aller au-delà du mois actuel
    if (currentMonthOffset < 0) {
      setCurrentMonthOffset(prev => prev + 1);
    }
  };

  const canGoNext = currentMonthOffset < 0;

  return (
    <div className="activity-calendar">
      {/* Header avec navigation */}
      <div className="activity-header">
        <button
          className="activity-nav-button"
          onClick={goToPreviousMonth}
          aria-label="Mois précédent"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <h3 className="activity-title">{monthData.monthName}</h3>

        <button
          className="activity-nav-button"
          onClick={goToNextMonth}
          disabled={!canGoNext}
          aria-label="Mois suivant"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Labels jours de la semaine */}
      <div className="activity-weekdays">
        <span className="activity-weekday">L</span>
        <span className="activity-weekday">M</span>
        <span className="activity-weekday">M</span>
        <span className="activity-weekday">J</span>
        <span className="activity-weekday">V</span>
        <span className="activity-weekday">S</span>
        <span className="activity-weekday">D</span>
      </div>

      {/* Grille du calendrier */}
      <div className="activity-grid">
        {calendarDays.map((dayData) => {
          if (dayData.empty) {
            return <div key={dayData.key} className="activity-day activity-day-empty"></div>;
          }

          return (
            <div
              key={dayData.key}
              className={`activity-day activity-level-${dayData.level}`}
              data-date={dayData.dateKey}
              data-count={dayData.exerciseCount}
              title={`${dayData.day} - ${dayData.exerciseCount} exercice${dayData.exerciseCount > 1 ? 's' : ''}`}
            >
              <span className="activity-day-number">{dayData.day}</span>
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="activity-legend">
        <span className="activity-legend-label">Moins</span>
        <div className="activity-legend-squares">
          <div className="activity-legend-square activity-level-0" title="0 exercice"></div>
          <div className="activity-legend-square activity-level-1" title="1-2 exercices"></div>
          <div className="activity-legend-square activity-level-2" title="3-5 exercices"></div>
          <div className="activity-legend-square activity-level-3" title="6-10 exercices"></div>
          <div className="activity-legend-square activity-level-4" title="11+ exercices"></div>
        </div>
        <span className="activity-legend-label">Plus</span>
      </div>
    </div>
  );
};

export default ActivityCalendar;
