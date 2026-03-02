export default function ContextCard({ concept, align }) {
    const isLeft = align === 'left';

    return (
        <div className={`flex flex-col flex-1 max-w-[200px] ${isLeft ? 'items-end text-left' : 'items-start text-right'}`}>
            <div className={`p-6 rounded-2xl w-full flex items-center justify-center min-h-[120px] border-2 shadow-xl backdrop-blur-sm
        ${isLeft ? 'bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border-blue-500/50' : 'bg-gradient-to-bl from-orange-900/40 to-red-900/40 border-red-500/50'}
      `}>
                <h3 className="text-3xl font-black text-white px-2 py-1 text-center leading-tight [text-wrap:balance]">
                    {concept}
                </h3>
            </div>
            {/* Decorative arrow pointing to the dial */}
            <div className="w-full flex justify-center mt-4 opacity-50">
                {isLeft ? (
                    <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                ) : (
                    <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                )}
            </div>
        </div>
    );
}
