import React, { useState, useEffect, useMemo } from 'react';
import { User, Brand, Promotion, Asset, PortalUpdate, ActivityLog, Course, TutorLmsConfig } from './types';
import { authService } from './services/authService';
import { brandService } from './services/brandService';
import { promotionService } from './services/promotionService';
import { assetService } from './services/assetService';
import { clientService } from './services/clientService';
import { updateService } from './services/updateService';
import { storageService } from './services/storageService';
import { courseService } from './services/courseService';

import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { BrandsCatalog } from './pages/Brands/BrandsCatalog';
import { BrandDetail } from './pages/Brands/BrandDetail';
import { PromotionDetail } from './pages/Promotions/PromotionDetail';
import { UpdatesCenter } from './pages/Updates/UpdatesCenter';
import { CoursesCatalog } from './pages/Courses/CoursesCatalog';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { ProfileSettings } from './pages/Profile/ProfileSettings';
import { AssetLightbox } from './components/gallery/AssetLightbox';
import { BrandModal } from './components/brands/BrandModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [currentView, setCurrentView] = useState<string>(() => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin' ? 'admin_dashboard' : 'dashboard';
  });
  const [activeBrandId, setActiveBrandId] = useState<string | undefined>(undefined);
  const [activePromoId, setActivePromoId] = useState<string | undefined>(undefined);
  const [activeCourseId, setActiveCourseId] = useState<string | undefined>(undefined);

  // App dataset state
  const [allUsers, setAllUsers] = useState<User[]>(() => storageService.getUsers());
  const [allBrands, setAllBrands] = useState<Brand[]>(() => storageService.getBrands());
  const [allPromotions, setAllPromotions] = useState<Promotion[]>(() => storageService.getPromotions());
  const [allAssets, setAllAssets] = useState<Asset[]>(() => storageService.getAssets());
  const [allUpdates, setAllUpdates] = useState<PortalUpdate[]>(() => storageService.getUpdates());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => storageService.getActivity());
  const [allCourses, setAllCourses] = useState<Course[]>(() => storageService.getCourses());
  const [tutorConfig, setTutorConfig] = useState<TutorLmsConfig>(() => storageService.getTutorConfig());

  // Global modals state

  const [lightboxAsset, setLightboxAsset] = useState<Asset | null>(null);

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefreshData = () => {
    setAllUsers(storageService.getUsers());
    setAllBrands(storageService.getBrands());
    setAllPromotions(storageService.getPromotions());
    setAllAssets(storageService.getAssets());
    setAllUpdates(storageService.getUpdates());
    setActivityLogs(storageService.getActivity());
    setAllCourses(storageService.getCourses());
    setTutorConfig(storageService.getTutorConfig());
    if (currentUser) {
      const refreshed = storageService.getUsers().find(u => u.id === currentUser.id);
      if (refreshed) setCurrentUser(refreshed);
    }
  };

  // Check Tutor LMS WordPress endpoint for new courses when user accesses the app
  useEffect(() => {
    if (currentUser) {
      courseService.syncCoursesOnLogin(currentUser).then((res) => {
        if (res.newCount > 0) {
          handleRefreshData();
          showToast(`¡${res.newCount} nuevo(s) curso(s) añadido(s) a la Academia Alviestetic!`);
        }
      }).catch(() => {
        // Keep smooth offline fallback
      });
    }
  }, [currentUser?.id]);

  // Enforce access control on brands for current user
  const authorizedBrands = useMemo(() => {
    return brandService.getBrandsForUser(currentUser);
  }, [currentUser, allBrands]);

  // Promotions accessible by current user
  const authorizedPromotions = useMemo(() => {
    return promotionService.getAllPromotionsForUser(currentUser);
  }, [currentUser, allPromotions]);

  // Assets accessible by current user
  const authorizedAssets = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return allAssets;
    return allAssets.filter(a => currentUser.assignedBrandIds.includes(a.brandId));
  }, [currentUser, allAssets]);

  // Unread updates count
  const unreadCount = useMemo(() => {
    return updateService.getUnreadCount(currentUser);
  }, [currentUser, allUpdates]);

  // Active brand and promotion objects
  const activeBrand = useMemo(() => {
    if (!activeBrandId) return null;
    return brandService.getBrandById(activeBrandId, currentUser);
  }, [activeBrandId, currentUser, allBrands]);

  const activePromotion = useMemo(() => {
    if (!activePromoId) return null;
    return promotionService.getPromotionById(activePromoId, currentUser);
  }, [activePromoId, currentUser, allPromotions]);

  const activePromotionAssets = useMemo(() => {
    if (!activePromoId) return [];
    return assetService.getAssetsForPromotion(activePromoId, currentUser);
  }, [activePromoId, currentUser, allAssets]);

  // Navigation controller with authorization guard
  const handleNavigate = (view: string, brandId?: string, promoId?: string) => {
    // Admin view authorization guard
    if (view.startsWith('admin_') && currentUser?.role !== 'admin') {
      showToast('Acceso restringido al perfil de Administrador.');
      setCurrentView('dashboard');
      return;
    }

    // Brand access authorization guard
    if (brandId && currentUser?.role !== 'admin') {
      if (!currentUser?.assignedBrandIds.includes(brandId)) {
        showToast('No tienes autorización para acceder a esta marca.');
        setCurrentView('dashboard');
        setActiveBrandId(undefined);
        setActivePromoId(undefined);
        return;
      }
    }

    setCurrentView(view);
    setActiveBrandId(brandId);
    setActivePromoId(promoId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch demo user from Navbar dropdown
  const handleSwitchDemoUser = (userId: string) => {
    const user = authService.loginDemoUser(userId);
    if (user) {
      setCurrentUser(user);
      handleRefreshData();
      showToast(`Sesión cambiada a ${user.name} (${user.role === 'admin' ? 'Administrador' : 'Cliente'})`);

      // Reset view to appropriate dashboard depending on role
      if (user.role === 'admin') {
        setCurrentView('admin_dashboard');
      } else {
        setCurrentView('dashboard');
      }
      setActiveBrandId(undefined);
      setActivePromoId(undefined);
    }
  };

  // Factory reset demo data in localStorage
  const handleResetDemoData = () => {
    if (window.confirm('¿Deseas restaurar todos los datos demo de clientes, marcas y novedades al estado original?')) {
      storageService.resetToFactoryDefaults();
      handleRefreshData();
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      setCurrentView(user?.role === 'admin' ? 'admin_dashboard' : 'dashboard');
      setActiveBrandId(undefined);
      setActivePromoId(undefined);
      showToast('Datos de demostración restaurados correctamente.');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentView('dashboard');
    setActiveBrandId(undefined);
    setActivePromoId(undefined);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    handleRefreshData();
    setCurrentView(user.role === 'admin' ? 'admin_dashboard' : 'dashboard');
  };

  const handleMarkUpdateRead = (updateId: string) => {
    if (currentUser) {
      updateService.markAsRead(updateId, currentUser.id);
      handleRefreshData();
    }
  };

  const handleMarkAllUpdatesRead = () => {
    if (currentUser) {
      updateService.markAllAsRead(currentUser);
      handleRefreshData();
      showToast('Todas las novedades marcadas como leídas.');
    }
  };

  // Breadcrumbs computation
  const breadcrumbs = useMemo(() => {
    const isAdmin = currentUser?.role === 'admin';
    const isClientPreview = isAdmin && ['dashboard', 'brands', 'brand_detail', 'promotion_detail', 'courses', 'updates'].includes(currentView);

    const crumbs: Array<{ label: string; view: string; brandId?: string; promoId?: string }> = [];

    if (isAdmin) {
      crumbs.push({ label: 'Panel de Control', view: 'admin_dashboard' });
      if (isClientPreview) {
        crumbs.push({ label: 'Vista Previa Cliente', view: 'dashboard' });
      }
    } else {
      crumbs.push({ label: 'Inicio', view: 'dashboard' });
    }

    if (currentView === 'brands') {
      crumbs.push({ label: 'Marcas', view: 'brands' });
    } else if (currentView === 'brand_detail' && activeBrand) {
      crumbs.push({ label: 'Marcas', view: 'brands' });
      crumbs.push({ label: activeBrand.name, view: 'brand_detail', brandId: activeBrand.id });
    } else if (currentView === 'promotion_detail' && activeBrand && activePromotion) {
      crumbs.push({ label: 'Marcas', view: 'brands' });
      crumbs.push({ label: activeBrand.name, view: 'brand_detail', brandId: activeBrand.id });
      crumbs.push({
        label: activePromotion.title,
        view: 'promotion_detail',
        brandId: activeBrand.id,
        promoId: activePromotion.id
      });
    } else if (currentView === 'updates') {
      crumbs.push({ label: 'Centro de Novedades', view: 'updates' });
    } else if (currentView === 'courses') {
      crumbs.push({ label: 'Cursos & Academia', view: 'courses' });
    } else if (currentView.startsWith('admin_')) {
      if (currentView === 'admin_clients') {
        crumbs.push({ label: 'Gestión de Clientes', view: 'admin_clients' });
      } else if (currentView === 'admin_brands') {
        crumbs.push({ label: 'Marcas & SharePoint', view: 'admin_brands' });
      } else if (currentView === 'admin_activity') {
        crumbs.push({ label: 'Registro de Auditoría', view: 'admin_activity' });
      } else if (currentView === 'admin_courses') {
        crumbs.push({ label: 'Cursos', view: 'admin_courses' });
      }
    } else if (currentView === 'profile') {
      crumbs.push({ label: 'Mi Perfil & Ajustes', view: 'profile' });
    }

    return crumbs;
  }, [currentView, activeBrand, activePromotion, currentUser]);

  // If unauthenticated, show Login screen
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout
      currentUser={currentUser}
      authorizedBrands={authorizedBrands}
      activeView={currentView}
      activeBrandId={activeBrandId}
      breadcrumbs={breadcrumbs}
      unreadCount={unreadCount}
      clientsCount={clientService.getClients().length}
      brandsCount={allBrands.length}
      coursesCount={allCourses.length}
      onNavigate={handleNavigate}
      onSwitchDemoUser={handleSwitchDemoUser}
      onResetDemoData={handleResetDemoData}
      onLogout={handleLogout}
    >
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900 text-white p-4 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* DASHBOARD VIEW */}
      {currentView === 'dashboard' && (
        <Dashboard
          currentUser={currentUser}
          authorizedBrands={authorizedBrands}
          promotions={authorizedPromotions}
          recentAssets={authorizedAssets}
          unreadCount={unreadCount}
          onNavigate={handleNavigate}
          onSelectAsset={(asset) => setLightboxAsset(asset)}
        />
      )}

      {/* BRANDS CATALOG VIEW */}
      {currentView === 'brands' && (
        <BrandsCatalog
          currentUser={currentUser}
          brands={authorizedBrands}
          promotions={authorizedPromotions}
          onNavigate={handleNavigate}
          onOpenCreateBrand={() => setIsBrandModalOpen(true)}
        />
      )}

      {/* BRAND DETAIL VIEW */}
      {currentView === 'brand_detail' && activeBrand && (
        <BrandDetail
          brand={activeBrand}
          promotions={promotionService.getPromotionsForBrand(activeBrand.id, currentUser)}
          currentUser={currentUser}
          onNavigate={handleNavigate}
          onBack={() => handleNavigate('brands')}
        />
      )}

      {/* PROMOTION DETAIL / ASSETS GALLERY VIEW */}
      {currentView === 'promotion_detail' && activeBrand && activePromotion && (
        <PromotionDetail
          promotion={activePromotion}
          brand={activeBrand}
          assets={activePromotionAssets}
          currentUser={currentUser}
          onBack={() => handleNavigate('brand_detail', activeBrand.id)}
        />
      )}

      {/* UPDATES CENTER VIEW */}
      {currentView === 'updates' && (
        <UpdatesCenter
          currentUser={currentUser}
          updates={updateService.getUpdatesForUser(currentUser)}
          brands={authorizedBrands}
          promotions={authorizedPromotions}
          onMarkRead={handleMarkUpdateRead}
          onMarkAllRead={handleMarkAllUpdatesRead}
          onNavigateToPromotion={(brandId, promoId) =>
            handleNavigate('promotion_detail', brandId, promoId)
          }
          onNavigateToCourse={(courseId) => {
            setActiveCourseId(courseId);
            handleNavigate('courses');
          }}
        />
      )}

      {/* COURSES CATALOG VIEW */}
      {currentView === 'courses' && (
        <CoursesCatalog
          currentUser={currentUser}
          courses={allCourses}
          tutorConfig={tutorConfig}
          onRefreshCourses={handleRefreshData}
          onShowToast={showToast}
          initialSelectedCourseId={activeCourseId}
        />
      )}

      {/* ADMIN VIEWS */}
      {(currentView === 'admin_dashboard' ||
        currentView === 'admin_clients' ||
        currentView === 'admin_brands' ||
        currentView === 'admin_activity' ||
        currentView === 'admin_courses') &&
        currentUser.role === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            clients={clientService.getClients()}
            brands={allBrands}
            promotions={allPromotions}
            activityLogs={activityLogs}
            activeSubTab={
              currentView === 'admin_clients'
                ? 'clients'
                : currentView === 'admin_brands'
                  ? 'brands'
                  : currentView === 'admin_activity'
                    ? 'activity'
                    : currentView === 'admin_courses'
                      ? 'courses'
                      : 'overview'
            }
            onTabChange={(tab) => {
              const tabToViewMap: Record<string, string> = {
                overview: 'admin_dashboard',
                clients: 'admin_clients',
                brands: 'admin_brands',
                activity: 'admin_activity',
                courses: 'admin_courses'
              };
              handleNavigate(tabToViewMap[tab] || 'admin_dashboard');
            }}
            onRefreshData={handleRefreshData}
            onNavigateToBrand={(bId) => handleNavigate('brand_detail', bId)}
            onNavigateToBrandsCatalog={() => handleNavigate('brands')}
            onNavigateToCourses={() => handleNavigate('courses')}
          />
        )}

      {/* PROFILE SETTINGS VIEW */}
      {currentView === 'profile' && (
        <ProfileSettings
          currentUser={currentUser}
          authorizedBrands={authorizedBrands}
          onLogout={handleLogout}
          onResetDemoData={handleResetDemoData}
        />
      )}


      {/* Asset Lightbox from Dashboard recent list */}
      {lightboxAsset && (
        <AssetLightbox
          asset={lightboxAsset}
          user={currentUser}
          onClose={() => setLightboxAsset(null)}
        />
      )}


      {/* Admin Brand Modal (from Brands Catalog) */}
      <BrandModal
        isOpen={isBrandModalOpen}
        editingBrand={null}
        onClose={() => setIsBrandModalOpen(false)}
        onSave={(brandData) => {
          brandService.createBrand(brandData);
          handleRefreshData();
          showToast(`Marca "${brandData.name}" creada con éxito.`);
        }}
      />
    </Layout>
  );
}
