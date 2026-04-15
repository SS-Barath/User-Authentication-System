export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen animated-bg noise relative flex items-center justify-center p-4 overflow-hidden">
      {/* Floating orbs */}
      <div 
        className="orb-1 absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} 
      />
      <div 
        className="orb-2 absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }} 
      />
      <div 
        className="orb-3 absolute top-3/4 left-1/3 w-64 h-64 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }} 
      />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Card */}
      <div className="card-enter relative z-10 w-full max-w-md">
        <div 
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Top accent line */}
          <div 
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(139,92,246,0.8), transparent)' }}
          />

          <div className="p-8 sm:p-10">
            {/* Logo mark */}
            <div className="stagger-1 flex items-center gap-3 mb-8">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-display font-700 text-white text-lg tracking-tight">User Authentication System</span>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

