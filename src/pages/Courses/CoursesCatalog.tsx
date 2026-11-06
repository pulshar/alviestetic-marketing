import React, { useState, useMemo, useRef } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  MapPin,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  PlayCircle,
  Tag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Course, CourseType, User, TutorLmsConfig } from '../../types';
import { courseService } from '../../services/courseService';
import { CourseDetailModal } from '../../components/courses/CourseDetailModal';

const COURSES_PER_PAGE = 20;

interface CoursesCatalogProps {
  currentUser: User;
  courses: Course[];
  tutorConfig: TutorLmsConfig;
  onRefreshCourses: () => void;
  onShowToast: (msg: string) => void;
  initialSelectedCourseId?: string;
}

export const CoursesCatalog: React.FC<CoursesCatalogProps> = ({
  currentUser,
  courses,
  tutorConfig,
  onRefreshCourses,
  onShowToast,
  initialSelectedCourseId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const catalogTopRef = useRef<HTMLDivElement>(null);
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(() => {
    if (initialSelectedCourseId) {
      return courses.find(c => c.id === initialSelectedCourseId) || null;
    }
    return null;
  });

  const isAdmin = currentUser.role === 'admin';

  // Dynamic list of categories with counts (prioritizing Mesoestetic & Phyt's)
  const availableCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    courses.forEach(c => {
      const cat = (c.categoryName && c.categoryName.trim()) ? c.categoryName.trim() : 'Otras';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const list = Object.keys(counts).sort((a, b) => {
      const getPriority = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('mesoestetic')) return 1;
        if (lower.includes("phyt's") || lower.includes('phyts')) return 2;
        return 10;
      };
      const diff = getPriority(a) - getPriority(b);
      if (diff !== 0) return diff;
      return a.localeCompare(b);
    });

    return list.map(name => ({
      name,
      count: counts[name]
    }));
  }, [courses]);

  // Filtering: Only by Category and optional search text
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      // Category filter
      if (selectedCategory !== 'all') {
        const courseCat = (c.categoryName && c.categoryName.trim()) ? c.categoryName.trim() : 'Otras';
        if (courseCat !== selectedCategory) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(query);
        const matchesDesc = c.description.toLowerCase().includes(query);
        const matchesCategory = (c.categoryName || '').toLowerCase().includes(query);
        const matchesInstructor = c.instructor.name.toLowerCase().includes(query);
        const matchesTopics = c.topics.some(t => t.toLowerCase().includes(query));
        const matchesLocation = c.location?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesInstructor && !matchesTopics && !matchesLocation) {
          return false;
        }
      }
      return true;
    });
  }, [courses, selectedCategory, searchQuery]);

  // Visual Pagination (20 courses per page)
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / COURSES_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedCourses = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * COURSES_PER_PAGE;
    return filteredCourses.slice(startIndex, startIndex + COURSES_PER_PAGE);
  }, [filteredCourses, safeCurrentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
    if (catalogTopRef.current) {
      catalogTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Manual WordPress sync trigger
  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const result = await courseService.syncCoursesOnLogin(currentUser);
      onRefreshCourses();
      if (result.newCount > 0) {
        onShowToast(`¡Sincronización completada! Se han detectado ${result.newCount} nuevos cursos.`);
      } else {
        onShowToast(`Catálogo de cursos al día (${result.totalCourses} cursos verificados).`);
      }
    } catch {
      onShowToast('Error durante la sincronización.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Test simulating a new course added to WordPress Tutor LMS
  const handleSimulateNewCourse = () => {
    const newCourse = courseService.simulateNewWordPressCourse();
    onRefreshCourses();
    onShowToast(`¡Nuevo curso simulado y notificación generada! (${newCourse.title})`);
  };

  return (
    <div className="space-y-6">
      {/* Catalog Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/20">
            <GraduationCap size={15} />
            <span>Academia Alviestetic</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Cursos y Especialización Médica
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Programas formativos tanto en formato online como talleres presenciales en clínica. Mantén al día a tu equipo con los últimos protocolos y técnicas en aparatología estética.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar: Category Only as requested */}
      <div ref={catalogTopRef} className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-2 scroll-mt-6">
        {/* Category Pills & Dropdown */}

        <div className='flex gap-0 sm:gap-3 flex-wrap justify-between'>
          <div className="flex items-center pb-3 gap-2 overflow-x-auto">

            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1.5">
              <Filter size={14} className="text-slate-400" />
              <span>Categoría:</span>
            </span>

            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
            >
              Todas ({courses.length})
            </button>

            {availableCategories.map(({ name, count }) => {
              const isSelected = selectedCategory === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleCategoryChange(name)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                  <Tag size={12} className={isSelected ? 'text-white' : 'text-slate-400'} />
                  <span>{name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">
            Mostrando <strong className="text-slate-900 font-semibold">{paginatedCourses.length}</strong> de {filteredCourses.length} cursos
            {totalPages > 1 && (
              <span className="ml-1 text-slate-400">· Página {safeCurrentPage} de {totalPages}</span>
            )}
          </div>
        </div>
        {/* Quick Search */}
        <div className="flex items-center gap-3 pt-2 sm:pt-0">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar curso por título, aparatología, tratamiento..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 sm:hidden shrink-0">
            {paginatedCourses.length} de {filteredCourses.length}
          </div>
        </div>
      </div>

      {/* Courses Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <BookOpen size={40} className="mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-900">No se encontraron cursos</h3>
          <p className="text-xs text-slate-500">
            No hay cursos que coincidan con los criterios seleccionados. Prueba a cambiar el filtro o restablecer la búsqueda.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Restablecer filtro
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedCourses.map((course) => {
              const isPresencial = course.type === 'presencial';

              return (
                <article
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Card Thumbnail */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden shrink-0">
                    <img
                      src={course.coverImageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isPresencial
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-blue-600 text-white shadow-xs'
                          }`}
                      >
                        {isPresencial ? <MapPin size={11} /> : <PlayCircle size={11} />}
                        {isPresencial ? 'Presencial' : 'Online'}
                      </span>

                      {/* {course.badgeText && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-slate-900 backdrop-blur-xs">
                          {course.badgeText}
                        </span>
                      )} */}
                    </div>

                    {/* Price overlay on image */}
                    <div className="absolute bottom-2.5 right-3 text-right">
                      <span className="text-[11px] font-bold text-white bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded">
                        {course.price}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4.5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Category tag */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md">
                          <Tag size={11} className="text-blue-600" />
                          {course.categoryName || 'General'}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {course.shortDescription || course.description}
                      </p>
                    </div>

                    {/* Instructor and Action buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {/* <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={course.instructor.avatarUrl || 'https://images.unsplash.com/photo-1594824813579-08c35d947231?w=200&auto=format&fit=crop&q=80'}
                          alt={course.instructor.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                        <span className="text-[11px] font-medium text-slate-700 truncate">
                          {course.instructor.name}
                        </span>
                      </div> */}

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setActiveCourseModal(course)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Ver temario
                        </button>

                        <a
                          href={course.enrollUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver en web oficial Alviestetic"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Visual Pagination Bar */}
          {totalPages > 1 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Mostrando{' '}
                <strong className="text-slate-900 font-semibold">
                  {(safeCurrentPage - 1) * COURSES_PER_PAGE + 1}
                </strong>
                {' – '}
                <strong className="text-slate-900 font-semibold">
                  {Math.min(safeCurrentPage * COURSES_PER_PAGE, filteredCourses.length)}
                </strong>{' '}
                de{' '}
                <strong className="text-slate-900 font-semibold">
                  {filteredCourses.length}
                </strong>{' '}
                cursos disponibles
              </div>

              <div className="flex items-center gap-1.5 justify-between w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => goToPage(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  <span>Anterior</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === safeCurrentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => goToPage(pageNum)}
                        className={`min-w-8 h-8 px-2.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => goToPage(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Siguiente</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Course Detail Modal */}
      {activeCourseModal && (
        <CourseDetailModal
          course={activeCourseModal}
          onClose={() => setActiveCourseModal(null)}
        />
      )}
    </div>
  );
};
