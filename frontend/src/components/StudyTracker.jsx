// src/components/StudyTracker.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import studyService from '../services/studyService';
import {
  Clock,
  Flame,
  Award,
  TrendingUp,
  Plus,
  X,
  Loader,
  Calendar,
} from 'lucide-react';

const StudyTracker = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logData, setLogData] = useState({
    hours: '',
    subject: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const weekDays = [
    { key: 'mon', label: 'M' },
    { key: 'tue', label: 'T' },
    { key: 'wed', label: 'W' },
    { key: 'thu', label: 'T' },
    { key: 'fri', label: 'F' },
    { key: 'sat', label: 'S' },
    { key: 'sun', label: 'S' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [progressData, statsData] = await Promise.all([
        studyService.getProgress(),
        studyService.getStats()
      ]);
      setProgress(progressData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching study data:', error);
      setError('Failed to load study data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogStudy = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!logData.hours || parseFloat(logData.hours) <= 0) {
      setError('Please enter valid hours');
      return;
    }

    setSubmitting(true);

    try {
      const result = await studyService.logSession({
        hours: parseFloat(logData.hours),
        subject: logData.subject || 'General',
        notes: logData.notes || ''
      });
      
      // Clear form
      setLogData({ hours: '', subject: '', notes: '' });
      setShowLogModal(false);
      setSuccess('Study session logged successfully!');
      
      // Refresh data
      await fetchData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error logging study:', error);
      setError(error.response?.data?.message || 'Failed to log study session');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#3F6B52' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: '#1C2B39' }}>
            Study Tracker
          </h2>
          <p className="text-sm" style={{ color: '#1C2B3980' }}>
            Track your study progress and build consistent habits
          </p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 transition-colors hover:opacity-90"
          style={{ backgroundColor: '#3F6B52', color: 'white' }}
        >
          <Plus className="w-4 h-4" /> Log Study
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-3 rounded-sm" style={{ backgroundColor: '#A63D4010', border: '1px solid #A63D4033' }}>
          <p className="text-sm" style={{ color: '#A63D40' }}>{error}</p>
        </div>
      )}
      {success && (
        <div className="p-3 rounded-sm" style={{ backgroundColor: '#3F6B5210', border: '1px solid #3F6B5233' }}>
          <p className="text-sm" style={{ color: '#3F6B52' }}>{success}</p>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#3F6B5215', color: '#3F6B52' }}>
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>
                  {stats.streak}d
                </p>
                <p className="text-xs" style={{ color: '#1C2B3980' }}>Study Streak</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#4A6C8C15', color: '#4A6C8C' }}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B39' }}>
                  {stats.totalHours}h
                </p>
                <p className="text-xs" style={{ color: '#1C2B3980' }}>Total Hours</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: '#B8892B15', color: '#B8892B' }}>
                <Award className="w-5 h-5" />
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
        </div>
      )}

      {/* Weekly Progress */}
      {stats && stats.weeklyData && (
        <div className="p-5 rounded-sm border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3914' }}>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#1C2B39' }}>
            <Calendar className="w-4 h-4" style={{ color: '#3F6B52' }} />
            Weekly Study Hours
          </h3>
          <div className="flex items-end gap-2 h-32">
            {weekDays.map((day, index) => (
              <div key={day.key} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${Math.max((stats.weeklyData[index] / 10) * 100, stats.weeklyData[index] > 0 ? 8 : 3)}%`,
                    backgroundColor: stats.weeklyData[index] > 0 ? '#3F6B52' : '#1C2B3914',
                    opacity: stats.weeklyData[index] > 0 ? 0.85 : 1,
                  }}
                />
                <span className="text-[10px]" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3955' }}>
                  {day.label}
                </span>
                <span className="text-[9px]" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3970' }}>
                  {stats.weeklyData[index]}h
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

      {/* Log Study Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-sm max-w-md w-full p-6 border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3922' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Fraunces', serif", color: '#1C2B39' }}>
                Log Study Session
              </h3>
              <button
                onClick={() => {
                  setShowLogModal(false);
                  setError('');
                  setLogData({ hours: '', subject: '', notes: '' });
                }}
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

            <form onSubmit={handleLogStudy} className="space-y-4">
              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Hours Studied *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={logData.hours}
                  onChange={(e) => setLogData({ ...logData, hours: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                  placeholder="e.g., 2.5"
                  required
                />
              </div>

              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={logData.subject}
                  onChange={(e) => setLogData({ ...logData, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                  placeholder="e.g., Mathematics"
                />
              </div>

              <div>
                <label className="text-xs block mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#1C2B3960' }}>
                  Notes (Optional)
                </label>
                <textarea
                  value={logData.notes}
                  onChange={(e) => setLogData({ ...logData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border focus:outline-none text-sm"
                  style={{ backgroundColor: 'white', borderColor: '#1C2B3922', color: '#1C2B39' }}
                  rows="3"
                  placeholder="What did you study?"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowLogModal(false);
                    setError('');
                    setLogData({ hours: '', subject: '', notes: '' });
                  }}
                  className="flex-1 py-2 rounded-sm text-sm font-medium border"
                  style={{ borderColor: '#1C2B3922', color: '#1C2B39' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-sm text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#3F6B52' }}
                >
                  {submitting ? 'Logging...' : 'Log Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTracker;