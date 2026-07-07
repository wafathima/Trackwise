// frontend/src/components/HabitTracker.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import habitService from '../services/habitService';
import {
  ClipboardCheck,
  CheckCircle,
  Circle,
  Flame,
  Award,
  TrendingUp,
  Plus,
  X,
  Loader,
  Calendar,
  Target,
  Zap,
} from 'lucide-react';

const HabitTracker = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [todayHabits, setTodayHabits] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [habitData, setHabitData] = useState({
    name: '',
    category: 'morning',
    description: '',
    target: 'daily',
    reminder: ''
  });
  const [loggingHabitId, setLoggingHabitId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const weekDays = [
  { key: 'mon', label: 'M' },
  { key: 'tue', label: 'T' },
  { key: 'wed', label: 'W' },
  { key: 'thu', label: 'T' },
  { key: 'fri', label: 'F' },
  { key: 'sat', label: 'S' },
  { key: 'sun', label: 'S' }
];


  const fetchData = async () => {
    setLoading(true);
    try {
      const [progressData, statsData, todayData] = await Promise.all([
        habitService.getProgress(),
        habitService.getStats(),
        habitService.getTodayHabits()
      ]);
      setProgress(progressData);
      setStats(statsData);
      setTodayHabits(todayData);
    } catch (error) {
      console.error('Error fetching habit data:', error);
      setError('Failed to load habit data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    if (!habitData.name.trim()) {
      setError('Habit name is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await habitService.createHabit(habitData);
      setHabitData({ name: '', category: 'morning', description: '', target: 'daily', reminder: '' });
      setShowCreateModal(false);
      await fetchData();
    } catch (error) {
      setError('Failed to create habit');
      console.error('Error creating habit:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogHabit = async (habitId) => {
    setLoggingHabitId(habitId);
    try {
      await habitService.logHabit(habitId);
      await fetchData();
    } catch (error) {
      console.error('Error logging habit:', error);
    } finally {
      setLoggingHabitId(null);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      morning: '#B8892B',
      study: '#3F6B52',
      fitness: '#4A6C8C',
      health: '#A63D40',
      evening: '#1C2B39'
    };
    return colors[category] || '#1C2B39';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      morning: '🌅 Morning',
      study: '📚 Study',
      fitness: '💪 Fitness',
      health: '❤️ Health',
      evening: '🌙 Evening'
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#B8892B' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: '#1C2B39' }}>
            Habit Tracker
          </h2>
          <p className="text-sm" style={{ color: '#1C2B3980' }}>
            Build consistent habits and track your progress
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 transition-colors hover:opacity-90"
          style={{ backgroundColor: '#B8892B', color: 'white' }}
        >
          <Plus className="w-4 h-4" /> New Habit
        </button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#B8892B15', color: '#B8892B' }}>
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>
                  {stats.streak}d
                </p>
                <p className="text-xs" style={{ color: '#1C2B3980' }}>Current Streak</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#3F6B5215', color: '#3F6B52' }}>
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>
                  {stats.completedTasks}
                </p>
                <p className="text-xs" style={{ color: '#1C2B3980' }}>Total Completed</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#A63D4015', color: '#A63D40' }}>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>
                  {stats.consistency}%
                </p>
                <p className="text-xs" style={{ color: '#1C2B3980' }}>Consistency</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#4A6C8C15', color: '#4A6C8C' }}>
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>
                  {stats.activeHabits || 0}
                </p>
                <p className="text-xs" style={{ color: '#1C2B3980' }}>Active Habits</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Habits */}
      {todayHabits && (
        <div className="p-5 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: '#1C2B39' }}>
              <Calendar className="w-4 h-4" style={{ color: '#B8892B' }} />
              Today's Habits
            </h3>
            <span className="text-xs" style={{ color: '#1C2B3970' }}>
              {todayHabits.totalCompleted} / {todayHabits.totalHabits} completed
            </span>
          </div>

          <div className="space-y-2">
            {todayHabits.habits && todayHabits.habits.length > 0 ? (
              todayHabits.habits.map((habit) => (
                <div
                  key={habit._id}
                  className="flex items-center justify-between p-3 rounded-sm border transition-all"
                  style={{
                    backgroundColor: habit.completed ? '#3F6B5208' : 'transparent',
                    borderColor: habit.completed ? '#3F6B5233' : '#1C2B3914',
                    opacity: habit.completed ? 0.7 : 1
                  }}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLogHabit(habit._id)}
                      disabled={loggingHabitId === habit._id || habit.completed}
                      className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {habit.completed ? (
                        <CheckCircle className="w-5 h-5" style={{ color: '#3F6B52' }} />
                      ) : (
                        <Circle className="w-5 h-5" style={{ color: '#1C2B3955' }} />
                      )}
                    </button>
                    <div>
                      <p className="text-sm font-medium" style={{ color: habit.completed ? '#1C2B3980' : '#1C2B39' }}>
                        {habit.name}
                        {habit.completed && (
                          <span className="ml-2 text-xs" style={{ color: '#3F6B52' }}>✓ Done</span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${getCategoryColor(habit.category)}15`,
                            color: getCategoryColor(habit.category)
                          }}
                        >
                          {getCategoryLabel(habit.category)}
                        </span>
                        {habit.target && (
                          <span className="text-[10px]" style={{ color: '#1C2B3960' }}>
                            {habit.target}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {loggingHabitId === habit._id && (
                    <Loader className="w-4 h-4 animate-spin" style={{ color: '#B8892B' }} />
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-center py-4" style={{ color: '#1C2B3960' }}>
                No habits created yet. Create your first habit!
              </p>
            )}
          </div>
        </div>
      )}

     {/* Weekly Progress */}
{stats && stats.weeklyData && (
  <div className="p-5 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#1C2B39' }}>
      <Zap className="w-4 h-4" style={{ color: '#B8892B' }} />
      Weekly Habit Completion
    </h3>
    <div className="flex items-end gap-2 h-32">
      {weekDays.map((day, index) => (
        <div key={day.key} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
          <div
            className="w-full rounded-t-sm transition-all"
            style={{
              height: `${Math.max((stats.weeklyData[index] / 10) * 100, stats.weeklyData[index] > 0 ? 8 : 3)}%`,
              backgroundColor: stats.weeklyData[index] > 0 ? '#B8892B' : '#1C2B3914',
              opacity: stats.weeklyData[index] > 0 ? 0.85 : 1,
            }}
          />
          <span className="text-[10px]" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3955' }}>
            {day.label}
          </span>
          <span className="text-[9px]" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3970' }}>
            {stats.weeklyData[index]}
          </span>
        </div>
      ))}
    </div>
  </div>
)}

      {/* Badges */}
      {stats && stats.badges && stats.badges.length > 0 && (
        <div className="p-5 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#1C2B39' }}>
            <Award className="w-4 h-4" style={{ color: '#B8892B' }} />
            Badges Earned
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.badges.map((badge, index) => (
              <div
                key={index}
                className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5"
                style={{ backgroundColor: '#B8892B15', color: '#B8892B' }}
              >
                <span>{badge.icon || '🏅'}</span>
                {badge.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Habit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-md w-full p-6 border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3922' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: '#1C2B39' }}>
                Create New Habit
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="transition-opacity hover:opacity-70"
                style={{ color: '#1C2B3960' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-sm mb-4" style={{ backgroundColor: '#A63D4010', border: '1px solid #A63D4033' }}>
                <p className="text-sm" style={{ color: '#A63D40' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Habit Name *
                </label>
                <input
                  type="text"
                  value={habitData.name}
                  onChange={(e) => setHabitData({ ...habitData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                  placeholder="e.g., Morning Meditation"
                  required
                />
              </div>

              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Category
                </label>
                <select
                  value={habitData.category}
                  onChange={(e) => setHabitData({ ...habitData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                >
                  <option value="morning">Morning</option>
                  <option value="study">Study</option>
                  <option value="fitness">Fitness</option>
                  <option value="health">Health</option>
                  <option value="evening">Evening</option>
                </select>
              </div>

              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Description (optional)
                </label>
                <textarea
                  value={habitData.description}
                  onChange={(e) => setHabitData({ ...habitData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                  rows="2"
                  placeholder="What's this habit about?"
                />
              </div>

              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Target Frequency
                </label>
                <select
                  value={habitData.target}
                  onChange={(e) => setHabitData({ ...habitData, target: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Reminder Time (optional)
                </label>
                <input
                  type="time"
                  value={habitData.reminder}
                  onChange={(e) => setHabitData({ ...habitData, reminder: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-sm text-sm font-medium border"
                  style={{ borderColor: '#1C2B3922', color: '#1C2B39' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-sm text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#B8892B' }}
                >
                  {submitting ? 'Creating...' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;