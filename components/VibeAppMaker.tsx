import React, { useState, useEffect } from 'react';
import { Sparkles, Code, Download, Save, Eye, Users, Zap, Brain, Heart, ArrowRight, X, Check, Loader2, ExternalLink } from 'lucide-react';

// Apple Glass 2025 Design System
const GlassTheme = {
  bg: 'bg-black',
  glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
  glassHover: 'bg-white/10 backdrop-blur-xl border border-white/20',
  primary: 'bg-white text-black',
  primaryHover: 'bg-white/90 text-black',
  secondary: 'bg-white/10 text-white border border-white/20',
  secondaryHover: 'bg-white/20 text-white border border-white/30',
  accent: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
  text: 'text-white',
  textMuted: 'text-white/70',
  textDim: 'text-white/50'
};

// Questionnaire Component
function IdeationQuestionnaire({ onComplete, onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    "What problem does this app solve and what inspired you to think of it?",
    "Describe using your app in a real scenario.",
    "When and where would you use this?",
    "What's the one thing this app must do well?",
    "Walk me through an ideal moment using the app.",
    "Are there any existing apps like this and if so, how does your idea differ?",
    "What emotion should users feel when using this?"
  ];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Generate app idea from answers
      const appIdea = generateAppIdea(answers);
      onComplete(appIdea);
    }
  };

  const generateAppIdea = (answers) => {
    return `Create a ${answers[6] || 'helpful'} app that ${answers[0] || 'solves a problem'}. 
    The app should be used ${answers[2] || 'daily'} and focus on ${answers[3] || 'user experience'}. 
    It should feel ${answers[6] || 'intuitive'} and ${answers[4] || 'smooth to use'}.`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${GlassTheme.glass} rounded-2xl p-8 max-w-2xl w-full`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${GlassTheme.text}`}>App Ideation Helper</h3>
          <button onClick={onClose} className={`${GlassTheme.secondary} p-2 rounded-lg hover:${GlassTheme.secondaryHover}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            {questions.map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${i <= currentQuestion ? 'bg-white' : 'bg-white/20'}`} />
            ))}
          </div>
          <p className={`text-sm ${GlassTheme.textMuted} mb-4`}>Question {currentQuestion + 1} of {questions.length}</p>
        </div>

        <div className="mb-8">
          <h4 className={`text-lg font-medium mb-4 ${GlassTheme.text}`}>{questions[currentQuestion]}</h4>
          <textarea
            placeholder="Share your thoughts..."
            className={`w-full h-32 ${GlassTheme.glass} rounded-lg p-4 ${GlassTheme.text} placeholder-white/50 border-0 focus:ring-2 focus:ring-white/30 resize-none`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey === false && e.target.value.trim()) {
                e.preventDefault();
                handleAnswer(e.target.value.trim());
              }
            }}
          />
        </div>

        <div className="flex justify-between">
          <button 
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className={`${GlassTheme.secondary} px-4 py-2 rounded-lg disabled:opacity-50`}
          >
            Previous
          </button>
          <button 
            onClick={() => handleAnswer(document.querySelector('textarea').value.trim())}
            disabled={!document.querySelector('textarea')?.value.trim()}
            className={`${GlassTheme.primary} px-6 py-2 rounded-lg flex items-center space-x-2`}
          >
            <span>{currentQuestion === questions.length - 1 ? 'Generate Idea' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// App Builder Component
function AppBuilder({ idea, onGenerate }) {
  const [theme, setTheme] = useState('playful');
  const [layout, setLayout] = useState('triple');
  const [isGenerating, setIsGenerating] = useState(false);

  const themes = ['minimal', 'playful', 'professional', 'artistic', 'techy'];
  const layouts = ['single', 'dual', 'triple', 'quad'];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea,
          theme,
          layout,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate app');
      }

      const appConfig = await response.json();
      onGenerate(appConfig.app);
    } catch (error) {
      console.error('Error generating app:', error);
      // Fallback to mock data for demo
      const mockAppConfig = {
        idea,
        theme,
        layout,
        timestamp: Date.now(),
        components: ['VibeCard', 'VibeButton', 'VibeGrid'],
        pages: ['Dashboard', 'Settings'],
        api: ['/api/data', '/api/users'],
        title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} App`,
        description: `A ${theme} themed app with ${layout} layout`
      };
      onGenerate(mockAppConfig);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`${GlassTheme.glass} rounded-2xl p-8`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`${GlassTheme.accent} p-2 rounded-lg`}>
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className={`text-2xl font-bold ${GlassTheme.text}`}>Vibe App Builder</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-3 ${GlassTheme.text}`}>App Idea</label>
          <textarea
            value={idea}
            onChange={(e) => {}}
            className={`w-full h-24 ${GlassTheme.glass} rounded-lg p-4 ${GlassTheme.text} border-0 focus:ring-2 focus:ring-white/30 resize-none`}
            placeholder="Describe your app idea..."
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-3 ${GlassTheme.text}`}>Visual Theme</label>
          <div className="grid grid-cols-5 gap-2">
            {themes.map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`p-3 rounded-lg text-sm font-medium capitalize transition-all ${
                  theme === t 
                    ? `${GlassTheme.primary}` 
                    : `${GlassTheme.secondary} hover:${GlassTheme.secondaryHover}`
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-3 ${GlassTheme.text}`}>Layout Style</label>
          <div className="grid grid-cols-4 gap-2">
            {layouts.map(l => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={`p-3 rounded-lg text-sm font-medium capitalize transition-all ${
                  layout === l 
                    ? `${GlassTheme.primary}` 
                    : `${GlassTheme.secondary} hover:${GlassTheme.secondaryHover}`
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !idea.trim()}
          className={`w-full ${GlassTheme.accent} py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Your App...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Generate Vibe App</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// App Preview Component
function AppPreview({ appConfig, onSave, onDownload }) {
  const [title, setTitle] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/download-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appData: appConfig }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate download');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${appConfig.title || 'vibe-app'}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: show alert
      alert('Download feature coming soon! Your app has been generated successfully.');
    }
  };

  return (
    <div className="space-y-6">
      <div className={`${GlassTheme.glass} rounded-2xl p-8`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${GlassTheme.text}`}>Your Generated App</h3>
          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              className={`${GlassTheme.secondary} px-4 py-2 rounded-lg flex items-center space-x-2 hover:${GlassTheme.secondaryHover}`}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className={`${GlassTheme.primary} px-4 py-2 rounded-lg flex items-center space-x-2 hover:${GlassTheme.primaryHover}`}
            >
              <Save className="w-4 h-4" />
              <span>Save Public</span>
            </button>
          </div>
        </div>

        {/* App Preview Frame */}
        <div className={`${GlassTheme.glass} rounded-xl p-6 min-h-96`}>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className={`ml-4 text-sm ${GlassTheme.textMuted}`}>localhost:3000</span>
          </div>
          
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-8 min-h-80">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">{appConfig.title || `Your ${appConfig.theme} App`}</h2>
              <p className="text-purple-700 mb-6">{appConfig.description || appConfig.idea}</p>
              
              <div className={`grid grid-cols-${appConfig.layout === 'single' ? '1' : appConfig.layout === 'dual' ? '2' : appConfig.layout === 'triple' ? '3' : '4'} gap-4`}>
                {Array(parseInt(appConfig.layout === 'single' ? '1' : appConfig.layout === 'dual' ? '2' : appConfig.layout === 'triple' ? '3' : '4')).fill(0).map((_, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Feature {i + 1}</h3>
                    <p className="text-sm text-purple-700">Generated component</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${GlassTheme.glass} rounded-2xl p-8 max-w-md w-full`}>
            <h3 className={`text-xl font-semibold mb-4 ${GlassTheme.text}`}>Save to Public Gallery</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your app a title..."
              className={`w-full ${GlassTheme.glass} rounded-lg p-4 ${GlassTheme.text} placeholder-white/50 border-0 focus:ring-2 focus:ring-white/30 mb-6`}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className={`flex-1 ${GlassTheme.secondary} py-2 rounded-lg hover:${GlassTheme.secondaryHover}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSave(title);
                  setShowSaveModal(false);
                }}
                disabled={!title.trim()}
                className={`flex-1 ${GlassTheme.primary} py-2 rounded-lg hover:${GlassTheme.primaryHover} disabled:opacity-50`}
              >
                Save Public
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Public Gallery Component
function PublicGallery({ apps }) {
  return (
    <div className={`${GlassTheme.glass} rounded-2xl p-6`}>
      <h3 className={`text-lg font-semibold mb-4 ${GlassTheme.text} flex items-center space-x-2`}>
        <Users className="w-5 h-5" />
        <span>Public Gallery</span>
      </h3>
      
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {apps.map((app, i) => (
          <div key={i} className={`${GlassTheme.glass} rounded-lg p-4 min-w-64 flex-shrink-0 hover:${GlassTheme.glassHover} transition-all cursor-pointer`}>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg h-32 mb-3 flex items-center justify-center">
              <span className="text-blue-900 font-medium">{app.title}</span>
            </div>
            <h4 className={`font-medium ${GlassTheme.text} mb-1`}>{app.title}</h4>
            <p className={`text-sm ${GlassTheme.textMuted} mb-2`}>{app.theme} • {app.layout}</p>
            <div className="flex space-x-2">
              <button className={`${GlassTheme.secondary} px-3 py-1 rounded text-sm hover:${GlassTheme.secondaryHover} flex items-center space-x-1`}>
                <Eye className="w-3 h-3" />
                <span>Preview</span>
              </button>
              <button className={`${GlassTheme.secondary} px-3 py-1 rounded text-sm hover:${GlassTheme.secondaryHover} flex items-center space-x-1`}>
                <ExternalLink className="w-3 h-3" />
                <span>Open</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main App Component
export default function VibeAppMaker() {
  const [currentStep, setCurrentStep] = useState('idea'); // idea, build, preview
  const [appIdea, setAppIdea] = useState('');
  const [generatedApp, setGeneratedApp] = useState(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [publicApps, setPublicApps] = useState([
    { title: 'Habit Tracker', theme: 'minimal', layout: 'dual' },
    { title: 'Recipe Finder', theme: 'playful', layout: 'triple' },
    { title: 'Task Manager', theme: 'professional', layout: 'single' },
    { title: 'Mood Journal', theme: 'artistic', layout: 'dual' },
    { title: 'Code Snippet Manager', theme: 'techy', layout: 'quad' }
  ]);

  const handleQuestionnaireComplete = (idea) => {
    setAppIdea(idea);
    setShowQuestionnaire(false);
    setCurrentStep('build');
  };

  const handleAppGenerated = (config) => {
    setGeneratedApp(config);
    setCurrentStep('preview');
  };

  const handleSavePublic = async (title) => {
    try {
      const response = await fetch('/api/save-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          appData: generatedApp,
        }),
      });

      if (response.ok) {
        const newApp = {
          title,
          theme: generatedApp.theme,
          layout: generatedApp.layout,
          idea: generatedApp.idea
        };
        setPublicApps([newApp, ...publicApps]);
      }
    } catch (error) {
      console.error('Error saving app:', error);
      // Fallback: add to local state
      const newApp = {
        title,
        theme: generatedApp.theme,
        layout: generatedApp.layout,
        idea: generatedApp.idea
      };
      setPublicApps([newApp, ...publicApps]);
    }
  };

  return (
    <div className={`min-h-screen ${GlassTheme.bg} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className={`${GlassTheme.accent} p-3 rounded-xl`}>
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className={`text-4xl font-bold ${GlassTheme.text}`}>Vibe App Maker</h1>
          </div>
          <p className={`text-lg ${GlassTheme.textMuted} max-w-2xl mx-auto`}>
            Create beautiful, AI-generated apps in seconds. No coding required, just pure creativity.
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {currentStep === 'idea' && (
            <div className={`${GlassTheme.glass} rounded-2xl p-8 text-center`}>
              <Brain className={`w-16 h-16 ${GlassTheme.textMuted} mx-auto mb-6`} />
              <h2 className={`text-2xl font-bold mb-4 ${GlassTheme.text}`}>What's Your App Idea?</h2>
              <p className={`${GlassTheme.textMuted} mb-8`}>Describe your app vision or let us help you brainstorm</p>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                <textarea
                  value={appIdea}
                  onChange={(e) => setAppIdea(e.target.value)}
                  placeholder="Describe your app idea... (e.g., 'A habit tracker that gamifies daily routines')"
                  className={`w-full h-32 ${GlassTheme.glass} rounded-lg p-4 ${GlassTheme.text} placeholder-white/50 border-0 focus:ring-2 focus:ring-white/30 resize-none`}
                />
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowQuestionnaire(true)}
                    className={`flex-1 ${GlassTheme.secondary} py-3 rounded-lg hover:${GlassTheme.secondaryHover} flex items-center justify-center space-x-2`}
                  >
                    <Heart className="w-5 h-5" />
                    <span>Help Me Brainstorm</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep('build')}
                    disabled={!appIdea.trim()}
                    className={`flex-1 ${GlassTheme.primary} py-3 rounded-lg hover:${GlassTheme.primaryHover} disabled:opacity-50 flex items-center justify-center space-x-2`}
                  >
                    <ArrowRight className="w-5 h-5" />
                    <span>Continue</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'build' && (
            <AppBuilder 
              idea={appIdea} 
              onGenerate={handleAppGenerated}
            />
          )}

          {currentStep === 'preview' && generatedApp && (
            <AppPreview 
              appConfig={generatedApp}
              onSave={handleSavePublic}
              onDownload={() => {}}
            />
          )}

          {/* Public Gallery */}
          <PublicGallery apps={publicApps} />
        </div>

        {/* Questionnaire Modal */}
        {showQuestionnaire && (
          <IdeationQuestionnaire 
            onComplete={handleQuestionnaireComplete}
            onClose={() => setShowQuestionnaire(false)}
          />
        )}
      </div>
    </div>
  );
}
