import { Course, CourseType, CourseLevel, PortalUpdate, TutorLmsConfig, User } from '../types';
import { storageService } from './storageService';
import { INITIAL_COURSES } from '../data/mockCourses';
import { cleanHtmlText, decodeHtmlEntities } from '../utils/textUtils';

class CourseService {
  getCourses(): Course[] {
    return storageService.getCourses();
  }

  getCourseById(id: string): Course | undefined {
    return this.getCourses().find(c => c.id === id);
  }

  saveCourse(course: Course): void {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === course.id);
    if (index >= 0) {
      courses[index] = course;
    } else {
      courses.unshift(course);
    }
    storageService.saveCourses(courses);
  }

  deleteCourse(id: string): void {
    const courses = this.getCourses().filter(c => c.id !== id);
    storageService.saveCourses(courses);
  }

  /**
   * Normalize courses from Tutor LMS REST API (/wp-json/tutor/v1/courses)
   * or standard WP custom post type (/wp-json/wp/v2/courses)
   * Decodes HTML entities like &#8211; (–), &#8217; (’), &amp;, etc.
   */
  private normalizeTutorLmsCourse(item: any, index: number): Course {
    const rawId = String(item.id || item.ID || `wp_course_${index}`);
    const rawTitle = typeof item.title === 'object' ? item.title.rendered : (item.post_title || item.title || 'Curso de Estética Avanzada');
    const rawContent = typeof item.content === 'object' ? item.content.rendered : (item.post_content || item.description || '');
    const rawExcerpt = typeof item.excerpt === 'object' ? item.excerpt.rendered : (item.post_excerpt || item.yoast_head_json?.description || '');
    const title = cleanHtmlText(rawTitle);
    const cleanContent = cleanHtmlText(rawContent);
    const cleanExcerpt = cleanHtmlText(rawExcerpt);

    // Determine type: presencial vs online
    const rawLink = item.link || item.guid?.rendered || item.guid || '';
    const isPresencial =
      rawLink.includes('presencial') ||
      title.toLowerCase().includes('presencial') ||
      title.toLowerCase().includes('taller') ||
      cleanContent.toLowerCase().includes('presencial');

    const isWebinar = title.toLowerCase().includes('webinar') || title.toLowerCase().includes('online');

    // Real Featured Image from WordPress REST API (embedded or Yoast) or Tutor LMS
    const coverImageUrl =
      item._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      item.yoast_head_json?.og_image?.[0]?.url ||
      item.thumbnail_url ||
      item.post_thumbnail?.url ||
      item.featured_image_url ||
      INITIAL_COURSES[index % INITIAL_COURSES.length]?.coverImageUrl ||
      'https://images.unsplash.com/photo-1512290900672-1f02f928e461?w=800&auto=format&fit=crop&q=80';

    // Category extraction (taxonomies + title keywords)
    let categoryName = '';
    if (item._embedded?.['wp:term'] && Array.isArray(item._embedded['wp:term'])) {
      for (const termGroup of item._embedded['wp:term']) {
        if (Array.isArray(termGroup) && termGroup.length > 0) {
          const match = termGroup.find((t: any) => t && t.name && !t.name.toLowerCase().includes('uncategorized'));
          if (match?.name) {
            categoryName = cleanHtmlText(match.name);
            break;
          }
        }
      }
    }
    if (!categoryName && item.course_category && Array.isArray(item.course_category) && item.course_category.length > 0) {
      categoryName = cleanHtmlText(item.course_category[0].name || item.course_category[0].slug || '');
    }
    const titleLower = title.toLowerCase();
    if (!categoryName || categoryName.toLowerCase().includes('uncategorized') || categoryName.toLowerCase().includes('sin categor')) {
      if (titleLower.includes("phyt's") || titleLower.includes('phyts') || titleLower.includes('kineplastie')) {
        categoryName = "Phyt's";
      } else if (titleLower.includes('mesoestetic') || titleLower.includes('mesopeel') || titleLower.includes('cosmelan') || titleLower.includes('eyecon')) {
        categoryName = 'Mesoestetic';
      } else if (titleLower.includes('láser') || titleLower.includes('laser') || titleLower.includes('diodo')) {
        categoryName = 'Láser & Luz';
      } else if (titleLower.includes('radiofrecuencia') || titleLower.includes('aparatología') || titleLower.includes('diatermia')) {
        categoryName = 'Aparatología Médica';
      } else if (isPresencial) {
        categoryName = 'Formación Presencial';
      } else {
        categoryName = 'Formación Continua';
      }
    }

    // Determine level
    let level: CourseLevel = 'Intermedio';
    const rawLevel = (item.tutor_course_level || item.level || '').toLowerCase();
    if (rawLevel.includes('principiante') || rawLevel.includes('beginner') || titleLower.includes('iniciación')) {
      level = 'Principiante';
    } else if (rawLevel.includes('avanzado') || rawLevel.includes('expert') || isPresencial || titleLower.includes('capacitación')) {
      level = 'Avanzado';
    } else if (rawLevel.includes('profesional') || titleLower.includes('comercial') || titleLower.includes('profesional')) {
      level = 'Profesional';
    }

    // Duration: Tutor LMS field or contextual estimate
    let duration = cleanHtmlText(item.tutor_course_duration || '');
    if (!duration) {
      if (isWebinar) {
        duration = '1.5 - 2 horas (Grabación en streaming)';
      } else if (isPresencial) {
        duration = '8 horas (1 jornada intensiva presencial)';
      } else {
        duration = '4 - 6 horas lectivas en vídeo';
      }
    }

    // Instructor
    let instructorName = cleanHtmlText(
      item.instructor?.display_name ||
      item.course_author?.display_name ||
      item.post_author?.display_name ||
      item._embedded?.author?.[0]?.name ||
      'Equipo Docente Alviestetic'
    );
    instructorName = instructorName.replace(/^\.+/, '').trim();
    if (!instructorName || instructorName.toLowerCase() === 'oscar') instructorName = 'Equipo Académico Alviestetic';

    // Price
    const rawPrice = item.price ?? item.tutor_course_price;
    const price = (rawPrice === 0 || rawPrice === '0' || !rawPrice)
      ? (isPresencial ? 'Incluido para centros colaboradores' : 'Acceso Gratuito Portal Clientes')
      : `${rawPrice} €`;

    // Direct course permalink on Alviestetic Tutor LMS
    const slug = item.post_name || item.slug || '';
    const enrollUrl = item.link || (slug ? `https://alviestetic.es/cursos/${slug}/` : (rawId ? `https://alviestetic.es/?p=${rawId}` : 'https://alviestetic.es/cursos/'));

    // Description / Summary
    const description = cleanContent || cleanExcerpt || `Capacitación completa sobre ${title}. Aprende la fundamentación técnica, indicaciones clínicas, contraindicaciones y protocolos de aplicación en cabina de la mano del equipo docente de Alviestetic.`;
    const shortDescription = cleanExcerpt || `Formación especializada sobre ${title}. Protocolo técnico desarrollado para centros y clínicas de Alviestetic.`;

    // Dynamic curriculum / syllabus topics based on theme
    let topics: string[] = [
      'Bases teóricas y fundamentación clínica del protocolo',
      'Pautas de seguridad y selección adecuada de equipos o productos',
      'Casos clínicos reales y resolución de dudas de aplicación en cabina'
    ];
    if (categoryName === "Phyt's") {
      topics = [
        'Formulación biocosmecéutica certificada y principios activos botánicos',
        'Protocolo de cabina exclusivo y aplicación paso a paso',
        'Prescripción y recomendaciones de continuidad domiciliaria'
      ];
    } else if (categoryName === 'Mesoestetic') {
      topics = [
        'Mecanismo de acción de la fórmula y sinergias moleculares',
        'Diagnóstico cutáneo y personalización según biotipo',
        'Protocolos combinados y optimización de resultados'
      ];
    } else if (categoryName === 'Láser & Luz') {
      topics = [
        'Parámetros ópticos, fluencia y duración de pulso según fototipo',
        'Medidas de fotoprotección y calibración del manípulo',
        'Consentimiento informado y protocolos de prevención'
      ];
    }

    return {
      id: rawId,
      title,
      slug: item.slug || item.post_name || `curso-${rawId}`,
      shortDescription,
      description,
      type: isPresencial ? 'presencial' : 'online',
      level,
      duration,
      price,
      instructor: {
        name: instructorName,
        role: 'Formador Oficial Academia Alviestetic',
        avatarUrl: item.instructor?.avatar_url || 'https://images.unsplash.com/photo-1594824813579-08c35d947231?w=200&auto=format&fit=crop&q=80'
      },
      coverImageUrl,
      topics,
      enrollUrl,
      location: isPresencial ? 'Sede Central Alviestetic · Madrid / Barcelona' : undefined,
      startDate: isPresencial ? 'Próxima convocatoria disponible' : undefined,
      badgeText: isPresencial ? 'Presencial' : (isWebinar ? 'Webinar' : 'Online'),
      publishedAt: item.date || item.post_date || new Date().toISOString(),
      categoryName
    };
  }

  /**
   * Fetches all courses from Tutor LMS REST API (/wp-json/tutor/v1/courses)
   * Automatically handles multi-page traversal using `data.total_page` and `data.total_course`.
   */
  async fetchAllTutorCourses(
    baseUrl: string,
    endpoint: string = '/wp-json/tutor/v1/courses'
  ): Promise<{
    success: boolean;
    message: string;
    totalCourses?: number;
    totalPages?: number;
    courses?: any[];
  }> {
    const cleanBase = baseUrl.replace(/\/+$/, '');
    let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Clean any prior pagination params and ensure order=asc
    cleanEndpoint = cleanEndpoint.replace(/([?&])paged=\d+/g, '').replace(/([?&])per_page=\d+/g, '');
    if (!cleanEndpoint.includes('order=')) {
      cleanEndpoint += (cleanEndpoint.includes('?') ? '&' : '?') + 'order=asc';
    }

    const separator = cleanEndpoint.includes('?') ? '&' : '?';
    const page1Url = `${cleanBase}${cleanEndpoint}${separator}paged=1`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(page1Url, {
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          success: false,
          message: `El servidor WordPress respondió con código HTTP ${res.status} (${res.statusText}).`
        };
      }

      const json = await res.json();
      let allPosts: any[] = [];
      let totalCourse = 0;
      let totalPage = 1;

      if (json && json.data && Array.isArray(json.data.posts)) {
        allPosts = [...json.data.posts];
        totalCourse = Number(json.data.total_course) || allPosts.length;
        totalPage = Number(json.data.total_page) || (totalCourse > allPosts.length ? Math.ceil(totalCourse / allPosts.length) : 1);
      } else if (json && Array.isArray(json.posts)) {
        allPosts = [...json.posts];
        totalCourse = Number(json.total_course) || allPosts.length;
        totalPage = Number(json.total_page) || 1;
      } else if (Array.isArray(json)) {
        allPosts = [...json];
        totalCourse = allPosts.length;
        totalPage = 1;
      }

      // If there are more pages (e.g. total_page = 2 with 37 total courses), fetch remaining pages in parallel
      if (totalPage > 1) {
        const remainingPagePromises = [];
        for (let p = 2; p <= totalPage; p++) {
          const nextUrl = `${cleanBase}${cleanEndpoint}${separator}paged=${p}`;
          remainingPagePromises.push(
            fetch(nextUrl, {
              headers: { Accept: 'application/json' }
            })
              .then(async r => {
                if (!r.ok) return null;
                const nextJson = await r.json();
                if (nextJson && nextJson.data && Array.isArray(nextJson.data.posts)) {
                  return nextJson.data.posts;
                } else if (nextJson && Array.isArray(nextJson.posts)) {
                  return nextJson.posts;
                } else if (Array.isArray(nextJson)) {
                  return nextJson;
                }
                return null;
              })
              .catch(() => null)
          );
        }

        const remainingResults = await Promise.all(remainingPagePromises);
        for (const pagePosts of remainingResults) {
          if (Array.isArray(pagePosts) && pagePosts.length > 0) {
            allPosts.push(...pagePosts);
          }
        }
      }

      // De-duplicate items by ID
      const seenIds = new Set<string>();
      const uniquePosts = allPosts.filter((item, idx) => {
        const id = String(item.id || item.ID || item.slug || `post_${idx}`);
        if (seenIds.has(id)) return false;
        seenIds.add(id);
        return true;
      });

      if (uniquePosts.length > 0) {
        return {
          success: true,
          message: `Conexión verificada: ${uniquePosts.length} cursos detectados (${totalPage} páginas de Tutor LMS, total: ${totalCourse || uniquePosts.length}).`,
          totalCourses: totalCourse || uniquePosts.length,
          totalPages: totalPage,
          courses: uniquePosts
        };
      } else {
        return {
          success: false,
          message: 'La respuesta de Tutor LMS no devolvió cursos válidos.'
        };
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return {
          success: false,
          message: 'Tiempo de espera agotado (timeout 6s) al consultar Tutor LMS.'
        };
      }
      return {
        success: false,
        message: `Restricción de red o política CORS del navegador al consultar ${page1Url}. Si el servidor no tiene CORS habilitado, se utiliza la base de datos local.`
      };
    }
  }

  /**
   * Test connection to Tutor LMS endpoint
   */
  async testEndpoint(baseUrl: string, endpoint: string): Promise<{ success: boolean; message: string; count?: number; courses?: any[] }> {
    const result = await this.fetchAllTutorCourses(baseUrl, endpoint);
    return {
      success: result.success,
      message: result.message,
      count: result.totalCourses,
      courses: result.courses
    };
  }

  /**
   * Sync courses when a user accesses the portal.
   * Traverses all Tutor LMS pages, normalizes courses, and generates notifications for newly detected courses.
   */
  async syncCoursesOnLogin(user: User): Promise<{
    success: boolean;
    newCount: number;
    totalCourses: number;
    statusMessage: string;
  }> {
    const config = storageService.getTutorConfig();
    const cachedIds = storageService.getCachedCourseIds();
    let currentCourses = storageService.getCourses();

    let status: 'connected' | 'cors_or_offline' | 'error' = 'connected';
    let statusMessage = '';
    let totalCoursesReported = currentCourses.length;
    let totalPagesReported = 2;

    const result = await this.fetchAllTutorCourses(config.baseUrl, config.coursesEndpoint);
    if (result.success && result.courses && result.courses.length > 0) {
      const normalized = result.courses.map((c, i) => this.normalizeTutorLmsCourse(c, i));
      currentCourses = normalized;
      totalCoursesReported = result.totalCourses || normalized.length;
      totalPagesReported = result.totalPages || 2;
      storageService.saveCourses(normalized);
      statusMessage = `Sincronizados ${normalized.length} cursos desde Tutor LMS (${totalPagesReported} páginas).`;
    } else {
      status = 'cors_or_offline';
      statusMessage = result.message;
    }

    // Detect new courses that haven't been notified yet
    const newCourses = currentCourses.filter(c => !cachedIds.includes(c.id));
    let newUpdatesCreated = 0;

    if (newCourses.length > 0) {
      const existingUpdates = storageService.getUpdates();
      const newUpdates: PortalUpdate[] = newCourses.map(course => ({
        id: `notif_course_${course.id}_${Date.now()}`,
        category: 'course',
        courseId: course.id,
        title: cleanHtmlText(`Nuevo curso: ${course.title}`),
        description: cleanHtmlText(`Nueva formación disponible en Academia Alviestetic · Categoría: ${course.categoryName || 'General'} (${course.type === 'presencial' ? 'Presencial' : 'Online'}).`),
        publishedAt: new Date().toISOString(),
        readByUserIds: []
      }));

      storageService.saveUpdates([...newUpdates, ...existingUpdates]);

      // Update cached IDs so we don't notify repeatedly for the same courses
      const updatedCachedIds = Array.from(new Set([...cachedIds, ...newCourses.map(c => c.id)]));
      storageService.saveCachedCourseIds(updatedCachedIds);
      newUpdatesCreated = newCourses.length;
    }

    // Update config sync timestamp & status
    storageService.saveTutorConfig({
      ...config,
      totalCourses: totalCoursesReported,
      totalPages: totalPagesReported,
      lastSyncAt: new Date().toISOString(),
      lastStatus: status,
      lastStatusMessage: statusMessage
    });

    return {
      success: status === 'connected',
      newCount: newUpdatesCreated,
      totalCourses: currentCourses.length,
      statusMessage
    };
  }

  /**
   * Simulates detecting a new course from WordPress Tutor LMS.
   * Creates a new course, pushes it to storage, and generates an in-app notification badge immediately.
   */
  simulateNewWordPressCourse(): Course {
    const timestamp = Date.now();
    const newCourseNumber = Math.floor(Math.random() * 900) + 100;
    const isPresencial = Math.random() > 0.5;

    const sampleTitles = [
      'Masterclass en Armonización Facial y Rellenos Híbridos',
      'Protocolos Avanzados de Microneedling Médico y Exosomas',
      'Láser Fraccionado CO2 y Ablación Térmica en Dermatología Estética',
      'Tratamiento de Ojeras Hipercromáticas y Bolsas Palpebrales',
      'Dermapen y Cócteles Bioestimulantes en Rejuvenecimiento de Cuello'
    ];

    const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];

    const simulatedCourse: Course = {
      id: `course_wp_${timestamp}`,
      title: cleanHtmlText(`${randomTitle} (#${newCourseNumber})`),
      slug: `curso-nuevo-${newCourseNumber}`,
      shortDescription: 'Nuevo curso publicado en la plataforma WordPress Tutor LMS de Alviestetic.',
      description: 'Formación especializada recién incorporada al catálogo académico de Alviestetic. Desarrollada por médicos estéticos y especialistas en aparatología médica para mejorar la técnica y seguridad en cabina.',
      type: isPresencial ? 'presencial' : 'online',
      level: 'Avanzado',
      duration: isPresencial ? '8 horas presenciales' : '5 horas lectivas HD',
      price: isPresencial ? 'Incluido para clientes autorizados' : 'Acceso Gratuito Portal Clientes',
      instructor: {
        name: 'Dra. María V. Cordero',
        role: 'Directora Académica Alviestetic',
        avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80'
      },
      coverImageUrl: isPresencial
        ? 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
      topics: [
        'Anatomía topográfica y planos de infiltración/aplicación',
        'Criterios clínicos para la selección de dispositivos y productos',
        'Protocolo de actuación y seguimiento evolutivo',
        'Casos reales y resolución guiada de dudas en directo'
      ],
      enrollUrl: isPresencial ? 'https://alviestetic.es/cursos-presenciales/' : 'https://alviestetic.es/cursos/',
      location: isPresencial ? 'Sede Central Alviestetic · Madrid' : undefined,
      startDate: isPresencial ? 'Próxima convocatoria en 15 días' : undefined,
      badgeText: '¡Recién Publicado!',
      publishedAt: new Date().toISOString(),
      categoryName: isPresencial ? 'Formación Presencial' : 'Formación Online'
    };

    // Save course
    const courses = this.getCourses();
    storageService.saveCourses([simulatedCourse, ...courses]);

    // Create immediate unread notification
    const updates = storageService.getUpdates();
    const newUpdate: PortalUpdate = {
      id: `notif_course_${simulatedCourse.id}`,
      category: 'course',
      courseId: simulatedCourse.id,
      title: cleanHtmlText(`Nuevo curso disponible: ${simulatedCourse.title}`),
      description: cleanHtmlText(`Se acaba de dar de alta en WordPress una nueva formación ${simulatedCourse.type === 'presencial' ? 'presencial' : 'online'}. Inscríbete ahora desde la app.`),
      publishedAt: new Date().toISOString(),
      readByUserIds: []
    };
    storageService.saveUpdates([newUpdate, ...updates]);

    // Update cached IDs so it's registered
    const cachedIds = storageService.getCachedCourseIds();
    storageService.saveCachedCourseIds([...cachedIds, simulatedCourse.id]);

    return simulatedCourse;
  }
}

export const courseService = new CourseService();
