
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T


export const AdminDashboardChart: typeof import("../components/AdminDashboardChart.vue")['default']
export const AdminSidebar: typeof import("../components/AdminSidebar.vue")['default']
export const AdminTopBar: typeof import("../components/AdminTopBar.vue")['default']
export const ParentDocCardIcon: typeof import("../components/ParentDocCardIcon.vue")['default']
export const RevealSection: typeof import("../components/RevealSection.vue")['default']
export const SiteFooter: typeof import("../components/SiteFooter.vue")['default']
export const SiteHeader: typeof import("../components/SiteHeader.vue")['default']
export const AdminAccountingTotalsBlocks: typeof import("../components/admin/AdminAccountingTotalsBlocks.vue")['default']
export const AdminClassEditModal: typeof import("../components/admin/AdminClassEditModal.vue")['default']
export const AdminLevelEditModal: typeof import("../components/admin/AdminLevelEditModal.vue")['default']
export const AdminServiceEditModal: typeof import("../components/admin/AdminServiceEditModal.vue")['default']
export const AdminStudentCarnetSuivi: typeof import("../components/admin/AdminStudentCarnetSuivi.vue")['default']
export const AdminStudentFicheSante: typeof import("../components/admin/AdminStudentFicheSante.vue")['default']
export const EnrollmentFamilySectionHeader: typeof import("../components/enrollment/EnrollmentFamilySectionHeader.vue")['default']
export const EnrollmentField: typeof import("../components/enrollment/EnrollmentField.vue")['default']
export const EnrollmentNavFooter: typeof import("../components/enrollment/EnrollmentNavFooter.vue")['default']
export const EnrollmentParentSignature: typeof import("../components/enrollment/EnrollmentParentSignature.vue")['default']
export const EnrollmentRecapBlock: typeof import("../components/enrollment/EnrollmentRecapBlock.vue")['default']
export const EnrollmentRecapCard: typeof import("../components/enrollment/EnrollmentRecapCard.vue")['default']
export const EnrollmentRecapRow: typeof import("../components/enrollment/EnrollmentRecapRow.vue")['default']
export const EnrollmentSectionTitle: typeof import("../components/enrollment/EnrollmentSectionTitle.vue")['default']
export const EnrollmentStepEnfant: typeof import("../components/enrollment/EnrollmentStepEnfant.vue")['default']
export const EnrollmentStepFamille: typeof import("../components/enrollment/EnrollmentStepFamille.vue")['default']
export const EnrollmentStepOptions: typeof import("../components/enrollment/EnrollmentStepOptions.vue")['default']
export const EnrollmentStepSante: typeof import("../components/enrollment/EnrollmentStepSante.vue")['default']
export const EnrollmentStepValidation: typeof import("../components/enrollment/EnrollmentStepValidation.vue")['default']
export const EnrollmentStepper: typeof import("../components/enrollment/EnrollmentStepper.vue")['default']
export const EnrollmentWizardHeader: typeof import("../components/enrollment/EnrollmentWizardHeader.vue")['default']
export const ParentChildOverviewCard: typeof import("../components/parent/ParentChildOverviewCard.vue")['default']
export const ParentPayTuitionInline: typeof import("../components/parent/PayTuitionInline.vue")['default']
export const ParentPayTuitionModal: typeof import("../components/parent/PayTuitionModal.vue")['default']
export const ParentChildSpaceCarnet: typeof import("../components/parent/child-space/ParentChildSpaceCarnet.vue")['default']
export const ParentChildSpaceHeader: typeof import("../components/parent/child-space/ParentChildSpaceHeader.vue")['default']
export const ParentChildSpaceProfil: typeof import("../components/parent/child-space/ParentChildSpaceProfil.vue")['default']
export const ParentChildSpaceSante: typeof import("../components/parent/child-space/ParentChildSpaceSante.vue")['default']
export const ParentChildSpaceTabs: typeof import("../components/parent/child-space/ParentChildSpaceTabs.vue")['default']
export const ParentChildSpaceTypes: typeof import("../components/parent/child-space/types")['default']
export const ParentOnboardingShell: typeof import("../components/parent/onboarding/ParentOnboardingShell.vue")['default']
export const ParentOnboardingSlide1: typeof import("../components/parent/onboarding/ParentOnboardingSlide1.vue")['default']
export const ParentOnboardingSlide2: typeof import("../components/parent/onboarding/ParentOnboardingSlide2.vue")['default']
export const ParentOnboardingSlide3: typeof import("../components/parent/onboarding/ParentOnboardingSlide3.vue")['default']
export const ParentOnboardingSlide4: typeof import("../components/parent/onboarding/ParentOnboardingSlide4.vue")['default']
export const ParentOnboardingTitle: typeof import("../components/parent/onboarding/ParentOnboardingTitle.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtLinkLocale: typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
export const SwitchLocalePathLink: typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyAdminDashboardChart: LazyComponent<typeof import("../components/AdminDashboardChart.vue")['default']>
export const LazyAdminSidebar: LazyComponent<typeof import("../components/AdminSidebar.vue")['default']>
export const LazyAdminTopBar: LazyComponent<typeof import("../components/AdminTopBar.vue")['default']>
export const LazyParentDocCardIcon: LazyComponent<typeof import("../components/ParentDocCardIcon.vue")['default']>
export const LazyRevealSection: LazyComponent<typeof import("../components/RevealSection.vue")['default']>
export const LazySiteFooter: LazyComponent<typeof import("../components/SiteFooter.vue")['default']>
export const LazySiteHeader: LazyComponent<typeof import("../components/SiteHeader.vue")['default']>
export const LazyAdminAccountingTotalsBlocks: LazyComponent<typeof import("../components/admin/AdminAccountingTotalsBlocks.vue")['default']>
export const LazyAdminClassEditModal: LazyComponent<typeof import("../components/admin/AdminClassEditModal.vue")['default']>
export const LazyAdminLevelEditModal: LazyComponent<typeof import("../components/admin/AdminLevelEditModal.vue")['default']>
export const LazyAdminServiceEditModal: LazyComponent<typeof import("../components/admin/AdminServiceEditModal.vue")['default']>
export const LazyAdminStudentCarnetSuivi: LazyComponent<typeof import("../components/admin/AdminStudentCarnetSuivi.vue")['default']>
export const LazyAdminStudentFicheSante: LazyComponent<typeof import("../components/admin/AdminStudentFicheSante.vue")['default']>
export const LazyEnrollmentFamilySectionHeader: LazyComponent<typeof import("../components/enrollment/EnrollmentFamilySectionHeader.vue")['default']>
export const LazyEnrollmentField: LazyComponent<typeof import("../components/enrollment/EnrollmentField.vue")['default']>
export const LazyEnrollmentNavFooter: LazyComponent<typeof import("../components/enrollment/EnrollmentNavFooter.vue")['default']>
export const LazyEnrollmentParentSignature: LazyComponent<typeof import("../components/enrollment/EnrollmentParentSignature.vue")['default']>
export const LazyEnrollmentRecapBlock: LazyComponent<typeof import("../components/enrollment/EnrollmentRecapBlock.vue")['default']>
export const LazyEnrollmentRecapCard: LazyComponent<typeof import("../components/enrollment/EnrollmentRecapCard.vue")['default']>
export const LazyEnrollmentRecapRow: LazyComponent<typeof import("../components/enrollment/EnrollmentRecapRow.vue")['default']>
export const LazyEnrollmentSectionTitle: LazyComponent<typeof import("../components/enrollment/EnrollmentSectionTitle.vue")['default']>
export const LazyEnrollmentStepEnfant: LazyComponent<typeof import("../components/enrollment/EnrollmentStepEnfant.vue")['default']>
export const LazyEnrollmentStepFamille: LazyComponent<typeof import("../components/enrollment/EnrollmentStepFamille.vue")['default']>
export const LazyEnrollmentStepOptions: LazyComponent<typeof import("../components/enrollment/EnrollmentStepOptions.vue")['default']>
export const LazyEnrollmentStepSante: LazyComponent<typeof import("../components/enrollment/EnrollmentStepSante.vue")['default']>
export const LazyEnrollmentStepValidation: LazyComponent<typeof import("../components/enrollment/EnrollmentStepValidation.vue")['default']>
export const LazyEnrollmentStepper: LazyComponent<typeof import("../components/enrollment/EnrollmentStepper.vue")['default']>
export const LazyEnrollmentWizardHeader: LazyComponent<typeof import("../components/enrollment/EnrollmentWizardHeader.vue")['default']>
export const LazyParentChildOverviewCard: LazyComponent<typeof import("../components/parent/ParentChildOverviewCard.vue")['default']>
export const LazyParentPayTuitionInline: LazyComponent<typeof import("../components/parent/PayTuitionInline.vue")['default']>
export const LazyParentPayTuitionModal: LazyComponent<typeof import("../components/parent/PayTuitionModal.vue")['default']>
export const LazyParentChildSpaceCarnet: LazyComponent<typeof import("../components/parent/child-space/ParentChildSpaceCarnet.vue")['default']>
export const LazyParentChildSpaceHeader: LazyComponent<typeof import("../components/parent/child-space/ParentChildSpaceHeader.vue")['default']>
export const LazyParentChildSpaceProfil: LazyComponent<typeof import("../components/parent/child-space/ParentChildSpaceProfil.vue")['default']>
export const LazyParentChildSpaceSante: LazyComponent<typeof import("../components/parent/child-space/ParentChildSpaceSante.vue")['default']>
export const LazyParentChildSpaceTabs: LazyComponent<typeof import("../components/parent/child-space/ParentChildSpaceTabs.vue")['default']>
export const LazyParentChildSpaceTypes: LazyComponent<typeof import("../components/parent/child-space/types")['default']>
export const LazyParentOnboardingShell: LazyComponent<typeof import("../components/parent/onboarding/ParentOnboardingShell.vue")['default']>
export const LazyParentOnboardingSlide1: LazyComponent<typeof import("../components/parent/onboarding/ParentOnboardingSlide1.vue")['default']>
export const LazyParentOnboardingSlide2: LazyComponent<typeof import("../components/parent/onboarding/ParentOnboardingSlide2.vue")['default']>
export const LazyParentOnboardingSlide3: LazyComponent<typeof import("../components/parent/onboarding/ParentOnboardingSlide3.vue")['default']>
export const LazyParentOnboardingSlide4: LazyComponent<typeof import("../components/parent/onboarding/ParentOnboardingSlide4.vue")['default']>
export const LazyParentOnboardingTitle: LazyComponent<typeof import("../components/parent/onboarding/ParentOnboardingTitle.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtLinkLocale: LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
export const LazySwitchLocalePathLink: LazyComponent<typeof import("../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
