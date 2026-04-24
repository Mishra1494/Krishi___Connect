import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt, faClipboardList, faChevronDown, faChevronUp,
  faUser, faPhone, faMapMarkerAlt, faSeedling, faCalendarCheck,
  faIndianRupeeSign, faIdCard, faLandmark, faRobot,
  faFilter, faCheckCircle, faClock, faTimesCircle, faSearch,
  faFileAlt, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { getApplications, getInsurancePlans } from '../data/insuranceData';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  Submitted: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: faClock, label: 'Submitted' },
  'Under Review': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: faSearch, label: 'Under Review' },
  Approved: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: faCheckCircle, label: 'Approved' },
  Rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: faTimesCircle, label: 'Rejected' }
};

const MyApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expandedApp, setExpandedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const plans = getInsurancePlans();

  const applications = useMemo(() => {
    // Show applications matching the current user's ID, OR 'anonymous' for dummy data visibility
    let apps = getApplications().filter(app => app.userId === user?.id || app.userId === 'anonymous');
    apps.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    if (filterStatus !== 'all') apps = apps.filter(a => a.status === filterStatus);
    return apps;
  }, [user, filterStatus]);

  const stats = useMemo(() => {
    const all = getApplications().filter(app => app.userId === user?.id || app.userId === 'anonymous');
    return {
      total: all.length,
      submitted: all.filter(a => a.status === 'Submitted').length,
      approved: all.filter(a => a.status === 'Approved').length,
      rejected: all.filter(a => a.status === 'Rejected').length
    };
  }, [user]);

  const maskAadhaar = (a) => a ? `XXXX-XXXX-${a.slice(-4)}` : 'N/A';
  const getPlan = (id) => plans.find(p => p.id === id);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      {/* Hero Header */}
      <section className="rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200 mb-1">
                <FontAwesomeIcon icon={faClipboardList} className="mr-1.5" /> My Applications
              </p>
              <h1 className="text-2xl md:text-3xl font-bold">Insurance Applications</h1>
              <p className="mt-2 text-sm text-emerald-100 max-w-lg">
                Track all your crop insurance applications, view status updates, and manage your coverage — all in one place.
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total', value: stats.total, color: 'bg-white/15' },
              { label: 'Submitted', value: stats.submitted, color: 'bg-blue-500/20' },
              { label: 'Approved', value: stats.approved, color: 'bg-emerald-400/20' },
              { label: 'Rejected', value: stats.rejected, color: 'bg-red-400/20' }
            ].map(s => (
              <div key={s.label} className={`${s.color} rounded-xl px-3 py-2.5 text-center backdrop-blur-sm border border-white/10`}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-emerald-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <FontAwesomeIcon icon={faFilter} className="text-slate-400 text-sm" />
        {['all', 'Submitted', 'Under Review', 'Approved', 'Rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterStatus === f
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faShieldAlt} className="text-emerald-400 text-3xl" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            {filterStatus !== 'all' ? 'No applications match this filter' : 'No Applications Yet'}
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            {filterStatus !== 'all'
              ? 'Try selecting a different filter to see your applications.'
              : 'Start your first insurance application using our AI-powered assistant. It takes just 2 minutes!'}
          </p>
          {filterStatus === 'all' && (
            <button
              onClick={() => navigate('/ai-assistant')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition shadow-md"
            >
              <FontAwesomeIcon icon={faRobot} /> Go to AI Assistant <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const plan = getPlan(app.planId);
            const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Submitted;
            const isExpanded = expandedApp === app.applicationId;

            return (
              <article key={app.applicationId} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                {/* Card Header */}
                <div
                  className="p-4 md:p-5 cursor-pointer"
                  onClick={() => setExpandedApp(isExpanded ? null : app.applicationId)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="shrink-0 w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faShieldAlt} className="text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 font-mono">{app.applicationId}</p>
                        <h3 className="font-semibold text-slate-900 text-sm truncate">{app.planName}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' · '}{app.fullName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.color}`}>
                        <FontAwesomeIcon icon={statusCfg.icon} className="text-[10px]" />
                        {statusCfg.label}
                      </span>
                      <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="text-slate-400 text-xs" />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-slate-500">Premium</p>
                      <p className="font-bold text-emerald-700">₹{app.premiumAmount?.toLocaleString('en-IN') || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-slate-500">Sum Insured</p>
                      <p className="font-bold text-slate-800">₹{app.sumInsured?.toLocaleString('en-IN') || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-slate-500">Season</p>
                      <p className="font-bold text-slate-800 capitalize">{app.season || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 px-4 md:px-5 py-4 bg-slate-50/50">
                    <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Application Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {[
                        { icon: faUser, label: 'Full Name', value: app.fullName },
                        { icon: faIdCard, label: 'Aadhaar', value: maskAadhaar(app.aadhaar) },
                        { icon: faPhone, label: 'Phone', value: app.phone },
                        { icon: faMapMarkerAlt, label: 'Farm Location', value: app.location },
                        { icon: faSeedling, label: 'Land Area', value: `${app.landArea} hectares` },
                        { icon: faLandmark, label: 'Bank A/C', value: app.bankAccount ? `XXXX${app.bankAccount.slice(-4)}` : 'N/A' },
                        { icon: faCalendarCheck, label: 'Season', value: app.season },
                        { icon: faFileAlt, label: 'Region', value: app.region }
                      ].map(row => (
                        <div key={row.label} className="flex items-center gap-2.5">
                          <FontAwesomeIcon icon={row.icon} className="text-emerald-600 w-4 shrink-0" />
                          <span className="text-slate-500 w-24 shrink-0">{row.label}</span>
                          <span className="font-medium text-slate-800 capitalize">{row.value}</span>
                        </div>
                      ))}
                    </div>

                    {plan && (
                      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.tagColor}`}>{plan.tag}</span>
                          <span className="text-xs text-slate-600">{plan.coverageType}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-slate-500">Claim Window:</span> <span className="font-medium">{plan.claimWindow}</span></div>
                          <div><span className="text-slate-500">Settlement:</span> <span className="font-medium">{plan.claimSettlement}</span></div>
                          <div><span className="text-slate-500">Helpline:</span> <span className="font-medium">{plan.helpline}</span></div>
                          <div><span className="text-slate-500">Portal:</span> <span className="font-medium">{plan.portalLink}</span></div>
                        </div>
                      </div>
                    )}

                    {/* Status History */}
                    {app.statusHistory && (
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Status Timeline</h4>
                        <div className="space-y-2">
                          {app.statusHistory.map((sh, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1 shrink-0" />
                              <div>
                                <span className="font-semibold text-slate-800">{sh.status}</span>
                                <span className="text-slate-400 ml-2">{new Date(sh.date).toLocaleString('en-IN')}</span>
                                {sh.note && <p className="text-slate-500 mt-0.5">{sh.note}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
