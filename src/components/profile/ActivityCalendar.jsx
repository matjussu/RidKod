import { useState, useMemo, useRef } from 'react';
import { normalizeDailyActivity } from '../../services/progressService';
import '../../styles/ActivityCalendar.css';

/**
 * DayTooltip - Tooltip compact affichant le détail d'activité
 */
const DayTooltip = ({ dayData, onClose, position, alignment = 'center' }) => {
  const { breakdown } = dayData;

  return (
    <>
      {/* Overlay transparent pour fermer */}
      <div className="tooltip-overlay" onClick={onClose} />

      {/* Tooltip positionné */}
      <div
        className={`day-tooltip${alignment !== 'center' ? ` align-${alignment}` : ''}`}
        style={{
          left: position.x,
          top: position.y
        }}
      >
        <div className="tooltip-total">
          {breakdown.total} activité{breakdown.total > 1 ? 's' : ''}
        </div>

        <div className="tooltip-breakdown">
          <div className="tooltip-row">
            <span>🏋️</span>
            <span className="tooltip-label">Entraînements</span>
            <span className="tooltip-value">{breakdown.training || 0}</span>
          </div>
          <div className="tooltip-row">
            <span>📚</span>
            <span className="tooltip-label">Leçons</span>
            <span className="tooltip-value">{breakdown.lessons || 0}</span>
          </div>
          <div className="tooltip-row">
            <span>🤖</span>
            <span className="tooltip-label">IA</span>
            <span className="tooltip-value">{breakdown.ai || 0}</span>
          </div>
          <div className="tooltip-row">
            <span>⚔️</span>
            <span className="tooltip-label">Challenges</span>
            <span className="tooltip-value">{breakdown.challenges || 0}</span>
          </div>
        </div>

        {/* Flèche vers le bas */}
        <div className="tooltip-arrow" />
      </div>
    </>
  );
};

/**
 * ActivityCalendar - GitHub-style contribution graph
 * Affiche l'activité quotidienne sur un mois avec détail par catégorie
 */
const ActivityCalendar = ({ dailyActivity = {} }) => {
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const calendarRef = useRef(null);

  // Normaliser les données (rétrocompatibilité ancien format)
  const normalizedActivity = useMemo(() =>
    normalizeDailyActivity(dailyActivity),
    [dailyActivity]
  );

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
      const dayActivity = normalizedActivity[dateKey] || {
        total: 0,
        training: 0,
        lessons: 0,
        ai: 0,
        challenges: 0
      };

      days.push({
        day,
        dateKey,
        exerciseCount: dayActivity.total,
        breakdown: dayActivity,
        level: getActivityLevel(dayActivity.total),
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

  const calendarDays = useMemo(() => generateCalendarDays(), [monthData, normalizedActivity]);

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

  // Handler pour clic sur un jour
  const handleDayClick = (event, dayData) => {
    if (dayData.exerciseCount > 0) {
      const rect = event.currentTarget.getBoundingClientRect();
      const calendarRect = calendarRef.current?.getBoundingClientRect();

      if (calendarRect) {
        // Position relative au calendrier
        const x = rect.left - calendarRect.left + rect.width / 2;
        const y = rect.top - calendarRect.top - 8;

        // Détection des bords pour éviter le dépassement
        const tooltipWidth = 200;
        const halfTooltip = tooltipWidth / 2;

        let alignment = 'center';
        let adjustedX = x;

        // Dépassement à gauche ?
        if (x < halfTooltip) {
          alignment = 'left';
          adjustedX = Math.max(10, rect.left - calendarRect.left);
        }
        // Dépassement à droite ?
        else if (x > calendarRect.width - halfTooltip) {
          alignment = 'right';
          adjustedX = Math.min(calendarRect.width - 10, rect.right - calendarRect.left);
        }

        setTooltipPosition({ x: adjustedX, y, alignment });
        setSelectedDay(dayData);
      }
    }
  };

  return (
    <div className="activity-calendar" ref={calendarRef}>
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
              className={`activity-day activity-level-${dayData.level}${dayData.exerciseCount > 0 ? ' clickable' : ''}`}
              data-date={dayData.dateKey}
              data-count={dayData.exerciseCount}
              title={`${dayData.day} - ${dayData.exerciseCount} activité${dayData.exerciseCount > 1 ? 's' : ''}`}
              onClick={(e) => handleDayClick(e, dayData)}
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
          <div className="activity-legend-square activity-level-0" title="0 activité"></div>
          <div className="activity-legend-square activity-level-1" title="1-2 activités"></div>
          <div className="activity-legend-square activity-level-2" title="3-5 activités"></div>
          <div className="activity-legend-square activity-level-3" title="6-10 activités"></div>
          <div className="activity-legend-square activity-level-4" title="11+ activités"></div>
        </div>
        <span className="activity-legend-label">Plus</span>
      </div>

      {/* Tooltip détail du jour */}
      {selectedDay && (
        <DayTooltip
          dayData={selectedDay}
          position={tooltipPosition}
          alignment={tooltipPosition.alignment}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
};

export default ActivityCalendar;
