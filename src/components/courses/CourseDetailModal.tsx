import React from 'react';
import {
  X,
  Calendar,
  Tag,
  MapPin,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  GraduationCap,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { Course } from '../../types';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
}) => {
  if (!course) return null;

  const isPresencial = course.type === 'presencial';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Header */}
        <div className="relative h-52 sm:h-60 w-full shrink-0 overflow-hidden bg-slate-900">
          <img
            src={course.coverImageUrl}
            alt={course.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
            title="Cerrar ventana"
          >
            <X size={18} />
          </button>

          {/* Type & Badge pills */}
          <div className="absolute top-3.5 left-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${isPresencial
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                }`}
            >
              <GraduationCap size={13} />
              {isPresencial ? 'Formación Presencial' : 'Curso Online'}
            </span>

            {/* {course.badgeText && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-slate-900 backdrop-blur-md">
                <Sparkles size={12} className="text-amber-500" />
                {course.badgeText}
              </span>
            )} */}
          </div>

          {/* Bottom Title inside banner */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              {course.categoryName || (isPresencial ? 'Práctica en Cabina' : 'Campus Virtual')}
            </span>
            <h2 className="text-lg sm:text-xl font-bold leading-tight mt-0.5 drop-shadow-sm">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* Key metadata grid */}
          {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div className="flex items-start gap-2.5">
              <Tag size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="block text-[10px] font-medium text-slate-500 uppercase">Categoría</span>
                <span className="font-semibold text-slate-900">{course.categoryName || 'General'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <BookOpen size={16} className="text-slate-500 mt-0.5 shrink-0" />
              <div>
                <span className="block text-[10px] font-medium text-slate-500 uppercase">Modalidad</span>
                <span className="font-semibold text-slate-900">
                  {isPresencial ? 'Práctica clínica' : 'Campus Virtual Online'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <UserCheck size={16} className="text-slate-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] font-medium text-slate-500 uppercase">Docente</span>
                <span className="font-semibold text-slate-900 truncate block" title={course.instructor.name}>
                  {course.instructor.name}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar size={16} className="text-slate-500 mt-0.5 shrink-0" />
              <div>
                <span className="block text-[10px] font-medium text-slate-500 uppercase">Acceso / Precio</span>
                <span className="font-bold text-emerald-600">{course.price}</span>
              </div>
            </div>
          </div> */}

          {/* Location for in-person */}
          {isPresencial && course.location && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
              <MapPin size={16} className="text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">Lugar de impartición: </span>
                <span>{course.location}</span>
                {course.startDate && (
                  <span className="block sm:inline sm:ml-2 text-amber-700 font-medium">
                    ({course.startDate})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="text-sm leading-relaxed text-slate-600">
              {course.description}
            </p>
          </div>

          {/* Topics / Syllabus */}
          {course.topics && course.topics.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                Temario
              </h3>
              <ul className="space-y-2">
                {course.topics.map((topic, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructor Bio */}
          {/* <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={course.instructor.avatarUrl || 'https://images.unsplash.com/photo-1594824813579-08c35d947231?w=200&auto=format&fit=crop&q=80'}
                alt={course.instructor.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{course.instructor.name}</h4>
                <p className="text-xs text-slate-500">{course.instructor.role}</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Acreditado por <span className="font-semibold text-slate-700">Academia Alviestetic</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">

            <a
              href={course.enrollUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{isPresencial ? 'Reservar plaza presencial' : 'Acceder al curso en Alviestetic'}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
