// frontend/src/components/HealthTracker.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import healthService from '../services/healthService';
import {
  Heart,
  Droplets,
  Moon,
  Flame,
  Award,
  TrendingUp,
  Plus,
  X,
  Loader,
  Calendar,
  Activity,
} from 'lucide-react';

const HealthTracker = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [workoutData, setWorkoutData] = useState({
    type: 'fitness',
    name: '',
    duration: '',
    exercises: '',
    calories: ''
  });
  const [waterAmount, setWaterAmount] = useState('');
  const [sleepHours, setSleepHours] = useState('');

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
      const [progressData, statsData] = await Promise.all([
        healthService.getProgress(),
        healthService.getStats()
      ]);
      setProgress(progressData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching health data:', error);
      setError('Failed to load health data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogWorkout = async (e) => {
    e.preventDefault();
    if (!workoutData.duration || parseFloat(workoutData.duration) <= 0) {
      setError('Please enter valid duration');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await healthService.logWorkout({
        type: workoutData.type,
        name: workoutData.name,
        duration: parseFloat(workoutData.duration),
        exercises: workoutData.exercises ? workoutData.exercises.split(',').map(e => e.trim()) : [],
        calories: workoutData.calories ? parseFloat(workoutData.calories) : 0
      });
      
      setWorkoutData({ type: 'fitness', name: '', duration: '', exercises: '', calories: '' });
      setShowWorkoutModal(false);
      await fetchData();
    } catch (error) {
      setError('Failed to log workout');
      console.error('Error logging workout:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogWater = async () => {
    if (!waterAmount || parseFloat(waterAmount) <= 0) {
      setError('Please enter valid amount');
      return;
    }

    setSubmitting(true);
    try {
      await healthService.logWater(parseFloat(waterAmount));
      setWaterAmount('');
      setShowWaterModal(false);
      await fetchData();
    } catch (error) {
      setError(error,'Failed to log water intake');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogSleep = async () => {
    if (!sleepHours || parseFloat(sleepHours) <= 0) {
      setError('Please enter valid hours');
      return;
    }

    setSubmitting(true);
    try {
      await healthService.logSleep(parseFloat(sleepHours));
      setSleepHours('');
      setShowSleepModal(false);
      await fetchData();
    } catch (error) {
      setError(error,'Failed to log sleep');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#4A6C8C' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: '#1C2B39' }}>
            Health Tracker
          </h2>
          <p className="text-sm" style={{ color: '#1C2B3980' }}>
            Track your fitness, nutrition, and wellness
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowWaterModal(true)}
            className="px-3 py-2 rounded-sm text-xs font-medium flex items-center gap-1.5 transition-colors hover:opacity-90"
            style={{ backgroundColor: '#4A6C8C', color: 'white' }}
          >
            <Droplets className="w-3.5 h-3.5" /> Water
          </button>
          <button
            onClick={() => setShowSleepModal(true)}
            className="px-3 py-2 rounded-sm text-xs font-medium flex items-center gap-1.5 transition-colors hover:opacity-90"
            style={{ backgroundColor: '#A63D40', color: 'white' }}
          >
            <Moon className="w-3.5 h-3.5" /> Sleep
          </button>
          <button
            onClick={() => setShowWorkoutModal(true)}
            className="px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 transition-colors hover:opacity-90"
            style={{ backgroundColor: '#4A6C8C', color: 'white' }}
          >
            <Plus className="w-4 h-4" /> Log Workout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#4A6C8C15', color: '#4A6C8C' }}>
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>
                  {stats.streak}d
                </p>
                <p className="text-xs" style={{ color: '#1C2B3980' }}>Workout Streak</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#A63D4015', color: '#A63D40' }}>
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>
                  {stats.points}
                </p>
                <p className="text-xs" style={{ color: '#1C2B3980' }}>Points Earned</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#B8892B15', color: '#B8892B' }}>
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
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>
                  {stats.badges?.length || 0}
                </p>
                <p className="text-xs" style={{ color: '#1C2B3980' }}>Badges Earned</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-sm border flex items-center gap-4" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
            <Droplets className="w-8 h-8" style={{ color: '#4A6C8C' }} />
            <div>
              <p className="text-xs" style={{ color: '#1C2B3980' }}>Water Intake</p>
              <p className="text-lg font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>
                {stats.waterIntake || 0}L
              </p>
            </div>
          </div>

          <div className="p-4 rounded-sm border flex items-center gap-4" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
            <Moon className="w-8 h-8" style={{ color: '#A63D40' }} />
            <div>
              <p className="text-xs" style={{ color: '#1C2B3980' }}>Sleep Duration</p>
              <p className="text-lg font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>
                {stats.sleepHours || 0}h
              </p>
            </div>
          </div>

          <div className="p-4 rounded-sm border flex items-center gap-4" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
            <Award className="w-8 h-8" style={{ color: '#B8892B' }} />
            <div>
              <p className="text-xs" style={{ color: '#1C2B3980' }}>Challenges</p>
              <p className="text-lg font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>
                {stats.challengesCompleted || 0}
              </p>
            </div>
          </div>
        </div>
      )}

    {/* Weekly Progress */}
{stats && stats.weeklyData && (
  <div className="p-5 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#1C2B39' }}>
      <Calendar className="w-4 h-4" style={{ color: '#4A6C8C' }} />
      Weekly Workouts
    </h3>
    <div className="flex items-end gap-2 h-32">
      {weekDays.map((day, index) => (
        <div key={day.key} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
          <div
            className="w-full rounded-t-sm transition-all"
            style={{
              height: `${Math.max((stats.weeklyData[index] / 7) * 100, stats.weeklyData[index] > 0 ? 8 : 3)}%`,
              backgroundColor: stats.weeklyData[index] > 0 ? '#4A6C8C' : '#1C2B3914',
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

      {/* Workout Modal */}
      {showWorkoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-md w-full p-6 border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3922' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: '#1C2B39' }}>
                Log Workout
              </h3>
              <button
                onClick={() => setShowWorkoutModal(false)}
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

            <form onSubmit={handleLogWorkout} className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Workout Type
                </label>
                <select
                  value={workoutData.type}
                  onChange={(e) => setWorkoutData({ ...workoutData, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                >
                  <option value="fitness">Fitness / Muscle Building</option>
                  <option value="calisthenics">Calisthenics</option>
                  <option value="yoga">Yoga</option>
                  <option value="cardio">Cardio</option>
                </select>
              </div>

              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Workout Name
                </label>
                <input
                  type="text"
                  value={workoutData.name}
                  onChange={(e) => setWorkoutData({ ...workoutData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                  placeholder="e.g., Full Body Workout"
                />
              </div>

              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={workoutData.duration}
                  onChange={(e) => setWorkoutData({ ...workoutData, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                  placeholder="e.g., 30"
                  required
                />
              </div>

              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Exercises (comma separated)
                </label>
                <input
                  type="text"
                  value={workoutData.exercises}
                  onChange={(e) => setWorkoutData({ ...workoutData, exercises: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                  placeholder="e.g., Push-ups, Squats, Planks"
                />
              </div>

              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Calories Burned (optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={workoutData.calories}
                  onChange={(e) => setWorkoutData({ ...workoutData, calories: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                  placeholder="e.g., 200"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowWorkoutModal(false)}
                  className="flex-1 py-2 rounded-sm text-sm font-medium border"
                  style={{ borderColor: '#1C2B3922', color: '#1C2B39' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-sm text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#4A6C8C' }}
                >
                  {submitting ? 'Logging...' : 'Log Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Water Modal */}
      {showWaterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-sm w-full p-6 border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3922' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: '#1C2B39' }}>
                Log Water Intake
              </h3>
              <button
                onClick={() => setShowWaterModal(false)}
                className="transition-opacity hover:opacity-70"
                style={{ color: '#1C2B3960' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Amount (liters) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={waterAmount}
                  onChange={(e) => setWaterAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                  placeholder="e.g., 0.5"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWaterModal(false)}
                  className="flex-1 py-2 rounded-sm text-sm font-medium border"
                  style={{ borderColor: '#1C2B3922', color: '#1C2B39' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogWater}
                  disabled={submitting}
                  className="flex-1 py-2 rounded-sm text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#4A6C8C' }}
                >
                  {submitting ? 'Logging...' : 'Log Water'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sleep Modal */}
      {showSleepModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-sm w-full p-6 border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3922' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: '#1C2B39' }}>
                Log Sleep
              </h3>
              <button
                onClick={() => setShowSleepModal(false)}
                className="transition-opacity hover:opacity-70"
                style={{ color: '#1C2B3960' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Hours of Sleep *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="12"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                  placeholder="e.g., 7.5"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSleepModal(false)}
                  className="flex-1 py-2 rounded-sm text-sm font-medium border"
                  style={{ borderColor: '#1C2B3922', color: '#1C2B39' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogSleep}
                  disabled={submitting}
                  className="flex-1 py-2 rounded-sm text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#A63D40' }}
                >
                  {submitting ? 'Logging...' : 'Log Sleep'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTracker;