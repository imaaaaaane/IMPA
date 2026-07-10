import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsData } from '../data/projectsData';

const ProjeDetayi = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // N-jbdou l-projet li m-nasb m3a l-ID
    const project = projectsData.find(p => p.id === parseInt(id));

    // Bash mli t-dekhel l-page t-bda mn l-foq
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!project) {
        return <div className="min-h-screen flex items-center justify-center text-2xl">Proje bulunamadı!</div>;
    }

    return (
        <main className="min-h-screen bg-[#F5F2EB] dark:bg-[#1A1A1C] pt-32 pb-24 transition-colors duration-500">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">

                {/* Bouton bash t-rj3i l-Home */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-12 flex items-center gap-4 text-xs tracking-widest uppercase text-[#1A1A1C]/60 hover:text-amber-600 dark:text-white/60 dark:hover:text-amber-500 transition-colors"
                >
                    <span className="text-xl">←</span> Geri Dön
                </button>

                {/* L-Header dyal L-Projet */}
                <div className="mb-12">
                    <span className="text-amber-600 dark:text-amber-500 font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
                        {project.category}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif text-[#1A1A1C] dark:text-[#FAF9F6]">
                        {project.title}
                    </h1>
                </div>

                {/* L-Media (Video awla Tswira) kbeer w fakhim */}
                <div className="w-full h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden mb-16 shadow-2xl">
                    {project.type === 'video' ? (
                        <video
                            src={project.media}
                            autoPlay loop muted controls playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={project.media}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Ch-Cher7 dyal l-projet */}
                <div className="max-w-3xl mx-auto text-center">
                    <div className="w-12 h-[1px] bg-amber-500 mx-auto mb-8"></div>
                    <p className="text-[#1A1A1C]/80 dark:text-white/80 text-lg md:text-xl leading-relaxed font-light">
                        {project.description}
                    </p>
                </div>

            </div>
        </main>
    );
};

export default ProjeDetayi;