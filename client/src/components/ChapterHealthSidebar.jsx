import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Check,
  MessageSquare,
  ScrollText,
  Sparkles,
  AlertTriangle,
  History,
  Send,
  CheckCircle,
  X,
  ArrowRight,
  Clock,
  User
} from 'lucide-react';
import { DRHP_HIERARCHY } from '../data/sebiDrhpSchema';

export const SECTION_KEYS = {
  company_details: "Chapter 1: Company Profile",
  business_overview: "Chapter 2: Business Overview",
  financials: "Chapter 3: Financial Information",
  capital_structure: "Chapter 4: Capital Structure",
  objects: "Chapter 5: Objects of the Issue",
  promoter_details: "Chapter 6: Promoters & Management",
  related_party: "Chapter 7: Related Party Transactions",
  risk_factors: "Chapter 8: Risk Factors",
  litigation: "Chapter 9: Litigation & Legal Proceedings",
  legal_compliance: "Chapter 10: Legal & Compliance",
  other_disclosures: "Chapter 11: Other Disclosures"
};

export function getIntakeForSection(key, intakeData = {}) {
  if (!intakeData) return {};
  const aliasMap = {
    risk_factors: 'risk_information',
    related_party: 'rpt',
    promoter_details: 'promoters'
  };
  const targetKey = aliasMap[key] || key;
  if (intakeData[targetKey] && typeof intakeData[targetKey] === 'object' && Object.keys(intakeData[targetKey]).length > 0) {
    return intakeData[targetKey];
  }
  if (intakeData[key] && typeof intakeData[key] === 'object' && Object.keys(intakeData[key]).length > 0) {
    return intakeData[key];
  }
  return intakeData || {};
}

export function computeChapterHealth(key, drafts = {}, intakeData = {}, documents = []) {
  const sectionDraft = drafts[key] || {};
  const sectionIntake = getIntakeForSection(key, intakeData);
  const values = Object.values(sectionIntake).filter(v => v !== null && v !== undefined && String(v).trim() !== '');
  const isStarted = values.length > 0 || (documents || []).length > 0 || (sectionDraft.blocks && sectionDraft.blocks.length > 0);
  if (!isStarted) {
    return { statusKey: 'not_started', statusLabel: 'Not Started', score: 0, confidenceScore: 0, evidenceScore: 0, criticalCount: 0, warningCount: 0, missingDocs: [] };
  }
  return { statusKey: 'healthy', statusLabel: 'Healthy', score: 85, confidenceScore: 90, evidenceScore: 80, criticalCount: 0, warningCount: 0, missingDocs: [] };
}

function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word, idx) => {
      if (idx > 0 && ['and', 'or', 'the', 'of', 'in', 'for', 'on', 'with', 'a', 'an'].includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// ── Review Tabs Section ────────────────────────────────────────────────────
function ReviewSection({
  comments = [],
  auditLogs = [],
  aiSuggestions = [],
  openIssues = [],
  versions = [],
  onCommentClick,
  onIssueClick,
  onAcceptSuggestion,
  onDismissSuggestion,
  onConvertSuggestionToComment,
  onVersionClick,
  onAddComment,
  onResolveComment,
  isDark = false
}) {
  const [activeTab, setActiveTab] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  const tabs = [
    { id: 'comments', label: 'Comments', icon: MessageSquare, count: comments.length, emoji: '💬' },
    { id: 'audit', label: 'Audit Log', icon: ScrollText, count: auditLogs.length, emoji: '📜' },
    { id: 'ai', label: 'AI Suggestions', icon: Sparkles, count: aiSuggestions.length, emoji: '🤖' },
    { id: 'issues', label: 'Open Issues', icon: AlertTriangle, count: openIssues.length, emoji: '⚠' },
    { id: 'versions', label: 'Version History', icon: History, count: null, emoji: '📄' }
  ];

  const handleToggleTab = (tabId) => {
    setActiveTab(prev => prev === tabId ? null : tabId);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (onAddComment) onAddComment(newCommentText);
    setNewCommentText('');
  };

  const baseBg = isDark ? 'bg-white/5' : 'bg-slate-50/80';
  const baseText = isDark ? 'text-slate-300' : 'text-slate-600';
  const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-indigo-50/60';
  const activeBg = isDark ? 'bg-indigo-600/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700';
  const borderColor = isDark ? 'border-white/10' : 'border-slate-200';
  const cardBg = isDark ? 'bg-white/5' : 'bg-white';
  const cardBorder = isDark ? 'border-white/10' : 'border-slate-200';
  const headingText = isDark ? 'text-slate-400' : 'text-slate-400';

  return (
    <div className="space-y-1">
      {/* Divider */}
      <div className={`border-t ${isDark ? 'border-white/10' : 'border-slate-200'} my-3`} />

      {/* REVIEW heading */}
      <h4 className={`text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 ${headingText} font-mono`}>
        Review
      </h4>

      {/* Tab items */}
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <div key={tab.id}>
            <button
              type="button"
              onClick={() => handleToggleTab(tab.id)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive ? activeBg : `${baseText} ${hoverBg}`
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                {tab.count !== null && tab.count !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? (isDark ? 'bg-indigo-500/30 text-indigo-200' : 'bg-indigo-200/60 text-indigo-800')
                      : (isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-200/80 text-slate-500')
                  }`}>
                    {tab.count}
                  </span>
                )}
                {isActive
                  ? <ChevronDown className="w-3 h-3" />
                  : <ChevronRight className="w-3 h-3" />
                }
              </span>
            </button>

            {/* Expanded panel */}
            {isActive && (
              <div className={`ml-2 mr-1 mt-1 mb-2 p-2.5 rounded-xl border ${cardBorder} ${cardBg} space-y-2 animate-slide-up`}>

                {/* ── COMMENTS TAB ─────────────────────────────────── */}
                {tab.id === 'comments' && (
                  <div className="space-y-2">
                    <div className="max-h-[260px] overflow-y-auto space-y-2 pr-1">
                      {comments.length === 0 ? (
                        <p className={`text-[11px] text-center py-4 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          No comments yet. Highlight text in the document or add one below.
                        </p>
                      ) : (
                        comments.map((comm) => (
                          <div
                            key={comm.id}
                            onClick={() => onCommentClick && onCommentClick(comm)}
                            className={`p-2.5 rounded-lg border space-y-1.5 text-xs cursor-pointer transition-all ${
                              comm.status === 'resolved'
                                ? `${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50/50 border-slate-200'} opacity-50`
                                : comm.type === 'clarification_requested'
                                ? `${isDark ? 'bg-amber-900/20 border-amber-700/30' : 'bg-amber-50 border-amber-200'} hover:shadow-sm`
                                : `${isDark ? 'bg-indigo-900/20 border-indigo-700/30' : 'bg-indigo-50/50 border-indigo-100'} hover:shadow-sm`
                            }`}
                          >
                            <div className="flex justify-between items-start gap-1">
                              <div className="min-w-0">
                                <span className={`font-bold block truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{comm.author}</span>
                                <span className={`text-[10px] capitalize ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{comm.role}</span>
                              </div>
                              {comm.status === 'active' ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onResolveComment && onResolveComment(comm.id); }}
                                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5 border border-emerald-200 hover:border-emerald-300 px-1.5 py-0.5 rounded bg-emerald-50/20 transition-all shrink-0"
                                >
                                  <CheckCircle className="w-3 h-3" /> Resolve
                                </button>
                              ) : (
                                <span className={`text-[10px] font-bold uppercase shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                  Resolved
                                </span>
                              )}
                            </div>
                            <p className={`leading-normal ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{comm.content}</p>
                            {comm.linkedText && (
                              <p className={`text-[10px] italic truncate ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`}>
                                "{comm.linkedText}"
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add comment form */}
                    <form onSubmit={handleSubmitComment} className={`border-t pt-2 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                      <div className="relative">
                        <textarea
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder="Add a comment..."
                          className={`w-full pl-2.5 pr-8 py-1.5 border rounded-lg text-xs outline-none resize-none h-14 transition-all ${
                            isDark
                              ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500'
                              : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500'
                          }`}
                        />
                        <button
                          type="submit"
                          className="absolute right-1.5 bottom-2 p-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── AUDIT LOG TAB ────────────────────────────────── */}
                {tab.id === 'audit' && (
                  <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
                    {auditLogs.length === 0 ? (
                      <p className={`text-[11px] text-center py-4 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        No activity recorded yet.
                      </p>
                    ) : (
                      auditLogs.map((log, idx) => (
                        <div key={log.id || idx} className={`px-2.5 py-2 rounded-lg border text-[11px] space-y-0.5 ${
                          isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50/80 border-slate-100'
                        }`}>
                          <div className="flex items-center justify-between gap-1">
                            <span className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{log.user || log.author || 'System'}</span>
                            <span className={`text-[9px] font-mono shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              {log.timestamp ? new Date(log.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded capitalize ${
                              isDark ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                            }`}>{log.role || 'user'}</span>
                            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{log.action || log.description || 'Activity logged'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* ── AI SUGGESTIONS TAB ──────────────────────────── */}
                {tab.id === 'ai' && (
                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                    {aiSuggestions.length === 0 ? (
                      <p className={`text-[11px] text-center py-4 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        No AI suggestions for this section.
                      </p>
                    ) : (
                      aiSuggestions.map((sug, idx) => (
                        <div key={sug.id || idx} className={`p-2.5 rounded-lg border space-y-2 ${
                          isDark ? 'bg-white/5 border-white/5' : 'bg-amber-50/50 border-amber-100'
                        }`}>
                          <div className="flex items-start gap-1.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                              sug.severity === 'critical'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : sug.severity === 'warning'
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}>
                              {sug.severity || sug.category || 'Info'}
                            </span>
                            <p className={`text-xs font-medium leading-snug ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                              {sug.description || sug.text || 'Review suggestion'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              onClick={() => onAcceptSuggestion && onAcceptSuggestion(sug)}
                              className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded text-[10px] transition-all flex items-center gap-0.5"
                            >
                              <Check className="w-3 h-3" /> Accept
                            </button>
                            <button
                              onClick={() => onDismissSuggestion && onDismissSuggestion(sug)}
                              className={`px-2 py-0.5 font-semibold rounded text-[10px] transition-all ${
                                isDark ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() => onConvertSuggestionToComment && onConvertSuggestionToComment(sug)}
                              className={`px-2 py-0.5 font-semibold rounded text-[10px] transition-all flex items-center gap-0.5 ${
                                isDark ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              <MessageSquare className="w-3 h-3" /> Comment
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* ── OPEN ISSUES TAB ─────────────────────────────── */}
                {tab.id === 'issues' && (
                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                    {openIssues.length === 0 ? (
                      <p className={`text-[11px] text-center py-4 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        No open issues. All clear!
                      </p>
                    ) : (
                      openIssues.map((issue, idx) => (
                        <div
                          key={issue.id || idx}
                          onClick={() => onIssueClick && onIssueClick(issue)}
                          className={`p-2.5 rounded-lg border space-y-1.5 text-xs cursor-pointer transition-all hover:shadow-sm ${
                            isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-200 hover:border-indigo-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              issue.severity === 'critical' || issue.category === 'critical'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}>
                              {issue.severity || issue.category || 'High Severity'}
                            </span>
                            <span className={`text-[10px] font-mono truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              {issue.section || issue.fieldName || ''}
                            </span>
                          </div>
                          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {issue.description || 'Missing or inconsistent disclosure data.'}
                          </p>
                          <div className="flex items-center gap-3">
                            {issue.assignedUser && (
                              <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                                <User className="w-3 h-3" /> {issue.assignedUser}
                              </span>
                            )}
                            <span className={`flex items-center gap-0.5 text-[10px] ${
                              isDark ? 'text-amber-400' : 'text-amber-600'
                            }`}>
                              <Clock className="w-3 h-3" /> {issue.status || 'Open'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* ── VERSION HISTORY TAB ─────────────────────────── */}
                {tab.id === 'versions' && (
                  <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
                    {versions.length === 0 ? (
                      <p className={`text-[11px] text-center py-4 italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        No version history available.
                      </p>
                    ) : (
                      versions.map((ver, idx) => (
                        <button
                          key={ver.id || idx}
                          type="button"
                          onClick={() => onVersionClick && onVersionClick(ver)}
                          className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg border text-xs text-left transition-all cursor-pointer group ${
                            ver.isCurrent
                              ? (isDark ? 'bg-indigo-900/20 border-indigo-700/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700')
                              : (isDark ? 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-50/80 border-slate-100 text-slate-600 hover:bg-slate-100')
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <span className="font-bold block">{ver.label || `Version ${idx + 1}`}</span>
                            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              {ver.timestamp ? new Date(ver.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          {ver.isCurrent ? (
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${isDark ? 'bg-indigo-500/30' : 'bg-indigo-200/60'}`}>
                              Current
                            </span>
                          ) : (
                            <ArrowRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-slate-400' : 'text-indigo-500'}`} />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


export const CHAPTER_SUGGESTIONS = {
  financials: [
    {
      id: 'sug-fin-1',
      title: 'Customer Concentration',
      type: 'warning',
      text: 'Top 5 customers contribute 62.5% of FY25 revenue. Consider strengthening the related risk disclosure.',
      actionType: 'review',
      targetId: 'summary_restated_financial_info',
      applyText: '\n\nNote on Customer Concentration: The Top 5 customers contribute 62.5% of FY25 restated revenue. Management recommends continuous monitoring of key OEM client agreements.'
    },
    {
      id: 'sug-fin-2',
      title: 'Financial Consistency',
      type: 'conflict',
      text: 'FY24 revenue differs from the underlying financial source.',
      actionType: 'view_conflict',
      targetId: 'summary_restated_financial_info',
      sourceRef: 'Intake: Financials: restated_fs'
    },
    {
      id: 'sug-fin-3',
      title: 'Source Coverage',
      type: 'source',
      text: 'Financial Information is linked to its underlying financial data.',
      actionType: 'view_source',
      sourceRef: 'Document: Audited_Financial_Statements_FY25.pdf'
    }
  ],
  financial_information: [
    {
      id: 'sug-fin-1',
      title: 'Customer Concentration',
      type: 'warning',
      text: 'Top 5 customers contribute 62.5% of FY25 revenue. Consider strengthening the related risk disclosure.',
      actionType: 'review',
      targetId: 'summary_restated_financial_info',
      applyText: '\n\nNote on Customer Concentration: The Top 5 customers contribute 62.5% of FY25 restated revenue. Management recommends continuous monitoring of key OEM client agreements.'
    },
    {
      id: 'sug-fin-2',
      title: 'Financial Consistency',
      type: 'conflict',
      text: 'FY24 revenue differs from the underlying financial source.',
      actionType: 'view_conflict',
      targetId: 'summary_restated_financial_info',
      sourceRef: 'Intake: Financials: restated_fs'
    },
    {
      id: 'sug-fin-3',
      title: 'Source Coverage',
      type: 'source',
      text: 'Financial Information is linked to its underlying financial data.',
      actionType: 'view_source',
      sourceRef: 'Document: Audited_Financial_Statements_FY25.pdf'
    }
  ],
  company_details: [
    {
      id: 'sug-comp-1',
      title: 'Capacity Utilization',
      type: 'warning',
      text: 'Plant manufacturing capacity utilization reached 84.2% in FY25. Consider adding expansion timeline details.',
      actionType: 'review',
      targetId: 'definitions_and_abbreviations',
      applyText: '\n\nOperational Note: Plant manufacturing capacity utilization averaged 84.2% in FY25, with planned 5-axis CNC machining expansion in Q3 FY26.'
    },
    {
      id: 'sug-comp-2',
      title: 'Registered Office Alignment',
      type: 'conflict',
      text: 'Registered office address in ROC certificate potential inconsistency with utility bill record. Verification recommended.',
      actionType: 'view_conflict',
      targetId: 'general_information',
      sourceRef: 'Intake: Company Details: registered_address'
    },
    {
      id: 'sug-comp-3',
      title: 'Source Coverage',
      type: 'source',
      text: 'Company Profile disclosures are linked to verified Incorporation Certificate and CIN records.',
      actionType: 'view_source',
      sourceRef: 'Document: Certificate_of_Incorporation.pdf'
    }
  ],
  business_overview: [
    {
      id: 'sug-biz-1',
      title: 'Raw Material Exposure',
      type: 'warning',
      text: 'Key raw material costs account for 58.4% of total expenses. Consider reviewing raw material volatility disclosure.',
      actionType: 'review',
      targetId: 'our_business',
      applyText: '\n\nSupply Chain Exposure: Raw material purchases (primarily alloy steel & brass forgings) represented 58.4% of total operational expenses.'
    },
    {
      id: 'sug-biz-2',
      title: 'OEM Agreement Duration',
      type: 'conflict',
      text: 'OEM long-term supply agreement tenure (3 years) potential inconsistency with key customer disclosures.',
      actionType: 'view_conflict',
      targetId: 'our_business',
      sourceRef: 'Intake: Business Overview: key_customers'
    },
    {
      id: 'sug-biz-3',
      title: 'Source Coverage',
      type: 'source',
      text: 'Business Overview narrative is linked to CRISIL industry report and plant machinery inspection records.',
      actionType: 'view_source',
      sourceRef: 'Document: CRISIL_Precision_Engineering_Report.pdf'
    }
  ],
  risk_factors: [
    {
      id: 'sug-risk-1',
      title: 'Supplier Dependency',
      type: 'warning',
      text: 'Single alloy steel supplier accounts for 48% of raw material purchases. Review recommended for Risk Factor 3.',
      actionType: 'review',
      targetId: 'risk_factors',
      applyText: '\n\nAdditional Risk Factor Disclosure: The Company sources 48% of its alloy steel requirements from a primary vendor. Any supply disruption could temporarily impact production.'
    },
    {
      id: 'sug-risk-2',
      title: 'Litigation Disclosure Match',
      type: 'conflict',
      text: 'Pending tax dispute amount (₹14.2 Lakhs) potential inconsistency between Legal Chapter and Risk Factor 5.',
      actionType: 'view_conflict',
      targetId: 'risk_factors',
      sourceRef: 'Intake: Litigation: tax_proceedings'
    },
    {
      id: 'sug-risk-3',
      title: 'Source Coverage',
      type: 'source',
      text: 'Risk Factors are linked to environmental compliance NOCs and insurance policy coverage schedules.',
      actionType: 'view_source',
      sourceRef: 'Document: MPCB_Consent_to_Operate.pdf'
    }
  ],
  promoter_details: [
    {
      id: 'sug-prom-1',
      title: 'Promoter Lock-in Requirement',
      type: 'warning',
      text: 'Promoter minimum contribution of 20% equity requires 3-year lock-in. Consider verifying pre-IPO allotment dates.',
      actionType: 'review',
      targetId: 'our_promoters_and_promoter_group'
    },
    {
      id: 'sug-prom-2',
      title: 'Source Coverage',
      type: 'source',
      text: 'Promoter profile and management background are linked to MCA DIN records and PAN verification.',
      actionType: 'view_source',
      sourceRef: 'Intake: Promoters: promoters_list'
    }
  ],
  capital_structure: [
    {
      id: 'sug-cap-1',
      title: 'Authorized Capital Alignment',
      type: 'conflict',
      text: 'Authorized equity share capital in disclosure requires verification against ROC Form SH-7 filing.',
      actionType: 'view_conflict',
      targetId: 'capital_structure',
      sourceRef: 'Intake: Capital Structure: authorized_capital'
    },
    {
      id: 'sug-cap-2',
      title: 'Source Coverage',
      type: 'source',
      text: 'Shareholding pattern and pre-IPO capital structure are verified against PAS-3 return of allotment.',
      actionType: 'view_source',
      sourceRef: 'Document: PAS3_Return_of_Allotment.pdf'
    }
  ],
  objects: [
    {
      id: 'sug-obj-1',
      title: 'Working Capital Deployment Schedule',
      type: 'warning',
      text: 'Proposed issue proceeds deployment across FY26-FY27. Review recommended for fund deployment timeline.',
      actionType: 'review',
      targetId: 'objects'
    },
    {
      id: 'sug-obj-2',
      title: 'Source Coverage',
      type: 'source',
      text: 'Machinery acquisition cost estimates verified against vendor quotation proposals.',
      actionType: 'view_source',
      sourceRef: 'Intake: Objects: machinery_quotation'
    }
  ],
  litigation: [
    {
      id: 'sug-lit-1',
      title: 'Statutory License Validity',
      type: 'warning',
      text: 'Factory License renewal due in Dec 2028. Consider confirming current validity status with inspector of factories.',
      actionType: 'review',
      targetId: 'key_regulations_and_policies'
    },
    {
      id: 'sug-lit-2',
      title: 'Source Coverage',
      type: 'source',
      text: 'Outstanding legal proceedings table verified against legal counsel certificate and court status portal.',
      actionType: 'view_source',
      sourceRef: 'Document: Legal_Counsel_Opinion_Letter.pdf'
    }
  ]
};

function AiSuggestionsSidebarCard({
  activeTocId,
  selectedSectionKey,
  isDark = false,
  onReview,
  onViewConflict,
  onViewSource,
  onApply,
  onDismiss
}) {
  const [resolvedIds, setResolvedIds] = useState(new Set());

  // Determine current chapter key
  const chapterKey = selectedSectionKey || 'company_details';
  const rawSuggestions = CHAPTER_SUGGESTIONS[chapterKey] || CHAPTER_SUGGESTIONS[activeTocId] || CHAPTER_SUGGESTIONS['financial_information'];

  const activeSuggestions = rawSuggestions.filter(s => !resolvedIds.has(s.id));
  const count = activeSuggestions.length;

  const handleAction = (sug, actionType) => {
    if (actionType === 'review' && onReview) {
      onReview(sug);
    } else if (actionType === 'view_conflict' && onViewConflict) {
      onViewConflict(sug);
    } else if (actionType === 'view_source' && onViewSource) {
      onViewSource(sug);
    } else if (actionType === 'apply') {
      if (onApply) onApply(sug);
      setResolvedIds(prev => new Set([...prev, sug.id]));
    } else if (actionType === 'dismiss') {
      if (onDismiss) onDismiss(sug);
      setResolvedIds(prev => new Set([...prev, sug.id]));
    }
  };

  const cardContainerStyle = isDark
    ? "bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3 mt-4"
    : "bg-gradient-to-br from-indigo-50/50 via-slate-50 to-white p-4 rounded-2xl border border-indigo-100 shadow-sm space-y-3 mt-4 font-sans";

  return (
    <div className={cardContainerStyle}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-indigo-100/60 pb-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <h4 className="font-bold text-slate-800 text-xs tracking-tight font-sans">✨ AI Suggestions</h4>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 shrink-0 font-mono">
          {count} {count === 1 ? 'Suggestion' : 'Suggestions'}
        </span>
      </div>

      {/* Suggestion Items */}
      {count === 0 ? (
        <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-center">
          <p className="text-[11px] text-emerald-700 font-medium flex items-center justify-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> All AI suggestions resolved for this chapter.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-0.5">
          {activeSuggestions.map((sug) => {
            const isWarning = sug.type === 'warning';
            const isConflict = sug.type === 'conflict';
            const iconSymbol = isWarning ? '⚠' : isConflict ? '⚠' : '✓';

            return (
              <div
                key={sug.id}
                className={`p-3 rounded-xl border transition-all space-y-2 ${
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : isConflict
                    ? 'bg-red-50/40 border-red-100'
                    : isWarning
                    ? 'bg-amber-50/40 border-amber-100'
                    : 'bg-emerald-50/40 border-emerald-100'
                }`}
              >
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold shrink-0">{iconSymbol}</span>
                    <span className="font-bold text-xs text-slate-800 truncate">{sug.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAction(sug, 'dismiss')}
                    className="text-slate-400 hover:text-slate-600 text-[10px] p-0.5 rounded hover:bg-slate-100 transition-colors"
                    title="Dismiss suggestion"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-600 leading-snug font-sans">
                  {sug.text}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  {sug.actionType === 'review' && (
                    <button
                      type="button"
                      onClick={() => handleAction(sug, 'review')}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> Review
                    </button>
                  )}

                  {sug.actionType === 'view_conflict' && (
                    <button
                      type="button"
                      onClick={() => handleAction(sug, 'view_conflict')}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[10px] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <AlertTriangle className="w-3 h-3" /> View Conflict
                    </button>
                  )}

                  {sug.actionType === 'view_source' && (
                    <button
                      type="button"
                      onClick={() => handleAction(sug, 'view_source')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" /> View Source
                    </button>
                  )}

                  {sug.applyText && (
                    <button
                      type="button"
                      onClick={() => handleAction(sug, 'apply')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-[10px] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Apply
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleAction(sug, 'dismiss')}
                    className="px-2 py-1 text-slate-500 hover:text-slate-700 font-semibold text-[10px] rounded hover:bg-slate-100 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ChapterHealthSidebar({
  activeId,
  setActiveId,
  onNavigateSection,
  drafts = {},
  gapReport = [],
  variant = 'light', // 'light' | 'dark'
  // Review section props
  comments = [],
  auditLogs = [],
  aiSuggestions = [],
  openIssues = [],
  versions = [],
  onCommentClick,
  onIssueClick,
  onAcceptSuggestion,
  onDismissSuggestion,
  onConvertSuggestionToComment,
  onVersionClick,
  onAddComment,
  onResolveComment,
  onReviewSuggestion,
  onViewConflict,
  onViewSource,
  onApplySuggestion
}) {
  // Find which parent section contains activeId
  const getParentSectionId = (targetId) => {
    if (!targetId) return 'general';
    for (const sec of DRHP_HIERARCHY) {
      if (sec.id === targetId) return sec.id;
      if (sec.subsections && sec.subsections.some(sub => sub.id === targetId)) {
        return sec.id;
      }
    }
    return 'general';
  };

  const [expandedSectionId, setExpandedSectionId] = React.useState(() => getParentSectionId(activeId));

  React.useEffect(() => {
    if (activeId) {
      const parentId = getParentSectionId(activeId);
      setExpandedSectionId(parentId);
    }
  }, [activeId]);

  const handleParentClick = (sec, backendKey) => {
    setExpandedSectionId(sec.id);
    const targetId = (sec.subsections && sec.subsections.length > 0)
      ? sec.subsections[0].id
      : sec.id;

    if (setActiveId) setActiveId(targetId);
    if (onNavigateSection) {
      onNavigateSection(backendKey || sec.key, targetId);
    }
  };

  const handleSubClick = (subId, backendKey, e) => {
    e.stopPropagation();
    if (setActiveId) setActiveId(subId);
    if (onNavigateSection) {
      onNavigateSection(backendKey, subId);
    }
  };

  const hasUnresolvedGap = (key) => {
    if (!Array.isArray(gapReport) || gapReport.length === 0 || !key) return false;
    const keyMap = { risk_factors: 'risk_information', related_party: 'rpt', promoter_details: 'promoters' };
    const targetKey = keyMap[key] || key;
    return gapReport.some(g => {
      const field = g.fieldName || '';
      return field.startsWith(key) || field.startsWith(targetKey);
    });
  };

  const isDark = variant === 'dark';
  const currentParentSec = DRHP_HIERARCHY.find(sec => sec.id === expandedSectionId || sec.id === activeId || sec.subsections?.some(sub => sub.id === activeId));
  const selectedSectionKey = currentParentSec?.key || 'company_details';

  return (
    <div className={isDark ? "space-y-1 font-sans" : "bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm h-fit space-y-2 sticky top-6 max-h-[90vh] overflow-y-auto font-sans"}>
      {!isDark && (
        <h3 className="font-bold text-slate-800 text-sm px-3 mb-4">DRHP Table of Contents</h3>
      )}

      <div className="space-y-1">
        {DRHP_HIERARCHY.map((sec, secIdx) => {
          const secNum = secIdx + 1;
          const isExpanded = expandedSectionId === sec.id;
          const isSecActive = activeId === sec.id;
          const hasSub = sec.subsections && sec.subsections.length > 0;
          const secDraft = drafts[sec.key];
          const isCertified = secDraft && secDraft.status === 'certified';
          const secGap = hasUnresolvedGap(sec.key);
          const titleText = toTitleCase(sec.title);

          return (
            <div key={sec.id} className="space-y-1">
              {/* Parent Section Item */}
              <button
                type="button"
                onClick={() => handleParentClick(sec, sec.key)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSecActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/5'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <span className="truncate flex-1">{titleText}</span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isCertified ? (
                    <Check className={`w-3.5 h-3.5 shrink-0 ${isSecActive ? 'text-white' : 'text-emerald-400'}`} title="Section certified" />
                  ) : secGap ? (
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isSecActive ? 'bg-white/70' : 'bg-amber-400'}`} title="Contains unresolved gap" />
                  ) : null}

                  {hasSub && (
                    <span className={isSecActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-400'}>
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                  )}
                </div>
              </button>

              {/* Subsections Accordion List */}
              {hasSub && isExpanded && (
                <div className={`ml-3 pl-2 border-l space-y-1 my-1 ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
                  {sec.subsections.map((sub, subIdx) => {
                    const subNum = `${secNum}.${subIdx + 1}`;
                    const isSubActive = activeId === sub.id;
                    const subGap = hasUnresolvedGap(sub.key);
                    const subDraft = drafts[sub.key];
                    const isSubCertified = subDraft && subDraft.status === 'certified';
                    const cleanSubTitle = (sub.title || '').replace(/^\d+(\.\d+)*\s*/, '').trim();
                    const subTitleText = `${subNum} ${toTitleCase(cleanSubTitle)}`;

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={(e) => handleSubClick(sub.id, sub.key, e)}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs font-medium transition-all duration-200 cursor-pointer ${
                          isSubActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 font-semibold'
                            : isDark
                            ? 'text-slate-400 hover:text-white hover:bg-white/5'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                      >
                        <span className="truncate flex-1">{subTitleText}</span>
                        {isSubCertified ? (
                          <Check className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-emerald-400'}`} title="Subsection certified" />
                        ) : subGap ? (
                          <span className={`w-2 h-2 rounded-full shrink-0 ${isSubActive ? 'bg-white/70' : 'bg-amber-400'}`} title="Contains unresolved gap" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Suggestions Card — Compact Left Sidebar Section */}
      <AiSuggestionsSidebarCard
        activeTocId={activeId}
        selectedSectionKey={selectedSectionKey}
        isDark={isDark}
        onReview={onReviewSuggestion}
        onViewConflict={onViewConflict}
        onViewSource={onViewSource}
        onApply={onApplySuggestion}
        onDismiss={onDismissSuggestion}
      />
    </div>
  );
}
